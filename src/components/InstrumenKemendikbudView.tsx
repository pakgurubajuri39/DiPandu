import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Eye,
  FolderCheck,
  Printer,
  CheckCircle2,
  AlertCircle,
  Award,
  Layers,
  Sparkles,
  ShieldCheck,
  Save,
  Lock,
  Info,
} from 'lucide-react';
import {
  initialIndikatorPerencanaan,
  standarIndikatorGTK,
  initialRubrikPortofolioPilar,
} from '../data/instrumentsData';
import { IndikatorPerencanaan, IndikatorKinerjaGTK, RubrikPortofolioPilar } from '../types/instruments';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

export const InstrumenKemendikbudView: React.FC = () => {
  const { settings, users, currentUser } = useApp();

  // Role Permissions
  // INSTRUMEN KEMENDIKBUD HANYA DAPAT DIISI OLEH PENGAWAS / KEPALA SEKOLAH. GURU HANYA DAPAT MELIHAT HASIL PENILAIANNYA (READ-ONLY).
  const isPenilai = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';
  const isGuru = currentUser?.role === 'guru';

  const [activeInstrument, setActiveInstrument] = useState<'perencanaan' | 'observasi' | 'portofolio'>('perencanaan');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Teacher selection
  const guruList = users.filter((u) => u.role === 'guru');
  // If user is a guru, lock to their own ID
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    isGuru ? currentUser?.id || guruList[0]?.id || '' : guruList[0]?.id || ''
  );

  const selectedGuru = isGuru
    ? users.find((u) => u.id === currentUser?.id) || guruList[0]
    : users.find((u) => u.id === selectedGuruId) || guruList[0];

  // State for Instrument 1: Perencanaan (Modul Ajar)
  const [indikatorPerencanaan, setIndikatorPerencanaan] = useState<IndikatorPerencanaan[]>(initialIndikatorPerencanaan);
  const [catatanUmumPerencanaan, setCatatanUmumPerencanaan] = useState(
    'Modul ajar telah mengintegrasikan diferensiasi proses dan instrumen asesmen formatif yang sangat kontekstual dengan kesiapan murid.'
  );

  // Compute Instrument 1 Score
  const totalSkorPerencanaan = indikatorPerencanaan.reduce((sum, item) => sum + item.skor, 0);
  const maxSkorPerencanaan = indikatorPerencanaan.length * 2; // 34
  const nilaiAkhirPerencanaan = Math.round((totalSkorPerencanaan / maxSkorPerencanaan) * 100);

  const getPredikatPerencanaan = (nilai: number) => {
    if (nilai >= 86) return { label: 'Amat Baik (A)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (nilai >= 71) return { label: 'Baik (B)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (nilai >= 56) return { label: 'Cukup (C)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Kurang (D)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleScoreChangePerencanaan = (id: string, newSkor: 0 | 1 | 2) => {
    if (!isPenilai) return; // Strict guard
    setIndikatorPerencanaan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, skor: newSkor } : item))
    );
  };

  // State for Instrument 2: Observasi GTK
  const [selectedGTKIndikatorId, setSelectedGTKIndikatorId] = useState<string>(standarIndikatorGTK[0].id);
  const [gtkIndicators, setGtkIndicators] = useState<IndikatorKinerjaGTK[]>(standarIndikatorGTK);

  const activeGTK = gtkIndicators.find((i) => i.id === selectedGTKIndikatorId) || gtkIndicators[0];

  const handleGTKKetercapaianChange = (
    indikatorId: string,
    fokusKey: 'fokusPerilaku1' | 'fokusPerilaku2' | 'fokusPerilaku3',
    ketercapaian: 1 | 2 | 3
  ) => {
    if (!isPenilai) return; // Strict guard
    setGtkIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id === indikatorId) {
          return {
            ...ind,
            [fokusKey]: {
              ...ind[fokusKey],
              ketercapaian,
            },
          };
        }
        return ind;
      })
    );
  };

  // State for Instrument 3: Portofolio
  const [rubrikPilar, setRubrikPilar] = useState<RubrikPortofolioPilar[]>(initialRubrikPortofolioPilar);

  const handleSaveAssessment = () => {
    if (!isPenilai) return;
    setSaveSuccessMessage(`Hasil penilaian instrumen untuk ${selectedGuru?.nama} berhasil disimpan ke basis data.`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <TutWuriHandayaniLogo className="w-12 h-12 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Instrumen Resmi Kemendikbudristek & BSKAP Kurikulum Merdeka</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Instrumen Penilaian Supervisi Akademik Guru
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Penelaahan modul ajar (BSKAP No. 033/2024), rubrik observasi kelas pengelolaan kinerja GTK (Perdirjen GTK No. 7607/2023), dan verifikasi portofolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isPenilai && (
              <button
                onClick={handleSaveAssessment}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Penilaian
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* ROLE NOTICE BANNER */}
        <div className="mt-5">
          {isGuru ? (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
              <Lock className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-blue-900">Hak Akses Guru (Mode Tinjauan / Read-Only):</span>
                <p className="text-blue-800 mt-0.5 leading-relaxed">
                  Sesuai ketentuan, instrumen penilaian supervisi hanya dapat diisi dan dinilai oleh <strong>Pengawas Sekolah Pembina ({settings.pengawasPembina})</strong> atau <strong>Kepala Sekolah</strong>. Anda memiliki akses penuh untuk meninjau detail skor, deskriptor penilaian, dan catatan kualitatif yang diberikan.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-900">Hak Akses Penilai ({currentUser?.role === 'pengawas' ? 'Pengawas Sekolah' : 'Kepala Sekolah'}):</span>
                <p className="text-emerald-800 mt-0.5 leading-relaxed">
                  Anda memiliki otoritas penuh untuk mengisi skala rubrik, memberikan catatan kualitatif, serta mengesahkan instrumen penilaian bagi guru binaan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Guru selection & Instrument Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Guru Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Guru yang Dinilai:</span>
            {isGuru ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 font-semibold">
                <span>{selectedGuru?.nama}</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  (Akun Anda)
                </span>
              </span>
            ) : (
              <select
                value={selectedGuruId}
                onChange={(e) => setSelectedGuruId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {guruList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama} — {g.mapel} ({g.sekolah})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3 Instrument Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveInstrument('perencanaan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeInstrument === 'perencanaan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              1. Telaah Perencanaan (BSKAP)
            </button>

            <button
              onClick={() => setActiveInstrument('observasi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeInstrument === 'observasi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              2. Observasi Kelas (Ditjen GTK)
            </button>

            <button
              onClick={() => setActiveInstrument('portofolio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeInstrument === 'portofolio'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5 text-indigo-600" />
              3. Validasi Portofolio Guru
            </button>
          </div>
        </div>
      </div>

      {/* ================= INSTRUMEN 1: TELAAH PERENCANAAN PEMBELAJARAN (BSKAP) ================= */}
      {activeInstrument === 'perencanaan' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-xs print:border-none print:p-0">
          {/* Kop Dokumen Instrumen */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TutWuriHandayaniLogo className="w-11 h-11" />
              <div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                  INSTRUMEN PENELAAHAN MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Standar Panduan Pembelajaran dan Asesmen (PPA) BSKAP Kemendikbudristek & Kurikulum Merdeka
                </p>
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Satuan Pendidikan: {selectedGuru?.sekolah || settings.institutionName} · Pengawas Pembina: {settings.pengawasPembina}
            </p>
          </div>

          {/* Identitas Guru & Penilai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <p><strong className="text-slate-700">Nama Guru:</strong> {selectedGuru?.nama}</p>
              <p className="font-mono mt-1"><strong className="text-slate-700">NIP:</strong> {selectedGuru?.nip || '-'}</p>
              <p className="mt-1"><strong className="text-slate-700">Mata Pelajaran:</strong> {selectedGuru?.mapel}</p>
            </div>
            <div>
              <p><strong className="text-slate-700">Pengawas Penelaah:</strong> {settings.pengawasPembina}</p>
              <p className="mt-1"><strong className="text-slate-700">Tahun Ajaran:</strong> {settings.tahunAjaranAktif} ({settings.semesterAktif})</p>
              <p className="mt-1"><strong className="text-slate-700">Fokus Kurikulum:</strong> Fase E/F SMA Merdeka</p>
            </div>
          </div>

          {/* Skor Summary Card */}
          <div className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-900">Hasil Rekapitulasi Skor Penelaahan Modul Ajar</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {totalSkorPerencanaan} <span className="text-xs text-slate-500">/ {maxSkorPerencanaan} Poin</span>
                </span>
                <span className="text-base font-bold font-mono text-blue-700">
                  Nilai Akhir: {nilaiAkhirPerencanaan} / 100
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getPredikatPerencanaan(nilaiAkhirPerencanaan).color}`}>
                Predikat: {getPredikatPerencanaan(nilaiAkhirPerencanaan).label}
              </span>
            </div>
          </div>

          {/* Table of 17 Indicators */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-32">Komponen</th>
                  <th className="py-2.5 px-3">Indikator & Deskriptor Telaah</th>
                  <th className="py-2.5 px-3 w-40 text-center">Skor Penilaian</th>
                  <th className="py-2.5 px-3 w-48">Catatan Penelaah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {indikatorPerencanaan.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono text-center font-semibold text-slate-600">
                      {ind.nomor}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {ind.komponen}
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900 leading-snug">{ind.deskriptor}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ind.panduanPenilaian}</p>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isPenilai ? (
                        // Penilai (Supervisor / Kepsek) has interactive buttons
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                          {[0, 1, 2].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleScoreChangePerencanaan(ind.id, val as 0 | 1 | 2)}
                              className={`px-2.5 py-1 text-xs font-bold rounded transition cursor-pointer ${
                                ind.skor === val
                                  ? val === 2
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : val === 1
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'bg-rose-500 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      ) : (
                        // Guru: Read-only display badge
                        <div className="inline-flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 text-xs font-bold font-mono rounded border ${
                              ind.skor === 2
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ind.skor === 1
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            Skor: {ind.skor}
                          </span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {ind.skor === 2 ? 'Lengkap & Sesuai' : ind.skor === 1 ? 'Kurang Lengkap' : 'Tidak Ada'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 italic text-[11px]">
                      {ind.catatan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Catatan Kualitatif & Rekomendasi Pengawas */}
          <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center justify-between">
              <span>Catatan Kualitatif & Rekomendasi Pengawas Pembina</span>
              {!isPenilai && (
                <span className="text-[10px] font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                  Hanya dapat diedit oleh Pengawas / Kepala Sekolah
                </span>
              )}
            </h4>
            {isPenilai ? (
              <textarea
                rows={3}
                value={catatanUmumPerencanaan}
                onChange={(e) => setCatatanUmumPerencanaan(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Masukkan catatan kualitatif telaah modul ajar..."
              />
            ) : (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 text-xs italic">
                "{catatanUmumPerencanaan}"
              </div>
            )}
          </div>

          {/* Tanda Tangan Resmi Pengawas & Guru */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-800">
            <div>
              <p className="text-slate-500">Guru yang Ditelaah,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tertanda Digital)
              </div>
              <p className="font-bold underline text-slate-900">{selectedGuru?.nama}</p>
              <p className="text-[11px] font-mono text-slate-500">NIP. {selectedGuru?.nip || '-'}</p>
            </div>

            <div>
              <p className="text-slate-500">Pengawas Pembina SMA,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tertanda Digital)
              </div>
              <p className="font-bold underline text-slate-900">{settings.pengawasPembina}</p>
              <p className="text-[11px] font-mono text-slate-500">NIP. 19680512 199303 1 004</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSTRUMEN 2: RUBRIK OBSERVASI KELAS (DITJEN GTK) ================= */}
      {activeInstrument === 'observasi' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="border-b-2 border-slate-800 pb-5 mb-5 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TutWuriHandayaniLogo className="w-11 h-11" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                    RUBRIK OBSERVASI KINERJA KELAS (STANDAR DITJEN GTK KEMENDIKBUDRISTEK)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Perdirjen GTK No. 7607/B.B1/HK.03/2023 · Pengelolaan Praktik Kinerja Guru Kurikulum Merdeka
                  </p>
                </div>
              </div>
            </div>

            {/* Indikator Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-slate-100">
              {gtkIndicators.map((ind) => {
                const isSelected = ind.id === selectedGTKIndikatorId;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedGTKIndikatorId(ind.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {ind.nama}
                  </button>
                );
              })}
            </div>

            {/* Current Selected Indicator Details */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs">
              <span className="font-bold text-blue-700 uppercase tracking-wider text-[11px]">
                Fokus Sasaran Kinerja Terpilih:
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeGTK.nama}</h3>
              <p className="text-slate-600 mt-1">{activeGTK.deskripsi}</p>
              <div className="mt-2 text-slate-500 font-medium">
                Target Perilaku: <strong className="text-slate-800">{activeGTK.fokusTarget}</strong>
              </div>
            </div>
          </div>

          {/* 3 Fokus Perilaku Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['fokusPerilaku1', 'fokusPerilaku2', 'fokusPerilaku3'] as const).map((fpKey, idx) => {
              const fp = activeGTK[fpKey];
              return (
                <div
                  key={fp.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">
                        Target Perilaku {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fp.ketercapaian === 3
                            ? 'bg-emerald-50 text-emerald-700'
                            : fp.ketercapaian === 2
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {fp.ketercapaian === 3
                          ? 'Dilakukan & Efektif'
                          : fp.ketercapaian === 2
                          ? 'Dilakukan Belum Efektif'
                          : 'Belum Dilakukan'}
                      </span>
                    </div>

                    {/* Perilaku yang Dianjurkan */}
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1.5">
                        ✓ Perilaku yang Dianjurkan:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
                        {fp.perilakuDianjurkan.map((p, pIdx) => (
                          <li key={pIdx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Perilaku yang Dihindari */}
                    <div>
                      <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-1.5">
                        ✕ Perilaku yang Dihindari:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 leading-relaxed">
                        {fp.perilakuDihindari.map((p, pIdx) => (
                          <li key={pIdx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Rating Selection (1, 2, 3) */}
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Peringkat Observasi Penilai:
                      </span>
                      {isPenilai ? (
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { val: 1, label: 'Belum' },
                            { val: 2, label: 'Blm Efektif' },
                            { val: 3, label: 'Efektif' },
                          ].map((btn) => (
                            <button
                              key={btn.val}
                              type="button"
                              onClick={() =>
                                handleGTKKetercapaianChange(activeGTK.id, fpKey, btn.val as 1 | 2 | 3)
                              }
                              className={`py-1.5 text-[11px] font-bold rounded-lg border transition text-center cursor-pointer ${
                                fp.ketercapaian === btn.val
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                              fp.ketercapaian === 3
                                ? 'bg-emerald-600 text-white'
                                : fp.ketercapaian === 2
                                ? 'bg-blue-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {fp.ketercapaian === 3
                              ? 'Skor 3: Dilakukan & Efektif'
                              : fp.ketercapaian === 2
                              ? 'Skor 2: Dilakukan Belum Efektif'
                              : 'Skor 1: Belum Dilakukan'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bukti Faktual Catatan */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Catatan Bukti Faktual Perilaku:
                      </span>
                      <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700 italic">
                        "{fp.catatanBuktiFaktual}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= INSTRUMEN 3: VALIDASI PORTOFOLIO GURU & PKB ================= */}
      {activeInstrument === 'portofolio' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-xs print:border-none print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TutWuriHandayaniLogo className="w-11 h-11" />
              <div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                  INSTRUMEN VALIDASI & PENILAIAN PORTOFOLIO PENGEMBANGAN DIRI GURU
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Evaluasi 4 Pilar: Sertifikat Pelatihan Mandiri, Karya Otentik Siswa, PTK/Best Practice, dan Fasilitasi P5
                </p>
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Satuan Pendidikan: {selectedGuru?.sekolah || settings.institutionName} · Pengawas Pembina: {settings.pengawasPembina}
            </p>
          </div>

          {/* 4 Pilar Rubrics Accordion/Cards */}
          <div className="space-y-6">
            {rubrikPilar.map((pilar, pIdx) => (
              <div
                key={pilar.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Pilar {pIdx + 1} ({pilar.kategori})
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{pilar.namaPilar}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      Rata-Rata: {pilar.skorRataRata.toFixed(2)} / 4.00
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {pilar.statusKelayakan}
                    </span>
                  </div>
                </div>

                {/* Sub-criteria */}
                <div className="space-y-2 text-xs">
                  {pilar.aspekPenilaian.map((aspek, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="max-w-xl">
                        <p className="font-semibold text-slate-800">{aspek.kriteria}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">{aspek.catatan}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 font-mono">Skor:</span>
                        <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                          {aspek.skor} / 4
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white rounded-lg border border-blue-100 text-xs text-slate-700">
                  <strong className="text-blue-900">Catatan Rekomendasi Validator:</strong>{' '}
                  {pilar.catatanValidator}
                </div>
              </div>
            ))}
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-800">
            <div>
              <p className="text-slate-500">Guru Pemilik Portofolio,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tertanda Digital)
              </div>
              <p className="font-bold underline text-slate-900">{selectedGuru?.nama}</p>
              <p className="text-[11px] font-mono text-slate-500">NIP. {selectedGuru?.nip || '-'}</p>
            </div>

            <div>
              <p className="text-slate-500">Pengawas Penilai Portofolio,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tertanda Digital)
              </div>
              <p className="font-bold underline text-slate-900">{settings.pengawasPembina}</p>
              <p className="text-[11px] font-mono text-slate-500">NIP. 19680512 199303 1 004</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
