import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { login, users, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login gagal. Periksa username dan password Anda.');
    }
  };

  const handleQuickLogin = async (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
    setLoading(true);
    const res = await login(u, p);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4 border border-blue-100">
            <img
              src="/src/assets/images/dipandu_logo_emblem_1790340317534.jpg"
              alt="DiPandu"
              className="w-14 h-14 rounded-xl object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke DiPandu
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Sistem Digital Pendampingan & Edukasi Supervisi Guru
          </p>
          <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50/80 py-1 px-3 rounded-full inline-block border border-blue-200/60">
            {settings.institutionName}
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Memvalidasi...' : 'Masuk Aplikasi'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Pilih Akun Demo (Satu Klik)
          </p>
          <div className="grid grid-cols-2 gap-2 text-left">
            <button
              onClick={() => handleQuickLogin('admin', 'pakhaji')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
            >
              <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                Pengawas / Admin
              </span>
              <span className="block text-[11px] text-slate-500 font-mono">admin / pakhaji</span>
            </button>

            <button
              onClick={() => handleQuickLogin('kepsek', 'bajuri39')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
            >
              <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                Kepala Sekolah
              </span>
              <span className="block text-[11px] text-slate-500 font-mono">kepsek / bajuri39</span>
            </button>

            <button
              onClick={() => handleQuickLogin('guru1', 'bajuri39')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
            >
              <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                Guru Matematika
              </span>
              <span className="block text-[11px] text-slate-500 font-mono">guru1 / bajuri39</span>
            </button>

            <button
              onClick={() => handleQuickLogin('guru2', 'bajuri39')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group"
            >
              <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                Guru Biologi
              </span>
              <span className="block text-[11px] text-slate-500 font-mono">guru2 / bajuri39</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
