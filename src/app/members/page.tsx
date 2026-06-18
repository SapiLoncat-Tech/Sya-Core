"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2 } from "lucide-react";

const members = [
  { id: "M-001", name: "Ahmad Syafiq", nik: "320192837182", type: "Anggota Penuh", status: "Aktif", balance: "Rp 12.500.000", ao: "Budi Santoso" },
  { id: "M-002", name: "Siti Aminah", nik: "320192837183", type: "Anggota Biasa", status: "Aktif", balance: "Rp 4.200.000", ao: "Rina Marlina" },
  { id: "M-003", name: "Budi Raharjo", nik: "320192837184", type: "Calon Anggota", status: "Non-Aktif", balance: "Rp 500.000", ao: "Budi Santoso" },
  { id: "M-004", name: "Fatmawati", nik: "320192837185", type: "Anggota Penuh", status: "Aktif", balance: "Rp 28.100.000", ao: "Rina Marlina" },
  { id: "M-005", name: "Hasan Basri", nik: "320192837186", type: "Anggota Biasa", status: "Aktif", balance: "Rp 1.150.000", ao: "Budi Santoso" },
];

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Master Data Anggota</h1>
          <p className="text-gray-400">Kelola profil nasabah, simpanan, dan status keanggotaan.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-lg shadow-emerald-500/20">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Anggota
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, NIK, atau ID..." 
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors w-full md:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors w-full md:w-auto justify-center">
              <FileText className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID & Nama</th>
                <th className="px-6 py-4 font-medium">NIK</th>
                <th className="px-6 py-4 font-medium">Jenis</th>
                <th className="px-6 py-4 font-medium">AO Area</th>
                <th className="px-6 py-4 font-medium">Total Saldo</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={member.id} 
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-emerald-400 transition-colors">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{member.nik}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{member.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{member.ao}</td>
                  <td className="px-6 py-4 font-medium text-white">{member.balance}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      member.status === 'Aktif' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {member.status === 'Aktif' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
          <span>Menampilkan 5 dari 1,245 anggota</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 glass rounded hover:text-white disabled:opacity-50" disabled>Seb</button>
            <button className="px-3 py-1 glass bg-emerald-500/20 text-emerald-400 rounded border-emerald-500/30">1</button>
            <button className="px-3 py-1 glass rounded hover:text-white">2</button>
            <button className="px-3 py-1 glass rounded hover:text-white">3</button>
            <button className="px-3 py-1 glass rounded hover:text-white">Sel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
