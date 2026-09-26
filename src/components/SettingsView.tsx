import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  School,
  Users,
  ShieldCheck,
  Save,
  UserPlus,
  Building,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { UserRole, SekolahBinaan } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    users,
    createUser,
    sekolahBinaan,
    addSekolahBinaan,
    updateSekolahBinaan,
    deleteSekolahBinaan,
  } = useApp();

  // Institution settings state
  const [instName, setInstName] = useState(settings.institutionName);
  const [pengawasName, setPengawasName] = useState(settings.pengawasPembina);
  const [tahunAjaran, setTahunAjaran] = useState(settings.tahunAjaranAktif);
  const [semester, setSemester] = useState(settings.semesterAktif);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New user form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('guru');
  const [mapel, setMapel] = useState('Matematika');
  const [sekolah, setSekolah] = useState(sekolahBinaan[0]?.nama || settings.institutionName);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('bajuri39');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Sekolah Binaan modal state
  const [showSekolahModal, setShowSekolahModal] = useState(false);
  const [editingSekolahId, setEditingSekolahId] = useState<string | null>(null);
  const [sekNama, setSekNama] = useState('');
  const [sekNpsn, setSekNpsn] = useState('');
  const [sekAlamat, setSekAlamat] = useState('');
  const [sekKepsek, setSekKepsek] = useState('');
  const [sekJumlahGuru, setSekJumlahGuru] = useState<number>(30);
  const [sekAkreditasi, setSekAkreditasi] = useState('A (Unggul)');
  const [isSubmittingSekolah, setIsSubmittingSekolah] = useState(false);

  const handleOpenAddSekolah = () => {
    setEditingSekolahId(null);
    setSekNama('');
    setSekNpsn('');
    setSekAlamat('');
    setSekKepsek('');
    setSekJumlahGuru(30);
    setSekAkreditasi('A (Unggul)');
    setShowSekolahModal(true);
  };

  const handleOpenEditSekolah = (s: SekolahBinaan) => {
    setEditingSekolahId(s.id);
    setSekNama(s.nama);
    setSekNpsn(s.npsn);
    setSekAlamat(s.alamat);
    setSekKepsek(s.kepalaSekolah);
    setSekJumlahGuru(s.jumlahGuru);
    setSekAkreditasi(s.akreditasi);
    setShowSekolahModal(true);
  };

  const handleSaveSekolah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekNama) return;
    setIsSubmittingSekolah(true);
    if (editingSekolahId) {
      await updateSekolahBinaan(editingSekolahId, {
        nama: sekNama,
        npsn: sekNpsn,
        alamat: sekAlamat,
        kepalaSekolah: sekKepsek,
        jumlahGuru: Number(sekJumlahGuru),
        akreditasi: sekAkreditasi,
      });
    } else {
      await addSekolahBinaan({
        nama: sekNama,
        npsn: sekNpsn,
        alamat: sekAlamat,
        kepalaSekolah: sekKepsek,
        jumlahGuru: Number(sekJumlahGuru),
        akreditasi: sekAkreditasi,
      });
    }
    setIsSubmittingSekolah(false);
    setShowSekolahModal(false);
  };

  const handleDeleteSekolah = async (id: string, namaSek: string) => {
    if (confirm(`Hapus sekolah "${namaSek}" dari daftar sekolah binaan?`)) {
      await deleteSekolahBinaan(id);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    await updateSettings({
      institutionName: instName,
      pengawasPembina: pengawasName,
      tahunAjaranAktif: tahunAjaran,
      semesterAktif: semester,
    });
    setIsSavingSettings(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !username) return;

    setIsSubmittingUser(true);
    const success = await createUser({
      nama,
      nip,
      role,
      mapel,
      sekolah,
      username,
      password,
    });
    setIsSubmittingUser(false);

    if (success) {
      setShowAddUserModal(false);
      setNama('');
      setNip('');
      setUsername('');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan Lembaga & Wilayah Binaan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Konfigurasi nama institusi pendidikan, data pengawas pembina, manajemen akun pengguna, dan daftar sekolah binaan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Institution Configuration Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Konfigurasi Institusi</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lembaga / Sekolah Utama
              </label>
              <input
                type="text"
                required
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Akan otomatis muncul di header modul kurikulum dan lembar cetak laporan.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pengawas Pembina SMA
              </label>
              <input
                type="text"
                required
                value={pengawasName}
                onChange={(e) => setPengawasName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  required
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester Aktif
                </label>
                <input
                  type="text"
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Footer Copyright Dokumen
              </label>
              <input
                type="text"
                disabled
                value={settings.copyright || '@copyright by. Pak GuruAI'}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Right: Sekolah Binaan & User Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sekolah Binaan Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Daftar Sekolah Binaan Pengawas</h2>
                <span className="text-xs font-mono text-slate-500 ml-2 bg-slate-100 px-2 py-0.5 rounded">
                  {sekolahBinaan.length} Sekolah
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenAddSekolah}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Sekolah Binaan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sekolahBinaan.map((sek) => (
                <div
                  key={sek.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-indigo-300 transition relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{sek.nama}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">NPSN: {sek.npsn}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      {sek.akreditasi}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{sek.alamat}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Kepsek: <strong className="text-slate-700">{sek.kepalaSekolah}</strong></span>
                    <span className="font-semibold text-slate-800">{sek.jumlahGuru} Guru</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSekolah(sek)}
                      className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition text-xs flex items-center gap-1 px-2"
                      title="Edit Sekolah"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSekolah(sek.id, sek.nama)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition text-xs flex items-center gap-1 px-2"
                      title="Hapus Sekolah"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Daftar Pengguna & Hak Akses</h2>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Tambah Pengguna
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Nama & NIP</th>
                    <th className="py-2.5 px-3">Role / Peran</th>
                    <th className="py-2.5 px-3">Sekolah</th>
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 font-mono">Username</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 block">{u.nama}</span>
                        <span className="text-[11px] text-slate-500 font-mono">NIP: {u.nip || '-'}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                            u.role === 'pengawas'
                              ? 'bg-purple-50 text-purple-700'
                              : u.role === 'kepala_sekolah'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{u.sekolah}</td>
                      <td className="py-2.5 px-3 text-slate-700">{u.mapel}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{u.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
            <p className="text-xs text-slate-500 mt-1">
              Daftarkan guru, kepala sekolah, atau pengawas ke dalam sistem DiPandu.
            </p>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Kusuma, S.Pd"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK
                </label>
                <input
                  type="text"
                  placeholder="19890101 201501 2 003"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peran</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800"
                  >
                    <option value="guru">Guru</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="pengawas">Pengawas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={mapel}
                    onChange={(e) => setMapel(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Satuan Pendidikan / Asal Sekolah Binaan
                </label>
                <select
                  value={sekolah}
                  onChange={(e) => setSekolah(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {sekolahBinaan.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama} ({s.akreditasi})
                    </option>
                  ))}
                  <option value={settings.institutionName}>
                    {settings.institutionName} (Sekolah Induk)
                  </option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih sekolah binaan yang terdaftar di sistem pengawas pembina.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="rina_kusuma"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
                  {isSubmittingUser ? 'Menyimpan...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Sekolah Binaan */}
      {showSekolahModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <School className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSekolahId ? 'Edit Data Sekolah Binaan' : 'Tambah Sekolah Binaan Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Daftarkan satuan pendidikan binaan di bawah pengawasan {settings.pengawasPembina}.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSekolah} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan / Sekolah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMAN 2 Depok atau SMA Harapan Bangsa"
                  value={sekNama}
                  onChange={(e) => setSekNama(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN (Nomor Pokok Sekolah)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 20211245"
                    value={sekNpsn}
                    onChange={(e) => setSekNpsn(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Akreditasi
                  </label>
                  <select
                    value={sekAkreditasi}
                    onChange={(e) => setSekAkreditasi(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="A (Unggul)">A (Unggul)</option>
                    <option value="B (Baik)">B (Baik)</option>
                    <option value="C (Cukup)">C (Cukup)</option>
                    <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jl. Raya Sawangan No. 45, Pancoran Mas, Kota Depok"
                  value={sekAlamat}
                  onChange={(e) => setSekAlamat(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Drs. H. Suryadi, M.Pd"
                    value={sekKepsek}
                    onChange={(e) => setSekKepsek(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Jumlah Guru
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={sekJumlahGuru}
                    onChange={(e) => setSekJumlahGuru(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSekolahModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSekolah}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmittingSekolah ? 'Menyimpan...' : editingSekolahId ? 'Perbarui Sekolah' : 'Simpan Sekolah Binaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
