"use client";

import Link from "next/link";
import { FileText, Download, FileSpreadsheet, LockKeyhole, History, ArrowRight } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Laporan & Analytics</h1>
        <p className="text-gray-400">Ekspor laporan keuangan standar OJK/Kemenkop dan Audit Trail.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Laporan Standard */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-white mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-emerald-400" />
            Laporan Keuangan Standar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Laporan Posisi Keuangan (Neraca)", desc: "Aset, Kewajiban, dan Ekuitas per periode.", link: "/reports/neraca" },
              { title: "Laporan Laba Rugi", desc: "Pendapatan operasi dan beban operasional.", link: "/reports/laba-rugi" },
              { title: "Laporan Perubahan Ekuitas", desc: "Perubahan modal disetor dan SHU." },
              { title: "Laporan Arus Kas", desc: "Arus kas operasi, investasi, dan pendanaan." },
              { title: "Laporan Sumber & Penyaluran Ziswaf", desc: "Mutasi dana kebajikan." },
              { title: "Kolektibilitas Pembiayaan (NPF)", desc: "Daftar pembiayaan bermasalah." },
            ].map((report, i) => (
              <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                <div>
                  <h4 className="text-white font-medium mb-1">{report.title}</h4>
                  <p className="text-xs text-gray-400 mb-4">{report.desc}</p>
                </div>
                {report.link ? (
                  <Link href={report.link} className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-sm font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-1 border border-emerald-500/20">
                    Lihat Laporan <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <div className="flex gap-2 opacity-50 cursor-not-allowed">
                    <button disabled className="flex-1 bg-white/5 text-white text-xs py-2 rounded-lg flex justify-center items-center gap-1 border border-white/5">
                      <Download className="w-3 h-3" /> PDF
                    </button>
                    <button disabled className="flex-1 bg-white/5 text-white text-xs py-2 rounded-lg flex justify-center items-center gap-1 border border-white/5">
                      <FileSpreadsheet className="w-3 h-3" /> Excel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="glass-card rounded-2xl p-6 h-fit border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-white flex items-center">
              <History className="w-5 h-5 mr-2 text-blue-400" />
              Audit Trail Terkini
            </h3>
            <LockKeyhole className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-4">
            {[
              { user: 'Budi (Staff)', action: 'Input Akad Murabahah', target: 'M-001', time: '10 menit lalu' },
              { user: 'Siti (Kasir)', action: 'Terima Angsuran', target: 'M-045', time: '45 menit lalu' },
              { user: 'Ahmad (Manajer)', action: 'Validasi Jurnal', target: 'Bulan April', time: '2 jam lalu' },
              { user: 'Rina (AO)', action: 'Update Data Anggota', target: 'M-089', time: '5 jam lalu' },
            ].map((log, i) => (
              <div key={i} className="relative pl-4 border-l border-white/10 pb-4 last:pb-0">
                <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[4.5px] top-1.5"></div>
                <p className="text-sm text-white font-medium">{log.action}</p>
                <p className="text-xs text-gray-400 mt-1">Oleh: <span className="text-blue-300">{log.user}</span> • Ref: {log.target}</p>
                <p className="text-[10px] text-gray-500 mt-1">{log.time}</p>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-xs text-blue-400 hover:text-blue-300 py-2 border border-blue-500/20 rounded-lg transition-colors">
            Lihat Log Lengkap
          </button>
        </div>

      </div>
    </div>
  );
}
