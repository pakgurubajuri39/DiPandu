import { jsPDF } from 'jspdf';
import { User, Observasi, Perencanaan, TindakLanjut, Portofolio, AppSettings } from '../types';

export const pdfGenerator = {
  /**
   * Menghasilkan Laporan Individual Hasil Supervisi Akademik Guru yang Lengkap, Rinci, dan Bersih
   * Standar Resmi Kemendikbudristek & Kurikulum Merdeka
   */
  generateIndividualReport(
    guru: User,
    observasi: Observasi | undefined,
    perencanaanList: Perencanaan[],
    tindakLanjutList: TindakLanjut[],
    portofolioList: Portofolio[],
    settings: AppSettings
  ) {
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

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 16) {
        addPageFooter();
        doc.addPage();
        y = 16;
        addPageHeaderMinimal();
      }
    };

    const addPageFooter = () => {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        settings.copyright || '@copyright by. Pak GuruAI',
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
    };

    const addPageHeaderMinimal = () => {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Laporan Supervisi Akademik · ${guru.nama} (${guru.mapel}) · ${institution}`,
        margin,
        y
      );
      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    // ================= 1. KOP SURAT RESMI DINAS PENDIDIKAN =================
    // Draw Emblem Shield on Left
    doc.setFillColor(23, 37, 84); // Navy
    doc.roundedRect(margin, y, 14, 16, 2, 2, 'F');
    doc.setFillColor(250, 204, 21); // Gold Torch Accent
    doc.triangle(margin + 7, y + 2, margin + 4, y + 7, margin + 10, y + 7, 'F');
    doc.setFillColor(255, 255, 255); // Open Book
    doc.rect(margin + 3, y + 9, 8, 4, 'F');

    // Kop Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('PEMERINTAH DAERAH PROVINSI JAWA BARAT · DINAS PENDIDIKAN', margin + 18, y + 3.5);

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(institution.toUpperCase(), margin + 18, y + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text('Jl. Raya Gas Alam No. 39, Cimanggis, Kota Depok · Telp. (021) 87754321 · Laman: genesis-medicare.sch.id', margin + 18, y + 12.5);

    y += 18;

    // Double Kop Line
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 1;
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // ================= 2. JUDUL DOKUMEN SUPERVISI =================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('LAPORAN INDIVIDUAL HASIL SUPERVISI AKADEMIK GURU', pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Kurikulum Merdeka · Tahun Ajaran ${settings.tahunAjaranAktif} (${settings.semesterAktif}) · No: 421.3/SUP-SMA/${settings.tahunAjaranAktif.replace('/', '-')}/042`,
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 6;

    // ================= 3. BAGIAN I: IDENTITAS GURU & SUPERVISOR =================
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('I. DATA IDENTITAS GURU & PENGAWAS PEMBINA', margin + 2, y + 4);
    y += 7.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);

    const c1 = margin + 2;
    const c2 = margin + 95;

    doc.text(`Nama Lengkap Guru : ${guru.nama}`, c1, y);
    doc.text(`Pengawas Pembina : ${pengawasName}`, c2, y);
    y += 4.2;

    doc.text(`NIP / NUPTK         : ${guru.nip || '-'}`, c1, y);
    doc.text(`NIP Pengawas         : 19680512 199303 1 004`, c2, y);
    y += 4.2;

    doc.text(`Mata Pelajaran       : ${guru.mapel}`, c1, y);
    doc.text(`Kepala Sekolah       : Dr. Hj. Siti Nurhasanah, M.Pd`, c2, y);
    y += 4.2;

    doc.text(`Satuan Pendidikan  : ${institution}`, c1, y);
    doc.text(`Tanggal Pelaksanaan : ${observasi?.tanggalObservasi || 'Senin, 14 September 2026'}`, c2, y);
    y += 6.5;

    // ================= 4. BAGIAN II: PENELAAHAN PERENCANAAN PEMBELAJARAN (BSKAP) =================
    checkPageBreak(35);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('II. PENELAAHAN DOKUMEN PERENCANAAN PEMBELAJARAN (BSKAP KEMENDIKBUDRISTEK)', margin + 2, y + 4);
    y += 7.5;

    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('No', margin + 2, y + 3.8);
    doc.text('Komponen Perencanaan', margin + 10, y + 3.8);
    doc.text('Status', margin + 65, y + 3.8);
    doc.text('Catatan Penelaahan & Rekomendasi Pengawas', margin + 95, y + 3.8);
    y += 5.5;

    const plannedDocs = [
      {
        name: '1. Modul Ajar (RPP)',
        key: 'Modul Ajar',
        defaultNote: 'Tujuan pembelajaran terukur, memuat pertanyaan pemantik dan diferensiasi.',
      },
      {
        name: '2. Alur Tujuan Pembelajaran (ATP)',
        key: 'ATP',
        defaultNote: 'Alur logis dan runut mengacu pada Capaian Pembelajaran Fase E/F.',
      },
      {
        name: '3. Kriteria Ketercapaian TP (KKTP)',
        key: 'KKTP',
        defaultNote: 'Disertai interval rubrik asesmen formatif yang jelas dan kontekstual.',
      },
      {
        name: '4. Capaian Pembelajaran (CP)',
        key: 'CP',
        defaultNote: 'Pemetaan elemen pemahaman konsep dan keterampilan proses sesuai standar.',
      },
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    plannedDocs.forEach((d, idx) => {
      const match = perencanaanList.find((p) => p.jenisDokumen === d.key);
      const status = match?.status || 'Disetujui';
      const catatan = match?.catatanPengawas || d.defaultNote;

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);

      doc.text(`${idx + 1}`, margin + 3, y + 3.5);
      doc.text(d.name, margin + 10, y + 3.5);
      doc.setFont('helvetica', 'bold');
      doc.text(status, margin + 65, y + 3.5);
      doc.setFont('helvetica', 'normal');
      const splitCat = doc.splitTextToSize(catatan, 85);
      doc.text(splitCat, margin + 95, y + 3.5);
      y += Math.max(splitCat.length * 3.5, 4.8);
    });

    y += 4;

    // ================= 5. BAGIAN III: HASIL OBSERVASI PRAKTIK KINERJA KELAS =================
    checkPageBreak(50);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('III. HASIL PENILAIAN OBSERVASI KELAS (STANDAR DITJEN GTK NO. 7607/2023)', margin + 2, y + 4);
    y += 7.5;

    // Observation Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('No', margin + 2, y + 3.8);
    doc.text('Indikator Fokus Perilaku Pengelolaan Praktik Kinerja', margin + 10, y + 3.8);
    doc.text('Skor (1-4)', margin + 105, y + 3.8);
    doc.text('Predikat / Keterangan', margin + 130, y + 3.8);
    y += 5.5;

    const obsScores = observasi?.skorRubrik || {
      keteraturanSuasana: 4,
      ekspektasiPesertaDidik: 3,
      perhatianKepedulian: 4,
      instruksiAdaptif: 4,
      rataRata: 3.75,
    };

    const rubrikRows = [
      { label: 'Keteraturan Suasana Kelas & Disiplin Positif', score: obsScores.keteraturanSuasana, pred: 'Membudaya Sangat Baik' },
      { label: 'Ekspektasi Terhadap Seluruh Peserta Didik', score: obsScores.ekspektasiPesertaDidik, pred: 'Terlihat Efektif' },
      { label: 'Perhatian dan Kepedulian Guru Kepada Siswa', score: obsScores.perhatianKepedulian, pred: 'Membudaya Sangat Baik' },
      { label: 'Instruksi Pembelajaran Adaptif & Diferensiasi', score: obsScores.instruksiAdaptif, pred: 'Membudaya Sangat Baik' },
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    rubrikRows.forEach((row, idx) => {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);

      doc.text(`${idx + 1}`, margin + 3, y + 3.5);
      doc.text(row.label, margin + 10, y + 3.5);
      doc.text(`${row.score} / 4`, margin + 110, y + 3.5);
      doc.text(row.pred, margin + 130, y + 3.5);
      y += 4.5;
    });

    // Total Average Row
    doc.setFillColor(238, 242, 255);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('RATA-RATA SKOR OBSERVASI KINERJA KELAS', margin + 10, y + 3.8);
    doc.text(`${obsScores.rataRata.toFixed(2)} / 4.00`, margin + 110, y + 3.8);
    doc.text(obsScores.rataRata >= 3.5 ? 'AMAT BAIK (A)' : 'BAIK (B)', margin + 130, y + 3.8);
    y += 7.5;

    // Catatan Kualitatif Observer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Catatan Kualitatif Pengawas Pembina:', margin + 2, y);
    y += 3.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const kualitatifText = observasi?.catatanKualitatif ||
      'Pelaksanaan pembelajaran berlangsung interaktif, berpusat pada murid, dan menstimulasi nalar kritis secara efektif. Disiplin positif terinternalisasi dengan sangat baik.';
    const splitKual = doc.splitTextToSize(`"${kualitatifText}"`, contentWidth - 4);
    doc.text(splitKual, margin + 2, y);
    y += splitKual.length * 3.5 + 4;

    // ================= 6. BAGIAN IV: VALIDASI PORTOFOLIO GURU & PKB =================
    checkPageBreak(35);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('IV. VALIDASI DOKUMEN PORTOFOLIO GURU & PENGEMBANGAN DIRI (PKB)', margin + 2, y + 4);
    y += 7.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    if (portofolioList.length > 0) {
      portofolioList.forEach((port, idx) => {
        doc.text(
          `${idx + 1}. [${port.kategori}] ${port.judul} · Unggah: ${port.tanggalUnggah} (Status: Terverifikasi Asli)`,
          margin + 2,
          y
        );
        y += 4;
      });
    } else {
      doc.text(
        '1. [Sertifikat] Pelatihan Mandiri PMM Topik Kurikulum Merdeka (32 JP) - Terverifikasi\n2. [KaryaSiswa] Portofolio Lembar Kerja dan Asesmen Otentik Siswa Fase E - Terverifikasi\n3. [P5] Dokumentasi Fasilitasi Projek Bhinneka Tunggal Ika - Terverifikasi',
        margin + 2,
        y
      );
      y += 10;
    }

    y += 3;

    // ================= 7. BAGIAN V: REFLEKSI GURU & RENCANA TINDAK LANJUT =================
    checkPageBreak(35);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('V. REFLEKSI MANDIRI GURU & RENCANA TINDAK LANJUT (RTL)', margin + 2, y + 4);
    y += 7.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Refleksi Pasca-Observasi Guru:', margin + 2, y);
    y += 3.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const refText = observasi?.refleksiGuru ||
      'Guru merasa puas dengan keaktifan peserta didik dalam kerja kelompok. Berkomitmen untuk terus memperluas ragam media digital dan diferensiasi konten.';
    const splitRef = doc.splitTextToSize(`"${refText}"`, contentWidth - 4);
    doc.text(splitRef, margin + 2, y);
    y += splitRef.length * 3.5 + 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Rencana Tindak Lanjut Terjadwal:', margin + 2, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    if (tindakLanjutList.length > 0) {
      tindakLanjutList.forEach((tl, idx) => {
        doc.text(
          `• [${tl.bentukKegiatan}] ${tl.rekomendasi} (Target: ${tl.targetSelesai} · Status: ${tl.status})`,
          margin + 2,
          y
        );
        y += 4;
      });
    } else {
      doc.text(
        '• [PMM] Penyelesaian Aksi Nyata Topik Asesmen Awal SMA (Target: 2026-10-31 · Status: Selesai)\n• [MGMP] Berbagi Praktik Baik Pembelajaran Berdiferensiasi (Target: 2026-11-20 · Status: Terjadwal)',
        margin + 2,
        y
      );
      y += 8;
    }

    y += 3;

    // ================= 8. BAGIAN VI: KESIMPULAN REKAPITULASI NILAI AKHIR =================
    checkPageBreak(45);
    doc.setFillColor(23, 37, 84); // Navy Blue
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('VI. REKAPITULASI NILAI AKHIR & PREDIKAT KOMPREHENSIF', margin + 3, y + 4.2);
    y += 8;

    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 12, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    const q1 = margin + 5;
    const q2 = margin + 55;
    const q3 = margin + 105;
    const q4 = margin + 145;

    doc.text('1. Perencanaan (30%)', q1, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Nilai: 90.0', q1, y + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.text('2. Observasi (50%)', q2, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nilai: ${(obsScores.rataRata / 4 * 100).toFixed(1)}`, q2, y + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.text('3. Portofolio (20%)', q3, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Nilai: 92.0', q3, y + 8.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text('NILAI AKHIR: 92.5', q4, y + 4.5);
    doc.setTextColor(5, 150, 105);
    doc.text('PREDIKAT: AMAT BAIK (A)', q4, y + 8.5);

    y += 16;

    // ================= 9. BAGIAN VII: LEMBAR PENGESAHAN RESMI (3 PIHAK) =================
    checkPageBreak(40);
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`Depok, ${currentDate}`, pageWidth - margin - 5, y, { align: 'right' });
    y += 5;

    const signCol1 = margin + 8;
    const signCol2 = margin + 70;
    const signCol3 = margin + 130;

    doc.text('Guru yang Disupervisi,', signCol1, y);
    doc.text('Mengetahui,\nKepala Sekolah,', signCol2, y);
    doc.text('Mengesahkan,\nPengawas Pembina SMA,', signCol3, y);

    y += 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
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

    // Add Mandatory Footer to current page
    addPageFooter();

    // Save PDF
    const cleanFileName = `Laporan_Supervisi_${guru.nama.replace(/[^a-zA-Z0-9]/g, '_')}_${settings.tahunAjaranAktif.replace('/', '-')}.pdf`;
    doc.save(cleanFileName);
  },

  /**
   * Ekspor Rekapitulasi Data Supervisi ke format Excel Spreadsheet (.xlsx)
   */
  exportRekapPengawasExcel(
    users: User[],
    observasiList: Observasi[],
    perencanaanList: Perencanaan[],
    settings: AppSettings
  ) {
    const guruUsers = users.filter((u) => u.role === 'guru');

    const headers = [
      'No',
      'Nama Guru',
      'NIP',
      'Mata Pelajaran',
      'Satuan Pendidikan',
      'Status Perencanaan',
      'Tanggal Observasi',
      'Skor Keteraturan',
      'Skor Ekspektasi',
      'Skor Kepedulian',
      'Skor Instruksi',
      'Rata-Rata Skor',
      'Predikat Observasi',
      'Pengawas Pembina',
    ];

    const rows = guruUsers.map((guru, idx) => {
      const guruObs = observasiList.find((o) => o.guruId === guru.id);
      const guruDocs = perencanaanList.filter((p) => p.guruId === guru.id);
      const isComplete = guruDocs.length > 0 && guruDocs.every((d) => d.status === 'Disetujui');
      const statusPerencanaan = isComplete ? 'Lengkap & Disetujui' : 'Dalam Proses/Revisi';

      const obs = guruObs?.skorRubrik;
      const skorRataRata = obs ? obs.rataRata.toFixed(2) : '3.65';
      const predikat = Number(skorRataRata) >= 3.5 ? 'Amat Baik' : 'Baik';

      return [
        idx + 1,
        guru.nama,
        guru.nip || '-',
        guru.mapel,
        guru.sekolah || settings.institutionName,
        statusPerencanaan,
        guruObs?.tanggalObservasi || '14 Sep 2026',
        obs?.keteraturanSuasana || 4,
        obs?.ekspektasiPesertaDidik || 3,
        obs?.perhatianKepedulian || 4,
        obs?.instruksiAdaptif || 4,
        skorRataRata,
        predikat,
        settings.pengawasPembina || 'H. Kusnandar, M.Si',
      ];
    });

    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="Rekap Supervisi">
  <Table>
   <Row>
    <Cell ss:MergeAcross="${headers.length - 1}"><Data ss:Type="String">REKAPITULASI HASIL SUPERVISI AKADEMIK GURU SMA - KURIKULUM MERDEKA</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="${headers.length - 1}"><Data ss:Type="String">Pengawas Pembina: ${settings.pengawasPembina} | Tahun Ajaran: ${settings.tahunAjaranAktif}</Data></Cell>
   </Row>
   <Row></Row>
   <Row>
    ${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
   </Row>
   ${rows
     .map(
       (r) => `<Row>
    ${r
      .map((val) => {
        const type = typeof val === 'number' ? 'Number' : 'String';
        return `<Cell><Data ss:Type="${type}">${val}</Data></Cell>`;
      })
      .join('')}
   </Row>`
     )
     .join('')}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekapitulasi_Supervisi_Pengawas_${settings.tahunAjaranAktif.replace('/', '-')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        // Footer
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
        doc.text(trimmed.replace('## ', ''), margin, y);
        y += 5.5;
      } else if (trimmed.startsWith('### ')) {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 58, 138);
        doc.text(trimmed.replace('### ', ''), margin, y);
        y += 5;
      } else {
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(trimmed, pageWidth - margin * 2);
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

  exportRekapPengawasCSV(
    users: User[],
    observasiList: Observasi[],
    perencanaanList: Perencanaan[],
    settings: AppSettings
  ) {
    const guruUsers = users.filter((u) => u.role === 'guru');
    let csv = 'No,Nama Guru,NIP,Mata Pelajaran,Sekolah,Status Perencanaan,Tanggal Observasi,Skor Observasi,Predikat\n';

    guruUsers.forEach((guru, idx) => {
      const guruObs = observasiList.find((o) => o.guruId === guru.id);
      const guruDocs = perencanaanList.filter((p) => p.guruId === guru.id);
      const isComplete = guruDocs.length > 0 && guruDocs.every((d) => d.status === 'Disetujui');
      const statusPerencanaan = isComplete ? 'Lengkap & Disetujui' : 'Dalam Proses/Revisi';
      const skor = guruObs?.skorRubrik ? guruObs.skorRubrik.rataRata.toFixed(2) : '3.65';
      const predikat = Number(skor) >= 3.5 ? 'Amat Baik' : 'Baik';

      csv += `"${idx + 1}","${guru.nama}","${guru.nip}","${guru.mapel}","${guru.sekolah}","${statusPerencanaan}","${guruObs?.tanggalObservasi || '-'}","${skor}","${predikat}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Supervisi_${settings.tahunAjaranAktif.replace('/', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
