import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  UserPlus,
  School,
  BookOpen,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { login, registerGuru, users, settings, sekolahBinaan } = useApp();
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Register form state
  const [regNama, setRegNama] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regMapel, setRegMapel] = useState('Matematika');
  const [regSekolah, setRegSekolah] = useState(sekolahBinaan[0]?.nama || settings.institutionName);
  const [regKontak, setRegKontak] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('Password minimal 4 karakter.');
      return;
    }

    setRegLoading(true);
    const res = await registerGuru({
      nama: regNama,
      nip: regNip,
      mapel: regMapel,
      sekolah: regSekolah,
      kontak: regKontak,
      username: regUsername,
      password: regPassword,
    });
    setRegLoading(false);

    if (!res.success) {
      setRegError(res.message || 'Pendaftaran gagal. Silakan coba lagi.');
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex mb-3">
            <AppLogo className="w-16 h-16 rounded-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            DiPandu Supervisi Guru
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Digital Pendampingan & Edukasi Supervisi Kurikulum Merdeka
          </p>
          <div className="mt-2 text-xs font-semibold text-blue-700 bg-blue-50/80 py-1 px-3 rounded-full inline-block border border-blue-200/60">
            {settings.institutionName}
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 mb-6 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('register');
              setRegError(null);
              if (!regSekolah && sekolahBinaan.length > 0) {
                setRegSekolah(sekolahBinaan[0].nama);
              }
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeMode === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Daftar Guru Baru
          </button>
        </div>

        {activeMode === 'login' ? (
          <div>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
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
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'pakhaji')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group cursor-pointer"
                >
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    Pengawas / Admin
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono">admin / pakhaji</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('kepsek', 'bajuri39')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group cursor-pointer"
                >
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    Kepala Sekolah
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono">kepsek / bajuri39</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru1', 'bajuri39')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group cursor-pointer"
                >
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    Guru Matematika
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono">guru1 / bajuri39</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru2', 'bajuri39')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition text-left group cursor-pointer"
                >
                  <span className="block text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    Guru Biologi
                  </span>
                  <span className="block text-[11px] text-slate-500 font-mono">guru2 / bajuri39</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= REGISTER GURU BARU ================= */
          <div>
            <div className="mb-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                <School className="w-4 h-4 text-blue-600" />
                Pendaftaran Guru Sekolah Binaan
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Pilih sekolah tempat Anda mengajar dari daftar sekolah binaan yang telah terdaftar oleh Pengawas Pembina ({settings.pengawasPembina}).
              </p>
            </div>

            {regError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Guru & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Hj. Nurul Hidayati, M.Pd"
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    placeholder="19820512 200901 2 006"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kimia, Sosiologi, dll"
                    value={regMapel}
                    onChange={(e) => setRegMapel(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Satuan Pendidikan / Asal Sekolah Binaan
                </label>
                <div className="relative">
                  <select
                    value={regSekolah}
                    onChange={(e) => setRegSekolah(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none pr-8"
                  >
                    {sekolahBinaan.map((sek) => (
                      <option key={sek.id} value={sek.nama}>
                        {sek.nama} ({sek.akreditasi} - NPSN: {sek.npsn})
                      </option>
                    ))}
                    <option value={settings.institutionName}>
                      {settings.institutionName} (Pusat / Induk)
                    </option>
                  </select>
                  <School className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Data Anda akan otomatis terhubung ke rekapitulasi supervisi pengawas pada sekolah yang dipilih.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Kontak / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="0812-3456-7890"
                    value={regKontak}
                    onChange={(e) => setRegKontak(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username Akun
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="nurul_hidayati"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 4 digit"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full mt-3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {regLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang & Langsung Masuk'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
