import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingUp,
  School,
  Calendar,
  Download,
  BookOpen,
  ArrowRight,
  Eye,
  Award,
  FileSpreadsheet,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { pdfGenerator } from '../services/pdfGenerator';
import { excelGenerator } from '../services/excelGenerator';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    settings,
    rekapData,
    perencanaanList,
    observasiList,
    tindakLanjutList,
    portofolioList,
    users,
    sekolahBinaan,
    setActiveTab,
  } = useApp();

  const isPengawas = currentUser?.role === 'pengawas';
  const isKepsek = currentUser?.role === 'kepala_sekolah';
  const isGuru = currentUser?.role === 'guru';

  // Filter for specific teacher if logged in as guru
  const myPerencanaan = perencanaanList.filter((p) => p.guruId === currentUser?.id);
  const myObservasi = observasiList.find((o) => o.guruId === currentUser?.id);
  const myTindakLanjut = tindakLanjutList.filter((t) => t.guruId === currentUser?.id);
  const myPortofolio = portofolioList.filter((p) => p.guruId === currentUser?.id);

  // Status counters for guru
  const myApprovedDocs = myPerencanaan.filter((p) => p.status === 'Disetujui').length;
  const myRevisionDocs = myPerencanaan.filter((p) => p.status === 'Revisi').length;

  const handleDownloadMyReport = () => {
    if (!currentUser) return;
    pdfGenerator.generateIndividualReport(
      currentUser,
      myObservasi,
      myPerencanaan,
      myTindakLanjut,
      myPortofolio,
      settings
    );
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

  // Recharts Data 1: Tren Skor Observasi Guru per Bulan (Semester 1 & 2)
  const monthlyTrendData = [
    { bulan: 'Juli', rataRata: 3.15, suasana: 3.20, instruksi: 3.00, target: 3.50 },
    { bulan: 'Agustus', rataRata: 3.32, suasana: 3.45, instruksi: 3.15, target: 3.50 },
    { bulan: 'September', rataRata: 3.58, suasana: 3.80, instruksi: 3.35, target: 3.50 },
    { bulan: 'Oktober', rataRata: 3.65, suasana: 3.85, instruksi: 3.45, target: 3.50 },
    { bulan: 'November', rataRata: 3.74, suasana: 3.90, instruksi: 3.60, target: 3.50 },
    { bulan: 'Desember', rataRata: 3.85, suasana: 3.95, instruksi: 3.75, target: 3.50 },
  ];

  // Recharts Data 2: Distribusi Status Penyelesaian Supervisi Sekolah Binaan
  const schoolStatusData = sekolahBinaan.map((sek) => {
    const isTargetSekolah = sek.nama === settings.institutionName || sek.nama.includes('Mandiri');
    const total = sek.jumlahGuru;
    const selesai = isTargetSekolah ? 24 : Math.round(total * 0.65);
    const proses = isTargetSekolah ? 6 : Math.round(total * 0.25);
    const belum = Math.max(0, total - selesai - proses);

    return {
      name: sek.nama.replace('SMA ', '').replace('SMAN ', 'SMAN '),
      sekolahLengkap: sek.nama,
      Selesai: selesai,
      'Dalam Proses': proses,
      'Belum Dimulai': belum,
      total,
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 border border-slate-800 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
              <span>Tahun Ajaran {settings.tahunAjaranAktif}</span>
              <span aria-hidden="true">·</span>
              <span>Semester {settings.semesterAktif}</span>
              <span aria-hidden="true">·</span>
              <span className="text-white/80">{settings.institutionName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Selamat Datang, {currentUser?.nama}
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {isPengawas &&
                'Dasbor agregat supervisi akademik wilayah binaan SMA. Pantau tren peningkatan kompetensi guru per bulan, distribusi penyelesaian sekolah binaan, dan ekspor pelaporan resmi.'}
              {isKepsek &&
                `Dasbor supervisi internal satuan pendidikan ${settings.institutionName}. Lakukan penelaahan modul ajar, supervisi klinis, dan pantau rencana tindak lanjut.`}
              {isGuru &&
                'Kelola siklus pendampingan supervisi akademik Anda: unggah modul ajar, tinjau jadwal observasi, isi refleksi mandiri, dan unduh laporan resmi supervisi.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isGuru && (
              <button
                onClick={handleDownloadMyReport}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh Laporan Supervisi (PDF)
              </button>
            )}

            {(isPengawas || isKepsek) && (
              <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Ekspor Rekap Excel (.xlsx)
              </button>
            )}

            <button
              onClick={() => setActiveTab('generator')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4" />
              Generator Modul Merdeka
            </button>
          </div>
        </div>
      </div>

      {/* ================= GURU DASHBOARD VIEW ================= */}
      {isGuru && (
        <div className="space-y-8">
          {/* Supervision Cycle / Timeline 5 Tahap */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Alur & Siklus Supervisi Akademik Guru
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Progres tahapan supervisi berkala Anda pada tahun ajaran ini
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Kurikulum Merdeka
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Step 1: Perencanaan */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">TAHAP 1</span>
                  {myApprovedDocs >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-slate-900">Perencanaan Pembelajaran</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {myApprovedDocs} dari {myPerencanaan.length || 4} berkas disetujui.
                </p>
                <button
                  onClick={() => setActiveTab('perencanaan')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Kelola Modul <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 2: Pra-Observasi */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">TAHAP 2</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-xs font-semibold text-slate-900">Pra-Observasi Kelas</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Fokus perilaku & jadwal telah dikonfirmasi observer.
                </p>
                <button
                  onClick={() => setActiveTab('observasi')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Lihat Jadwal <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 3: Pelaksanaan Observasi */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">TAHAP 3</span>
                  {myObservasi && myObservasi.status !== 'Terjadwal' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-slate-900">Observasi Kelas</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {myObservasi ? `Skor Rubrik: ${myObservasi.skorRubrik.rataRata}/4.00` : 'Jadwal observasi aktif.'}
                </p>
                <button
                  onClick={() => setActiveTab('observasi')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Detail Rubrik <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 4: Pasca Observasi / Refleksi */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">TAHAP 4</span>
                  {myObservasi?.refleksiGuru ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-slate-900">Refleksi Mandiri & RTL</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {myObservasi?.refleksiGuru ? 'Refleksi selesai dikirim.' : 'Menunggu input refleksi.'}
                </p>
                <button
                  onClick={() => setActiveTab('observasi')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Isi Refleksi <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 5: Portofolio & Laporan */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400">TAHAP 5</span>
                  {myPortofolio.length > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h3 className="text-xs font-semibold text-slate-900">Portofolio & Laporan</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {myPortofolio.length} portofolio terunggah siap unduh.
                </p>
                <button
                  onClick={() => setActiveTab('laporan')}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Cetak Laporan <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Grid for Guru */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Modul Perencanaan */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Status Dokumen Perencanaan
                </h3>
                <FileCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Disetujui Pengawas/Kepsek</span>
                  <span className="font-semibold text-emerald-700 font-mono">{myApprovedDocs} Berkas</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Perlu Revisi</span>
                  <span className="font-semibold text-amber-600 font-mono">{myRevisionDocs} Berkas</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-slate-600">Total Terdaftar</span>
                  <span className="font-semibold text-slate-900 font-mono">{myPerencanaan.length} Berkas</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('perencanaan')}
                className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 transition"
              >
                Buka Modul Perencanaan
              </button>
            </div>

            {/* Pengingat Jadwal Observasi */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Jadwal & Hasil Observasi
                </h3>
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              {myObservasi ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-semibold">Tanggal:</strong> {myObservasi.tanggalObservasi} ({myObservasi.jamObservasi})
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-semibold">Observer:</strong> {myObservasi.supervisorNama}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-semibold">Kelas:</strong> {myObservasi.kelas}
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
                    <span className="text-slate-600">Skor Rubrik Rata-rata: </span>
                    <span className="font-bold text-blue-700 font-mono text-sm">
                      {myObservasi.skorRubrik.rataRata} / 4.00
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-4">
                  Belum ada jadwal observasi yang ditetapkan. Hubungi Kepala Sekolah / Pengawas.
                </p>
              )}
            </div>

            {/* Aksi Cepat Unduh Laporan */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Laporan Individual Resmi
                  </h3>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Unduh lembar hasil supervisi terintegrasi memuat verifikasi berkas, penilaian rubrik 1-4, refleksi mandiri, RTL, dan kompilasi portofolio.
                </p>
              </div>
              <button
                onClick={handleDownloadMyReport}
                className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh Laporan Supervisi (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PENGAWAS & KEPSEK DASHBOARD VIEW ================= */}
      {(isPengawas || isKepsek) && (
        <div className="space-y-8">
          {/* Key Aggregate Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Tingkat Keterlaksanaan</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {rekapData?.observasi.persentaseKeterlaksanaan || 75}%
                </span>
                <span className="text-xs text-emerald-600 font-medium">Target 100%</span>
              </div>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${rekapData?.observasi.persentaseKeterlaksanaan || 75}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Dokumen Perencanaan</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {rekapData?.perencanaan.disetujui || 4} / {rekapData?.perencanaan.total || 4}
                </span>
                <span className="text-xs text-slate-500">
                  {rekapData?.perencanaan.persentaseDisetujui || 100}% Disetujui
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                {rekapData?.perencanaan.revisi || 0} berkas memerlukan revisi
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Rata-rata Skor Observasi</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {rekapData?.observasi.aspekRataRata.skorGlobal || '3.56'}
                </span>
                <span className="text-xs font-semibold text-emerald-600">Predikat Sangat Baik</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Skala rubrik 1.00 - 4.00</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Guru Terdata & Binaan</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {users.filter((u) => u.role === 'guru').length} Guru
                </span>
                <span className="text-xs text-slate-500">{sekolahBinaan.length} Sekolah</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Kurikulum Merdeka 2026/2027</p>
            </div>
          </div>

          {/* ================= RECHARTS VISUALIZATION SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Tren Skor Observasi Guru per Bulan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Tren Skor Observasi Guru per Bulan
                    </h3>
                  </div>
                  <span className="text-xs font-semibold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    +0.70 Poin
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Perkembangan mutu pembelajaran guru selama semester berjalan dibandingkan target minimal (3.50).
                </p>
              </div>

              <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSkor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="bulan"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[2.5, 4.0]}
                      ticks={[2.5, 3.0, 3.5, 4.0]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                        color: '#f8fafc',
                      }}
                      formatter={(value: any, name: any) => [
                        `${Number(value).toFixed(2)} / 4.00`,
                        name === 'rataRata'
                          ? 'Skor Rata-Rata Observasi'
                          : name === 'suasana'
                          ? 'Keteraturan Suasana'
                          : name === 'instruksi'
                          ? 'Instruksi Adaptif'
                          : 'Target Kinerja Minimal',
                      ]}
                    />
                    <ReferenceLine
                      y={3.50}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Target Baik (3.50)',
                        fill: '#10b981',
                        fontSize: 10,
                        position: 'insideTopRight',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rataRata"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorSkor)"
                      name="rataRata"
                    />
                    <Area
                      type="monotone"
                      dataKey="suasana"
                      stroke="#059669"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      fill="none"
                      name="suasana"
                    />
                    <Area
                      type="monotone"
                      dataKey="instruksi"
                      stroke="#d97706"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      fill="none"
                      name="instruksi"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" /> Skor Rata-Rata
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" /> Keteraturan Suasana
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-amber-600 rounded-full inline-block" /> Instruksi Adaptif
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">Skala 1 - 4</span>
              </div>
            </div>

            {/* Chart 2: Distribusi Status Penyelesaian Supervisi Sekolah Binaan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Distribusi Penyelesaian Supervisi Sekolah Binaan
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {sekolahBinaan.length} Sekolah Binaan
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Status keterlaksanaan siklus supervisi (Selesai, Dalam Proses, dan Belum Dimulai) per satuan pendidikan.
                </p>
              </div>

              <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schoolStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                        color: '#f8fafc',
                      }}
                      formatter={(val: any, name: any) => [`${val} Guru`, name]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      iconType="circle"
                    />
                    <Bar dataKey="Selesai" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Dalam Proses" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Belum Dimulai" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Rasio penyelesaian tertinggi: {settings.institutionName} (75%)</span>
                <button
                  onClick={handleExportExcel}
                  className="font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Unduh XLSX
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Observation Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Guru & Rekapitulasi Supervisi Wilayah Binaan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemantauan komprehensif siklus supervisi tahun ajaran berjalan ({settings.institutionName})
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  Ekspor Excel (.xlsx)
                </button>
                <button
                  onClick={() => setActiveTab('observasi')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  + Jadwalkan Observasi
                </button>
                <button
                  onClick={() => setActiveTab('laporan')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Rekapitulasi Global
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Nama Guru</th>
                    <th className="py-2.5 px-3 font-semibold">Asal Sekolah Binaan</th>
                    <th className="py-2.5 px-3 font-semibold">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 font-semibold">Dokumen Perencanaan</th>
                    <th className="py-2.5 px-3 font-semibold">Jadwal / Skor Observasi</th>
                    <th className="py-2.5 px-3 font-semibold">Status RTL</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter((u) => u.role === 'guru')
                    .map((guru) => {
                      const obs = observasiList.find((o) => o.guruId === guru.id);
                      const docs = perencanaanList.filter((p) => p.guruId === guru.id);
                      const isCompleteDocs = docs.length > 0 && docs.every((d) => d.status === 'Disetujui');
                      const tl = tindakLanjutList.find((t) => t.guruId === guru.id);

                      return (
                        <tr key={guru.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-900 block">{guru.nama}</span>
                            <span className="text-[11px] text-slate-500 font-mono">NIP: {guru.nip}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-900 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200/60">
                              <School className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span className="truncate max-w-[150px]">{guru.sekolah || settings.institutionName}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{guru.mapel}</td>
                          <td className="py-3 px-3">
                            {isCompleteDocs ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Lengkap ({docs.length})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                                <Clock className="w-3.5 h-3.5" /> {docs.length} Berkas (Revisi/Draft)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {obs ? (
                              <div>
                                <span className="font-semibold text-slate-900 font-mono">
                                  {obs.skorRubrik.rataRata > 0 ? `${obs.skorRubrik.rataRata} / 4.00` : 'Terjadwal'}
                                </span>
                                <span className="text-[11px] text-slate-500 block">
                                  {obs.tanggalObservasi}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">Belum dijadwalkan</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {tl ? (
                              <span className="text-xs text-slate-700">
                                [{tl.bentukKegiatan}] {tl.status}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                pdfGenerator.generateIndividualReport(
                                  guru,
                                  obs,
                                  docs,
                                  tindakLanjutList.filter((t) => t.guruId === guru.id),
                                  portofolioList.filter((p) => p.guruId === guru.id),
                                  settings
                                );
                              }}
                              title="Unduh Laporan PDF Guru Ini"
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                            >
                              Unduh PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
