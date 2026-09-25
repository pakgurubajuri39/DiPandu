import * as XLSX from 'xlsx';
import { User, Observasi, Perencanaan, TindakLanjut, Portofolio, SekolahBinaan, AppSettings } from '../types';

export function createRekapSupervisiWorkbook(
  users: User[],
  observasiList: Observasi[],
  perencanaanList: Perencanaan[],
  tindakLanjutList: TindakLanjut[],
  portofolioList: Portofolio[],
  sekolahBinaan: SekolahBinaan[],
  settings: AppSettings
) {
  const wb = XLSX.utils.book_new();
  const guruUsers = users.filter((u) => u.role === 'guru');

  // 1. Data Sheet 1: Rekapitulasi Supervisi Guru
  const rowsGuru = guruUsers.map((guru, idx) => {
    const guruObs = observasiList.find((o) => o.guruId === guru.id);
    const guruDocs = perencanaanList.filter((p) => p.guruId === guru.id);
    const approvedDocs = guruDocs.filter((d) => d.status === 'Disetujui').length;
    const statusPerencanaan = `${approvedDocs}/${guruDocs.length || 4} Disetujui (${
      approvedDocs >= 3 ? 'Lengkap' : 'Dalam Proses/Revisi'
    })`;

    const guruTL = tindakLanjutList.find((t) => t.guruId === guru.id);
    const guruPort = portofolioList.filter((p) => p.guruId === guru.id);

    const skorSuasana = guruObs?.skorRubrik ? guruObs.skorRubrik.keteraturanSuasana : '-';
    const skorEkspektasi = guruObs?.skorRubrik ? guruObs.skorRubrik.ekspektasiPesertaDidik : '-';
    const skorPerhatian = guruObs?.skorRubrik ? guruObs.skorRubrik.perhatianKepedulian : '-';
    const skorInstruksi = guruObs?.skorRubrik ? guruObs.skorRubrik.instruksiAdaptif : '-';
    const skorRataRata = guruObs?.skorRubrik ? guruObs.skorRubrik.rataRata.toFixed(2) : '-';

    let predikat = 'Belum Observasi';
    if (guruObs?.skorRubrik) {
      const s = guruObs.skorRubrik.rataRata;
      if (s >= 3.5) predikat = 'Sangat Baik (Membudaya)';
      else if (s >= 2.5) predikat = 'Baik (Terlihat Efektif)';
      else if (s >= 1.5) predikat = 'Cukup (Berkembang)';
      else predikat = 'Kurang (Perlu Pembinaan)';
    }

    return {
      'No': idx + 1,
      'Nama Guru': guru.nama,
      'NIP': guru.nip || '-',
      'Mata Pelajaran': guru.mapel,
      'Satuan Pendidikan': guru.sekolah,
      'Status Perencanaan Kurikulum': statusPerencanaan,
      'Tanggal Observasi': guruObs?.tanggalObservasi || 'Belum Terjadwal',
      'Kelas / Rombel': guruObs?.kelas || '-',
      '1. Keteraturan Suasana (1-4)': skorSuasana,
      '2. Ekspektasi Siswa (1-4)': skorEkspektasi,
      '3. Perhatian Guru (1-4)': skorPerhatian,
      '4. Instruksi Adaptif (1-4)': skorInstruksi,
      'Skor Rata-Rata (1-4)': skorRataRata,
      'Predikat Kinerja': predikat,
      'Catatan Kualitatif Observer': guruObs?.catatanKualitatif || '-',
      'Refleksi Mandiri Guru': guruObs?.refleksiGuru || '-',
      'Bentuk Kegiatan RTL': guruTL?.bentukKegiatan || '-',
      'Rekomendasi Tindak Lanjut': guruTL?.rekomendasi || '-',
      'Target Selesai RTL': guruTL?.targetSelesai || '-',
      'Status RTL': guruTL?.status || 'Belum Dimulai',
      'Jumlah Portofolio': guruPort.length,
    };
  });

  const wsGuru = XLSX.utils.json_to_sheet(rowsGuru);

  // Auto width columns for Sheet 1
  const colWidths = [
    { wch: 5 },  // No
    { wch: 25 }, // Nama Guru
    { wch: 22 }, // NIP
    { wch: 20 }, // Mapel
    { wch: 25 }, // Sekolah
    { wch: 28 }, // Status Perencanaan
    { wch: 18 }, // Tanggal
    { wch: 15 }, // Kelas
    { wch: 24 }, // Skor 1
    { wch: 22 }, // Skor 2
    { wch: 22 }, // Skor 3
    { wch: 24 }, // Skor 4
    { wch: 20 }, // Rata-rata
    { wch: 25 }, // Predikat
    { wch: 45 }, // Catatan
    { wch: 45 }, // Refleksi
    { wch: 18 }, // Bentuk RTL
    { wch: 45 }, // Rekomendasi RTL
    { wch: 16 }, // Target
    { wch: 16 }, // Status RTL
    { wch: 16 }, // Jml Portofolio
  ];
  wsGuru['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, wsGuru, 'Rekapitulasi Guru');

  // 2. Data Sheet 2: Profil Sekolah Binaan
  const rowsSekolah = sekolahBinaan.map((sek, idx) => ({
    'No': idx + 1,
    'Nama Sekolah Binaan': sek.nama,
    'NPSN': sek.npsn,
    'Akreditasi': sek.akreditasi,
    'Kepala Sekolah': sek.kepalaSekolah,
    'Jumlah Guru': sek.jumlahGuru,
    'Alamat Sekolah': sek.alamat,
    'Pengawas Pembina': settings.pengawasPembina,
  }));

  const wsSekolah = XLSX.utils.json_to_sheet(rowsSekolah);
  wsSekolah['!cols'] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 26 },
    { wch: 14 },
    { wch: 45 },
    { wch: 26 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSekolah, 'Sekolah Binaan');

  // 3. Data Sheet 3: Ringkasan & Metrik Pengawas
  const rowsRingkasan = [
    { 'Indikator / Metrik': 'Nama Aplikasi', 'Keterangan': 'DiPandu - Edukasi Supervisi Guru' },
    { 'Indikator / Metrik': 'Institusi Utama', 'Keterangan': settings.institutionName },
    { 'Indikator / Metrik': 'Tahun Ajaran', 'Keterangan': settings.tahunAjaranAktif },
    { 'Indikator / Metrik': 'Semester', 'Keterangan': settings.semesterAktif },
    { 'Indikator / Metrik': 'Pengawas Pembina SMA', 'Keterangan': settings.pengawasPembina },
    { 'Indikator / Metrik': 'Total Guru Binaan', 'Keterangan': guruUsers.length },
    { 'Indikator / Metrik': 'Total Sekolah Binaan', 'Keterangan': sekolahBinaan.length },
    { 'Indikator / Metrik': 'Total Dokumen Perencanaan Terkumpul', 'Keterangan': perencanaanList.length },
    { 'Indikator / Metrik': 'Total Observasi Kelas Selesai', 'Keterangan': observasiList.filter(o => o.status !== 'Terjadwal').length },
    { 'Indikator / Metrik': 'Total Portofolio Guru', 'Keterangan': portofolioList.length },
    { 'Indikator / Metrik': 'Hak Cipta', 'Keterangan': settings.copyright || '@copyright by. Pak GuruAI' },
    { 'Indikator / Metrik': 'Tanggal Unduh Laporan', 'Keterangan': new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }) },
  ];

  const wsRingkasan = XLSX.utils.json_to_sheet(rowsRingkasan);
  wsRingkasan['!cols'] = [{ wch: 35 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsRingkasan, 'Informasi & Metrik');

  return wb;
}

export const excelGenerator = {
  async exportRekapSupervisiExcel(
    users: User[],
    observasiList: Observasi[],
    perencanaanList: Perencanaan[],
    tindakLanjutList: TindakLanjut[],
    portofolioList: Portofolio[],
    sekolahBinaan: SekolahBinaan[],
    settings: AppSettings
  ) {
    const fileName = `Rekapitulasi_Supervisi_Pengawas_${settings.tahunAjaranAktif.replace('/', '-')}.xlsx`;

    // Try server download first for 100% reliable download inside iframes
    try {
      const res = await fetch('/api/reports/excel');
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 500) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          return;
        }
      }
    } catch {
      // Fallback to client-side XLSX generation
    }

    // Client-side fallback
    const wb = createRekapSupervisiWorkbook(
      users,
      observasiList,
      perencanaanList,
      tindakLanjutList,
      portofolioList,
      sekolahBinaan,
      settings
    );
    XLSX.writeFile(wb, fileName);
  },
};
