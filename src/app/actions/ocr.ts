export async function extractDocumentData(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('Tidak ada file yang diunggah');
    }

    const fileName = file.name.toLowerCase();
    
    // Trik Sihir Presentasi: Simulasi AI Cerdas berdasarkan nama file
    // Sistem akan menunggu 2.5 detik seolah-olah sedang "berpikir" keras
    await new Promise(resolve => setTimeout(resolve, 2500));

    let docType = "Kuitansi Pembelian";
    let nominal = Math.floor(Math.random() * 50) * 100000 + 100000; // Angka acak ratusan ribu
    let tanggal = new Date().toISOString().split('T')[0];
    let namaPihak = "Toko Serba Ada";
    let deskripsi = "Pembelian perlengkapan operasional";

    // Aturan khusus untuk presentasi (sesuaikan dengan nama file yang mungkin diunggah)
    if (fileName.includes('banner') || fileName.includes('spanduk')) {
      docType = "Kuitansi Percetakan";
      nominal = 250000;
      namaPihak = "Percetakan Bintang Jaya";
      deskripsi = "Cetak Banner Spanduk Sya-Core";
    } else if (fileName.includes('pln') || fileName.includes('listrik')) {
      docType = "Tagihan Listrik PLN";
      nominal = 1250500;
      namaPihak = "PT PLN (Persero)";
      deskripsi = "Pembayaran Listrik Kantor Bulan Ini";
    } else if (fileName.includes('makan') || fileName.includes('kopi') || fileName.includes('struk')) {
      docType = "Struk Makanan";
      nominal = 85000;
      namaPihak = "Warkop & Resto Berkah";
      deskripsi = "Konsumsi Rapat Tim";
    } else {
      // Jika nama file tidak dikenali, buat nama toko acak
      const tokoAcak = ["Toko Makmur Sejahtera", "CV Jaya Abadi", "Toko ATK Sentosa", "Agen Sembako Murah"];
      namaPihak = tokoAcak[Math.floor(Math.random() * tokoAcak.length)];
      docType = "Nota Belanja Tulis";
    }

    const jsonData = { docType, nominal, tanggal, namaPihak, deskripsi };
    return { success: true, data: jsonData };

  } catch (error: any) {
    console.error('OCR Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan saat memproses dokumen.' };
  }
}
