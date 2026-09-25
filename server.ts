import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initial State / In-Memory Database
const state = {
  settings: {
    institutionName: 'SMA Genesis Medicare',
    copyright: '@copyright by. Pak GuruAI',
    tahunAjaranAktif: '2026/2027',
    semesterAktif: 'Ganjil',
    pengawasPembina: 'H. Kusnandar, M.Si',
  },
  users: [
    {
      id: 'usr-admin',
      nama: 'H. Kusnandar, M.Si',
      nip: '19680512 199303 1 004',
      role: 'pengawas',
      sekolah: 'Dinas Pendidikan Wil. II (SMA Binaan)',
      mapel: 'Pengawas Sekolah Pembina SMA',
      username: 'admin',
      password: 'pakhaji',
      avatar: '/src/assets/images/avatar_pengawas_senior_1790340331197.jpg',
      kontak: '0812-3456-7890',
    },
    {
      id: 'usr-kepsek',
      nama: 'Dr. Hj. Siti Nurhasanah, M.Pd',
      nip: '19740815 199802 2 002',
      role: 'kepala_sekolah',
      sekolah: 'SMA Genesis Medicare',
      mapel: 'Manajerial & Kepemimpinan Sekolah',
      username: 'kepsek',
      password: 'bajuri39',
      avatar: '',
      kontak: '0813-9876-5432',
    },
    {
      id: 'usr-guru-1',
      nama: 'Ahmad Fauzi, S.Pd',
      nip: '19850210 201001 1 015',
      role: 'guru',
      sekolah: 'SMA Genesis Medicare',
      mapel: 'Matematika',
      username: 'guru1',
      password: 'bajuri39',
      avatar: '',
      kontak: '0857-1122-3344',
    },
    {
      id: 'usr-guru-2',
      nama: 'Dewi Lestari, S.Pd',
      nip: '19910624 201603 2 008',
      role: 'guru',
      sekolah: 'SMA Genesis Medicare',
      mapel: 'Biologi',
      username: 'guru2',
      password: 'bajuri39',
      avatar: '',
      kontak: '0819-2233-4455',
    },
    {
      id: 'usr-guru-3',
      nama: 'Bambang Prakoso, M.Pd',
      nip: '19821105 200801 1 009',
      role: 'guru',
      sekolah: 'SMA Genesis Medicare',
      mapel: 'Fisika',
      username: 'guru3',
      password: 'bajuri39',
      avatar: '',
      kontak: '0821-4455-6677',
    },
    {
      id: 'usr-guru-4',
      nama: 'Ratna Sari, S.Pd',
      nip: '19940318 201903 2 012',
      role: 'guru',
      sekolah: 'SMA Genesis Medicare',
      mapel: 'Bahasa Indonesia',
      username: 'guru4',
      password: 'bajuri39',
      avatar: '',
      kontak: '0812-7788-9900',
    },
  ],
  sekolahBinaan: [
    {
      id: 'sek-1',
      nama: 'SMA Genesis Medicare',
      npsn: '20271890',
      alamat: 'Jl. K.H. Ahmad Dahlan No. 12, Kota Depok, Jawa Barat',
      kepalaSekolah: 'Dr. Hj. Siti Nurhasanah, M.Pd',
      jumlahGuru: 32,
      akreditasi: 'A (Unggul)',
    },
    {
      id: 'sek-2',
      nama: 'SMAN 1 Jaya Mandiri',
      npsn: '20211245',
      alamat: 'Jl. Pendidikan Raya No. 45, Jawa Barat',
      kepalaSekolah: 'Drs. H. Mulyadi, M.M',
      jumlahGuru: 48,
      akreditasi: 'A (Unggul)',
    },
    {
      id: 'sek-3',
      nama: 'SMA Bina Bangsa Sejahtera',
      npsn: '20239012',
      alamat: 'Jl. Merdeka Barat No. 88, Jawa Barat',
      kepalaSekolah: 'Endang Wahyuni, S.Pd, M.Si',
      jumlahGuru: 28,
      akreditasi: 'B (Baik)',
    },
  ],
  perencanaan: [
    {
      id: 'per-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'Modul Ajar',
      judul: 'Modul Ajar Matematika Fase E: SPLDV & Matriks Kontekstual',
      fileUrl: '#doc-spldv.pdf',
      fileName: 'Modul_Ajar_Matematika_Fase_E_Ahmad_Fauzi.pdf',
      status: 'Disetujui',
      catatanPengawas: 'Luar biasa, komponen diferensiasi proses dan lembar kerja peserta didik (LKPD) sudah sangat terstruktur.',
      tanggalUnggah: '2026-08-04',
      updatedAt: '2026-08-06',
    },
    {
      id: 'per-2',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'ATP',
      judul: 'Alur Tujuan Pembelajaran (ATP) Matematika Fase E Kelas 10',
      fileUrl: '#doc-atp-math.pdf',
      fileName: 'ATP_Matematika_Fase_E_2026.pdf',
      status: 'Disetujui',
      catatanPengawas: 'Urutan capaian pembelajaran per elemen sudah selaras dengan panduan BSKAP Kemendikbud.',
      tanggalUnggah: '2026-08-01',
      updatedAt: '2026-08-03',
    },
    {
      id: 'per-3',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'KKTP',
      judul: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Interval Nilai',
      fileUrl: '#doc-kktp-math.pdf',
      fileName: 'KKTP_Matematika_Kelas10.pdf',
      status: 'Disetujui',
      catatanPengawas: 'Kriteria deskripsi interval sudah realistis dan akuntabel.',
      tanggalUnggah: '2026-08-02',
      updatedAt: '2026-08-05',
    },
    {
      id: 'per-4',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'Modul Ajar',
      judul: 'Modul Ajar Biologi Fase F: Metabolisme Enzim dan Katabolisme',
      fileUrl: '#doc-bio-enzim.pdf',
      fileName: 'Modul_Ajar_Biologi_Dewi_Lestari.pdf',
      status: 'Disetujui',
      catatanPengawas: 'Sangat baik. Integrasikan rubrik asesmen formatif unjuk kerja laboratorium.',
      tanggalUnggah: '2026-08-10',
      updatedAt: '2026-08-12',
    },
    {
      id: 'per-5',
      guruId: 'usr-guru-3',
      guruNama: 'Bambang Prakoso, M.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'Modul Ajar',
      judul: 'Modul Ajar Fisika Fase F: Dinamika Rotasi & Kesetimbangan',
      fileUrl: '#doc-fisika.pdf',
      fileName: 'Modul_Ajar_Fisika_Fase_F.pdf',
      status: 'Revisi',
      catatanPengawas: 'Tolong lengkapi pertanyaan pemantik di bagian pendahuluan dan asesmen diagnostik non-kognitif awal.',
      tanggalUnggah: '2026-08-14',
      updatedAt: '2026-08-16',
    },
    {
      id: 'per-6',
      guruId: 'usr-guru-4',
      guruNama: 'Ratna Sari, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'CP',
      judul: 'Analisis Capaian Pembelajaran Bahasa Indonesia Elemen Menulis',
      fileUrl: '#doc-cp-bindo.pdf',
      fileName: 'Analisis_CP_B_Indo_Fase_E.pdf',
      status: 'Draft',
      catatanPengawas: 'Menunggu finalisasi telaah tim MGMP sekolah.',
      tanggalUnggah: '2026-08-18',
      updatedAt: '2026-08-18',
    },
  ],
  observasi: [
    {
      id: 'obs-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      guruNip: '19850210 201001 1 015',
      guruMapel: 'Matematika',
      sekolah: 'SMA Genesis Medicare',
      supervisorId: 'usr-admin',
      supervisorNama: 'H. Kusnandar, M.Si',
      tanggalObservasi: '2026-09-12',
      jamObservasi: '08:00 - 09:30 WIB',
      kelas: 'X-1 (Fase E)',
      fokusPerilaku: 'Penerapan Disiplin Positif & Pembelajaran Berdiferensiasi Konten/Proses',
      semester: '1',
      skorRubrik: {
        keteraturanSuasana: 4,
        ekspektasiPesertaDidik: 4,
        perhatianKepedulian: 3,
        instruksiAdaptif: 4,
        rataRata: 3.75,
      },
      catatanKualitatif: 'Guru menunjukkan penguasaan kelas yang sangat inspiratif. Kesepakatan kelas ditegakkan dengan pendekatan restoratif. Peserta didik aktif berdiskusi kelompok menyelesaikan masalah kontekstual biaya produksi UMKM.',
      fotoBuktiUrl: '/src/assets/images/classroom_supervision_hero_1790340344236.jpg',
      refleksiGuru: 'Saya merasa suasana diskusi kelompok jauh lebih hidup ketika studi kasus diambil dari masalah riil sekitar murid. Namun pada manajemen waktu presentasi akhir masih sedikit tergesa-gesa.',
      rencanaPerbaikanGuru: 'Akan membuat timer digital interaktif di layar proyektor untuk membatasi durasi perwakilan kelompok agar sesi kesimpulan lebih komprehensif.',
      status: 'Selesai Refleksi',
    },
    {
      id: 'obs-2',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      guruNip: '19910624 201603 2 008',
      guruMapel: 'Biologi',
      sekolah: 'SMA Genesis Medicare',
      supervisorId: 'usr-admin',
      supervisorNama: 'H. Kusnandar, M.Si',
      tanggalObservasi: '2026-09-16',
      jamObservasi: '10:00 - 11:30 WIB',
      kelas: 'XI-2 (Fase F)',
      fokusPerilaku: 'Instruksi yang Adaptif & Umpan Balik Konstruktif',
      semester: '1',
      skorRubrik: {
        keteraturanSuasana: 4,
        ekspektasiPesertaDidik: 3,
        perhatianKepedulian: 4,
        instruksiAdaptif: 3,
        rataRata: 3.50,
      },
      catatanKualitatif: 'Praktikum uji enzim katalase berlangsung aman dan teratur. Guru responsif mendatangi kelompok siswa yang mengalami kendala teknis pencatatan tabung reaksi.',
      fotoBuktiUrl: '/src/assets/images/classroom_supervision_hero_1790340344236.jpg',
      refleksiGuru: 'Siswa sangat bersemangat saat pengamatan langsung busa oksigen enzim, namun pembagian tugas dalam kelompok masih didominasi 2 orang per meja.',
      rencanaPerbaikanGuru: 'Menerapkan role-card (Ketua, Notulis, Operator, Presenter) di setiap praktikum agar keterlibatan murid 100% merata.',
      status: 'Selesai Refleksi',
    },
    {
      id: 'obs-3',
      guruId: 'usr-guru-3',
      guruNama: 'Bambang Prakoso, M.Pd',
      guruNip: '19821105 200801 1 009',
      guruMapel: 'Fisika',
      sekolah: 'SMA Genesis Medicare',
      supervisorId: 'usr-kepsek',
      supervisorNama: 'Dr. Hj. Siti Nurhasanah, M.Pd',
      tanggalObservasi: '2026-09-28',
      jamObservasi: '07:30 - 09:00 WIB',
      kelas: 'XI-1 (Fase F)',
      fokusPerilaku: 'Pemanfaatan Media Pembelajaran Interaktif PhET Simulation',
      semester: '1',
      skorRubrik: {
        keteraturanSuasana: 3,
        ekspektasiPesertaDidik: 3,
        perhatianKepedulian: 3,
        instruksiAdaptif: 3,
        rataRata: 3.00,
      },
      catatanKualitatif: 'Jadwal pra-observasi telah disepakati. Modul ajar sedang dalam perbaikan sebelum jadwal observasi kelas berlangsung.',
      fotoBuktiUrl: '',
      refleksiGuru: '',
      rencanaPerbaikanGuru: '',
      status: 'Terjadwal',
    },
  ],
  tindakLanjut: [
    {
      id: 'tl-1',
      observasiId: 'obs-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      rekomendasi: 'Mengembangkan instrumen asesmen formatif berbasis aplikasi digital interaktif dan membagikan praktik baik di MGMP Matematika SMA Kota.',
      bentukKegiatan: 'MGMP',
      targetSelesai: '2026-10-30',
      status: 'Dalam Proses',
      catatanPerkembangan: 'Sudah memaparkan draf LKPD diferensiasi pada pertemuan MGMP minggu lalu.',
    },
    {
      id: 'tl-2',
      observasiId: 'obs-2',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      rekomendasi: 'Menyelesaikan modul pelatihan mandiri di Platform Merdeka Mengajar (PMM) topik Diferensiasi Pembelajaran dalam IPA.',
      bentukKegiatan: 'PMM',
      targetSelesai: '2026-11-15',
      status: 'Dalam Proses',
      catatanPerkembangan: 'Aksi nyata telah diunggah dan sedang dalam proses validasi kurator PMM.',
    },
  ],
  portofolio: [
    {
      id: 'port-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      kategori: 'Sertifikat',
      judul: 'Sertifikat Pelatihan Nasional Pembelajaran Berdiferensiasi PMM (32 JP)',
      deskripsi: 'Kelulusan topik Pembelajaran Berdiferensiasi dengan predikat Sangat Baik dari Kemendikbudristek.',
      fileUrl: '#sertifikat-pmm.pdf',
      fileName: 'Sertifikat_PMM_Ahmad_Fauzi.pdf',
      tanggalUnggah: '2026-07-28',
      tahunAjaran: '2026/2027',
    },
    {
      id: 'port-2',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      kategori: 'KaryaSiswa',
      judul: 'Kompilasi Infografis Proyek Matematika Terapan: Analisis Anggaran Rumah Tangga',
      deskripsi: 'Hasil karya peserta didik kelas X-1 dalam menganalisis data keuangan menggunakan sistem persamaan linear.',
      fileUrl: '#karya-siswa-x1.pdf',
      fileName: 'Infografis_Karya_Siswa_X1.pdf',
      tanggalUnggah: '2026-09-14',
      tahunAjaran: '2026/2027',
    },
    {
      id: 'port-3',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      kategori: 'PTK',
      judul: 'Laporan PTK: Peningkatan Berpikir Kritis Siswa melalui Model PBL Berbantuan Geogebra',
      deskripsi: 'Laporan Penelitian Tindakan Kelas siklus 1 dan 2 yang dipresentasikan pada seminar ilmiah guru.',
      fileUrl: '#ptk-geogebra.pdf',
      fileName: 'Laporan_PTK_Matematika_2026.pdf',
      tanggalUnggah: '2026-08-30',
      tahunAjaran: '2026/2027',
    },
    {
      id: 'port-4',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      kategori: 'P5',
      judul: 'Modul & Dokumentasi P5: Rekayasa dan Teknologi Filter Air Sederhana',
      deskripsi: 'Fasilitasi projek penguatan profil pelajar Pancasila tema Rekayasa Teknologi ramah lingkungan.',
      fileUrl: '#p5-filter-air.pdf',
      fileName: 'Dokumentasi_P5_Filter_Air.pdf',
      tanggalUnggah: '2026-09-02',
      tahunAjaran: '2026/2027',
    },
    {
      id: 'port-5',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      sekolah: 'SMA Genesis Medicare',
      kategori: 'Sertifikat',
      judul: 'Sertifikat Bimbingan Teknis Laboratorium Biologi SMA Tingkat Provinsi',
      deskripsi: 'Pelatihan keselamatan kerja dan optimalisasi alat mikroskop digital di laboratorium sekolah.',
      fileUrl: '#sertif-bimtek-lab.pdf',
      fileName: 'Sertifikat_Bimtek_Lab_Bio.pdf',
      tanggalUnggah: '2026-08-05',
      tahunAjaran: '2026/2027',
    },
  ],
};

