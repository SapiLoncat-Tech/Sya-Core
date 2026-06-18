"use client";

import { motion } from "framer-motion";
import { 
  Wallet, 
  Users, 
  Coins, 
  HeartHandshake,
  TrendingUp,
  AlertCircle,
  BellRing
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const healthData = [
  { subject: 'Likuiditas', A: 85, fullMark: 100 },
  { subject: 'Solvabilitas', A: 90, fullMark: 100 },
  { subject: 'Rentabilitas', A: 75, fullMark: 100 },
  { subject: 'Kualitas Aset', A: 88, fullMark: 100 },
  { subject: 'Kepatuhan Syariah', A: 95, fullMark: 100 },
];

const growthData = [
  { name: 'Jan', pembiayaan: 4000, dana: 2400 },
  { name: 'Feb', pembiayaan: 4500, dana: 2800 },
  { name: 'Mar', pembiayaan: 4800, dana: 3100 },
  { name: 'Apr', pembiayaan: 5200, dana: 3600 },
  { name: 'Mei', pembiayaan: 6000, dana: 4000 },
  { name: 'Jun', pembiayaan: 6500, dana: 4800 },
];

const stats = [
  { title: "Total Aset", value: "Rp 12.5 M", change: "+12.5%", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { title: "Anggota Aktif", value: "1,245", change: "+4.2%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { title: "Total Pembiayaan", value: "Rp 8.2 M", change: "+8.1%", icon: Coins, color: "text-amber-400", bg: "bg-amber-400/10" },
  { title: "Saldo Ziswaf", value: "Rp 450 Jt", change: "+15.3%", icon: HeartHandshake, color: "text-purple-400", bg: "bg-purple-400/10" },
];

const alerts = [
  { id: 1, title: "Jatuh Tempo Hari Ini", desc: "12 anggota memiliki jadwal angsuran Murabahah.", type: "warning" },
  { id: 2, title: "Peringatan NPF", desc: "Pembiayaan macet Bpk. Budi masuk bulan ke-3.", type: "danger" },
  { id: 3, title: "Validasi Laporan", desc: "Laporan bulanan siap untuk divalidasi Manajer.", type: "info" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Executive Summary</h1>
          <p className="text-gray-400">Ringkasan performa keuangan dan operasional LKM Syariah Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors text-sm font-medium">
            <BellRing className="w-4 h-4 text-emerald-400" />
            <span>Notifikasi</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">3</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-heading font-semibold text-white mb-6">Indeks Kesehatan Koperasi</h3>
          <div className="flex-1 min-h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skor"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 25, 35, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-semibold text-white">Tren Pembiayaan vs Dana Pihak Ketiga</h3>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPembiayaan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDana" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 25, 35, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="pembiayaan" stroke="#10b981" fillOpacity={1} fill="url(#colorPembiayaan)" name="Pembiayaan" />
                <Area type="monotone" dataKey="dana" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDana)" name="Dana Pihak Ketiga" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
          Perhatian Khusus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map(alert => (
            <div key={alert.id} className={
              `glass border-l-4 rounded-xl p-4 flex gap-4 ` + 
              (alert.type === 'warning' ? 'border-amber-400' : alert.type === 'danger' ? 'border-red-400' : 'border-blue-400')
            }>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm">{alert.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
