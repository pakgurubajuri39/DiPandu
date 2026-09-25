import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Award,
  User,
  School,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { pdfGenerator } from '../services/pdfGenerator';
import { excelGenerator } from '../services/excelGenerator';
import { User as UserType } from '../types';

export const LaporanView: React.FC = () => {
  const {
    currentUser,
    users,
    settings,
    perencanaanList,
    observasiList,
    tindakLanjutList,
    portofolioList,
    sekolahBinaan,
    rekapData,
  } = useApp();

  const isSupervisor = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';

  // Target teacher to view/print
  const guruList = users.filter((u) => u.role === 'guru');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    currentUser?.role === 'guru' ? currentUser.id : guruList[0]?.id || ''
  );

  const selectedGuru = users.find((u) => u.id === selectedGuruId) || currentUser;

  // Selected teacher's data
  const targetPerencanaan = perencanaanList.filter((p) => p.guruId === selectedGuru?.id);
  const targetObservasi = observasiList.find((o) => o.guruId === selectedGuru?.id);
  const targetTindakLanjut = tindakLanjutList.filter((t) => t.guruId === selectedGuru?.id);
  const targetPortofolio = portofolioList.filter((p) => p.guruId === selectedGuru?.id);

  const handleDownloadPDF = () => {
    if (!selectedGuru) return;
    pdfGenerator.generateIndividualReport(
      selectedGuru,
      targetObservasi,
      targetPerencanaan,
      targetTindakLanjut,
      targetPortofolio,
      settings
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    excelGenerator.exportRekapSupervisiExcel(
      users,
      observasiList,
      perencanaanList,
      tindakLanjutList,
      portofolioList,
      sekolahBinaan,
      settings
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Action Controls (no-print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Modul 4: Pelaporan & Unduh Hasil Supervisi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dokumen resmi hasil supervisi akademik berstandar akreditasi dan Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Download Button */}
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh Laporan Supervisi (PDF)
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak / Pratinjau
            </button>

            {isSupervisor && (
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Ekspor Rekap Excel (.xlsx)
              </button>
            )}
          </div>
        </div>

        {/* Supervisor Teacher Picker */}
        {isSupervisor && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Pilih Guru untuk Pratinjau:</span>
            <select
              value={selectedGuruId}
              onChange={(e) => setSelectedGuruId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {guruList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama} — {g.mapel} ({g.sekolah})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ================= FORMAL DOCUMENT SHEET / PRATINJAU ================= */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* KOP SURAT RESMI */}
        <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/src/assets/images/dipandu_logo_emblem_1790340317534.jpg"
              alt="Logo DiPandu"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 leading-tight">
                {settings.institutionName}
              </h2>
              <p className="text-xs text-slate-600">
                SISTEM INFORMASI DIGITAL PENDAMPINGAN & SUPERVISI GURU (DIPANDU)
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Tahun Ajaran: {settings.tahunAjaranAktif} · Semester: {settings.semesterAktif} · Kurikulum Merdeka
          </p>
        </div>

        {/* JUDUL LAPORAN */}
        <div className="text-center my-6">
          <h3 className="text-base font-bold uppercase text-slate-900 tracking-wide underline underline-offset-4">
            LAPORAN INDIVIDUAL HASIL SUPERVISI AKADEMIK GURU
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Nomor: 421.3/SUP-SMA/{new Date().getFullYear()}/042
          </p>
        </div>

        {/* 1. IDENTITAS GURU & SUPERVISOR */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-3 border-blue-600 pl-2">
            I. IDENTITAS GURU & SUPERVISOR
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">Nama Lengkap Guru</span>
              <span className="font-semibold text-slate-900">: {selectedGuru?.nama}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">Supervisor Pembina</span>
              <span className="font-semibold text-slate-900">
                : {targetObservasi?.supervisorNama || settings.pengawasPembina}
              </span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">NIP Guru</span>
              <span className="font-mono text-slate-800">: {selectedGuru?.nip || '-'}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">Mata Pelajaran</span>
              <span className="text-slate-800">: {selectedGuru?.mapel}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">Satuan Pendidikan</span>
              <span className="text-slate-800">: {selectedGuru?.sekolah || settings.institutionName}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-32">Tanggal Supervisi</span>
              <span className="font-mono text-slate-800">
                : {targetObservasi?.tanggalObservasi || 'Jadwal Reguler Semester 1'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. REKAPITULASI VERIFIKASI PERENCANAAN */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-3 border-blue-600 pl-2">
            II. HASIL VERIFIKASI DOKUMEN PERENCANAAN
          </h4>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2 px-3 w-10">No</th>
                <th className="py-2 px-3">Komponen Perencanaan</th>
                <th className="py-2 px-3 w-28">Status</th>
                <th className="py-2 px-3">Catatan Verifikator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {['Modul Ajar', 'ATP', 'KKTP', 'CP'].map((type, idx) => {
                const match = targetPerencanaan.find((p) => p.jenisDokumen === type);
                return (
                  <tr key={type}>
                    <td className="py-2 px-3 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      {match?.judul || `${type} (Kurikulum Merdeka)`}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          match?.status === 'Disetujui'
                            ? 'text-emerald-700'
                            : match?.status === 'Revisi'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {match?.status || 'Belum Diunggah'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 italic">
                      {match?.catatanPengawas || 'Menunggu unggahan dokumen oleh guru.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3. HASIL OBSERVASI KELAS & SKOR RUBRIK */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-3 border-blue-600 pl-2">
            III. PENILAIAN OBSERVASI KELAS (RUBRIK 1 - 4)
          </h4>
          {targetObservasi ? (
            <div className="space-y-3">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2 px-3 w-10">No</th>
                    <th className="py-2 px-3">Indikator Fokus Perilaku</th>
                    <th className="py-2 px-3 w-20 text-center">Skor (1-4)</th>
                    <th className="py-2 px-3 w-44">Kategori Kinerja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 font-mono">1</td>
                    <td className="py-2 px-3">Keteraturan Suasana Kelas & Disiplin Positif</td>
                    <td className="py-2 px-3 font-mono font-bold text-center">
                      {targetObservasi.skorRubrik.keteraturanSuasana}
                    </td>
                    <td className="py-2 px-3 text-slate-700">Membudaya Sangat Baik</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">2</td>
                    <td className="py-2 px-3">Ekspektasi Terhadap Seluruh Peserta Didik</td>
                    <td className="py-2 px-3 font-mono font-bold text-center">
                      {targetObservasi.skorRubrik.ekspektasiPesertaDidik}
                    </td>
                    <td className="py-2 px-3 text-slate-700">Terlihat Efektif</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">3</td>
                    <td className="py-2 px-3">Perhatian dan Kepedulian Guru</td>
                    <td className="py-2 px-3 font-mono font-bold text-center">
                      {targetObservasi.skorRubrik.perhatianKepedulian}
                    </td>
                    <td className="py-2 px-3 text-slate-700">Membudaya Sangat Baik</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">4</td>
                    <td className="py-2 px-3">Instruksi Pembelajaran Adaptif & Diferensiasi</td>
                    <td className="py-2 px-3 font-mono font-bold text-center">
                      {targetObservasi.skorRubrik.instruksiAdaptif}
                    </td>
                    <td className="py-2 px-3 text-slate-700">Terlihat Efektif</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="py-2.5 px-3 uppercase text-slate-900">
                      Rata-Rata Skor Observasi
                    </td>
                    <td className="py-2.5 px-3 font-mono text-center text-blue-700 text-sm">
                      {targetObservasi.skorRubrik.rataRata.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-blue-800">PREDIKAT BAIK</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <strong className="text-slate-900 block mb-1">Catatan Kualitatif Observer:</strong>
                <p className="text-slate-700 italic">"{targetObservasi.catatanKualitatif}"</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
              Data observasi belum direkam.
            </p>
          )}
        </div>

        {/* 4. REFLEKSI GURU & REKOMENDASI TINDAK LANJUT */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-3 border-blue-600 pl-2">
            IV. REFLEKSI MANDIRI & REKOMENDASI TINDAK LANJUT (RTL)
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Refleksi Mandiri Guru:</strong>
              <p className="text-slate-700 leading-relaxed">
                {targetObservasi?.refleksiGuru ||
                  'Guru telah menyelesaikan siklus refleksi dan berkomitmen melakukan perbaikan berkelanjutan.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Rencana Tindak Lanjut Terjadwal:</strong>
              {targetTindakLanjut.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {targetTindakLanjut.map((tl) => (
                    <li key={tl.id}>
                      <strong>[{tl.bentukKegiatan}]</strong> {tl.rekomendasi} (Target: {tl.targetSelesai} · Status: {tl.status})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">Pemanfaatan modul mandiri Platform Merdeka Mengajar (PMM) dan MGMP.</p>
              )}
            </div>
          </div>
        </div>

        {/* 5. REKAPITULASI PORTOFOLIO */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-3 border-blue-600 pl-2">
            V. DOKUMEN PORTOFOLIO TERKUMPUL
          </h4>
          {targetPortofolio.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {targetPortofolio.map((port) => (
                <li
                  key={port.id}
                  className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between items-center"
                >
                  <span className="font-medium text-slate-800 truncate pr-2">
                    • [{port.kategori}] {port.judul}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {port.tanggalUnggah}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">Belum ada portofolio yang dilampirkan.</p>
          )}
        </div>

        {/* KOLOM TANDA TANGAN (3 KOLOM) */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs text-slate-800">
          <div>
            <p className="text-slate-500">Guru yang Disupervisi,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-signature text-slate-400 italic text-sm">(Tertanda Digital)</span>
            </div>
            <p className="font-bold underline text-slate-900">{selectedGuru?.nama}</p>
            <p className="text-[11px] font-mono text-slate-500">NIP. {selectedGuru?.nip || '-'}</p>
          </div>

          <div>
            <p className="text-slate-500">Mengetahui,<br />Kepala Sekolah,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-signature text-slate-400 italic text-sm">(Tertanda Digital)</span>
            </div>
            <p className="font-bold underline text-slate-900">Dr. Hj. Siti Nurhasanah, M.Pd</p>
            <p className="text-[11px] font-mono text-slate-500">NIP. 19740815 199802 2 002</p>
          </div>

          <div>
            <p className="text-slate-500">Pengawas Pembina SMA,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="font-signature text-slate-400 italic text-sm">(Tertanda Digital)</span>
            </div>
            <p className="font-bold underline text-slate-900">
              {targetObservasi?.supervisorNama || settings.pengawasPembina}
            </p>
            <p className="text-[11px] font-mono text-slate-500">NIP. 19680512 199303 1 004</p>
          </div>
        </div>

        {/* MANDATORY FOOTER DI SETIAP HALAMAN / DOKUMEN */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
          {settings.copyright || '@copyright by. Pak GuruAI'}
        </div>
      </div>
    </div>
  );
};