// ================= API ENDPOINTS ================= //

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Find user by username
  const user = state.users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );

  const isValidPassword =
    user &&
    (user.password === password ||
      (user.username.toLowerCase() === 'admin' && (password === 'pakhaji' || password === 'bajuri39')));

  if (!user || !isValidPassword) {
    return res.status(401).json({ success: false, message: 'Username atau password salah! (Password admin: pakhaji)' });
  }

  // Return user without password
  const { password: _, ...userSafe } = user;
  return res.json({
    success: true,
    user: userSafe,
    settings: state.settings,
  });
});

// App Settings endpoints
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: state.settings });
});

app.put('/api/settings', (req, res) => {
  const { institutionName, pengawasPembina, tahunAjaranAktif, semesterAktif } = req.body;
  if (institutionName) state.settings.institutionName = institutionName;
  if (pengawasPembina) state.settings.pengawasPembina = pengawasPembina;
  if (tahunAjaranAktif) state.settings.tahunAjaranAktif = tahunAjaranAktif;
  if (semesterAktif) state.settings.semesterAktif = semesterAktif;
  res.json({ success: true, settings: state.settings });
});

// Users management
app.get('/api/users', (req, res) => {
  const safeUsers = state.users.map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeUsers });
});

app.post('/api/users', (req, res) => {
  const { nama, nip, role, sekolah, mapel, username, password, kontak } = req.body;
  if (!nama || !username || !role) {
    return res.status(400).json({ success: false, message: 'Nama, username, dan peran wajib diisi.' });
  }

  if (state.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    nama,
    nip: nip || '-',
    role,
    sekolah: sekolah || state.settings.institutionName,
    mapel: mapel || '-',
    username,
    password: password || 'bajuri39',
    avatar: '',
    kontak: kontak || '-',
  };

  state.users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json({ success: true, user: safe });
});

