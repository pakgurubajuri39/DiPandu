export type UserRole = 'pengawas' | 'kepala_sekolah' | 'guru';

export interface User {
  id: string;
  nama: string;
  nip: string;
  role: UserRole;
  sekolah: string;
  mapel: string;
  username: string;
  password?: string;
  avatar?: string;
  kontak?: string;
}

export type JenisDokumenPerencanaan = 'Modul Ajar' | 'ATP' | 'KKTP' | 'CP';
export type StatusPerencanaan = 'Draft' | 'Revisi' | 'Disetujui';

export interface Perencanaan {
  id: string;
  guruId: string;
  guruNama: string;
  sekolah: string;
  tahunAjaran: string;
  jenisDokumen: JenisDokumenPerencanaan;
  judul: string;
  fileUrl: string;
  fileName: string;
  status: StatusPerencanaan;
  catatanPengawas: string;
  tanggalUnggah: string;
  updatedAt: string;
}

export interface RubrikSkor {
  keteraturanSuasana: number; // 1-4
  ekspektasiPesertaDidik: number; // 1-4
  perhatianKepedulian: number; // 1-4
  instruksiAdaptif: number; // 1-4
  rataRata: number;
}

export type StatusObservasi = 'Terjadwal' | 'Selesai Observasi' | 'Selesai Refleksi';

export interface Observasi {
  id: string;
  guruId: string;
  guruNama: string;
  guruNip: string;
  guruMapel: string;
  sekolah: string;
  supervisorId: string;
  supervisorNama: string;
  tanggalObservasi: string;
  jamObservasi: string;
  kelas: string;
  fokusPerilaku: string;
  semester: '1' | '2';
  skorRubrik: RubrikSkor;
  catatanKualitatif: string;
  fotoBuktiUrl?: string;
  refleksiGuru?: string;
  rencanaPerbaikanGuru?: string;
  status: StatusObservasi;
}

export type BentukKegiatanTL = 'PMM' | 'Coaching' | 'MGMP' | 'Bimtek';
export type StatusTindakLanjut = 'Belum Dimulai' | 'Dalam Proses' | 'Selesai';

export interface TindakLanjut {
  id: string;
  observasiId: string;
  guruId: string;
  guruNama: string;
  sekolah: string;
  rekomendasi: string;
  bentukKegiatan: BentukKegiatanTL;
  targetSelesai: string;
  status: StatusTindakLanjut;
  catatanPerkembangan?: string;
}

export type KategoriPortofolio = 'Sertifikat' | 'KaryaSiswa' | 'PTK' | 'P5';

export interface Portofolio {
  id: string;
  guruId: string;
  guruNama: string;
  sekolah: string;
  kategori: KategoriPortofolio;
  judul: string;
  deskripsi: string;
  fileUrl: string;
  fileName: string;
  tanggalUnggah: string;
  tahunAjaran: string;
}

export interface SekolahBinaan {
  id: string;
  nama: string;
  npsn: string;
  alamat: string;
  kepalaSekolah: string;
  jumlahGuru: number;
  akreditasi: string;
}

export interface AppSettings {
  institutionName: string;
  copyright: string;
  tahunAjaranAktif: string;
  semesterAktif: string;
  pengawasPembina: string;
}

export interface MaterialGenerationRequest {
  jenjang: 'SD' | 'SMP' | 'SMA';
  kelas: number | string;
  mapel: string;
  topik: string;
}
