'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { getLabaRugiData } from '@/app/actions/reports';

type LabaRugiData = {
  pendapatan: { marginMurabahah: number; total: number };
  beban: { operasional: number; gaji: number; total: number };
  labaBersih: number;
};

export default function LabaRugiPage() {
  const [data, setData] = useState<LabaRugiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await getLabaRugiData();
      setData(result);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/reports" className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm font-medium mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Laporan
          </Link>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">Laporan Laba Rugi Komprehensif</h1>
          <p className="text-gray-400">Periode Berjalan: Mengukur performa finansial Koperasi/LKM.</p>
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
          <p className="text-gray-400">Mengagregasi pendapatan dan beban...</p>
        </div>
      ) : data ? (
        <div className="glass-card rounded-2xl overflow-hidden border-t-4 border-t-emerald-500">
          
          {/* Header */}
          <div className="bg-black/40 p-5 border-b border-white/10 text-center">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Koperasi Sya-Core</h2>
            <p className="text-emerald-400 font-medium mt-1">Laporan Laba Rugi (Income Statement)</p>
            <p className="text-xs text-gray-400 mt-1">Periode: Tahun Berjalan</p>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Pendapatan Operasional */}
            <div>
              <h3 className="text-blue-400 font-bold mb-3 border-b border-white/10 pb-2 flex items-center">
                PENDAPATAN OPERASIONAL
              </h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                  <span className="pl-4">41101 - Pendapatan Margin Murabahah</span>
                  <span>Rp {data.pendapatan.marginMurabahah.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 font-bold text-white">
                <span>TOTAL PENDAPATAN OPERASIONAL</span>
                <span>Rp {data.pendapatan.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Beban Operasional */}
            <div>
              <h3 className="text-red-400 font-bold mb-3 border-b border-white/10 pb-2 flex items-center">
                BEBAN OPERASIONAL
              </h3>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                  <span className="pl-4">51101 - Beban Gaji Karyawan</span>
                  <span>Rp {data.beban.gaji.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 hover:text-white transition-colors">
                  <span className="pl-4">51201 - Beban Operasional Kantor</span>
                  <span>Rp {data.beban.operasional.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 font-bold text-white">
                <span>TOTAL BEBAN OPERASIONAL</span>
                <span>Rp {data.beban.total.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Laba Bersih */}
          <div className={`p-6 border-t border-white/10 flex justify-between items-center text-xl font-bold ${data.labaBersih >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {data.labaBersih >= 0 ? 'LABA BERSIH (NET INCOME)' : 'RUGI BERSIH (NET LOSS)'}
            </div>
            <span>Rp {data.labaBersih.toLocaleString()}</span>
          </div>

        </div>
      ) : null}
    </div>
  );
}
