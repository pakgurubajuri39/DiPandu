import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Eye,
  FolderCheck,
  Printer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import {
  initialIndikatorPerencanaan,
  standarIndikatorGTK,
  initialRubrikPortofolioPilar,
} from '../data/instrumentsData';
import { IndikatorPerencanaan, IndikatorKinerjaGTK, RubrikPortofolioPilar } from '../types/instruments';

export const InstrumenKemendikbudView: React.FC = () => {
  const { settings, users, currentUser } = useApp();

  const [activeInstrument, setActiveInstrument] = useState<'perencanaan' | 'observasi' | 'portofolio'>('perencanaan');

  // Teacher selection
  const guruList = users.filter((u) => u.role === 'guru');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(guruList[0]?.id || '');
  const selectedGuru = users.find((u) => u.id === selectedGuruId) || guruList[0];

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Standar Resmi Kemendikbudristek & Ditjen GTK</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Instrumen Penilaian Supervisi Akademik Kurikulum Merdeka
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Instrumen penelaahan perencanaan pembelajaran (BSKAP 2024), rubrik observasi kelas pengelolaan kinerja guru, dan validasi portofolio PKB.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak Instrumen Resmi
            </button>
          </div>
        </div>

        {/* Guru selection & Instrument Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Guru Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Guru yang Dinilai:</span>
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
          </div>

          {/* 3 Instrument Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveInstrument('perencanaan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
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
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
              INSTRUMEN PENELAAHAN MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Standar Panduan Pembelajaran dan Asesmen (PPA) BSKAP Kemendikbudristek & Kurikulum Merdeka
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Satuan Pendidikan: {settings.institutionName} · Pengawas Pembina: {settings.pengawasPembina}
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
              <span className="text-xs font-semibold text-blue-900">Hasil Rekapitulasi Skor Penelaahan</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {totalSkorPerencanaan} <span className="text-xs text-slate-500">/ {maxSkorPerencanaan} Poin</span>
                </span>
                <span className="text-base font-bold font-mono text-blue-700">
                  Nilai: {nilaiAkhirPerencanaan} / 100
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
                  <th className="py-2.5 px-3 w-36 text-center">Skala Keterpenuhan</th>
                  <th className="py-2.5 px-3 w-48">Catatan Penelaah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {indikatorPerencanaan.map((ind, idx) => (
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
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                        {[0, 1, 2].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChangePerencanaan(ind.id, val as 0 | 1 | 2)}
                            className={`px-2.5 py-1 text-xs font-bold rounded transition ${
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
                      <span className="text-[10px] text-slate-400 block mt-0.5">
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
            <h4 className="font-bold text-slate-900">Catatan Kualitatif & Tindak Lanjut Pengawas Pembina</h4>
            <textarea
              rows={3}
              value={catatanUmumPerencanaan}
              onChange={(e) => setCatatanUmumPerencanaan(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
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
            <div className="border-b-2 border-slate-800 pb-4 mb-5 text-center">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
                RUBRIK OBSERVASI KINERJA KELAS (STANDAR DITJEN GTK KEMENDIKBUDRISTEK)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Perdirjen GTK No. 7607/B.B1/HK.03/2023 · Pengelolaan Praktik Kinerja Guru Kurikulum Merdeka
              </p>
            </div>

            {/* Indikator Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-slate-100">
              {gtkIndicators.map((ind) => {
                const isSelected = ind.id === selectedGTKIndikatorId;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedGTKIndikatorId(ind.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
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
                Fokus Sasaran Kinerja:
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
                        Peringkat Observasi Observer:
                      </span>
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
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition text-center ${
                              fp.ketercapaian === btn.val
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
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
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
              INSTRUMEN VALIDASI & PENILAIAN PORTOFOLIO PENGEMBANGAN DIRI GURU
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Evaluasi 4 Pilar: Sertifikat Pelatihan Mandiri, Karya Otentik Siswa, PTK/Best Practice, dan Fasilitasi P5
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">
              Satuan Pendidikan: {settings.institutionName} · Pengawas Pembina: {settings.pengawasPembina}
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
