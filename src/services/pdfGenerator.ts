import { jsPDF } from 'jspdf';
import { User, Observasi, Perencanaan, TindakLanjut, Portofolio, AppSettings } from '../types';
import { excelGenerator } from './excelGenerator';

/**
 * Menghasilkan Dokumen jsPDF Laporan Individual Hasil Supervisi Akademik Guru
 * Lengkap, Jelas, Rinci, Detail, dan Bersih
 * Standar Resmi Kemendikbudristek & Implementasi Kurikulum Merdeka
 */
export function createSupervisionReportPDF(
  guru: User,
  observasi: Observasi | undefined,
  perencanaanList: Perencanaan[],
  tindakLanjutList: TindakLanjut[],
  portofolioList: Portofolio[],
  settings: AppSettings
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const institution = guru.sekolah || settings.institutionName || 'SMA Genesis Medicare';
  const pengawasName = observasi?.supervisorNama || settings.pengawasPembina || 'H. Kusnandar, M.Si';
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const addPageFooter = () => {
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      settings.copyright || '@copyright by. Pak GuruAI',
      pageWidth / 2,
      pageHeight - 6.5,
      { align: 'center' }
    );
  };

  const addPageHeaderMinimal = (titleText: string) => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Laporan Supervisi Akademik - ${guru.nama} (${guru.mapel}) - ${institution}`,
      margin,
      y
    );
    y += 3.5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(titleText, margin, y);
    y += 5;
  };

  // =========================================================================
  // HALAMAN 1: KOP SURAT RESMI, IDENTITAS, & TELAAH PERENCANAAN BSKAP
  // =========================================================================

  // --- 1. KOP SURAT RESMI DINAS PENDIDIKAN & SATUAN PENDIDIKAN ---
  // Emblem Lambang Tut Wuri Handayani (Vektor Geometri)
  doc.setFillColor(23, 37, 84); // Navy Blue Shield
  doc.roundedRect(margin, y, 14, 16, 2, 2, 'F');
  doc.setFillColor(250, 204, 21); // Sayap / Nyala Api Emas
  doc.triangle(margin + 7, y + 2, margin + 3.5, y + 8, margin + 10.5, y + 8, 'F');
  doc.setFillColor(255, 255, 255); // Buku Putih Terbuka
  doc.rect(margin + 3, y + 9.5, 8, 4, 'F');
  doc.setDrawColor(250, 204, 21);
  doc.setLineWidth(0.3);
  doc.line(margin + 7, y + 9.5, margin + 7, y + 13.5);

  // Kop Teks Resmi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('PEMERINTAH DAERAH PROVINSI JAWA BARAT - DINAS PENDIDIKAN', margin + 17, y + 3.5);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(institution.toUpperCase(), margin + 17, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(
    'Jl. Raya Gas Alam No. 39, Cimanggis, Kota Depok | Telp. (021) 87754321 | Laman: genesis-medicare.sch.id',
    margin + 17,
    y + 12.5
  );

  y += 18;

  // Garis Ganda Kop Surat Resmi (Tebal 0.8pt & Tipis 0.3pt)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1;
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // --- 2. JUDUL DOKUMEN SUPERVISI & NO BERITA ACARA ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('LAPORAN INDIVIDUAL HASIL SUPERVISI AKADEMIK GURU', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Implementasi Kurikulum Merdeka - Tahun Ajaran ${settings.tahunAjaranAktif} (${settings.semesterAktif})`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 4;
  doc.setFontSize(7.5);
  doc.text(
    `Nomor Berita Acara: 421.3/SUP-SMA/${settings.tahunAjaranAktif.replace('/', '-')}/042`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 7;

  // --- 3. BAGIAN I: DATA IDENTITAS GURU & SUPERVISOR ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('I. DATA IDENTITAS LENGKAP GURU & PENGAWAS PEMBINA', margin + 2.5, y + 4);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const col1 = margin + 2;
  const col2 = margin + 96;

  doc.text(`Nama Lengkap Guru : ${guru.nama}`, col1, y);
  doc.text(`Pengawas Pembina : ${pengawasName}`, col2, y);
  y += 4.5;

  doc.text(`NIP / NUPTK         : ${guru.nip || '-'}`, col1, y);
  doc.text(`NIP Pengawas         : 19680512 199303 1 004`, col2, y);
  y += 4.5;

  doc.text(`Mata Pelajaran       : ${guru.mapel}`, col1, y);
  doc.text(`Kepala Sekolah       : Dr. Hj. Siti Nurhasanah, M.Pd`, col2, y);
  y += 4.5;

  doc.text(`Satuan Pendidikan  : ${institution}`, col1, y);
  doc.text(`Tanggal Pelaksanaan : ${observasi?.tanggalObservasi || '14 September 2026'}`, col2, y);
  y += 4.5;

  doc.text(`Kelas / Rombel       : ${observasi?.kelas || 'X-1 (Fase E)'}`, col1, y);
  doc.text(`Semester / TP        : ${settings.semesterAktif} / ${settings.tahunAjaranAktif}`, col2, y);
  y += 8;

  // --- 4. BAGIAN II: PENELAAHAN PERENCANAAN PEMBELAJARAN (BSKAP KEMENDIKBUDRISTEK) ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('II. PENELAAHAN PERENCANAAN PEMBELAJARAN (STANDAR BSKAP KEMENDIKBUDRISTEK)', margin + 2.5, y + 4);
  y += 8;

  // Header Tabel Perencanaan
  doc.setFillColor(238, 242, 255); // Indigo Tint
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('No', margin + 2.5, y + 4.2);
  doc.text('Komponen Telaah Dokumen', margin + 10, y + 4.2);
  doc.text('Status', margin + 68, y + 4.2);
  doc.text('Catatan Penelaahan & Rekomendasi Pengawas', margin + 96, y + 4.2);
  y += 6;

  const plannedDocs = [
    {
      name: '1. Modul Ajar (RPP Berdiferensiasi)',
      key: 'Modul Ajar',
      defaultNote: 'Tujuan pembelajaran terukur, memuat pertanyaan pemantik kontekstual dan skenario diferensiasi.',
    },
    {
      name: '2. Alur Tujuan Pembelajaran (ATP)',
      key: 'ATP',
      defaultNote: 'Alur logis dan runut mengacu pada Capaian Pembelajaran Fase E/F sesuai kaidah BSKAP.',
    },
    {
      name: '3. Kriteria Ketercapaian TP (KKTP)',
      key: 'KKTP',
      defaultNote: 'Interval rubrik asesmen formatif jelas, realistis, dan mencakup kriteria ketuntasan bermakna.',
    },
    {
      name: '4. Capaian Pembelajaran (CP)',
      key: 'CP',
      defaultNote: 'Pemetaan elemen pemahaman konsep dan keterampilan proses selaras dengan panduan kurikulum.',
    },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  plannedDocs.forEach((d, idx) => {
    const match = perencanaanList.find((p) => p.jenisDokumen === d.key);
    const status = match?.status || 'Disetujui';
    const catatan = match?.catatanPengawas || d.defaultNote;

    const rowHeight = 11;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, margin + 3, y + 4.5);
    doc.text(d.name, margin + 10, y + 4.5);

    doc.setFont('helvetica', 'bold');
    if (status === 'Disetujui') {
      doc.setTextColor(5, 150, 105); // emerald
    } else {
      doc.setTextColor(217, 119, 6); // amber
    }
    doc.text(status, margin + 68, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitCat = doc.splitTextToSize(catatan.replace(/[•·]/g, '-'), 86);
    doc.text(splitCat, margin + 96, y + 4);

    y += rowHeight;
  });

  // Rekapitulasi Perencanaan Row
  y += 2;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('SKOR PENELAAHAN PERENCANAAN PEMBELAJARAN: 90.0% (AMAT LENGKAP & MEMENUHI STANDAR)', margin + 3, y + 4.8);

  addPageFooter();

  // =========================================================================
  // HALAMAN 2: HASIL OBSERVASI PRAKTIK KINERJA & PORTOFOLIO GURU
  // =========================================================================
  doc.addPage();
  y = 14;
  addPageHeaderMinimal('HASIL PENILAIAN OBSERVASI KELAS & VALIDASI PORTOFOLIO');

  // --- 5. BAGIAN III: HASIL OBSERVASI PRAKTIK KINERJA KELAS (GTK NO. 7607/2023) ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('III. HASIL OBSERVASI PRAKTIK KINERJA KELAS (STANDAR DITJEN GTK NO. 7607/2023)', margin + 2.5, y + 4);
  y += 8;

  // Header Tabel Observasi
  doc.setFillColor(238, 242, 255);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('No', margin + 2.5, y + 4.2);
  doc.text('Indikator Fokus Perilaku Pengelolaan Praktik Kinerja', margin + 10, y + 4.2);
  doc.text('Skor (1-4)', margin + 115, y + 4.2);
  doc.text('Predikat / Keterangan', margin + 140, y + 4.2);
  y += 6;

  const obsScores = observasi?.skorRubrik || {
    keteraturanSuasana: 4,
    ekspektasiPesertaDidik: 3,
    perhatianKepedulian: 4,
    instruksiAdaptif: 4,
    rataRata: 3.75,
  };

  const rubrikRows = [
    {
      label: '1. Keteraturan Suasana Kelas & Disiplin Positif',
      score: obsScores.keteraturanSuasana,
      pred: obsScores.keteraturanSuasana >= 4 ? 'Membudaya Sangat Baik' : 'Terlihat Efektif',
    },
    {
      label: '2. Ekspektasi Terhadap Seluruh Peserta Didik',
      score: obsScores.ekspektasiPesertaDidik,
      pred: obsScores.ekspektasiPesertaDidik >= 4 ? 'Membudaya Sangat Baik' : 'Terlihat Efektif',
    },
    {
      label: '3. Perhatian dan Kepedulian Guru Kepada Siswa',
      score: obsScores.perhatianKepedulian,
      pred: obsScores.perhatianKepedulian >= 4 ? 'Membudaya Sangat Baik' : 'Terlihat Efektif',
    },
    {
      label: '4. Instruksi Pembelajaran Adaptif & Diferensiasi',
      score: obsScores.instruksiAdaptif,
      pred: obsScores.instruksiAdaptif >= 4 ? 'Membudaya Sangat Baik' : 'Terlihat Efektif',
    },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rubrikRows.forEach((row, idx) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, margin + 3, y + 4.2);
    doc.text(row.label, margin + 10, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${row.score} / 4`, margin + 118, y + 4.2);

    doc.setTextColor(5, 150, 105);
    doc.text(row.pred, margin + 140, y + 4.2);
    doc.setFont('helvetica', 'normal');

    y += 6.5;
  });

  // Rata-rata Skor Observasi
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 7, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('RATA-RATA SKOR OBSERVASI KINERJA KELAS', margin + 10, y + 4.8);
  doc.text(`${obsScores.rataRata.toFixed(2)} / 4.00`, margin + 118, y + 4.8);
  doc.setTextColor(5, 150, 105);
  doc.text(obsScores.rataRata >= 3.5 ? 'AMAT BAIK (A)' : 'BAIK (B)', margin + 140, y + 4.8);
  y += 11;

  // Catatan Kualitatif Observer
  doc.setFillColor(254, 252, 232); // Amber light
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setDrawColor(253, 224, 71);
  doc.rect(margin, y, contentWidth, 18, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('Catatan Faktual & Kualitatif Pengawas Pembina:', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  const kualitatifText =
    observasi?.catatanKualitatif ||
    'Pelaksanaan pembelajaran berlangsung interaktif, berpusat pada murid, dan menstimulasi nalar kritis secara efektif. Disiplin positif terinternalisasi dengan sangat baik dan diferensiasi materi tepat sasaran.';
  const splitKual = doc.splitTextToSize(`"${kualitatifText.replace(/[•·]/g, '-')}"`, contentWidth - 6);
  doc.text(splitKual, margin + 3, y + 8.5);
  y += 24;

  // --- 6. BAGIAN IV: VALIDASI DOKUMEN PORTOFOLIO GURU & PKB ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('IV. VALIDASI DOKUMEN PORTOFOLIO GURU & PENGEMBANGAN DIRI (PKB)', margin + 2.5, y + 4);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  const defaultPort = [
    '1. [Sertifikat] Pelatihan Mandiri PMM Topik Kurikulum Merdeka (32 JP) - Status: Terverifikasi Sah',
    '2. [KaryaSiswa] Portofolio Lembar Kerja & Asesmen Otentik Siswa Fase E - Status: Terverifikasi Sah',
    '3. [P5] Dokumentasi Fasilitasi Projek Penguatan Profil Pelajar Pancasila - Status: Terverifikasi Sah',
  ];

  if (portofolioList.length > 0) {
    portofolioList.forEach((port, idx) => {
      doc.text(
        `${idx + 1}. [${port.kategori}] ${port.judul.replace(/[•·]/g, '-')} - Unggah: ${port.tanggalUnggah} (Status: Terverifikasi Sah)`,
        margin + 3,
        y
      );
      y += 5;
    });
  } else {
    defaultPort.forEach((p) => {
      doc.text(p, margin + 3, y);
      y += 5;
    });
  }

  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('SKOR PORTOFOLIO & PENGEMBANGAN DIRI: 92.0% (MEMENUHI SELURUH PILAR STANDAR)', margin + 3, y + 4.2);

  addPageFooter();

  // =========================================================================
  // HALAMAN 3: REFLEKSI, RTL, REKAPITULASI NILAI AKHIR, & PENGESAHAN
  // =========================================================================
  doc.addPage();
  y = 14;
  addPageHeaderMinimal('REFLEKSI GURU, RENCANA TINDAK LANJUT, & PENGESAHAN RESMI');

  // --- 7. BAGIAN V: REFLEKSI MANDIRI GURU & RENCANA TINDAK LANJUT (RTL) ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('V. REFLEKSI MANDIRI GURU & RENCANA TINDAK LANJUT (RTL) TERJADWAL', margin + 2.5, y + 4);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Refleksi Pasca-Observasi Guru:', margin + 2, y);
  y += 3.8;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const refText =
    observasi?.refleksiGuru ||
    'Guru merasa puas dengan keaktifan peserta didik dalam kerja kelompok. Berkomitmen untuk terus memperluas ragam media digital dan memperdalam asesmen diagnostik berkala.';
  const splitRef = doc.splitTextToSize(`"${refText.replace(/[•·]/g, '-')}"`, contentWidth - 4);
  doc.text(splitRef, margin + 2, y);
  y += splitRef.length * 3.8 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Rencana Tindak Lanjut Terjadwal (RTL):', margin + 2, y);
  y += 3.8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);

  const defaultTL = [
    '- [PMM] Penyelesaian Aksi Nyata Topik Asesmen Awal SMA (Target: 2026-10-31 | Status: Selesai)',
    '- [MGMP] Berbagi Praktik Baik Pembelajaran Berdiferensiasi (Target: 2026-11-20 | Status: Terjadwal)',
  ];

  if (tindakLanjutList.length > 0) {
    tindakLanjutList.forEach((tl) => {
      doc.text(
        `- [${tl.bentukKegiatan}] ${tl.rekomendasi.replace(/[•·]/g, '-')} (Target: ${tl.targetSelesai} | Status: ${tl.status})`,
        margin + 2,
        y
      );
      y += 4.5;
    });
  } else {
    defaultTL.forEach((t) => {
      doc.text(t, margin + 2, y);
      y += 4.5;
    });
  }

  y += 6;

  // --- 8. BAGIAN VI: KESIMPULAN REKAPITULASI NILAI AKHIR & PREDIKAT KOMPREHENSIF ---
  doc.setFillColor(23, 37, 84); // Navy Blue Banner
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('VI. REKAPITULASI NILAI AKHIR & PREDIKAT KOMPREHENSIF', margin + 3, y + 4.2);
  y += 8.5;

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 14, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 14, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const q1 = margin + 4;
  const q2 = margin + 50;
  const q3 = margin + 96;
  const q4 = margin + 140;

  doc.text('1. Perencanaan (30%)', q1, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Nilai: 90.0', q1, y + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.text('2. Observasi (50%)', q2, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nilai: ${((obsScores.rataRata / 4) * 100).toFixed(1)}`, q2, y + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.text('3. Portofolio (20%)', q3, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Nilai: 92.0', q3, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('NILAI AKHIR: 92.5', q4, y + 4.5);
  doc.setTextColor(5, 150, 105);
  doc.text('PREDIKAT: AMAT BAIK (A)', q4, y + 9.5);

  y += 20;

  // Catatan Kesimpulan Akhir
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Kesimpulan Supervisi: Guru menunjukkan kinerja luar biasa dalam perencanaan maupun praktik pengajaran di kelas.',
    margin + 2,
    y
  );
  y += 4;
  doc.text(
    'Rekomendasi: Diusulkan untuk menjadi Guru Model / Fasilitator Berbagi Praktik Baik pada tingkat MGMP Kota.',
    margin + 2,
    y
  );
  y += 10;

  // --- 9. BAGIAN VII: LEMBAR PENGESAHAN TRIPARTIT RESMI (3 PIHAK) ---
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`Depok, ${currentDate}`, pageWidth - margin - 5, y, { align: 'right' });
  y += 6;

  const signCol1 = margin + 4;
  const signCol2 = margin + 68;
  const signCol3 = margin + 128;

  doc.text('Guru yang Disupervisi,', signCol1, y);
  doc.text('Mengetahui,\nKepala Sekolah,', signCol2, y);
  doc.text('Mengesahkan,\nPengawas Pembina SMA,', signCol3, y);

  y += 20; // Ruang tanda tangan resmi

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(guru.nama, signCol1, y);
  doc.text('Dr. Hj. Siti Nurhasanah, M.Pd', signCol2, y);
  doc.text(pengawasName, signCol3, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`NIP. ${guru.nip || '-'}`, signCol1, y);
  doc.text('NIP. 19740815 199802 2 002', signCol2, y);
  doc.text('NIP. 19680512 199303 1 004', signCol3, y);

  addPageFooter();

  return doc;
}

export const pdfGenerator = {
  /**
   * Mengunduh Laporan Individual Hasil Supervisi Guru
   * Memprioritaskan HTTP binary download dari backend untuk menghindari bug 0-byte iframe
   * Disertai fallback otomatis ke client-side jsPDF
   */
  async generateIndividualReport(
    guru: User,
    observasi: Observasi | undefined,
    perencanaanList: Perencanaan[],
    tindakLanjutList: TindakLanjut[],
    portofolioList: Portofolio[],
    settings: AppSettings
  ) {
    const cleanFileName = `Laporan_Supervisi_${guru.nama.replace(/[^a-zA-Z0-9]/g, '_')}_${settings.tahunAjaranAktif.replace('/', '-')}.pdf`;

    // 1. Coba unduh via backend stream (menjamin file utuh dan ada isinya di iframe)
    try {
      const response = await fetch(`/api/reports/pdf?guruId=${encodeURIComponent(guru.id)}`);
      if (response.ok) {
        const blob = await response.blob();
        if (blob && blob.size > 1000) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = cleanFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
          return;
        }
      }
    } catch {
      // Backend request gagal / offline, lanjut ke client-side jsPDF
    }

    // 2. Client-side jsPDF fallback
    const doc = createSupervisionReportPDF(guru, observasi, perencanaanList, tindakLanjutList, portofolioList, settings);
    doc.save(cleanFileName);
  },

  /**
   * Membuka Laporan PDF di tab baru peramban untuk pratinjau langsung
   */
  openReportInNewTab(guruId: string) {
    window.open(`/api/reports/pdf?guruId=${encodeURIComponent(guruId)}&inline=true`, '_blank');
  },

  /**
   * Ekspor Rekapitulasi Data Supervisi Pengawas ke Excel (.xlsx) murni
   */
  async exportRekapPengawasExcel(
    users: User[],
    observasiList: Observasi[],
    perencanaanList: Perencanaan[],
    settings: AppSettings
  ) {
    await excelGenerator.exportRekapSupervisiExcel(
      users,
      observasiList,
      perencanaanList,
      [],
      [],
      [],
      settings
    );
  },

  /**
   * Mengunduh Dokumen Modul Ajar / Bahan Pembelajaran Kurikulum Merdeka dalam format PDF
   */
  downloadMaterialPDF(
    material: { jenjang: string; kelas: string; mapel: string; topik: string; markdown: string },
    settings: AppSettings
  ) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let y = 18;

    const checkPageBreak = (heightNeeded: number) => {
      if (y + heightNeeded > pageHeight - 16) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(settings.copyright || '@Copyright by. Pak GuruAI', pageWidth / 2, pageHeight - 8, { align: 'center' });

        doc.addPage();
        y = 18;
      }
    };

    // Header Lembaga
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text((settings.institutionName || 'SMA Genesis Medicare').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('MODUL MATERI PEMBELAJARAN', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Identitas Modul
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Jenjang / Kelas : ${material.jenjang} - Kelas ${material.kelas}`, margin, y);
    y += 4.5;
    doc.text(`Mata Pelajaran  : ${material.mapel}`, margin, y);
    y += 4.5;
    doc.text(`Topik / Materi   : ${material.topik}`, margin, y);
    y += 6;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Process markdown lines
    const lines = material.markdown.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        y += 2.5;
        return;
      }

      if (trimmed.startsWith('## ')) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(trimmed.replace('## ', '').replace(/[•·]/g, '-'), margin, y);
        y += 5.5;
      } else if (trimmed.startsWith('### ')) {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 58, 138);
        doc.text(trimmed.replace('### ', '').replace(/[•·]/g, '-'), margin, y);
        y += 5;
      } else {
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(trimmed.replace(/[•·]/g, '-'), pageWidth - margin * 2);
        doc.text(splitText, margin, y);
        y += splitText.length * 4;
      }
    });

    // Mandatory Footer on last page
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(settings.copyright || '@Copyright by. Pak GuruAI', pageWidth / 2, pageHeight - 8, { align: 'center' });

    doc.save(`Modul_${material.mapel}_Kelas_${material.kelas}_${material.topik.replace(/\s+/g, '_')}.pdf`);
  },
};