// Sekolah Binaan
app.get('/api/sekolah', (req, res) => {
  res.json({ success: true, sekolahBinaan: state.sekolahBinaan });
});

// Perencanaan Pembelajaran
app.get('/api/perencanaan', (req, res) => {
  const { guruId } = req.query;
  if (guruId) {
    const filtered = state.perencanaan.filter((p) => p.guruId === guruId);
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: state.perencanaan });
});

app.post('/api/perencanaan', (req, res) => {
  const { guruId, jenisDokumen, judul, fileName, fileUrl } = req.body;
  const guru = state.users.find((u) => u.id === guruId);

  const newDoc = {
    id: `per-${Date.now()}`,
    guruId: guruId || 'usr-guru-1',
    guruNama: guru ? guru.nama : 'Guru Pendidik',
    sekolah: guru ? guru.sekolah : state.settings.institutionName,
    tahunAjaran: state.settings.tahunAjaranAktif,
    jenisDokumen: jenisDokumen || 'Modul Ajar',
    judul: judul || `Dokumen ${jenisDokumen}`,
    fileName: fileName || `${jenisDokumen}_${Date.now()}.pdf`,
    fileUrl: fileUrl || '#',
    status: 'Draft',
    catatanPengawas: 'Dokumen baru diunggah, menunggu telaah pengawas/kepala sekolah.',
    tanggalUnggah: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  state.perencanaan.unshift(newDoc);
  res.status(201).json({ success: true, data: newDoc });
});

app.put('/api/perencanaan/:id/review', (req, res) => {
  const { id } = req.params;
  const { status, catatanPengawas } = req.body;

  const doc = state.perencanaan.find((p) => p.id === id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });
  }

  if (status) doc.status = status;
  if (catatanPengawas !== undefined) doc.catatanPengawas = catatanPengawas;
  doc.updatedAt = new Date().toISOString().split('T')[0];

  res.json({ success: true, data: doc });
});

