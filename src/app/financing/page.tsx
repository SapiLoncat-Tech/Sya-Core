'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, Calculator, Eye, CalendarCheck, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { getMembers, createContractAction } from '@/app/actions/financing';

type Member = {
  id: string;
  full_name: string;
  nik: string;
};

export default function FinancingPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  
  // Form State
  const [memberId, setMemberId] = useState('');
  const [akadType, setAkadType] = useState('murabahah');
  const [plafon, setPlafon] = useState('10000000');
  const [tenor, setTenor] = useState('12');
  const [margin, setMargin] = useState('15');
  const [assetDescription, setAssetDescription] = useState('Motor Honda Vario 160');
  
  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchMembers() {
      const data = await getMembers();
      setMembers(data);
      setIsLoadingMembers(false);
    }
    fetchMembers();
  }, []);

  // Simple calculation for UI preview
  const pokok = parseInt(plafon) || 0;
  const tTenor = parseInt(tenor) || 1;
  const tMargin = parseInt(margin) || 0;
  
  const totalMargin = (pokok * tMargin) / 100;
  const totalPembiayaan = pokok + totalMargin;
  const angsuranPerBulan = totalPembiayaan / tTenor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      setErrorMessage('Pilih nasabah terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('member_id', memberId);
    formData.append('akad_type', akadType);
    formData.append('plafon', plafon);
    formData.append('margin', margin);
    formData.append('tenor', tenor);
    formData.append('asset_description', assetDescription);

    const result = await createContractAction(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccessMessage(result.message);
      // Optional: Reset form
      // setPlafon(''); setAssetDescription('');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Akad & Pembiayaan</h1>
        <p className="text-gray-400">Input kontrak syariah, simulasi angsuran, dan pembuatan jurnal akuntansi otomatis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <FileSignature className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Formulir Akad</h3>
          </div>

          {successMessage && (
            <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nasabah</label>
              <select 
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                disabled={isLoadingMembers}
              >
                <option value="">{isLoadingMembers ? 'Memuat data...' : 'Pilih Nasabah...'}</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name} ({m.nik})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Jenis Akad</label>
              <select 
                value={akadType}
                onChange={(e) => setAkadType(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
              >
                <option value="murabahah">Murabahah (Jual Beli)</option>
                <option value="mudharabah">Mudharabah (Bagi Hasil)</option>
                <option value="musyarakah">Musyarakah (Kemitraan)</option>
                <option value="qardh">Qardh (Pinjaman Kebajikan)</option>
              </select>
            </div>

            <AnimatePresence mode="popLayout">
              {akadType === "murabahah" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-300">Nama Barang / Objek Akad</label>
                  <input 
                    type="text" 
                    value={assetDescription}
                    onChange={(e) => setAssetDescription(e.target.value)}
                    placeholder="Contoh: Sepeda Motor Honda Beat"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Plafon Pembiayaan / Modal (Rp)</label>
              <input 
                type="number" 
                value={plafon}
                onChange={(e) => setPlafon(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {akadType === "murabahah" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Margin (%)</label>
                    <input 
                      type="number" 
                      value={margin}
                      onChange={(e) => setMargin(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tenor (Bulan)</label>
                    <input 
                      type="number" 
                      value={tenor}
                      onChange={(e) => setTenor(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan & Validasi Akad
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary & Simulation */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
              <CalendarCheck className="w-5 h-5 mr-2 text-blue-400" />
              Simulasi {akadType.charAt(0).toUpperCase() + akadType.slice(1)}
            </h3>
            
            {akadType === 'murabahah' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Harga Pokok</p>
                  <p className="text-lg font-bold text-white">Rp {(pokok).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Total Margin</p>
                  <p className="text-lg font-bold text-amber-400">Rp {(totalMargin).toLocaleString()}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Total Harga Jual</p>
                  <p className="text-lg font-bold text-white">Rp {(totalPembiayaan).toLocaleString()}</p>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-xs text-emerald-300 mb-1">Angsuran / Bulan</p>
                  <p className="text-lg font-bold text-emerald-400">Rp {(angsuranPerBulan).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 mb-6 text-sm">
                Simulasi cicilan dan bagi hasil untuk {akadType} akan muncul setelah profil rasio (nisbah) dan pendapatan LKM diperbarui akhir bulan.
              </div>
            )}

            {akadType === 'murabahah' && (
              <div className="overflow-hidden border border-white/10 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Bulan Ke</th>
                      <th className="px-4 py-3 font-medium">Porsi Pokok</th>
                      <th className="px-4 py-3 font-medium">Porsi Margin</th>
                      <th className="px-4 py-3 font-medium">Total Angsuran</th>
                      <th className="px-4 py-3 font-medium text-right">Sisa Hutang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[1, 2, 3].map((b) => (
                      <tr key={b} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-gray-400">{b}</td>
                        <td className="px-4 py-3 text-white">Rp {(pokok/tTenor).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                        <td className="px-4 py-3 text-amber-400">Rp {(totalMargin/tTenor).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                        <td className="px-4 py-3 text-emerald-400 font-medium">Rp {(angsuranPerBulan).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                        <td className="px-4 py-3 text-right text-gray-400">Rp {(totalPembiayaan - (angsuranPerBulan * b)).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center text-gray-500 text-xs italic bg-white/[0.01]">
                        Menampilkan 3 bulan pertama dari {tTenor} bulan...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Journal Preview */}
          {akadType === 'murabahah' && (
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-400" />
                  Preview Jurnal Otomatis
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-md border border-purple-500/30">
                  Pencairan Murabahah
                </span>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 font-mono text-sm">
                <div className="grid grid-cols-12 text-gray-500 mb-2 border-b border-white/10 pb-2">
                  <div className="col-span-2">Kode Akun</div>
                  <div className="col-span-6">Nama Akun</div>
                  <div className="col-span-2 text-right">Debit</div>
                  <div className="col-span-2 text-right">Kredit</div>
                </div>
                
                <div className="grid grid-cols-12 text-gray-300 py-1">
                  <div className="col-span-2 text-emerald-400">14101</div>
                  <div className="col-span-6">Piutang Murabahah - {assetDescription || '[Nama Barang]'}</div>
                  <div className="col-span-2 text-right">{(totalPembiayaan).toLocaleString()}</div>
                  <div className="col-span-2 text-right">-</div>
                </div>
                
                <div className="grid grid-cols-12 text-gray-300 py-1">
                  <div className="col-span-2 text-emerald-400">22101</div>
                  <div className="col-span-6 pl-4">Margin Murabahah Ditangguhkan</div>
                  <div className="col-span-2 text-right">-</div>
                  <div className="col-span-2 text-right text-amber-400">{(totalMargin).toLocaleString()}</div>
                </div>
                
                <div className="grid grid-cols-12 text-gray-300 py-1">
                  <div className="col-span-2 text-emerald-400">11101</div>
                  <div className="col-span-6 pl-4">Kas / Bank Syariah</div>
                  <div className="col-span-2 text-right">-</div>
                  <div className="col-span-2 text-right text-red-400">{(pokok).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
