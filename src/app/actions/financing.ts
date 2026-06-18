'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('members')
    .select('id, full_name, nik')
    .eq('status', 'active')
    .order('full_name')

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data
}

export async function createContractAction(formData: FormData) {
  const supabase = await createClient()
  
  // Mengambil user ID (staff/kasir) yang login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Anda harus login untuk memproses akad.' }
  }

  const memberId = formData.get('member_id') as string
  const akadType = formData.get('akad_type') as string
  const plafon = parseFloat(formData.get('plafon') as string) || 0
  const assetDescription = formData.get('asset_description') as string
  
  // Kalkulasi
  let marginAmount = 0
  if (akadType === 'murabahah') {
    const marginPercent = parseFloat(formData.get('margin') as string) || 0
    marginAmount = (plafon * marginPercent) / 100
  }

  // 1. Insert ke tabel contracts
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      member_id: memberId,
      type: akadType,
      principal_amount: plafon,
      margin_amount: marginAmount,
      asset_description: assetDescription,
      status: 'active',
      created_by: user.id
    })
    .select()
    .single()

  if (contractError) {
    console.error('Contract Error:', contractError)
    return { success: false, message: 'Gagal menyimpan data akad.' }
  }

  // 2. Auto-Journaling (Insert ke tabel transactions)
  // Khusus Murabahah (PSAK 102)
  if (akadType === 'murabahah') {
    const totalPiutang = plafon + marginAmount
    
    const transactions = [
      {
        contract_id: contract.id,
        member_id: memberId,
        type: 'debit',
        amount: totalPiutang,
        description: `Piutang Murabahah - ${assetDescription}`,
        created_by: user.id
      },
      {
        contract_id: contract.id,
        member_id: memberId,
        type: 'kredit',
        amount: plafon,
        description: 'Kas LKM / Bank Syariah',
        created_by: user.id
      },
      {
        contract_id: contract.id,
        member_id: memberId,
        type: 'kredit',
        amount: marginAmount,
        description: 'Margin Murabahah Ditangguhkan',
        created_by: user.id
      }
    ]

    const { error: txError } = await supabase
      .from('transactions')
      .insert(transactions)

    if (txError) {
      console.error('Transaction Error:', txError)
      // Idealnya harus ada rollback jika ini gagal, tapi untuk versi sederhana kita log dulu
      return { success: false, message: 'Akad tersimpan, tapi gagal mencatat Jurnal otomatis.' }
    }
  }

  revalidatePath('/financing')
  return { success: true, message: 'Akad & Jurnal berhasil disimpan!' }
}