// Observasi Kelas
app.get('/api/observasi', (req, res) => {
  const { guruId } = req.query;
  if (guruId) {
    const filtered = state.observasi.filter((o) => o.guruId === guruId);
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: state.observasi });
});

app.post('/api/observasi', (req, res) => {
  const {
    guruId,
    supervisorId,
    tanggalObservasi,
    jamObservasi,
    kelas,
    fokusPerilaku,
    semester,
    skorRubrik,
    catatanKualitatif,
    fotoBuktiUrl,
  } = req.body;

  const guru = state.users.find((u) => u.id === guruId);
  const supervisor = state.users.find((u) => u.id === supervisorId);

  const scores = skorRubrik || {
    keteraturanSuasana: 3,
    ekspektasiPesertaDidik: 3,
    perhatianKepedulian: 3,
    instruksiAdaptif: 3,
  };
  const rataRata = Number(
    (
      (Number(scores.keteraturanSuasana) +
        Number(scores.ekspektasiPesertaDidik) +
        Number(scores.perhatianKepedulian) +
        Number(scores.instruksiAdaptif)) /
      4
    ).toFixed(2)
  );

  const newObs = {
    id: `obs-${Date.now()}`,
    guruId: guruId || 'usr-guru-1',
    guruNama: guru ? guru.nama : 'Guru Pendidik',
    guruNip: guru ? guru.nip : '-',
    guruMapel: guru ? guru.mapel : '-',
    sekolah: guru ? guru.sekolah : state.settings.institutionName,
    supervisorId: supervisorId || 'usr-admin',
    supervisorNama: supervisor ? supervisor.nama : 'H. Kusnandar, M.Si',
    tanggalObservasi: tanggalObservasi || new Date().toISOString().split('T')[0],
    jamObservasi: jamObservasi || '08:00 - 09:30 WIB',
    kelas: kelas || 'X-1',
    fokusPerilaku: fokusPerilaku || 'Keteraturan Suasana Kelas & Disiplin Positif',
    semester: semester || '1',
    skorRubrik: {
      keteraturanSuasana: Number(scores.keteraturanSuasana),
      ekspektasiPesertaDidik: Number(scores.ekspektasiPesertaDidik),
      perhatianKepedulian: Number(scores.perhatianKepedulian),
      instruksiAdaptif: Number(scores.instruksiAdaptif),
      rataRata,
    },
    catatanKualitatif: catatanKualitatif || 'Observasi telah dilaksanakan sesuai instrumen rubrik.',
    fotoBuktiUrl: fotoBuktiUrl || '',
    refleksiGuru: '',
    rencanaPerbaikanGuru: '',
    status: 'Selesai Observasi',
  };

  state.observasi.unshift(newObs);
  res.status(201).json({ success: true, data: newObs });
});

