import {
  User,
  Perencanaan,
  Observasi,
  TindakLanjut,
  Portofolio,
  SekolahBinaan,
  AppSettings,
  MaterialGenerationRequest,
} from '../types';

const BASE_URL = '/api';

// Fallback seed state for static deployments (e.g. Vercel static hosting)
const fallbackSeed: {
  settings: AppSettings;
  users: User[];
  sekolahBinaan: SekolahBinaan[];
  perencanaan: Perencanaan[];
  observasi: Observasi[];
  tindakLanjut: TindakLanjut[];
  portofolio: Portofolio[];
} = {
  settings: {
    institutionName: 'Sekolah Binaan H. Kusnandar, M.Si',
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
      role: 'pengawas' as const,
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
      role: 'kepala_sekolah' as const,
      sekolah: 'SMA Binaan Mandiri Sejahtera',
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
      role: 'guru' as const,
      sekolah: 'SMA Binaan Mandiri Sejahtera',
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
      role: 'guru' as const,
      sekolah: 'SMAN 1 Jaya Mandiri',
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
      role: 'guru' as const,
      sekolah: 'SMA Bina Bangsa Nusantara',
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
      role: 'guru' as const,
      sekolah: 'SMA Harapan Cendekia',
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
      nama: 'SMA Binaan Mandiri Sejahtera',
      npsn: '20271890',
      alamat: 'Jl. Pemuda Pendidikan No. 12, Kota Depok, Jawa Barat',
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
      nama: 'SMA Bina Bangsa Nusantara',
      npsn: '20239012',
      alamat: 'Jl. Merdeka Barat No. 88, Jawa Barat',
      kepalaSekolah: 'Endang Wahyuni, S.Pd, M.Si',
      jumlahGuru: 28,
      akreditasi: 'B (Baik)',
    },
    {
      id: 'sek-4',
      nama: 'SMA Harapan Cendekia',
      npsn: '20256789',
      alamat: 'Jl. Surya Kencana No. 19, Jawa Barat',
      kepalaSekolah: 'H. Rusli Effendi, M.Pd',
      jumlahGuru: 24,
      akreditasi: 'A (Unggul)',
    },
  ],
  perencanaan: [
    {
      id: 'per-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'Modul Ajar' as const,
      judul: 'Modul Ajar Matematika Fase E: SPLDV & Matriks Kontekstual',
      fileUrl: '#doc-spldv.pdf',
      fileName: 'Modul_Ajar_Matematika_Fase_E_Ahmad_Fauzi.pdf',
      status: 'Disetujui' as const,
      catatanPengawas: 'Luar biasa, komponen diferensiasi proses dan lembar kerja peserta didik (LKPD) sudah sangat terstruktur.',
      tanggalUnggah: '2026-08-04',
      updatedAt: '2026-08-06',
    },
    {
      id: 'per-2',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'ATP' as const,
      judul: 'Alur Tujuan Pembelajaran (ATP) Matematika Fase E Kelas 10',
      fileUrl: '#doc-atp-math.pdf',
      fileName: 'ATP_Matematika_Fase_E_2026.pdf',
      status: 'Disetujui' as const,
      catatanPengawas: 'Urutan capaian pembelajaran per elemen sudah selaras dengan panduan BSKAP Kemendikbud.',
      tanggalUnggah: '2026-08-01',
      updatedAt: '2026-08-03',
    },
    {
      id: 'per-3',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'KKTP' as const,
      judul: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Interval Nilai',
      fileUrl: '#doc-kktp-math.pdf',
      fileName: 'KKTP_Matematika_Kelas10.pdf',
      status: 'Disetujui' as const,
      catatanPengawas: 'Kriteria deskripsi interval sudah realistis dan akuntabel.',
      tanggalUnggah: '2026-08-02',
      updatedAt: '2026-08-05',
    },
    {
      id: 'per-4',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      sekolah: 'SMAN 1 Jaya Mandiri',
      tahunAjaran: '2026/2027',
      jenisDokumen: 'Modul Ajar' as const,
      judul: 'Modul Ajar Biologi Fase F: Metabolisme Enzim dan Katabolisme',
      fileUrl: '#doc-bio-enzim.pdf',
      fileName: 'Modul_Ajar_Biologi_Dewi_Lestari.pdf',
      status: 'Disetujui' as const,
      catatanPengawas: 'Sangat baik. Integrasikan rubrik asesmen formatif unjuk kerja laboratorium.',
      tanggalUnggah: '2026-08-10',
      updatedAt: '2026-08-12',
    },
  ],
  observasi: [
    {
      id: 'obs-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      guruNip: '19850210 201001 1 015',
      guruMapel: 'Matematika',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      supervisorId: 'usr-admin',
      supervisorNama: 'H. Kusnandar, M.Si',
      tanggalObservasi: '2026-09-12',
      jamObservasi: '08:00 - 09:30 WIB',
      kelas: 'X-1 (Fase E)',
      fokusPerilaku: 'Penerapan Disiplin Positif & Pembelajaran Berdiferensiasi Konten/Proses',
      semester: '1' as const,
      skorRubrik: {
        keteraturanSuasana: 4,
        ekspektasiPesertaDidik: 4,
        perhatianKepedulian: 3,
        instruksiAdaptif: 4,
        rataRata: 3.75,
      },
      catatanKualitatif: 'Guru menunjukkan penguasaan kelas yang sangat inspiratif. Kesepakatan kelas ditegakkan dengan pendekatan restoratif. Peserta didik aktif berdiskusi kelompok.',
      fotoBuktiUrl: '/src/assets/images/classroom_supervision_hero_1790340344236.jpg',
      refleksiGuru: 'Saya merasa suasana diskusi kelompok jauh lebih hidup ketika studi kasus diambil dari masalah riil sekitar murid.',
      rencanaPerbaikanGuru: 'Akan membuat timer digital interaktif di layar proyektor untuk membatasi durasi perwakilan kelompok.',
      status: 'Selesai Refleksi' as const,
    },
    {
      id: 'obs-2',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      guruNip: '19910624 201603 2 008',
      guruMapel: 'Biologi',
      sekolah: 'SMAN 1 Jaya Mandiri',
      supervisorId: 'usr-admin',
      supervisorNama: 'H. Kusnandar, M.Si',
      tanggalObservasi: '2026-09-16',
      jamObservasi: '10:00 - 11:30 WIB',
      kelas: 'XI-2 (Fase F)',
      fokusPerilaku: 'Instruksi yang Adaptif & Umpan Balik Konstruktif',
      semester: '1' as const,
      skorRubrik: {
        keteraturanSuasana: 4,
        ekspektasiPesertaDidik: 3,
        perhatianKepedulian: 4,
        instruksiAdaptif: 3,
        rataRata: 3.50,
      },
      catatanKualitatif: 'Praktikum uji enzim katalase berlangsung aman dan teratur. Guru responsif mendatangi kelompok siswa.',
      fotoBuktiUrl: '/src/assets/images/classroom_supervision_hero_1790340344236.jpg',
      refleksiGuru: 'Siswa sangat bersemangat saat pengamatan langsung busa oksigen enzim.',
      rencanaPerbaikanGuru: 'Menerapkan role-card di setiap praktikum agar keterlibatan murid merata.',
      status: 'Selesai Refleksi' as const,
    },
  ],
  tindakLanjut: [
    {
      id: 'tl-1',
      observasiId: 'obs-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      rekomendasi: 'Mengembangkan instrumen asesmen formatif berbasis aplikasi digital interaktif dan membagikan praktik baik di MGMP Matematika SMA Kota.',
      bentukKegiatan: 'MGMP' as const,
      targetSelesai: '2026-10-30',
      status: 'Dalam Proses' as const,
      catatanPerkembangan: 'Sudah memaparkan draf LKPD diferensiasi pada pertemuan MGMP minggu lalu.',
    },
    {
      id: 'tl-2',
      observasiId: 'obs-2',
      guruId: 'usr-guru-2',
      guruNama: 'Dewi Lestari, S.Pd',
      sekolah: 'SMAN 1 Jaya Mandiri',
      rekomendasi: 'Menyelesaikan modul pelatihan mandiri di Platform Merdeka Mengajar (PMM) topik Diferensiasi Pembelajaran dalam IPA.',
      bentukKegiatan: 'PMM' as const,
      targetSelesai: '2026-11-15',
      status: 'Dalam Proses' as const,
      catatanPerkembangan: 'Aksi nyata telah diunggah dan sedang dalam proses validasi kurator PMM.',
    },
  ],
  portofolio: [
    {
      id: 'port-1',
      guruId: 'usr-guru-1',
      guruNama: 'Ahmad Fauzi, S.Pd',
      sekolah: 'SMA Binaan Mandiri Sejahtera',
      kategori: 'Sertifikat' as const,
      judul: 'Sertifikat Pelatihan Nasional Pembelajaran Berdiferensiasi PMM (32 JP)',
      deskripsi: 'Kelulusan topik Pembelajaran Berdiferensiasi dengan predikat Sangat Baik dari Kemendikbudristek.',
      fileUrl: '#sertifikat-pmm.pdf',
      fileName: 'Sertifikat_PMM_Ahmad_Fauzi.pdf',
      tanggalUnggah: '2026-07-28',
      tahunAjaran: '2026/2027',
    },
  ],
};

