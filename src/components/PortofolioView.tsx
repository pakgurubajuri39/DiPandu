import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderArchive,
  UploadCloud,
  Award,
  BookOpen,
  FileCheck,
  Layers,
  Trash2,
  ExternalLink,
  Filter,
  FileText,
} from 'lucide-react';
import { KategoriPortofolio } from '../types';

export const PortofolioView: React.FC = () => {
  const { currentUser, portofolioList, addPortofolio, deletePortofolio, users, setActiveTab } = useApp();

  const isSupervisor = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterGuru, setFilterGuru] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [selectedKategori, setSelectedKategori] = useState<KategoriPortofolio>('Sertifikat');
  const [judulPortofolio, setJudulPortofolio] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'Semua Kategori', icon: FolderArchive },
    { id: 'Sertifikat', label: 'Sertifikat Pelatihan', icon: Award },
    { id: 'KaryaSiswa', label: 'Sampel Karya Siswa', icon: FileCheck },
    { id: 'PTK', label: 'Laporan PTK / Best Practice', icon: BookOpen },
    { id: 'P5', label: 'Dokumentasi Projek P5', icon: Layers },
  ];

  const filteredList = portofolioList.filter((item) => {
    if (!isSupervisor && item.guruId !== currentUser?.id) return false;
    if (activeCategory !== 'all' && item.kategori !== activeCategory) return false;
    if (filterGuru !== 'all' && item.guruId !== filterGuru) return false;
    return true;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulPortofolio) return;

    setIsUploading(true);
    const fileName = selectedFile
      ? selectedFile.name
      : `${selectedKategori}_${judulPortofolio.replace(/\s+/g, '_')}.pdf`;

    await addPortofolio({
      guruId: currentUser?.id,
      guruNama: currentUser?.nama,
      sekolah: currentUser?.sekolah,
      kategori: selectedKategori,
      judul: judulPortofolio,
      deskripsi,
      fileName,
      fileUrl: `#${fileName}`,
    });

    setIsUploading(false);
    setShowUploadModal(false);
    setJudulPortofolio('');
    setDeskripsi('');
    setSelectedFile(null);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Sertifikat':
        return <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">Sertifikat</span>;
      case 'KaryaSiswa':
        return <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">Karya Siswa</span>;
      case 'PTK':
        return <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">Laporan PTK</span>;
      case 'P5':
        return <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">Projek P5</span>;
      default:
        return <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">{cat}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Modul 3: Repositori Galeri Portofolio Guru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Penyimpanan karya profesional, sertifikat pengembangan keprofesian berkelanjutan, karya siswa, dan laporan PTK.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('instrumen')}
            className="px-3.5 py-2 text-xs font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition flex items-center gap-1.5"
          >
            <FolderArchive className="w-4 h-4 text-indigo-600" />
            Instrumen Validasi 4 Pilar
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            Unggah Portofolio Baru
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Supervisor Teacher Filter */}
        {isSupervisor && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-semibold">Guru:</span>
            <select
              value={filterGuru}
              onChange={(e) => setFilterGuru(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Semua Guru</option>
              {users
                .filter((u) => u.role === 'guru')
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama} ({g.mapel})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Portfolio Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  {getCategoryBadge(item.kategori)}
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.tanggalUnggah}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.judul}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {item.deskripsi}
                </p>

                {isSupervisor && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                    Pendidik: <strong className="text-slate-800">{item.guruNama}</strong>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[170px]">
                  {item.fileName}
                </span>

                <div className="flex items-center gap-1.5">
                  {(currentUser?.id === item.guruId || currentUser?.role === 'pengawas') && (
                    <button
                      onClick={() => deletePortofolio(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Hapus Portofolio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
            <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              Belum ada portofolio pada kategori ini.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Klik "Unggah Portofolio Baru" untuk menambahkan karya atau sertifikat.
            </p>
          </div>
        )}
      </div>

      {/* Modal Upload Portofolio */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Unggah Dokumen Portofolio Guru
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Lampirkan sertifikat pelatihan mandiri, karya projek siswa, atau artikel ilmiah.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Portofolio
                </label>
                <select
                  value={selectedKategori}
                  onChange={(e) => setSelectedKategori(e.target.value as KategoriPortofolio)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Sertifikat">Sertifikat Pelatihan (PMM / Bimtek)</option>
                  <option value="KaryaSiswa">Sampel Hasil Belajar / Karya Siswa</option>
                  <option value="PTK">Laporan Penelitian Tindakan Kelas (PTK)</option>
                  <option value="P5">Dokumentasi Projek P5 (Profil Pelajar Pancasila)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Portofolio / Berkas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sertifikat Pelatihan Berdiferensiasi PMM 32 JP"
                  value={judulPortofolio}
                  onChange={(e) => setJudulPortofolio(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Keterangan Ringkas
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan ringkasan materi kegiatan atau keterkaitan dengan pembelajaran..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Dokumen / Lampiran (PDF/Gambar)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  {isUploading ? 'Mengunggah...' : 'Simpan Portofolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
