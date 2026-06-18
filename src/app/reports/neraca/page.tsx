'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { getNeracaData } from '@/app/actions/reports';

type NeracaData = {
  aset: { kas: number; piutangMurabahah: number; total: number };
  kewajiban: { marginDitangguhkan: number; total: number };
  ekuitas: { modalAwal: number; total: number };
  isBalanced: boolean;
};

export default function NeracaPage() {
  const [data, setData] = useState<NeracaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await getNeracaData();
      setData(result);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/reports" className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm font-medium mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Laporan
          </Link>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Laporan Posisi Keuangan (Neraca)</h1>
          <p className="text-gray-400">Periode Berjalan: Berdasarkan Akumulasi Jurnal Transaksi LKM.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-white/5 text-sm font-medium" onClick={() => window.print()}>
            <Download className="w-4 h-4" /> Cetak PDF
          </button>
          <button className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border border-emerald-500/20 text-sm font-medium">
            <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-400">Mengagregasi buku besar...</p>
        </div>
      ) : data ? (
        <>
          <div className={`p-4 rounded-xl flex items-center justify-center gap-2 font-medium border ${data.isBalanced ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <Scale className="w-5 h-5" />
            {data.isBalanced ? 'Status: SEIMBANG (BALANCED)' : 'Status: TIDAK SEIMBANG (UNBALANCED)'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* AKTIVA (ASET) */}
            <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-blue-500">
              <div className="bg-black/40 p-4 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">AKTIVA (ASET)</h3>
              </div>
              <div className="p-4 space-y-6">
                
                <div>
                  <h4 className="text-blue-400 font-medium mb-2 text-sm border-b border-white/5 pb-2">ASET LANCAR</h4>
                  <div className="space-y-3 mt-3 text-sm">
                    <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                      <span>11101 - Kas / Bank Syariah</span>
                      <span>Rp {data.aset.kas.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                      <span>14101 - Piutang Murabahah</span>
                      <span>Rp {data.aset.piutangMurabahah.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="bg-black/40 p-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-white">TOTAL ASET</span>
                <span className="font-bold text-blue-400">Rp {data.aset.total.toLocaleString()}</span>
              </div>
            </div>

            {/* PASIVA (KEWAJIBAN & EKUITAS) */}
            <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-purple-500">
              <div className="bg-black/40 p-4 border-b border-white/10">
                <h3 className="font-bold text-lg text-white">PASIVA (KEWAJIBAN & EKUITAS)</h3>
              </div>
              <div className="p-4 space-y-6">
                
                <div>
                  <h4 className="text-purple-400 font-medium mb-2 text-sm border-b border-white/5 pb-2">KEWAJIBAN (LIABILITAS)</h4>
                  <div className="space-y-3 mt-3 text-sm">
                    <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                      <span>22101 - Margin Murabahah Ditangguhkan</span>
                      <span>Rp {data.kewajiban.marginDitangguhkan.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-sm font-medium text-gray-200">
                    <span>Total Kewajiban</span>
                    <span>Rp {data.kewajiban.total.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-purple-400 font-medium mb-2 text-sm border-b border-white/5 pb-2">EKUITAS (MODAL)</h4>
                  <div className="space-y-3 mt-3 text-sm">
                    <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                      <span>31101 - Modal Disetor LKM</span>
                      <span>Rp {data.ekuitas.modalAwal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-sm font-medium text-gray-200">
                    <span>Total Ekuitas</span>
                    <span>Rp {data.ekuitas.total.toLocaleString()}</span>
                  </div>
                </div>

              </div>
              <div className="bg-black/40 p-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-white">TOTAL PASIVA</span>
                <span className="font-bold text-purple-400">Rp {(data.kewajiban.total + data.ekuitas.total).toLocaleString()}</span>
              </div>
            </div>

          </div>
        </>
      ) : null}
    </div>
  );
}