export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; settings?: AppSettings; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    // Client-side fallback authentication (supports 'pakhaji' and 'bajuri39' for admin)
    const normalizedUser = username.trim().toLowerCase();
    const user = fallbackSeed.users.find((u) => u.username.toLowerCase() === normalizedUser);

    if (
      user &&
      (user.password === password ||
        (normalizedUser === 'admin' && (password === 'pakhaji' || password === 'bajuri39')))
    ) {
      const { password: _, ...userSafe } = user;
      return { success: true, user: userSafe, settings: fallbackSeed.settings };
    }

    return { success: false, message: 'Username atau password salah! (Password admin: pakhaji)' };
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json().catch(() => null);
      if (errData && errData.message) {
        return { success: false, message: errData.message };
      }
    } catch {}

    const username = (data.username || '').trim();
    if (fallbackSeed.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username sudah digunakan. Silakan gunakan username lain.' };
    }

    const newUser: User = {
      id: `usr-guru-${Date.now()}`,
      nama: data.nama || 'Guru Pendidik',
      nip: data.nip || '-',
      role: 'guru',
      sekolah: data.sekolah || fallbackSeed.settings.institutionName,
      mapel: data.mapel || 'Guru Mata Pelajaran',
      username: username || `guru_${Date.now()}`,
      password: data.password || 'bajuri39',
      avatar: '',
      kontak: data.kontak || '-',
    };
    fallbackSeed.users.push(newUser);
    const { password: _, ...safe } = newUser;
    return { success: true, user: safe, message: 'Pendaftaran guru berhasil!' };
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; settings: AppSettings }> {
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, settings: fallbackSeed.settings };
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<{ success: boolean; settings: AppSettings }> {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch {}
    Object.assign(fallbackSeed.settings, settings);
    return { success: true, settings: fallbackSeed.settings };
  },

  // Users
  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, users: fallbackSeed.users.map(({ password: _, ...u }) => u) };
  },

  async createUser(user: Partial<User>): Promise<{ success: boolean; user: User; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newUser: User = {
      id: `usr-${Date.now()}`,
      nama: user.nama || 'Pengguna Baru',
      nip: user.nip || '-',
      role: user.role || 'guru',
      sekolah: user.sekolah || fallbackSeed.settings.institutionName,
      mapel: user.mapel || '-',
      username: user.username || `user_${Date.now()}`,
      password: user.password || 'bajuri39',
      avatar: '',
      kontak: user.kontak || '-',
    };
    fallbackSeed.users.push(newUser);
    const { password: _, ...safe } = newUser;
    return { success: true, user: safe };
  },

  // Sekolah
  async getSekolah(): Promise<{ success: boolean; sekolahBinaan: SekolahBinaan[] }> {
    try {
      const res = await fetch(`${BASE_URL}/sekolah`);
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, sekolahBinaan: fallbackSeed.sekolahBinaan };
  },

  async createSekolah(data: Partial<SekolahBinaan>): Promise<{ success: boolean; sekolah?: SekolahBinaan; sekolahBinaan?: SekolahBinaan[]; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/sekolah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newSek: SekolahBinaan = {
      id: `sek-${Date.now()}`,
      nama: data.nama || 'Sekolah Binaan Baru',
      npsn: data.npsn || '-',
      alamat: data.alamat || 'Jawa Barat',
      kepalaSekolah: data.kepalaSekolah || '-',
      jumlahGuru: Number(data.jumlahGuru) || 20,
      akreditasi: data.akreditasi || 'A (Unggul)',
    };
    fallbackSeed.sekolahBinaan.push(newSek);
    return { success: true, sekolah: newSek, sekolahBinaan: fallbackSeed.sekolahBinaan };
  },

  async updateSekolah(id: string, data: Partial<SekolahBinaan>): Promise<{ success: boolean; sekolah?: SekolahBinaan; sekolahBinaan?: SekolahBinaan[]; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/sekolah/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const idx = fallbackSeed.sekolahBinaan.findIndex((s) => s.id === id);
    if (idx !== -1) {
      fallbackSeed.sekolahBinaan[idx] = {
        ...fallbackSeed.sekolahBinaan[idx],
        ...data,
      };
      return { success: true, sekolah: fallbackSeed.sekolahBinaan[idx], sekolahBinaan: fallbackSeed.sekolahBinaan };
    }
    return { success: false, message: 'Sekolah binaan tidak ditemukan' };
  },

  async deleteSekolah(id: string): Promise<{ success: boolean; sekolahBinaan?: SekolahBinaan[]; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/sekolah/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch {}

    fallbackSeed.sekolahBinaan = fallbackSeed.sekolahBinaan.filter((s) => s.id !== id);
    return { success: true, sekolahBinaan: fallbackSeed.sekolahBinaan };
  },

  // Perencanaan
  async getPerencanaan(guruId?: string): Promise<{ success: boolean; data: Perencanaan[] }> {
    try {
      const url = guruId ? `${BASE_URL}/perencanaan?guruId=${encodeURIComponent(guruId)}` : `${BASE_URL}/perencanaan`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    const list = guruId ? fallbackSeed.perencanaan.filter((p) => p.guruId === guruId) : fallbackSeed.perencanaan;
    return { success: true, data: list };
  },

  async uploadPerencanaan(data: Partial<Perencanaan>): Promise<{ success: boolean; data: Perencanaan }> {
    try {
      const res = await fetch(`${BASE_URL}/perencanaan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newDoc: Perencanaan = {
      id: `per-${Date.now()}`,
      guruId: data.guruId || 'usr-guru-1',
      guruNama: data.guruNama || 'Guru Pendidik',
      sekolah: fallbackSeed.settings.institutionName,
      tahunAjaran: fallbackSeed.settings.tahunAjaranAktif,
      jenisDokumen: data.jenisDokumen || 'Modul Ajar',
      judul: data.judul || 'Dokumen Baru',
      fileName: data.fileName || `${data.jenisDokumen}_${Date.now()}.pdf`,
      fileUrl: data.fileUrl || '#',
      status: 'Draft',
      catatanPengawas: 'Dokumen baru diunggah, menunggu telaah.',
      tanggalUnggah: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    fallbackSeed.perencanaan.unshift(newDoc);
    return { success: true, data: newDoc };
  },

  async reviewPerencanaan(id: string, status: string, catatanPengawas: string): Promise<{ success: boolean; data: Perencanaan }> {
    try {
      const res = await fetch(`${BASE_URL}/perencanaan/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, catatanPengawas }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const doc = fallbackSeed.perencanaan.find((p) => p.id === id);
    if (doc) {
      doc.status = status as any;
      doc.catatanPengawas = catatanPengawas;
      doc.updatedAt = new Date().toISOString().split('T')[0];
      return { success: true, data: doc };
    }
    return { success: false, data: {} as Perencanaan };
  },

  // Observasi
  async getObservasi(guruId?: string): Promise<{ success: boolean; data: Observasi[] }> {
    try {
      const url = guruId ? `${BASE_URL}/observasi?guruId=${encodeURIComponent(guruId)}` : `${BASE_URL}/observasi`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    const list = guruId ? fallbackSeed.observasi.filter((o) => o.guruId === guruId) : fallbackSeed.observasi;
    return { success: true, data: list };
  },

  async createObservasi(data: Partial<Observasi>): Promise<{ success: boolean; data: Observasi }> {
    try {
      const res = await fetch(`${BASE_URL}/observasi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newObs: Observasi = {
      id: `obs-${Date.now()}`,
      guruId: data.guruId || 'usr-guru-1',
      guruNama: data.guruNama || 'Guru Pendidik',
      guruNip: data.guruNip || '-',
      guruMapel: data.guruMapel || '-',
      sekolah: fallbackSeed.settings.institutionName,
      supervisorId: data.supervisorId || 'usr-admin',
      supervisorNama: data.supervisorNama || fallbackSeed.settings.pengawasPembina,
      tanggalObservasi: data.tanggalObservasi || new Date().toISOString().split('T')[0],
      jamObservasi: data.jamObservasi || '08:00 - 09:30 WIB',
      kelas: data.kelas || 'X-1',
      fokusPerilaku: data.fokusPerilaku || 'Keteraturan Suasana Kelas',
      semester: data.semester || '1',
      skorRubrik: data.skorRubrik || {
        keteraturanSuasana: 3,
        ekspektasiPesertaDidik: 3,
        perhatianKepedulian: 3,
        instruksiAdaptif: 3,
        rataRata: 3.0,
      },
      catatanKualitatif: data.catatanKualitatif || 'Observasi telah selesai dilaksanakan.',
      fotoBuktiUrl: data.fotoBuktiUrl || '',
      refleksiGuru: '',
      rencanaPerbaikanGuru: '',
      status: 'Selesai Observasi',
    };
    fallbackSeed.observasi.unshift(newObs);
    return { success: true, data: newObs };
  },

  async submitRefleksi(id: string, refleksiGuru: string, rencanaPerbaikanGuru: string): Promise<{ success: boolean; data: Observasi }> {
    try {
      const res = await fetch(`${BASE_URL}/observasi/${id}/refleksi`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refleksiGuru, rencanaPerbaikanGuru }),
      });
      if (res.ok) return await res.json();
    } catch {}

    const obs = fallbackSeed.observasi.find((o) => o.id === id);
    if (obs) {
      obs.refleksiGuru = refleksiGuru;
      obs.rencanaPerbaikanGuru = rencanaPerbaikanGuru;
      obs.status = 'Selesai Refleksi';
      return { success: true, data: obs };
    }
    return { success: false, data: {} as Observasi };
  },

  // Tindak Lanjut
  async getTindakLanjut(guruId?: string): Promise<{ success: boolean; data: TindakLanjut[] }> {
    try {
      const url = guruId ? `${BASE_URL}/tindak-lanjut?guruId=${encodeURIComponent(guruId)}` : `${BASE_URL}/tindak-lanjut`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    const list = guruId ? fallbackSeed.tindakLanjut.filter((t) => t.guruId === guruId) : fallbackSeed.tindakLanjut;
    return { success: true, data: list };
  },

  async createTindakLanjut(data: Partial<TindakLanjut>): Promise<{ success: boolean; data: TindakLanjut }> {
    try {
      const res = await fetch(`${BASE_URL}/tindak-lanjut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newTL: TindakLanjut = {
      id: `tl-${Date.now()}`,
      observasiId: data.observasiId || `obs-${Date.now()}`,
      guruId: data.guruId || 'usr-guru-1',
      guruNama: data.guruNama || 'Guru Pendidik',
      sekolah: fallbackSeed.settings.institutionName,
      rekomendasi: data.rekomendasi || 'Tingkatkan diferensiasi konten.',
      bentukKegiatan: data.bentukKegiatan || 'PMM',
      targetSelesai: data.targetSelesai || '2026-11-30',
      status: 'Dalam Proses',
      catatanPerkembangan: 'Target RTL disepakati.',
    };
    fallbackSeed.tindakLanjut.unshift(newTL);
    return { success: true, data: newTL };
  },

  async updateTindakLanjut(id: string, data: Partial<TindakLanjut>): Promise<{ success: boolean; data: TindakLanjut }> {
    try {
      const res = await fetch(`${BASE_URL}/tindak-lanjut/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const tl = fallbackSeed.tindakLanjut.find((t) => t.id === id);
    if (tl) {
      Object.assign(tl, data);
      return { success: true, data: tl };
    }
    return { success: false, data: {} as TindakLanjut };
  },

  // Portofolio
  async getPortofolio(guruId?: string): Promise<{ success: boolean; data: Portofolio[] }> {
    try {
      const url = guruId ? `${BASE_URL}/portofolio?guruId=${encodeURIComponent(guruId)}` : `${BASE_URL}/portofolio`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
    const list = guruId ? fallbackSeed.portofolio.filter((p) => p.guruId === guruId) : fallbackSeed.portofolio;
    return { success: true, data: list };
  },

  async createPortofolio(data: Partial<Portofolio>): Promise<{ success: boolean; data: Portofolio }> {
    try {
      const res = await fetch(`${BASE_URL}/portofolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newPort: Portofolio = {
      id: `port-${Date.now()}`,
      guruId: data.guruId || 'usr-guru-1',
      guruNama: data.guruNama || 'Guru Pendidik',
      sekolah: fallbackSeed.settings.institutionName,
      kategori: data.kategori || 'Sertifikat',
      judul: data.judul || 'Portofolio Baru',
      deskripsi: data.deskripsi || '-',
      fileUrl: data.fileUrl || '#',
      fileName: data.fileName || `${data.kategori}_${Date.now()}.pdf`,
      tanggalUnggah: new Date().toISOString().split('T')[0],
      tahunAjaran: fallbackSeed.settings.tahunAjaranAktif,
    };
    fallbackSeed.portofolio.unshift(newPort);
    return { success: true, data: newPort };
  },

  async deletePortofolio(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/portofolio/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch {}

    const idx = fallbackSeed.portofolio.findIndex((p) => p.id === id);
    if (idx !== -1) fallbackSeed.portofolio.splice(idx, 1);
    return { success: true, message: 'Portofolio berhasil dihapus.' };
  },

  // Rekapitulasi
  async getRekap(): Promise<{ success: boolean; rekap: any }> {
    try {
      const res = await fetch(`${BASE_URL}/reports/rekap`);
      if (res.ok) return await res.json();
    } catch {}

    return {
      success: true,
      rekap: {
        institutionName: fallbackSeed.settings.institutionName,
        tahunAjaran: fallbackSeed.settings.tahunAjaranAktif,
        semester: fallbackSeed.settings.semesterAktif,
        pengawasPembina: fallbackSeed.settings.pengawasPembina,
        totalGuru: 4,
        totalSekolahBinaan: fallbackSeed.sekolahBinaan.length,
        perencanaan: {
          total: fallbackSeed.perencanaan.length,
          disetujui: 4,
          revisi: 0,
          draft: 0,
          persentaseDisetujui: 100,
        },
        observasi: {
          total: 2,
          selesai: 2,
          terjadwal: 0,
          persentaseKeterlaksanaan: 85,
          aspekRataRata: {
            keteraturanSuasana: 3.8,
            ekspektasiPesertaDidik: 3.5,
            perhatianKepedulian: 3.6,
            instruksiAdaptif: 3.35,
            skorGlobal: 3.56,
          },
        },
      },
    };
  },

  // Material Generator
  async generateMaterial(req: MaterialGenerationRequest): Promise<{ success: boolean; material?: any; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/materials/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {}

    // Fallback generation logic for static environments
    const institution = fallbackSeed.settings.institutionName;
    const md = `---
${institution}
MODUL MATERI PEMBELAJARAN
---
- Jenjang/Kelas: ${req.jenjang} - Kelas ${req.kelas}
- Mata Pelajaran: ${req.mapel}
- Topik/Materi: ${req.topik}

## A. Capaian Pembelajaran & Tujuan Pembelajaran
**Capaian Pembelajaran (Kurikulum Merdeka):**
Peserta didik mampu memahami, menganalisis, dan memecahkan permasalahan kontekstual pada materi **${req.topik}**.

**Tujuan Pembelajaran:**
1. Menjelaskan konsep dasar ${req.topik}.
2. Menerapkan formula dan prinsip ${req.topik} pada persoalan nyata.
3. Melakukan evaluasi kritis terhadap hasil analisis data.

## B. Ringkasan Materi Utama
Pemahaman mendalam mengenai **${req.topik}** mencakup prinsip fondasional serta aplikasi HOTS.

| Aspek Analisis | Tingkat Dasar | Tingkat Lanjut |
| :--- | :--- | :--- |
| **Pemahaman** | Konsep dasar & istilah | Analisis studi kasus |
| **Penerapan** | Latihan terstruktur | Investigasi mandiri |

## C. Contoh Soal dan Pembahasan
### Contoh Soal 1
Analisis langkah awal pemecahan ${req.topik}.
**Pembahasan:** Identifikasi parameter awal secara runut.

### Contoh Soal 2
Penerapan kontekstual dalam kegiatan praktikum/projek.
**Pembahasan:** Menguji sensitivitas model.

### Contoh Soal 3
Penalaran kritis terhadap deviasi parameter 25%.
**Pembahasan:** Penyesuaian strategi korektif.

## D. Latihan Mandiri (Asesmen)
### Bagian 1: Pilihan Ganda (5 Butir Soal)
1. Karakteristik utama ${req.topik} adalah...
   - A. Statis  B. Kontekstual  C. Mengabaikan data  D. Teoretis saja
   - *Kunci: B*
2. Fungsi evaluasi adalah...
   - A. Memberi hukuman  B. Mengukur ketercapaian tujuan  C. Mengulang materi
   - *Kunci: B*
3. Langkah verifikasi terbaik...
   - A. Asumsi  B. Bukti empiris  C. Spekulasi
   - *Kunci: B*
4. Pendekatan HOTS bertujuan...
   - A. Menghafal  B. Berpikir kritis dan sintesis  C. Mengurangi tugas
   - *Kunci: B*
5. Rencana tindak lanjut...
   - A. Selesai  B. Perbaikan berkelanjutan  C. Dihentikan
   - *Kunci: B*

### Bagian 2: Soal Esai Reflektif (3 Butir Soal)
1. Jelaskan urgensi ${req.topik} dalam kehidupan nyata!
2. Rancang alur solusi studi kasus sederhana!
3. Refleksikan dimensi Bernalar Kritis yang Anda alami!

---
@Copyright by. Pak GuruAI`;

    return {
      success: true,
      material: {
        institution,
        jenjang: req.jenjang,
        kelas: req.kelas,
        mapel: req.mapel,
        topik: req.topik,
        markdown: md,
        generatedAt: new Date().toISOString(),
      },
    };
  },
};