app.put('/api/observasi/:id/refleksi', (req, res) => {
  const { id } = req.params;
  const { refleksiGuru, rencanaPerbaikanGuru } = req.body;

  const obs = state.observasi.find((o) => o.id === id);
  if (!obs) {
    return res.status(404).json({ success: false, message: 'Data observasi tidak ditemukan.' });
  }

  obs.refleksiGuru = refleksiGuru || obs.refleksiGuru;
  obs.rencanaPerbaikanGuru = rencanaPerbaikanGuru || obs.rencanaPerbaikanGuru;
  obs.status = 'Selesai Refleksi';

  res.json({ success: true, data: obs });
});

// Tindak Lanjut
app.get('/api/tindak-lanjut', (req, res) => {
  const { guruId } = req.query;
  if (guruId) {
    const filtered = state.tindakLanjut.filter((t) => t.guruId === guruId);
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: state.tindakLanjut });
});

app.post('/api/tindak-lanjut', (req, res) => {
  const { observasiId, guruId, rekomendasi, bentukKegiatan, targetSelesai } = req.body;
  const guru = state.users.find((u) => u.id === guruId);

  const newTL = {
    id: `tl-${Date.now()}`,
    observasiId: observasiId || `obs-${Date.now()}`,
    guruId: guruId || 'usr-guru-1',
    guruNama: guru ? guru.nama : 'Guru Pendidik',
    sekolah: guru ? guru.sekolah : state.settings.institutionName,
    rekomendasi: rekomendasi || 'Tingkatkan diferensiasi konten pembelajaran.',
    bentukKegiatan: bentukKegiatan || 'PMM',
    targetSelesai: targetSelesai || '2026-11-30',
    status: 'Dalam Proses',
    catatanPerkembangan: 'Target rencana tindak lanjut telah disepakati.',
  };

  state.tindakLanjut.unshift(newTL);
  res.status(201).json({ success: true, data: newTL });
});

