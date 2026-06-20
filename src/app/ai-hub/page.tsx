'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ScanLine, FileCheck, ShieldCheck, Activity, UploadCloud, CheckCircle2, X } from 'lucide-react';

export default function AIHubPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    docType: string;
    confidence: number;
    extracted: { nominal: number; tanggal: string; namaPihak: string; deskripsi?: string; };
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setScanResult(null);
    }
  };

  const startScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setScanResult(null);
    
    try {
      // Import Tesseract secara dinamis agar tidak merusak sistem SSR Vercel yang membuat tombol Error/Freeze
      const Tesseract = (await import('tesseract.js')).default;
      
      // Menjalankan Tesseract OCR secara lokal di browser!
      const worker = await Tesseract.createWorker('ind');
      const ret = await worker.recognize(file);
      await worker.terminate();

      const text = ret.data.text;
      const lines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 0);

      // Algoritma Regex Pencari Pola yang Lebih Rapi
      
      // 1. Cari Nominal Uang (Target khusus kata "Rp" atau angka dengan titik/koma)
      let nominal = 0;
      
      // Ambil semua kumpulan angka dengan cara menghapus SEMUA spasi terlebih dahulu.
      // Ini sangat penting karena OCR sering salah membaca "60.000" menjadi "60. 000" atau "60 000".
      const textTanpaSpasi = text.replace(/\\s+/g, '');
      const numMatches = textTanpaSpasi.match(/[\\d.,]+/g) || [];
      
      const angkaPotensial = numMatches.map(numStr => {
        // Buang angka desimal di belakang (misal ,00 atau .00)
        let cleanStr = numStr.replace(/[,.]\\d{1,2}$/, '');
        
        // Hapus sisa titik dan koma yang dipakai sebagai pemisah ribuan
        cleanStr = cleanStr.replace(/[,.]/g, '');
        
        return parseInt(cleanStr, 10);
      }).filter(n => !isNaN(n) && n >= 1000 && n < 1000000000);

      if (angkaPotensial.length > 0) {
        nominal = Math.max(...angkaPotensial);
      }

      // 2. Cari Nama Toko / Vendor
      let namaPihak = "Tidak Terdeteksi";
      if (lines.length > 0) {
        namaPihak = lines[0].split(/[.,|«-]/)[0].trim();
        if (namaPihak.length > 40) {
          namaPihak = namaPihak.substring(0, 35) + "...";
        }
      }
      
      // Khusus untuk bukti transfer Bank
      if (text.toLowerCase().includes('bank') || text.toLowerCase().includes('bsi') || text.toLowerCase().includes('transfer')) {
         // Regex lebih longgar: cari kata setelah "Penerima" atau "Kpd"
         const namaPenerimaMatch = text.match(/(?:Penerima|Kpd)\\s*[:\\-]?\\s*([A-Za-z\\s]{3,20})/i);
         if (namaPenerimaMatch && namaPenerimaMatch[1]) {
            namaPihak = "Transfer: " + namaPenerimaMatch[1].trim();
         } else {
            namaPihak = "Bukti Transfer Bank";
         }
      }

      // 3. Cari Tanggal
      let tanggal = new Date().toISOString().split('T')[0];
      const tanggalBulanTahun = text.match(/(\\d{1,2}\\s+[A-Za-z]+\\s+\\d{4})/);
      const tanggalAngka = text.match(/(\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{2,4})/);
      
      if (tanggalBulanTahun) {
        tanggal = tanggalBulanTahun[0];
      } else if (tanggalAngka) {
        tanggal = tanggalAngka[0];
      }

      // 4. Jenis Dokumen
      let docType = "Dokumen Keuangan";
      const txtLower = text.toLowerCase();
      if (txtLower.includes('transfer') || txtLower.includes('rekening') || txtLower.includes('berhasil')) docType = "Bukti Transfer Bank";
      else if (txtLower.includes('struk') || txtLower.includes('kasir')) docType = "Struk Belanja";
      else if (txtLower.includes('kuitansi') || txtLower.includes('kwitansi')) docType = "Kuitansi Pembayaran";
      else if (txtLower.includes('nota')) docType = "Nota Pembelian";

      setScanResult({
        docType: docType,
        confidence: Math.round(ret.data.confidence),
        extracted: {
          nominal: nominal,
          tanggal: tanggal,
          namaPihak: namaPihak,
          deskripsi: "Teks terbaca: " + text.substring(0, 80) + "..."
        }
      });
      
    } catch (error) {
      console.error(error);
      alert("Gagal membaca dokumen. Pastikan gambar jernih dan pencahayaan bagus.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2 flex items-center">
          <Bot className="w-8 h-8 mr-3 text-emerald-400" />
          Pusat Kecerdasan Buatan (AI Hub)
        </h1>
        <p className="text-gray-400">Modul canggih untuk Ekstraksi Dokumen Otomatis (OCR) dan Shariah Health Scoring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MODUL 1: SMART OCR SCANNER */}
        <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-blue-500 h-fit">
          <div className="bg-black/40 p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center">
              <ScanLine className="w-5 h-5 mr-2 text-blue-400" /> Smart Document OCR
            </h2>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md font-medium border border-blue-500/30">AI Powered</span>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-400 mb-6">Unggah foto kuitansi/nota nasabah. AI akan otomatis membaca nominal dan tanggal tanpa perlu mengetik manual.</p>
            
            {/* Area Upload */}
            {!file ? (
              <label 
                className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/5 group block"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                  <UploadCloud className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-medium mb-1">Klik atau Tarik Dokumen Kesini</h3>
                <p className="text-xs text-gray-400">Mendukung file JPG, PNG, atau PDF (Maks 5MB)</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/jpeg, image/png, application/pdf"
                  onChange={handleFileUpload}
                />
              </label>
            ) : (
              <div className="space-y-4">
                {/* File Preview */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="w-8 h-8 text-emerald-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {!isScanning && !scanResult && (
                    <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400 transition-colors p-2">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Scan Button & Animation */}
                {!scanResult && (
                  <button 
                    onClick={startScan}
                    disabled={isScanning}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center relative overflow-hidden disabled:opacity-80"
                  >
                    {isScanning ? (
                      <>
                        <div className="absolute inset-0 w-full h-full">
                          <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                          />
                        </div>
                        <ScanLine className="w-5 h-5 mr-2 animate-pulse" /> AI Sedang Membaca Dokumen...
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-5 h-5 mr-2" /> Mulai Ekstraksi AI
                      </>
                    )}
                  </button>
                )}

                {/* Scan Result */}
                <AnimatePresence>
                  {scanResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
                        <div className="flex items-center text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 mr-2" /> Ekstraksi Berhasil
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md">
                          Akurasi {scanResult.confidence}%
                        </span>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jenis Dokumen:</span>
                          <span className="text-white font-medium">{scanResult.docType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Nominal:</span>
                          <span className="text-emerald-400 font-bold">Rp {scanResult.extracted.nominal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tanggal:</span>
                          <span className="text-white font-medium">{scanResult.extracted.tanggal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pihak/Vendor:</span>
                          <span className="text-white font-medium">{scanResult.extracted.namaPihak}</span>
                        </div>
                      </div>

                      <button onClick={() => { setFile(null); setScanResult(null); }} className="w-full mt-5 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors text-sm">
                        Gunakan Data Ini ke Form Akad
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>


        {/* MODUL 2: SHARIAH SCORING CALCULATOR */}
        <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-emerald-500 h-fit">
          <div className="bg-black/40 p-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-emerald-400" /> Shariah Health Scoring
            </h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-medium border border-emerald-500/30">Auto Analysis</span>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-400 mb-6">AI menganalisis seluruh data transaksi buku besar LKM dan memberikan rating metrik kesehatan sesuai standar regulator.</p>
            
            {/* Skor Utama */}
            <div className="flex justify-center mb-8 relative">
              <div className="w-48 h-48 rounded-full border-[12px] border-emerald-500/30 flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                {/* Simulasi Circular Progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-500" strokeDasharray="276" strokeDashoffset="40" strokeLinecap="round" />
                </svg>
                
                <span className="text-5xl font-black text-white relative z-10">88</span>
                <span className="text-sm text-emerald-400 font-bold relative z-10 mt-1">SANGAT SEHAT</span>
              </div>
            </div>

            {/* Metrik Detail */}
            <div className="space-y-4">
              {[
                { name: "Non-Performing Financing (NPF)", value: "2.1%", status: "Sangat Baik", color: "emerald", desc: "Rasio kredit/pembiayaan macet. Standar < 5%." },
                { name: "Financing to Deposit Ratio (FDR)", value: "85%", status: "Ideal", color: "blue", desc: "Rasio penyaluran dana vs himpunan dana." },
                { name: "Efisiensi Operasional (BOPO)", value: "68%", status: "Cukup", color: "yellow", desc: "Perbandingan beban terhadap pendapatan." }
              ].map((metric, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden group hover:border-white/20 transition-colors">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${metric.color}-500`}></div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white">{metric.name}</h4>
                    <span className={`text-xs font-bold text-${metric.color}-400 bg-${metric.color}-500/10 px-2 py-0.5 rounded`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-[11px] text-gray-500 w-2/3 leading-tight">{metric.desc}</p>
                    <span className={`text-xs font-medium text-${metric.color}-300`}>{metric.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-colors text-sm border border-white/10 flex items-center justify-center">
              <Activity className="w-4 h-4 mr-2" /> Generate Laporan Analisis Detail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
