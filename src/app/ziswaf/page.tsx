'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ArrowDownToLine, ArrowUpFromLine, PieChart, Send, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { getZiswafBalances, getZiswafMutations, processZiswafAction } from '@/app/actions/ziswaf';

type Mutation = {
  id: string;
  type: 'in' | 'out';
  fund_category: string;
  amount: number;
  entity_name: string;
  program_name: string;
  created_at: string;
};

export default function ZiswafPage() {
  const [activeTab, setActiveTab] = useState<'in' | 'out'>('in');
  
  // States
  const [balances, setBalances] = useState({ zakat: 0, infaq: 0, wakaf: 0, amil: 0, total: 0 });
  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Form States
  const [fundCategory, setFundCategory] = useState('Zakat');
  const [amount, setAmount] = useState('');
  const [entityName, setEntityName] = useState('');
  const [programName, setProgramName] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoadingData(true);
    const [bals, muts] = await Promise.all([
      getZiswafBalances(),
      getZiswafMutations()
    ]);
    setBalances(bals);
    setMutations(muts);
    setIsLoadingData(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('txType', activeTab);
    formData.append('fundCategory', fundCategory);
    formData.append('amount', amount);
    formData.append('entityName', entityName);
    formData.append('programName', programName);
    formData.append('notes', notes);

    const result = await processZiswafAction(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setAmount(''); setEntityName(''); setProgramName(''); setNotes('');
      fetchData(); // Refresh data
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Dana Kebajikan (Ziswaf)</h1>
          <p className="text-gray-400">Pengelolaan ledger terpisah dana Zakat, Infaq, Sedekah, dan Wakaf LKM.</p>
        </div>
      </div>

      {/* Separated Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Dana Kebajikan", amount: balances.total, bg: "bg-gradient-to-br from-purple-500/20 to-purple-900/20", border: "border-purple-500/30", color: "text-purple-400" },
          { title: "Saldo Zakat", amount: balances.zakat, bg: "glass", border: "border-white/5", color: "text-white" },
          { title: "Saldo Infaq / Sedekah", amount: balances.infaq, bg: "glass", border: "border-white/5", color: "text-white" },
          { title: "Saldo Wakaf Tunai", amount: balances.wakaf, bg: "glass", border: "border-white/5", color: "text-white" },
        ].map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className={`${card.bg} border ${card.border} rounded-2xl p-5 relative overflow-hidden`}
          >
            <p className="text-sm font-medium text-gray-400 mb-2">{card.title}</p>
            <h3 className={`text-2xl font-bold ${card.color}`}>
              {isLoadingData ? '...' : `Rp ${card.amount.toLocaleString()}`}
            </h3>
            {i === 0 && <HeartHandshake className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500/10" />}
          </motion.div>
        ))}
      </div>
      
      {/* Daftar Penyaluran Terkini */}
      {mutations.filter(m => m.type === 'out').length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center text-emerald-400 font-bold mb-3">
            <PieChart className="w-4 h-4 mr-2" />
            Tempat Penyaluran Dana (Mustahiq / Program)
          </div>
          <div className="flex flex-wrap gap-3">
            {mutations.filter(m => m.type === 'out').map((tx, i) => (
              <div key={i} className="bg-black/20 border border-white/5 rounded-lg px-3 py-2 flex items-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mr-2" />
                <div>
                  <p className="text-xs text-white font-medium">{tx.entity_name}</p>
                  <p className="text-[10px] text-emerald-400">{tx.program_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Transaksi Ziswaf */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden h-fit">
          <div className={`pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${activeTab === 'in' ? 'bg-blue-500/5' : 'bg-emerald-500/5'}`}></div>
          
          <div className="relative z-10 flex border-b border-white/10 mb-6">
            <button 
              onClick={() => { setActiveTab('in'); setMessage({type:'', text:''}); }}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'in' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Terima Dana (In)
            </button>
            <button 
              onClick={() => { setActiveTab('out'); setMessage({type:'', text:''}); }}
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'out' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              Salurkan Dana (Out)
            </button>
          </div>

          {message.text && (
            <div className={`mb-4 p-4 rounded-xl text-sm flex items-start gap-3 border ${message.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{message.text}</p>
            </div>
          )}

          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Kategori Dana</label>
                <select 
                  value={fundCategory}
                  onChange={(e) => setFundCategory(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                >
                  <option value="Zakat">Zakat</option>
                  <option value="Infaq/Sedekah">Infaq / Sedekah</option>
                  <option value="Wakaf">Wakaf</option>
                  <option value="Lainnya">Dana Sosial Lainnya</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nominal (Rp)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {activeTab === 'in' ? 'Nama Donatur (Muzakki/Wakif)' : 'Nama Penerima (Mustahiq)'}
              </label>
              <input 
                type="text" 
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                required
                placeholder={activeTab === 'in' ? 'Hamba Allah / Nama Donatur' : 'Nama Penerima...'}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {activeTab === 'in' ? 'Sumber / Metode' : 'Program Asnaf'}
              </label>
              <input 
                type="text" 
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                required
                placeholder={activeTab === 'in' ? 'Transfer Bank / Tunai Kotak Amal' : 'Misal: Beasiswa Santri, Fakir Miskin'}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Keterangan / Catatan</label>
              <textarea 
                rows={2} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" 
                placeholder="Catatan tambahan..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full text-white py-3 rounded-xl font-medium transition-colors mt-2 shadow-lg flex items-center justify-center ${activeTab === 'in' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'} disabled:opacity-50`}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                activeTab === 'in' ? <Download className="w-5 h-5 mr-2" /> : <Send className="w-5 h-5 mr-2" />
              )}
              {activeTab === 'in' ? 'Catat Penerimaan Dana' : 'Proses Penyaluran Dana'}
            </button>
          </form>
        </div>

        {/* History / Laporan Sumber */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-white">Riwayat Mutasi Kebajikan</h3>
            </div>
            <button onClick={fetchData} className="text-sm text-gray-400 hover:text-white transition-colors">
              Refresh
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingData ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : mutations.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">Belum ada mutasi Ziswaf.</div>
            ) : (
              mutations.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'in' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {tx.type === 'in' ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.fund_category} - {tx.program_name}</p>
                      <p className="text-xs text-gray-400">{tx.entity_name} • {new Date(tx.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold whitespace-nowrap ${tx.type === 'in' ? 'text-blue-400' : 'text-emerald-400'}`}>
                    {tx.type === 'in' ? '+' : '-'} Rp {tx.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