app.put('/api/tindak-lanjut/:id', (req, res) => {
  const { id } = req.params;
  const { status, catatanPerkembangan, rekomendasi, bentukKegiatan, targetSelesai } = req.body;

  const tl = state.tindakLanjut.find((t) => t.id === id);
  if (!tl) {
    return res.status(404).json({ success: false, message: 'Data tindak lanjut tidak ditemukan.' });
  }

  if (status) tl.status = status;
  if (catatanPerkembangan) tl.catatanPerkembangan = catatanPerkembangan;
  if (rekomendasi) tl.rekomendasi = rekomendasi;
  if (bentukKegiatan) tl.bentukKegiatan = bentukKegiatan;
  if (targetSelesai) tl.targetSelesai = targetSelesai;

  res.json({ success: true, data: tl });
});

// Portofolio Guru
app.get('/api/portofolio', (req, res) => {
  const { guruId } = req.query;
  if (guruId) {
    const filtered = state.portofolio.filter((p) => p.guruId === guruId);
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: state.portofolio });
});

app.post('/api/portofolio', (req, res) => {
  const { guruId, kategori, judul, deskripsi, fileUrl, fileName } = req.body;
  const guru = state.users.find((u) => u.id === guruId);

  const newPort = {
    id: `port-${Date.now()}`,
    guruId: guruId || 'usr-guru-1',
    guruNama: guru ? guru.nama : 'Guru Pendidik',
    sekolah: guru ? guru.sekolah : state.settings.institutionName,
    kategori: kategori || 'Sertifikat',
    judul: judul || 'Portofolio Baru',
    deskripsi: deskripsi || '-',
    fileUrl: fileUrl || '#',
    fileName: fileName || `${kategori}_${Date.now()}.pdf`,
    tanggalUnggah: new Date().toISOString().split('T')[0],
    tahunAjaran: state.settings.tahunAjaranAktif,
  };

  state.portofolio.unshift(newPort);
  res.status(201).json({ success: true, data: newPort });
});

app.delete('/api/portofolio/:id', (req, res) => {
  const { id } = req.params;
  const index = state.portofolio.findIndex((p) => p.id === id);
  if (index !== -1) {
    state.portofolio.splice(index, 1);
    return res.json({ success: true, message: 'Portofolio berhasil dihapus.' });
  }
  res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan.' });
});

// Rekapitulasi Global untuk Pengawas
app.get('/api/reports/rekap', (req, res) => {
  const totalGuru = state.users.filter((u) => u.role === 'guru').length;
  const totalPerencanaan = state.perencanaan.length;
  const perencanaanDisetujui = state.perencanaan.filter((p) => p.status === 'Disetujui').length;
  const totalObservasi = state.observasi.length;
  const observasiSelesai = state.observasi.filter((o) => o.status !== 'Terjadwal').length;
  
  // Hitung rata-rata skor per aspek
  let sumSuasana = 0;
  let sumEkspektasi = 0;
  let sumPerhatian = 0;
  let sumInstruksi = 0;
  let countObs = 0;

  state.observasi.forEach((o) => {
    if (o.skorRubrik && o.skorRubrik.rataRata > 0) {
      sumSuasana += o.skorRubrik.keteraturanSuasana;
      sumEkspektasi += o.skorRubrik.ekspektasiPesertaDidik;
      sumPerhatian += o.skorRubrik.perhatianKepedulian;
      sumInstruksi += o.skorRubrik.instruksiAdaptif;
      countObs++;
    }
  });

  const rekap = {
    institutionName: state.settings.institutionName,
    tahunAjaran: state.settings.tahunAjaranAktif,
    semester: state.settings.semesterAktif,
    pengawasPembina: state.settings.pengawasPembina,
    totalGuru,
    totalSekolahBinaan: state.sekolahBinaan.length,
    perencanaan: {
      total: totalPerencanaan,
      disetujui: perencanaanDisetujui,
      revisi: state.perencanaan.filter((p) => p.status === 'Revisi').length,
      draft: state.perencanaan.filter((p) => p.status === 'Draft').length,
      persentaseDisetujui: totalPerencanaan > 0 ? Math.round((perencanaanDisetujui / totalPerencanaan) * 100) : 0,
    },
    observasi: {
      total: totalObservasi,
      selesai: observasiSelesai,
      terjadwal: state.observasi.filter((o) => o.status === 'Terjadwal').length,
      persentaseKeterlaksanaan: totalGuru > 0 ? Math.min(100, Math.round((observasiSelesai / totalGuru) * 100)) : 0,
      aspekRataRata: {
        keteraturanSuasana: countObs > 0 ? Number((sumSuasana / countObs).toFixed(2)) : 0,
        ekspektasiPesertaDidik: countObs > 0 ? Number((sumEkspektasi / countObs).toFixed(2)) : 0,
        perhatianKepedulian: countObs > 0 ? Number((sumPerhatian / countObs).toFixed(2)) : 0,
        instruksiAdaptif: countObs > 0 ? Number((sumInstruksi / countObs).toFixed(2)) : 0,
        skorGlobal: countObs > 0 ? Number(((sumSuasana + sumEkspektasi + sumPerhatian + sumInstruksi) / (countObs * 4)).toFixed(2)) : 0,
      },
    },
    tindakLanjut: {
      total: state.tindakLanjut.length,
      selesai: state.tindakLanjut.filter((t) => t.status === 'Selesai').length,
      dalamProses: state.tindakLanjut.filter((t) => t.status === 'Dalam Proses').length,
    },
    portofolio: {
      total: state.portofolio.length,
    },
  };

  res.json({ success: true, rekap });
});

