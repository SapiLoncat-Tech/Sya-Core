'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function extractDocumentData(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('Tidak ada file yang diunggah');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key Gemini belum dikonfigurasi. Hubungi Admin.');
    }

    // Inisialisasi Gemini API di dalam fungsi agar selalu membaca ENV terbaru
    const genAI = new GoogleGenerativeAI(apiKey);

    // Mengubah File (Blob) menjadi buffer array, lalu ke Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      },
    ];

    // Menggunakan model gemini-1.5-flash yang sangat cepat dan mendukung gambar (multimodal)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Kamu adalah asisten OCR cerdas untuk aplikasi keuangan Syariah.
      Tugasmu adalah membaca gambar kuitansi, struk, atau dokumen keuangan ini dan mengekstrak data berikut:
      1. docType: Tentukan jenis dokumen secara spesifik (contoh: Kuitansi Pembelian, Tagihan Listrik PLN, Struk Minimarket, dll).
      2. nominal: Cari total nilai/nominal uang dalam dokumen. Kembalikan HANYA angkanya saja (integer), tanpa titik/koma/Rp.
      3. tanggal: Cari tanggal transaksi. Format ke YYYY-MM-DD. Jika tidak ada, gunakan tanggal hari ini.
      4. namaPihak: Cari nama toko, vendor, atau pihak penerima uang.
      5. deskripsi: Berikan deskripsi singkat transaksi ini berdasarkan isi nota.
      
      Balas HANYA dalam format JSON Murni (tanpa markdown blok, tanpa awalan \`\`\`json).
      Format yang diharapkan persis seperti ini:
      {
        "docType": "string",
        "nominal": 0,
        "tanggal": "YYYY-MM-DD",
        "namaPihak": "string",
        "deskripsi": "string"
      }
    `;

    // Panggil API Gemini
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Bersihkan format markdown jika Gemini membandel
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const jsonData = JSON.parse(text);
      return { success: true, data: jsonData };
    } catch (parseError) {
      console.error('Gagal mem-parsing JSON dari Gemini:', text);
      throw new Error('Format balasan AI tidak valid.');
    }
  } catch (error: any) {
    console.error('OCR Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan saat mengekstrak dokumen.' };
  }
}
