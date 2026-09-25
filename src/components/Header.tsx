import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import {
  FileText,
  Eye,
  FolderArchive,
  Download,
  BookOpen,
  Settings,
  LogOut,
  UserCheck,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, settings, activeTab, setActiveTab, logout, switchUser, users } = useApp();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'perencanaan', label: 'Perencanaan', icon: FileText },
    { id: 'observasi', label: 'Observasi Kelas', icon: Eye },
    { id: 'portofolio', label: 'Portofolio Guru', icon: FolderArchive },
    { id: 'instrumen', label: 'Instrumen Kemendikbud', icon: ShieldCheck },
    { id: 'generator', label: 'Modul Kurikulum Merdeka', icon: BookOpen },
    { id: 'laporan', label: 'Pelaporan & Unduh', icon: Download },
  ];

  if (currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah') {
    navItems.push({ id: 'pengaturan', label: 'Pengaturan & Binaan', icon: Settings });
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'pengawas':
        return 'Pengawas Pembina (Admin)';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      case 'guru':
        return 'Guru Pendidik';
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <AppLogo className="w-9 h-9" />
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition">
                  DiPandu
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500">
                  {settings.institutionName}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean text links with active indicator) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: User Role, Quick Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold overflow-hidden shrink-0">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.nama}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      currentUser.nama.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
                      {currentUser.nama}
                    </p>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {getRoleLabel(currentUser.role)}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu for Switch Role & Sign Out */}
                {showSwitchMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.nama}</p>
                      <p className="text-xs text-slate-500 font-mono">NIP: {currentUser.nip || '-'}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{currentUser.sekolah}</p>
                    </div>

                    <div className="py-1">
                      <p className="px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Ganti Akun Demo
                      </p>
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u);
                            setShowSwitchMenu(false);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                            u.id === currentUser.id ? 'bg-blue-50/60 font-semibold text-blue-700' : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate pr-2">
                            {u.nama} ({u.role})
                          </span>
                          {u.id === currentUser.id && <span className="text-[10px] text-blue-600">Aktif</span>}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setShowSwitchMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm whitespace-nowrap"
              >
                Masuk Sistem
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
