import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  FileCheck,
  Edit3,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { JenisDokumenPerencanaan, Perencanaan } from '../types';

export const PerencanaanView: React.FC = () => {
  const {
    currentUser,
    perencanaanList,
    addPerencanaan,
    reviewPerencanaan,
    users,
    setActiveTab,
  } = useApp();

  const isSupervisor = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';

  // Filters
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGuru, setFilterGuru] = useState<string>('all');

  // Form Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState<JenisDokumenPerencanaan>('Modul Ajar');
  const [judulDokumen, setJudulDokumen] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Review Modal state (for Pengawas / Kepsek)
  const [reviewTarget, setReviewTarget] = useState<Perencanaan | null>(null);
  const [newStatus, setNewStatus] = useState<'Disetujui' | 'Revisi' | 'Draft'>('Disetujui');
  const [catatanReview, setCatatanReview] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Filtering logic
  const filteredList = perencanaanList.filter((doc) => {
    if (!isSupervisor && doc.guruId !== currentUser?.id) return false;
    if (filterJenis !== 'all' && doc.jenisDokumen !== filterJenis) return false;
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    if (filterGuru !== 'all' && doc.guruId !== filterGuru) return false;
    return true;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulDokumen) return;

    setIsUploading(true);
    const fileName = selectedFile ? selectedFile.name : `${selectedJenis}_${judulDokumen.replace(/\s+/g, '_')}.pdf`;

    await addPerencanaan({
      guruId: currentUser?.id,
      guruNama: currentUser?.nama,
      jenisDokumen: selectedJenis,
      judul: judulDokumen,
      fileName,
      fileUrl: `#${fileName}`,
    });

    setIsUploading(false);
    setShowUploadModal(false);
    setJudulDokumen('');
    setSelectedFile(null);
  };

  const handleOpenReview = (doc: Perencanaan) => {
    setReviewTarget(doc);
    setNewStatus(doc.status);
    setCatatanReview(doc.catatanPengawas || '');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;

    setIsSubmittingReview(true);
    await reviewPerencanaan(reviewTarget.id, newStatus, catatanReview);
    setIsSubmittingReview(false);
    setReviewTarget(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
          </span>
        );
      case 'Revisi':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" /> Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" /> Menunggu Telaah
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Modul 1: Perencanaan Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Penelaahan dan verifikasi Capaian Pembelajaran (CP), Alur Tujuan (ATP), Modul Ajar, dan KKTP Kurikulum Merdeka.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('instrumen')}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Instrumen Telaah BSKAP (17 Indikator)
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Generator Modul Merdeka
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            Unggah Berkas Baru
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {/* Jenis Dokumen */}
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">Semua Jenis Dokumen</option>
            <option value="Modul Ajar">Modul Ajar / RPP</option>
            <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
            <option value="KKTP">KKTP (Kriteria Ketercapaian)</option>
            <option value="CP">Capaian Pembelajaran (CP)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Revisi">Perlu Revisi</option>
            <option value="Draft">Draft / Menunggu</option>
          </select>

          {/* Guru Filter (for supervisor) */}
          {isSupervisor && (
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
          )}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Total: <strong className="text-slate-800">{filteredList.length}</strong> dokumen
        </div>
      </div>

      {/* Document List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Nama Dokumen & File</th>
                {isSupervisor && <th className="py-3 px-4">Guru Pengampu</th>}
                <th className="py-3 px-4">Jenis Dokumen</th>
                <th className="py-3 px-4">Tanggal Unggah</th>
                <th className="py-3 px-4">Status & Catatan Pengawas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-snug">{doc.judul}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>

                    {isSupervisor && (
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-900 block">{doc.guruNama}</span>
                        <span className="text-[11px] text-slate-500">{doc.sekolah}</span>
                      </td>
                    )}

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {doc.jenisDokumen}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {doc.tanggalUnggah}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="mb-1">{getStatusBadge(doc.status)}</div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                        "{doc.catatanPengawas}"
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isSupervisor ? (
                        <button
                          onClick={() => handleOpenReview(doc)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Telaah / Review
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Terdaftar</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada dokumen perencanaan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Upload Perencanaan */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Unggah Dokumen Perencanaan Pembelajaran
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Format berkas dokumen Kurikulum Merdeka (PDF atau draf lampiran)
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Dokumen
                </label>
                <select
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(e.target.value as JenisDokumenPerencanaan)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Modul Ajar">Modul Ajar / RPP Kurikulum Merdeka</option>
                  <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
                  <option value="KKTP">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</option>
                  <option value="CP">Analisis Capaian Pembelajaran (CP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Modul / Materi Dokumen
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Matematika Fase E: SPLDV & Matriks"
                  value={judulDokumen}
                  onChange={(e) => setJudulDokumen(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Berkas PDF
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ukuran maksimal 10MB (PDF disarankan untuk kompatibilitas telaah supervisi).
                </p>
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
                  {isUploading ? 'Mengunggah...' : 'Simpan & Unggah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Review Penelaahan untuk Pengawas / Kepsek */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Telaah Dokumen Perencanaan
              </h3>
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                {reviewTarget.jenisDokumen}
              </span>
            </div>

            <div className="my-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <p className="font-semibold text-slate-900">{reviewTarget.judul}</p>
              <p className="text-slate-500 mt-0.5">
                Pengampu: <strong>{reviewTarget.guruNama}</strong> ({reviewTarget.sekolah})
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Keputusan Verifikasi Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('Disetujui')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      newStatus === 'Disetujui'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Disetujui
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('Revisi')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      newStatus === 'Revisi'
                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Perlu Revisi
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('Draft')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      newStatus === 'Draft'
                        ? 'bg-slate-100 border-slate-400 text-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Draf / Pending
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Catatan Kualitatif / Arahan Perbaikan Pengawas
                </label>
                <textarea
                  rows={4}
                  required
                  value={catatanReview}
                  onChange={(e) => setCatatanReview(e.target.value)}
                  placeholder="Tuliskan catatan apresiasi atau aspek yang wajib diperbaiki (misal: lengkapi diferensiasi proses atau rubrik asesmen formatif)..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Menyimpan...' : 'Simpan Hasil Telaah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
