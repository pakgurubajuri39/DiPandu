export interface IndikatorPerencanaan {
  id: string;
  nomor: string;
  komponen: string;
  deskriptor: string;
  panduanPenilaian: string;
  skor: 0 | 1 | 2; // 0: Tidak Ada, 1: Kurang Lengkap, 2: Lengkap & Sesuai
  catatan?: string;
}

export interface InstrumenPerencanaanData {
  id: string;
  guruId: string;
  guruNama: string;
  sekolah: string;
  mataPelajaran: string;
  kelas: string;
  tanggalPenelaahan: string;
  namaPenelaah: string;
  indikatorList: IndikatorPerencanaan[];
  totalSkor: number; // Max 34
  nilaiAkhir: number; // 0 - 100
  predikat: 'Amat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  catatanUmum: string;
  rekomendasiTindakLanjut: string;
}

export interface FokusPerilakuGTK {
  id: string;
  perilakuDianjurkan: string[];
  perilakuDihindari: string[];
  ketercapaian: 1 | 2 | 3; // 1: Belum Dilakukan, 2: Dilakukan tapi Belum Efektif, 3: Dilakukan dan Efektif
  catatanBuktiFaktual: string;
}

export interface IndikatorKinerjaGTK {
  id: string;
  nama: string;
  fokusTarget: string;
  deskripsi: string;
  fokusPerilaku1: FokusPerilakuGTK;
  fokusPerilaku2: FokusPerilakuGTK;
  fokusPerilaku3: FokusPerilakuGTK;
  skorHolistik: 1 | 2 | 3 | 4; // 1: Kurang, 2: Cukup, 3: Baik, 4: Sangat Baik
  catatanPengamat: string;
}

export interface RubrikPortofolioPilar {
  id: string;
  kategori: 'Sertifikat' | 'KaryaSiswa' | 'PTK' | 'P5';
  namaPilar: string;
  aspekPenilaian: {
    kriteria: string;
    skor: 1 | 2 | 3 | 4;
    catatan: string;
  }[];
  skorRataRata: number;
  statusKelayakan: 'Memenuhi Syarat (Valid)' | 'Perlu Perbaikan Bukti Dukung' | 'Belum Memenuhi Syarat';
  catatanValidator: string;
}

export interface InstrumenPortofolioData {
  id: string;
  guruId: string;
  guruNama: string;
  sekolah: string;
  tanggalValidasi: string;
  namaValidator: string;
  pilarList: RubrikPortofolioPilar[];
  skorTotal: number;
  predikat: string;
  rekomendasiPKB: string;
}
