'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getZiswafBalances() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ziswaf_transactions')
    .select('type, fund_category, amount')

  if (error) {
    console.error('Error fetching balances:', error)
    return {
      zakat: 0,
      infaq: 0,
      wakaf: 0,
      amil: 0,
      total: 0
    }
  }

  let zakat = 0
  let infaq = 0
  let wakaf = 0
  let amil = 0

  data.forEach(tx => {
    const isOut = tx.type === 'out'
    const value = isOut ? -Number(tx.amount) : Number(tx.amount)

    switch (tx.fund_category) {
      case 'Zakat': zakat += value; break;
      case 'Infaq/Sedekah': infaq += value; break;
      case 'Wakaf': wakaf += value; break;
      case 'Amil': amil += value; break;
    }
  })

  return {
    zakat,
    infaq,
    wakaf,
    amil,
    total: zakat + infaq + wakaf + amil
  }
}

export async function getZiswafMutations() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ziswaf_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching mutations:', error)
    return []
  }

  return data
}

export async function processZiswafAction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Harap login terlebih dahulu.' }
  }

  const txType = formData.get('txType') as 'in' | 'out'
  const fundCategory = formData.get('fundCategory') as string
  const amount = parseFloat(formData.get('amount') as string) || 0
  const entityName = formData.get('entityName') as string
  const programName = formData.get('programName') as string
  const notes = formData.get('notes') as string

  const transactions = []

  // Transaksi Ziswaf murni (100% tanpa potongan Amil)
  transactions.push({
    type: txType,
    fund_category: fundCategory,
    amount: amount,
    entity_name: entityName,
    program_name: programName,
    notes: notes,
    created_by: user.id
  })

  const { error } = await supabase
    .from('ziswaf_transactions')
    .insert(transactions)

  if (error) {
    console.error('Transaction Error:', error)
    return { success: false, message: 'Gagal memproses transaksi Ziswaf.' }
  }

  revalidatePath('/ziswaf')
  return { success: true, message: txType === 'in' ? 'Penerimaan dana berhasil dicatat.' : 'Penyaluran dana berhasil diproses.' }
}
