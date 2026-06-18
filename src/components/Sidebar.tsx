"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  HeartHandshake, 
  BarChart3, 
  Settings,
  LogOut,
  MoonStar,
  Bot,
  Menu,
  X
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Manajemen Anggota", href: "/members", icon: Users },
  { name: "Akad & Pembiayaan", href: "/financing", icon: FileText },
  { name: "Dana Ziswaf", href: "/ziswaf", icon: HeartHandshake },
  { name: "Laporan & Analytics", href: "/reports", icon: BarChart3 },
  { name: "🤖 AI & Shariah Hub", href: "/ai-hub", icon: Bot },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Jangan tampilkan sidebar sama sekali di halaman login
  if (pathname === '/login') return null;

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-40 flex items-center justify-between px-4">
        <div className="flex items-center">
          <MoonStar className="text-emerald-400 w-6 h-6 mr-2" />
          <h1 className="text-lg font-heading font-bold text-gradient tracking-wide">
            Sya-Core
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={clsx(
        "w-64 flex-shrink-0 glass border-r border-white/5 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div>
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <MoonStar className="text-emerald-400 w-8 h-8 mr-3" />
          <h1 className="text-xl font-heading font-bold text-gradient tracking-wide">
            Sya-Core
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-2 mt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                <div className={clsx(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group cursor-pointer overflow-hidden",
                  isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={clsx("w-5 h-5 mr-3 relative z-10", isActive ? "text-emerald-400" : "group-hover:text-emerald-300 transition-colors")} />
                  <span className="text-sm font-medium relative z-10">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="text-emerald-400 font-bold text-sm">AM</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Ahmad Manajer</p>
            <p className="text-xs text-gray-400 truncate">Manajer LKM</p>
          </div>
        </div>
        <button className="mt-4 flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors group">
          <LogOut className="w-4 h-4 mr-3 group-hover:text-red-400" />
          Keluar Sistem
        </button>
      </div>
      </aside>
    </>
  );
}