// Kurikulum Merdeka Material Generator API (Aligned with system specification)
app.post('/api/materials/generate', (req, res) => {
  const { jenjang, kelas, mapel, topik } = req.body;

  if (!jenjang || !kelas || !mapel || !topik) {
    return res.status(400).json({
      success: false,
      message: 'Jenjang, Kelas, Mata Pelajaran, dan Topik wajib diisi.',
    });
  }

  const institution = state.settings.institutionName || 'SMA Genesis Medicare';

  // Generate pedagogical content according to the requested strict structure
  const markdownOutput = `---
${institution}
MODUL MATERI PEMBELAJARAN
---
- Jenjang/Kelas: ${jenjang} - Kelas ${kelas}
- Mata Pelajaran: ${mapel}
- Topik/Materi: ${topik}

## A. Capaian Pembelajaran & Tujuan Pembelajaran
**Capaian Pembelajaran (Fase Berdasarkan Kurikulum Merdeka):**
Peserta didik mampu memahami, menganalisis, dan mengaplikasikan konsep esensial pada materi **${topik}** dalam memecahkan permasalahan kontekstual kehidupan sehari-hari, serta menunjukkan profil Pelajar Pancasila yang bernalar kritis, mandiri, dan bergotong royong.

**Tujuan Pembelajaran:**
1. Peserta didik dapat mendefinisikan dan menjelaskan konsep dasar ${topik} dengan bahasa sendiri secara tepat.
2. Peserta didik dapat mengidentifikasi keterkaitan prinsip ${topik} dengan fenomena konkret di lingkungan sekitar.
3. Peserta didik mampu menyelesaikan persoalan bertingkat (LOTS hingga HOTS) terkait ${topik} secara sistematis dan kolaboratif.

## B. Ringkasan Materi Utama

### 1. Landasan Konseptual & Definisi Esensial
Materi **${topik}** memegang peranan krusial dalam struktur keilmuan ${mapel}. Pemahaman yang mendalam dimulai dari pengenalan prinsip-prinsip fundamental, struktur analisis, serta mekanisme operasional yang mendasari setiap gejala atau prosedur perhitungan.

### 2. Poin-Poin Kunci dan Karakteristik
- **Prinsip Utama**: Memadukan pemahaman konseptual dengan keterampilan prosedural yang terukur.
- **Diferensiasi Konteks**: Mengaitkan teori dengan studi kasus riil (industri, sains, sosial budaya, dan teknologi).
- **Struktur Logika**: Setiap langkah pemecahan masalah harus didasarkan pada penalaran deduktif dan induktif yang valid.

### 3. Matriks Komparasi dan Karakteristik
| Aspek Analisis | Tingkat Dasar (Fondasi) | Tingkat Lanjut (Aplikasi HOTS) |
| :--- | :--- | :--- |
| **Fokus Pemahaman** | Pemahaman konsep, rumus dasar, dan istilah teknis | Sintesis konsep multi-variabel dan pemecahan kasus kompleks |
| **Metode Pendekatan** | Prosedur bertahap dengan bimbingan (guided discovery) | Penyelidikan mandiri (inquiry) & perancangan solusi alternatif |
| **Indikator Keberhasilan** | Mampu menjawab pertanyaan faktual dan prosedural | Mampu mengevaluasi kelemahan argumen dan memvalidasi hasil |

## C. Contoh Soal dan Pembahasan

### Contoh Soal 1 (Tingkat Pemahaman - Pemecahan Bertahap)
**Soal:**
Jelaskan prinsip dasar dari ${topik} dalam konteks ${mapel} dan tentukan langkah awal yang harus dilakukan jika ditemukan kasus anomali pada penerapan konsep tersebut!

**Langkah Pembahasan:**
1. **Identifikasi Data & Informasi Awal**: Tuliskan semua parameter atau kondisi yang diketahui dari permasalahan.
2. **Kajian Formula/Prinsip Relevan**: Gunakan kaidah utama ${topik} untuk menganalisis relasi antar elemen.
3. **Simpulan Solusi**: Berdasarkan analisis, langkah penyesuaian dilakukan secara sistematis sehingga kondisi stabil dan optimal tercapai.

---

### Contoh Soal 2 (Tingkat Penerapan Kontekstual)
**Soal:**
Dalam kehidupan sehari-hari pada lingkungan sekolah/masyarakat, bagaimana konsep ${topik} dimanfaatkan untuk meningkatkan efisiensi dan akurasi pengambilan keputusan? Berikan ilustrasi kasus nyata!

**Langkah Pembahasan:**
1. **Analisis Situasi Nyata**: Peserta didik mengamati parameter masalah lapangan yang membutuhkan kalkulasi atau telaah kritis.
2. **Implementasi Prinsip ${topik}**: Terapkan model berpikir saintifik/matematis untuk memetakan alternatif tindakan.
3. **Hasil & Rekomendasi**: Diperoleh solusi paling efisien dengan risiko paling minimal serta dapat diuji kembali secara objektif.

---

### Contoh Soal 3 (Tingkat Penalaran Kritis / HOTS)
**Soal:**
Analisis dampak jika salah satu variabel pendukung dalam ${topik} mengalami deviasi sebesar 25%. Bagaimana strategi korektif yang paling efektif menurut kaidah ilmiah terkini?

**Langkah Pembahasan:**
1. **Simulasi Sensitivitas**: Menguji sensitivitas model terhadap perubahan parameter 25%.
2. **Korelasi Antar Elemen**: Perubahan variabel ini memicu efek domino pada output akhir.
3. **Solusi Perbaikan**: Merekayasa ulang parameter pengontrol untuk menyeimbangkan kembali sistem ke taraf toleransi standar.

## D. Latihan Mandiri (Asesmen)

### Bagian 1: Pilihan Ganda (5 Butir Soal)
1. Manakah pernyataan berikut yang paling tepat menggambarkan karakteristik fundamental dari **${topik}**?
   - A. Bersifat statis dan tidak dipengaruhi oleh perubahan lingkungan belajar
   - B. Merupakan keterpaduan antara konsep teoritis dan aplikasi praktis kontekstual
   - C. Hanya dapat diuji pada kondisi ideal tanpa memperhatikan variabel nyata
   - D. Mengabaikan prinsip deduktif dalam penarikan kesimpulan akhir
   - *Kunci: B*

2. Pada fase eksplorasi materi **${topik}**, fungsi utama dari asesmen diagnostik adalah...
   - A. Menentukan nilai akhir rapor peserta didik
   - B. Memberikan sanksi akademik bagi siswa yang lambat belajar
   - C. Memetakan kesiapan belajar, minat, dan profil belajar murid
   - D. Mengganti seluruh materi yang ada dalam kurikulum
   - *Kunci: C*

3. Faktor penentu keberhasilan implementasi konsep **${topik}** pada tingkat lanjut adalah...
   - A. Menghafal seluruh istilah tanpa memahami relasi antar komponen
   - B. Kemampuan bernalar kritis dan melakukan sintesis pemecahan masalah
   - C. Menghindari diskusi kelompok dan bekerja secara terisolasi
   - D. Mengurangi frekuensi latihan soal analitis
   - *Kunci: B*

4. Perhatikan fenomena perubahan pada materi **${topik}**. Langkah verifikasi yang paling objektif adalah...
   - A. Mengandalkan asumsi intuitif tanpa pengujian empiris
   - B. Membandingkan data hasil observasi dengan standar referensi ilmiah
   - C. Memilih data yang hanya mendukung dugaan awal saja
   - D. Menunda analisis hingga seluruh periode semester berakhir
   - *Kunci: B*

5. Tujuan dari perumusan kesimpulan pada akhir pembelajaran materi **${topik}** adalah...
   - A. Menutup kesempatan refleksi mandiri bagi siswa
   - B. Menyajikan rangkuman esensial dan mengukur ketercapaian tujuan belajar
   - C. Menghapus materi prasyarat yang telah dipelajari sebelumnya
   - D. Menyamaratakan seluruh gaya belajar tanpa variasi metode
   - *Kunci: B*

### Bagian 2: Soal Esai Reflektif (3 Butir Soal)
1. **Uraian Konsep**: Jelaskan mengapa pemahaman mengenai **${topik}** sangat esensial dalam pembelajaran ${mapel} kelas ${kelas}! Tuliskan dengan menyertakan minimal dua argumen logis.
2. **Analisis Studi Kasus**: Rancanglah sebuah alur penyelesaian masalah sederhana jika Anda dihadapkan pada situasi di mana teori **${topik}** bertolak belakang dengan hasil pengamatan awal di lapangan.
3. **Refleksi Profil Pelajar Pancasila**: Tuliskan bagaimana aktivitas mempelajari materi **${topik}** ini dapat menumbuhkan dimensi *Bernalar Kritis* dan *Kemandirian* dalam diri Anda!

---
@Copyright by. Pak GuruAI`;

  res.json({
    success: true,
    material: {
      institution,
      jenjang,
      kelas,
      mapel,
      topik,
      markdown: markdownOutput,
      generatedAt: new Date().toISOString(),
    },
  });
});

// Setup Vite Middlewares in development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[DiPandu Server] Berjalan pada http://localhost:${PORT}`);
  });
}

startServer();
