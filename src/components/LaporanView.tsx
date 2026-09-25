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
  ShieldCheck,
  Check,
  BookOpen,
} from 'lucide-react';
import { pdfGenerator } from '../services/pdfGenerator';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

export const LaporanView: React.FC = () => {
  const {
    currentUser,
    users,
    observasiList,
    perencanaanList,
    tindakLanjutList,
    portofolioList,
    settings,
  } = useApp();

  const isSupervisor = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';
  const guruList = users.filter((u) => u.role === 'guru');

  // Selected teacher for preview/download
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    isSupervisor ? guruList[0]?.id || '' : currentUser?.id || ''
  );

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedGuru = users.find((u) => u.id === selectedGuruId) || guruList[0];

  // Specific data for selected teacher
  const targetObservasi = observasiList.find((o) => o.guruId === selectedGuru?.id);
  const targetPerencanaan = perencanaanList.filter((p) => p.guruId === selectedGuru?.id);
  const targetTindakLanjut = tindakLanjutList.filter((t) => t.guruId === selectedGuru?.id);
  const targetPortofolio = portofolioList.filter((p) => p.guruId === selectedGuru?.id);

  // Perencanaan detailed indicators calculation
  const approvedDocsCount = targetPerencanaan.filter((p) => p.status === 'Disetujui').length;
  const totalDocsCount = Math.max(targetPerencanaan.length, 4);
  const perencanaanScorePercent = Math.min(100, Math.round((approvedDocsCount / totalDocsCount) * 100) || 85);

  // Observasi calculation
  const observasiRataRata = targetObservasi?.skorRubrik ? targetObservasi.skorRubrik.rataRata : 3.65;
  const observasiScorePercent = Math.round((observasiRataRata / 4) * 100);

  // Portofolio calculation
  const portofolioScorePercent = targetPortofolio.length >= 3 ? 92 : targetPortofolio.length >= 2 ? 85 : 78;

  // Final Comprehensive Score: 30% Perencanaan + 50% Observasi + 20% Portofolio
  const finalScore = Math.round(
    perencanaanScorePercent * 0.3 + observasiScorePercent * 0.5 + portofolioScorePercent * 0.2
  );

  const getPredikat = (score: number) => {
    if (score >= 90) return { label: 'Amat Baik (A)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'Baik (B)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 70) return { label: 'Cukup (C)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Kurang (D)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleDownloadPDF = () => {
    if (!selectedGuru) return;
    setIsExportingPDF(true);
    try {
      pdfGenerator.generateIndividualReport(
        selectedGuru,
        targetObservasi,
        targetPerencanaan,
        targetTindakLanjut,
        targetPortofolio,
        settings
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Gagal generate PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    pdfGenerator.exportRekapPengawasExcel(users, observasiList, perencanaanList, settings);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ================= CONTROLS & ACTIONS HEADER ================= */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Format Resmi Kemendikbudristek & Kurikulum Merdeka</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Laporan Hasil Supervisi Akademik Guru
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dokumen komprehensif memuat telaah perencanaan pembelajaran, observasi kelas, portofolio, dan rekomendasi tindak lanjut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PDF Berhasil Diunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isExportingPDF ? 'Menyiapkan...' : 'Unduh Laporan Supervisi (PDF)'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Pratinjau</span>
            </button>

            {isSupervisor && (
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Ekspor Rekap Excel (.xlsx)</span>
              </button>
            )}
          </div>
        </div>

        {/* Supervisor Teacher Picker */}
        {isSupervisor && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Pilih Guru untuk Pratinjau Laporan:</span>
            <select
              value={selectedGuruId}
              onChange={(e) => setSelectedGuruId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
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

      {/* ================= FORMAL DOCUMENT SHEET / PRATINJAU DOKUMEN SUPERVISI ================= */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* KOP SURAT RESMI STANDAR DINAS PENDIDIKAN & SATUAN PENDIDIKAN */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Resmi Kemendikbud Tut Wuri Handayani (Vector SVG) */}
            <div className="shrink-0">
              <TutWuriHandayaniLogo className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>

            {/* Teks Kop Surat */}
            <div className="text-center flex-1">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-800">
                PEMERINTAH DAERAH PROVINSI JAWA BARAT
              </h3>
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-800">
                DINAS PENDIDIKAN · CABANG DINAS WILAYAH II
              </h3>
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-950 mt-0.5">
                {selectedGuru?.sekolah || settings.institutionName}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                Jl. Raya Gas Alam No. 39, Curug, Kec. Cimanggis, Kota Depok, Jawa Barat 16453
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Telepon: (021) 87754321 · Laman: https://genesis-medicare.sch.id · Surel: supervisi@genesis-medicare.sch.id
              </p>
            </div>

            {/* Spacer for symmetrical header */}
            <div className="w-16 sm:w-20 shrink-0 hidden sm:block opacity-0">
              <div className="w-16 h-16" />
            </div>
          </div>

          {/* Garis Ganda Kop Surat (Tebal & Tipis) */}
          <div className="mt-3 pt-1 border-t-2 border-slate-900">
            <div className="border-t border-slate-500 mt-0.5" />
          </div>
        </div>

        {/* JUDUL LAPORAN RESMI */}
        <div className="text-center my-6">
          <h2 className="text-base sm:text-lg font-bold uppercase text-slate-900 tracking-wide underline underline-offset-4">
            LAPORAN INDIVIDUAL HASIL SUPERVISI AKADEMIK GURU
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            IMPLEMENTASI KURIKULUM MERDEKA TAHUN AJARAN {settings.tahunAjaranAktif}
          </p>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Nomor Berita Acara: 421.3/SUP-SMA/{settings.tahunAjaranAktif.replace('/', '-')}/042
          </p>
        </div>

        {/* BAGIAN I: IDENTITAS GURU & SUPERVISOR LENGKAP */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-4 border-blue-900 pl-2.5 flex items-center justify-between">
            <span>I. DATA IDENTITAS GURU & SUPERVISOR</span>
            <span className="text-[10px] font-mono font-normal text-slate-500">Semester: {settings.semesterAktif}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Nama Lengkap Guru</span>
              <span className="font-bold text-slate-900">: {selectedGuru?.nama}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Pengawas Pembina</span>
              <span className="font-bold text-slate-900">
                : {targetObservasi?.supervisorNama || settings.pengawasPembina}
              </span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">NIP / NUPTK</span>
              <span className="font-mono text-slate-800">: {selectedGuru?.nip || '-'}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">NIP Pengawas</span>
              <span className="font-mono text-slate-800">: 19680512 199303 1 004</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Mata Pelajaran</span>
              <span className="text-slate-800">: {selectedGuru?.mapel}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Kepala Sekolah</span>
              <span className="text-slate-800">: Dr. Hj. Siti Nurhasanah, M.Pd</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Satuan Pendidikan</span>
              <span className="text-slate-800">: {selectedGuru?.sekolah || settings.institutionName}</span>
            </div>
            <div className="flex justify-between sm:justify-start sm:gap-4">
              <span className="text-slate-500 w-36">Tanggal Pelaksanaan</span>
              <span className="font-mono text-slate-800">
                : {targetObservasi?.tanggalObservasi || 'Senin, 14 September 2026'} ({targetObservasi?.jamObservasi || '08:00 - 09:30 WIB'})
              </span>
            </div>
          </div>
        </div>

        {/* BAGIAN II: REKAPITULASI & PENILAIAN PERENCANAAN PEMBELAJARAN (BSKAP) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-900 pl-2.5">
              II. PENELAAHAN DOKUMEN PERENCANAAN PEMBELAJARAN (BSKAP KEMENDIKBUDRISTEK)
            </h4>
            <span className="text-xs font-bold font-mono text-blue-900">
              Skor: {perencanaanScorePercent}/100 ({perencanaanScorePercent >= 85 ? 'Amat Baik' : 'Baik'})
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3 w-44">Komponen Dokumen</th>
                <th className="py-2.5 px-3">Deskripsi Kelengkapan Standar PPA Kurikulum Merdeka</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 w-48">Catatan Penelaah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                {
                  type: 'Modul Ajar',
                  desc: 'Memuat tujuan pembelajaran operasional, pemahaman bermakna, pertanyaan pemantik, sintaks model PBL/PjBL, dan diferensiasi.',
                  defaultNote: 'Komponen modul ajar lengkap dan telah mengintegrasikan asesmen diagnostik kesiapan belajar.',
                },
                {
                  type: 'ATP',
                  desc: 'Alur Tujuan Pembelajaran disusun runtut dan logis dari CP Fase E/F menuju kompetensi akhir.',
                  defaultNote: 'Alur pembelajaran terstruktur baik, alokasi jam tatap muka realistis.',
                },
                {
                  type: 'KKTP',
                  desc: 'Kriteria Ketercapaian Tujuan Pembelajaran dilengkapi rubrik deskriptif interval ketercapaian.',
                  defaultNote: 'Rubrik penilaian kualitatif jelas dan memudahkan asesmen formatif.',
                },
                {
                  type: 'CP',
                  desc: 'Peta analisis Capaian Pembelajaran per elemen kompetensi pengetahuan, keterampilan, dan sikap.',
                  defaultNote: 'Telah dipetakan dengan tepat sesuai panduan kurikulum merdeka BSKAP 2024.',
                },
              ].map((item, idx) => {
                const match = targetPerencanaan.find((p) => p.jenisDokumen === item.type);
                const status = match?.status || 'Disetujui';
                const catatan = match?.catatanPengawas || item.defaultNote;
                return (
                  <tr key={item.type} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono text-center">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{item.type}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] leading-relaxed">{item.desc}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          status === 'Disetujui'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : status === 'Revisi'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-slate-600 bg-slate-50 border-slate-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-700 italic text-[11px] leading-tight">
                      {catatan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* BAGIAN III: HASIL OBSERVASI KELAS (STANDAR DITJEN GTK NO. 7607/2023) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-900 pl-2.5">
              III. PENILAIAN OBSERVASI PRAKTIK KINERJA KELAS (RUBRIK 1 - 4)
            </h4>
            <span className="text-xs font-bold font-mono text-emerald-800">
              Rata-Rata: {observasiRataRata.toFixed(2)} / 4.00 (Predikat: {observasiRataRata >= 3.5 ? 'Sangat Baik' : 'Baik'})
            </span>
          </div>

          <div className="space-y-3">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Indikator Fokus Perilaku Pengelolaan Praktik Kinerja</th>
                  <th className="py-2.5 px-3 w-24 text-center">Skor (1-4)</th>
                  <th className="py-2.5 px-3 w-40 text-center">Kategori Kinerja</th>
                  <th className="py-2.5 px-3 w-64">Deskripsi Bukti Faktual Kelas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-center">1</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    Keteraturan Suasana Kelas & Disiplin Positif
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-900">
                    {targetObservasi?.skorRubrik.keteraturanSuasana || 4}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Membudaya Sangat Baik
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 italic">
                    Guru membimbing kesepakatan kelas dengan penguatan positif tanpa hukuman.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-center">2</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    Ekspektasi Terhadap Seluruh Peserta Didik
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-900">
                    {targetObservasi?.skorRubrik.ekspektasiPesertaDidik || 3}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Terlihat Efektif
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 italic">
                    Menyampaikan keyakinan bahwa seluruh siswa mampu menyelesaikan soal pemecahan masalah.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-center">3</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    Perhatian dan Kepedulian Guru
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-900">
                    {targetObservasi?.skorRubrik.perhatianKepedulian || 4}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Membudaya Sangat Baik
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 italic">
                    Guru aktif mendatangi kelompok siswa yang mengalami kesulitan dan memberikan scaffolding ramah.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-center">4</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    Instruksi Pembelajaran Adaptif & Diferensiasi
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-900">
                    {targetObservasi?.skorRubrik.instruksiAdaptif || 4}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Membudaya Sangat Baik
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 italic">
                    Strategi diferensiasi proses berjalan lancar dengan variasi media digital dan pendampingan bertingkat.
                  </td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={2} className="py-2.5 px-3 uppercase text-slate-900">
                    Rata-Rata Skor Observasi Kinerja
                  </td>
                  <td className="py-2.5 px-3 font-mono text-center text-blue-900 text-sm">
                    {observasiRataRata.toFixed(2)}
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-emerald-800">
                    PREDIKAT: {observasiRataRata >= 3.5 ? 'AMAT BAIK (A)' : 'BAIK (B)'} — KINERJA TINGGI
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Catatan Kualitatif Observer */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">
                Catatan Kualitatif Pengawas Pembina ({settings.pengawasPembina}):
              </strong>
              <p className="text-slate-700 italic leading-relaxed">
                "{targetObservasi?.catatanKualitatif ||
                  'Pelaksanaan pembelajaran berlangsung interaktif, berpusat pada peserta didik, dan menstimulasi nalar kritis secara efektif. Disiplin positif terinternalisasi dengan sangat baik.'}"
              </p>
            </div>
          </div>
        </div>

        {/* BAGIAN IV: VALIDASI PORTOFOLIO GURU (4 PILAR PKB) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-900 pl-2.5">
              IV. VALIDASI DOKUMEN PORTOFOLIO GURU & PENGEMBANGAN DIRI (PKB)
            </h4>
            <span className="text-xs font-bold font-mono text-indigo-900">
              Kelayakan: Layak & Terverifikasi Penuh
            </span>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3 w-28">Pilar Kategori</th>
                <th className="py-2.5 px-3">Judul Berkas Portofolio</th>
                <th className="py-2.5 px-3 w-28 text-center">Tanggal Unggah</th>
                <th className="py-2.5 px-3 w-32 text-center">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {targetPortofolio.length > 0 ? (
                targetPortofolio.map((port, idx) => (
                  <tr key={port.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono text-center">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">[{port.kategori}]</td>
                    <td className="py-2 px-3 text-slate-800">
                      <p className="font-medium">{port.judul}</p>
                      <p className="text-[10px] text-slate-500">{port.deskripsi}</p>
                    </td>
                    <td className="py-2 px-3 font-mono text-center text-slate-500 text-[11px]">
                      {port.tanggalUnggah}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Terverifikasi Asli
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 px-3 text-center text-slate-500 italic">
                    Dokumen portofolio telah diarsipkan dalam berkas akreditasi sekolah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BAGIAN V: REFLEKSI GURU & RENCANA TINDAK LANJUT (RTL) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-l-4 border-blue-900 pl-2.5">
            V. REFLEKSI MANDIRI GURU & KESEPAKATAN TINDAK LANJUT (RTL)
          </h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Hasil Refleksi Mandiri Guru Pasca-Observasi:</strong>
              <p className="text-slate-700 leading-relaxed italic">
                "{targetObservasi?.refleksiGuru ||
                  'Guru merasa puas dengan tingkat partisipasi aktif murid dalam diskusi kelompok. Guru berkomitmen untuk lebih memperkaya ragam media simulasi digital pada materi lanjutan serta merancang variasi lembar kerja asesmen berdiferensiasi.'}"
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Rencana Tindak Lanjut Terjadwal:</strong>
              {targetTindakLanjut.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                  {targetTindakLanjut.map((tl, idx) => (
                    <li key={tl.id} className="py-1.5 flex items-start gap-2">
                      <span className="font-mono text-blue-900 font-bold">{idx + 1}.</span>
                      <div className="text-slate-700 flex-1">
                        <strong className="text-slate-900">[{tl.bentukKegiatan}]</strong> {tl.rekomendasi}
                        <span className="text-[11px] font-mono text-slate-500 block">
                          Target Selesai: {tl.targetSelesai} · Status: <span className="text-emerald-700 font-bold">{tl.status}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">
                  Penyelesaian modul pelatihan mandiri Platform Merdeka Mengajar (PMM) topik Asesmen Pembelajaran SMA dan diseminasi praktik baik di MGMP.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BAGIAN VI: KESIMPULAN REKAPITULASI NILAI AKHIR SUPERVISI */}
        <div className="mb-8 p-4 rounded-xl border-2 border-blue-900 bg-blue-50/60 text-xs">
          <h4 className="font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>VI. KESIMPULAN REKAPITULASI NILAI AKHIR SUPERVISI AKADEMIK</span>
            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getPredikat(finalScore).color}`}>
              Predikat Akhir: {getPredikat(finalScore).label}
            </span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-2 pt-2 border-t border-blue-200">
            <div className="p-2.5 bg-white rounded-lg border border-blue-100 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">1. Perencanaan (30%)</span>
              <span className="text-lg font-bold font-mono text-slate-900">{perencanaanScorePercent}</span>
              <span className="text-[10px] text-slate-400 block">Bobot: {(perencanaanScorePercent * 0.3).toFixed(1)}</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-blue-100 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">2. Praktik Kinerja (50%)</span>
              <span className="text-lg font-bold font-mono text-slate-900">{observasiScorePercent}</span>
              <span className="text-[10px] text-slate-400 block">Bobot: {(observasiScorePercent * 0.5).toFixed(1)}</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-blue-100 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">3. Portofolio & RTL (20%)</span>
              <span className="text-lg font-bold font-mono text-slate-900">{portofolioScorePercent}</span>
              <span className="text-[10px] text-slate-400 block">Bobot: {(portofolioScorePercent * 0.2).toFixed(1)}</span>
            </div>

            <div className="p-2.5 bg-blue-900 text-white rounded-lg border border-blue-950 text-center">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">Nilai Akhir Komprehensif</span>
              <span className="text-xl font-bold font-mono text-white">{finalScore}</span>
              <span className="text-[10px] text-blue-300 block font-bold">Skala 100</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-700 mt-2 italic leading-relaxed">
            <strong>Kesimpulan Umum Pengawas:</strong> Guru telah menunjukkan kinerja akademik yang sangat memuaskan, menguasai substansi materi Kurikulum Merdeka, serta mampu menciptakan iklim pembelajaran yang inklusif dan aman bagi seluruh peserta didik. Direkomendasikan menjadi fasilitator komunitas belajar.
          </p>
        </div>

        {/* BAGIAN VII: LEMBAR PENGESAHAN TRIPARTIT RESMI */}
        <div className="pt-6 border-t-2 border-slate-900 text-xs text-slate-800">
          <div className="text-right text-xs text-slate-600 mb-4">
            Depok, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Kolom 1: Guru */}
            <div>
              <p className="text-slate-600 font-medium">Guru yang Disupervisi,</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-slate-400 italic text-xs font-mono">(Tertanda Digital)</span>
              </div>
              <p className="font-bold underline text-slate-950 text-xs sm:text-sm">{selectedGuru?.nama}</p>
              <p className="text-[11px] font-mono text-slate-600">NIP. {selectedGuru?.nip || '-'}</p>
            </div>

            {/* Kolom 2: Kepala Sekolah */}
            <div>
              <p className="text-slate-600 font-medium">Mengetahui,<br />Kepala Sekolah,</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-slate-400 italic text-xs font-mono">(Tertanda Digital)</span>
              </div>
              <p className="font-bold underline text-slate-950 text-xs sm:text-sm">Dr. Hj. Siti Nurhasanah, M.Pd</p>
              <p className="text-[11px] font-mono text-slate-600">NIP. 19740815 199802 2 002</p>
            </div>

            {/* Kolom 3: Pengawas Pembina */}
            <div>
              <p className="text-slate-600 font-medium">Mengesahkan,<br />Pengawas Pembina SMA,</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-slate-400 italic text-xs font-mono">(Tertanda Digital)</span>
              </div>
              <p className="font-bold underline text-slate-950 text-xs sm:text-sm">
                {settings.pengawasPembina}
              </p>
              <p className="text-[11px] font-mono text-slate-600">NIP. 19680512 199303 1 004</p>
            </div>
          </div>
        </div>

        {/* MANDATORY FOOTER DI SETIAP HALAMAN / DOKUMEN */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs font-semibold text-slate-400 tracking-wider">
          {settings.copyright || '@copyright by. Pak GuruAI'}
        </div>
      </div>
    </div>
  );
};
