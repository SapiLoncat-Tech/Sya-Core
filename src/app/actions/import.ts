'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function importMembersAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, message: 'Tidak ada file yang diunggah.' };
    }

    // Membaca isi file JSON
    const textContent = await file.text();
    let dataToImport = [];

    try {
      dataToImport = JSON.parse(textContent);
    } catch (e) {
      return { success: false, message: 'Format file JSON tidak valid. Harap gunakan template yang disediakan.' };
    }

    if (!Array.isArray(dataToImport) || dataToImport.length === 0) {
      return { success: false, message: 'File JSON kosong atau tidak memiliki format Array.' };
    }

    const supabase = await createClient();

    // Pastikan user memiliki akses
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: 'Anda harus login untuk melakukan migrasi data.' };
    }

    // Menambahkan field created_by untuk setiap data
    const enrichedData = dataToImport.map((member: any) => ({
      ...member,
      created_by: user.id
    }));

    // Melakukan Bulk Insert ke tabel members
    const { error } = await supabase
      .from('members')
      .insert(enrichedData);

    if (error) {
      console.error('Import Error:', error);
      return { success: false, message: 'Gagal memasukkan data ke database. Pastikan NIK belum terdaftar sebelumnya.' };
    }

    // Revalidasi cache halaman manajemen anggota agar langsung muncul datanya
    revalidatePath('/members');

    return { 
      success: true, 
      message: `Migrasi berhasil! ${enrichedData.length} data anggota sukses diimpor.` 
    };

  } catch (err: any) {
    console.error('Server Action Error:', err);
    return { success: false, message: 'Terjadi kesalahan sistem saat memproses file.' };
  }
}
