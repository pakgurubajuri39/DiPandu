import { jsPDF } from 'jspdf';
import { User, Observasi, Perencanaan, TindakLanjut, Portofolio, AppSettings } from '../types';

export const pdfGenerator = {
  // Download Individual Teacher Supervision Report
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

    const institution = settings.institutionName || 'SMA Genesis Medicare';
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 18;

    // Header / Kop Dokumen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(institution.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text('LEMBAR HASIL SUPERVISI AKADEMIK GURU', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Tahun Ajaran: ${settings.tahunAjaranAktif} · Semester: ${settings.semesterAktif} · Kurikulum Merdeka`, pageWidth / 2, y, { align: 'center' });
    y += 4;

    // Horizontal line
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.6);
    doc.line(15, y, pageWidth - 15, y);
    y += 7;

    // Section 1: Identitas Guru & Supervisor
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('I. IDENTITAS GURU & SUPERVISOR', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const leftCol = 15;
    const rightCol = 110;

    doc.text(`Nama Guru: ${guru.nama}`, leftCol, y);
    doc.text(`Supervisor: ${observasi?.supervisorNama || settings.pengawasPembina}`, rightCol, y);
    y += 4.5;

    doc.text(`NIP Guru: ${guru.nip || '-'}`, leftCol, y);
    doc.text(`Mata Pelajaran: ${guru.mapel}`, rightCol, y);
    y += 4.5;

    doc.text(`Unit Kerja: ${guru.sekolah || institution}`, leftCol, y);
    doc.text(`Tanggal Observasi: ${observasi?.tanggalObservasi || 'Belum Terjadwal'}`, rightCol, y);
    y += 7;

    // Section 2: Rekapitulasi Dokumen Perencanaan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('II. VERIFIKASI DOKUMEN PERENCANAAN PEMBELAJARAN', 15, y);
    y += 5;

    // Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(15, y - 4, pageWidth - 30, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Jenis Dokumen', 18, y);
    doc.text('Status', 75, y);
    doc.text('Catatan Penelaahan / Review', 110, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const docTypes = ['Modul Ajar', 'ATP', 'KKTP', 'CP'];

    docTypes.forEach((type) => {
      const match = perencanaanList.find((p) => p.jenisDokumen === type);
      const statusText = match ? match.status : 'Belum Diunggah';
      const catatan = match?.catatanPengawas || 'Menunggu unggahan berkas';

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(15, y - 3.5, pageWidth - 15, y - 3.5);

      doc.text(type, 18, y);
      doc.text(statusText, 75, y);
      const splitCatatan = doc.splitTextToSize(catatan, 80);
      doc.text(splitCatatan, 110, y);
      y += Math.max(splitCatatan.length * 3.5, 5);
    });

    y += 3;

    // Section 3: Hasil Observasi Kelas & Rubrik
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('III. HASIL PENILAIAN OBSERVASI KELAS (RUBRIK 1 - 4)', 15, y);
    y += 5;

    if (observasi && observasi.skorRubrik) {
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y - 4, pageWidth - 30, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Indikator Fokus Perilaku', 18, y);
      doc.text('Skor', 130, y);
      doc.text('Keterangan', 155, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const rubrikItems = [
        { label: '1. Keteraturan Suasana Kelas', score: observasi.skorRubrik.keteraturanSuasana },
        { label: '2. Ekspektasi Pada Peserta Didik', score: observasi.skorRubrik.ekspektasiPesertaDidik },
        { label: '3. Perhatian dan Kepedulian', score: observasi.skorRubrik.perhatianKepedulian },
        { label: '4. Instruksi Adaptif & Diferensiasi', score: observasi.skorRubrik.instruksiAdaptif },
      ];

      const getPredikat = (s: number) => {
        if (s >= 3.5) return 'Sangat Baik (Membudaya)';
        if (s >= 2.5) return 'Baik (Terlihat Efektif)';
        if (s >= 1.5) return 'Cukup (Berkembang)';
        return 'Kurang (Perlu Pembinaan)';
      };

      rubrikItems.forEach((item) => {
        doc.line(15, y - 3.5, pageWidth - 15, y - 3.5);
        doc.text(item.label, 18, y);
        doc.text(`${item.score} / 4`, 130, y);
        doc.text(getPredikat(item.score), 155, y);
        y += 4.5;
      });

      // Total Rata-rata
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(238, 242, 255);
      doc.rect(15, y - 3.5, pageWidth - 30, 6, 'F');
      doc.text('RATA-RATA SKOR OBSERVASI', 18, y);
      doc.text(`${observasi.skorRubrik.rataRata.toFixed(2)} / 4.00`, 130, y);
      doc.text(getPredikat(observasi.skorRubrik.rataRata), 155, y);
      y += 7;

      // Catatan Kualitatif
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('Catatan Kualitatif Observer:', 15, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitKualitatif = doc.splitTextToSize(observasi.catatanKualitatif || 'Observasi telah selesai dilaksanakan.', pageWidth - 30);
      doc.text(splitKualitatif, 15, y);
      y += splitKualitatif.length * 3.5 + 4;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Observasi kelas belum dilaksanakan atau dalam tahap penjadwalan.', 18, y);
      y += 6;
    }

    // Section 4: Refleksi & Rekomendasi Tindak Lanjut
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('IV. REFLEKSI GURU & RENCANA TINDAK LANJUT (RTL)', 15, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Refleksi Mandiri Guru:', 15, y);
    y += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const refleksiText = observasi?.refleksiGuru || 'Guru telah menyampaikan refleksi pasca observasi dengan komitmen peningkatan berkelanjutan.';
    const splitRefleksi = doc.splitTextToSize(refleksiText, pageWidth - 30);
    doc.text(splitRefleksi, 15, y);
    y += splitRefleksi.length * 3.5 + 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Rekomendasi Rencana Tindak Lanjut:', 15, y);
    y += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    if (tindakLanjutList.length > 0) {
      tindakLanjutList.forEach((tl, idx) => {
        const tlText = `${idx + 1}. [${tl.bentukKegiatan}] ${tl.rekomendasi} (Target: ${tl.targetSelesai} · Status: ${tl.status})`;
        const splitTL = doc.splitTextToSize(tlText, pageWidth - 30);
        doc.text(splitTL, 15, y);
        y += splitTL.length * 3.5 + 1.5;
      });
    } else {
      doc.text('Peningkatan mandiri melalui pelatihan di Platform Merdeka Mengajar (PMM) dan diskusi MGMP.', 15, y);
      y += 5;
    }

    y += 2;

    // Section 5: Rangkuman Portofolio Guru
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('V. REKAPITULASI PORTOFOLIO GURU TERKUMPUL', 15, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    if (portofolioList.length > 0) {
      portofolioList.forEach((port, idx) => {
        doc.text(`• [${port.kategori}] ${port.judul} (${port.tanggalUnggah})`, 18, y);
        y += 4;
      });
    } else {
      doc.text('Belum ada dokumen portofolio tambahan yang diunggah.', 18, y);
      y += 5;
    }

    y += 6;

    // Kolom Tanda Tangan (3 Kolom: Guru, Kepala Sekolah, Pengawas Pembina)
    const signY = Math.min(y, 250);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);

    const col1 = 20;
    const col2 = 85;
    const col3 = 150;

    doc.text('Guru yang Disupervisi,', col1, signY);
    doc.text('Mengetahui,\nKepala Sekolah,', col2, signY);
    doc.text('Pengawas Pembina SMA,', col3, signY);

    const nameY = signY + 18;
    doc.setFont('helvetica', 'bold');
    doc.text(guru.nama, col1, nameY);
    doc.text('Dr. Hj. Siti Nurhasanah, M.Pd', col2, nameY);
    doc.text(observasi?.supervisorNama || settings.pengawasPembina, col3, nameY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`NIP. ${guru.nip || '-'}`, col1, nameY + 3.5);
    doc.text('NIP. 19740815 199802 2 002', col2, nameY + 3.5);
    doc.text('NIP. 19680512 199303 1 004', col3, nameY + 3.5);

    // Mandatory Footer
    const footerY = 287;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, footerY - 4, pageWidth - 15, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(settings.copyright || '@copyright by. Pak GuruAI', pageWidth / 2, footerY, { align: 'center' });

    // Download the PDF file
    const safeName = guru.nama.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Laporan_Supervisi_${safeName}_${settings.tahunAjaranAktif.replace('/', '-')}.pdf`);
  },

  // Export Rekap Pengawas to CSV
  exportRekapPengawasCSV(users: User[], observasiList: Observasi[], perencanaanList: Perencanaan[], settings: AppSettings) {
    const guruUsers = users.filter((u) => u.role === 'guru');
    
    let csv = 'No,Nama Guru,NIP,Mata Pelajaran,Sekolah,Status Perencanaan,Tanggal Observasi,Skor Rubrik Rata-Rata,Predikat\n';

    guruUsers.forEach((guru, idx) => {
      const guruObs = observasiList.find((o) => o.guruId === guru.id);
      const guruDocs = perencanaanList.filter((p) => p.guruId === guru.id);
      const statusDoc = guruDocs.length > 0 && guruDocs.every((d) => d.status === 'Disetujui') ? 'Lengkap & Disetujui' : 'Dalam Proses/Revisi';
      const skor = guruObs?.skorRubrik ? guruObs.skorRubrik.rataRata.toFixed(2) : '-';
      const predikat = guruObs?.skorRubrik ? (guruObs.skorRubrik.rataRata >= 3.5 ? 'Sangat Baik' : guruObs.skorRubrik.rataRata >= 2.5 ? 'Baik' : 'Cukup') : 'Belum Observasi';
      const tgl = guruObs?.tanggalObservasi || '-';

      csv += `"${idx + 1}","${guru.nama}","${guru.nip}","${guru.mapel}","${guru.sekolah}","${statusDoc}","${tgl}","${skor}","${predikat}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekapitulasi_Supervisi_Pengawas_${settings.tahunAjaranAktif.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Download Generated Teaching Material as PDF
  downloadMaterialPDF(material: any, settings: AppSettings) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const institution = settings.institutionName || 'SMA Genesis Medicare';
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 18;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(institution.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 5.5;

    doc.setFontSize(11);
    doc.text('MODUL MATERI PEMBELAJARAN (KURIKULUM MERDEKA)', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Jenjang: ${material.jenjang} (Kelas ${material.kelas}) · Mapel: ${material.mapel} · Topik: ${material.topik}`, pageWidth / 2, y, { align: 'center' });
    y += 4;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(15, y, pageWidth - 15, y);
    y += 8;

    // Content lines
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const lines = material.markdown.split('\n');
    lines.forEach((line: string) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }

      if (line.startsWith('## ')) {
        y += 2;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(line.replace('## ', ''), 15, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
      } else if (line.startsWith('### ')) {
        y += 1.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(line.replace('### ', ''), 15, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
      } else if (line.startsWith('---')) {
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y, pageWidth - 15, y);
        y += 4;
      } else if (line.trim().length > 0) {
        const split = doc.splitTextToSize(line, pageWidth - 30);
        doc.text(split, 15, y);
        y += split.length * 4;
      } else {
        y += 2;
      }
    });

    // Ensure copyright footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(settings.copyright || '@copyright by. Pak GuruAI', pageWidth / 2, 287, { align: 'center' });

    const safeTopic = material.topik.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Modul_${material.mapel}_${safeTopic}.pdf`);
  },
};
