"use client";

import { useState, useRef } from "react";
import { Shield, Sliders, Users, UploadCloud, Download, Loader2, CheckCircle2 } from "lucide-react";
import { importMembersAction } from "@/app/actions/import";

export default function SettingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    const result = await importMembersAction(formData);
    
    setIsUploading(false);
    setUploadMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) setFile(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-400">Konfigurasi Role-Based Access Control (RBAC) dan parameter produk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Management */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Manajemen Pengguna (RBAC)
          </h3>

          <div className="space-y-4">
            {[
              { role: "Admin Sistem", desc: "Akses penuh sistem dan parameter.", count: 2 },
              { role: "Manajer LKM", desc: "Dashboard eksekutif dan validasi laporan.", count: 1 },
              { role: "Staf Akuntansi / Pembiayaan", desc: "Input akad, angsuran, dan validasi jurnal.", count: 4 },
              { role: "Account Officer (AO)", desc: "Akses data nasabah lapangan (terbatas).", count: 8 },
              { role: "Dewan Pengawas Syariah", desc: "Akses read-only untuk audit kepatuhan.", count: 3 },
            ].map((role, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium text-white">{role.role}</h4>
                  <p className="text-xs text-gray-400 mt-1">{role.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">
                    <Users className="w-3 h-3 mr-1" /> {role.count}
                  </div>
                  <button className="text-gray-400 hover:text-white px-3 py-1 bg-white/5 rounded-lg text-xs transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors border border-white/5">
            + Tambah Pengguna Baru
          </button>
        </div>

        {/* Product Configuration */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
            <Sliders className="w-5 h-5 mr-2 text-emerald-400" />
            Konfigurasi Produk
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-400 border-b border-white/10 pb-2">Parameter Pembiayaan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Margin Murabahah Default</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="15" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">% / thn</span>
                  </div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Denda Keterlambatan</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="0" className="bg-transparent text-white font-medium w-full focus:outline-none" disabled />
                    <span className="text-gray-500 text-xs">(Dana Kebajikan)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-400 border-b border-white/10 pb-2">Parameter Simpanan (Nisbah)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Porsi LKM (Mudharabah)</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="40" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <label className="text-xs text-gray-400 block mb-1">Porsi Nasabah (Mudharabah)</label>
                  <div className="flex items-center">
                    <input type="text" defaultValue="60" className="bg-transparent text-white font-medium w-full focus:outline-none" />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
              Simpan Konfigurasi
            </button>
          </div>
        </div>

        {/* Migrasi & Impor Data */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 border-t-4 border-t-blue-500">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <UploadCloud className="w-5 h-5 mr-2 text-blue-400" />
              Migrasi & Impor Data (System Admin)
            </div>
            <a 
              href="/template_migrasi.json" 
              download 
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-1" /> Unduh Template JSON
            </a>
          </h3>

          <div className="bg-black/20 p-5 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full text-sm text-gray-400 space-y-2">
              <p>Gunakan fitur ini untuk melakukan <strong>Bulk Insert</strong> (mengunggah ribuan data anggota sekaligus) dari sistem Koperasi yang lama ke dalam Sya-Core.</p>
              <p>Format file yang diterima: <code className="text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded">.json</code></p>
            </div>
            
            <form onSubmit={handleUpload} className="flex-1 w-full flex flex-col gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${file ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-blue-400 bg-white/5'}`}
              >
                {file ? (
                  <p className="text-sm font-medium text-blue-400 truncate w-full">{file.name}</p>
                ) : (
                  <p className="text-sm text-gray-400">Klik untuk memilih file JSON</p>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json,application/json"
                  onChange={handleFileChange}
                />
              </div>

              {uploadMessage.text && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${uploadMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <p>{uploadMessage.text}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!file || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mulai Migrasi Data'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
