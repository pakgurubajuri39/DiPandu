import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  MessageSquare,
  TrendingUp,
  Award,
  PlusCircle,
  FileCheck,
  User,
  School,
  ArrowRight,
} from 'lucide-react';
import { Observasi, RubrikSkor, BentukKegiatanTL } from '../types';

export const ObservasiView: React.FC = () => {
  const {
    currentUser,
    users,
    observasiList,
    addObservasi,
    submitRefleksi,
    tindakLanjutList,
    addTindakLanjut,
    updateTindakLanjut,
    setActiveTab,
  } = useApp();

  const isSupervisor = currentUser?.role === 'pengawas' || currentUser?.role === 'kepala_sekolah';

  // Sub-tabs
  const [subTab, setSubTab] = useState<'daftar' | 'input-rubrik' | 'refleksi-guru' | 'rtl'>('daftar');

  // Input Rubrik Form State
  const [targetGuruId, setTargetGuruId] = useState(users.find((u) => u.role === 'guru')?.id || '');
  const [tanggalObs, setTanggalObs] = useState(new Date().toISOString().split('T')[0]);
  const [jamObs, setJamObs] = useState('08:00 - 09:30 WIB');
  const [kelasObs, setKelasObs] = useState('X-1 (Fase E)');
  const [fokusPerilaku, setFokusPerilaku] = useState('Penerapan Disiplin Positif & Keteraturan Suasana Kelas');
  const [semesterObs, setSemesterObs] = useState<'1' | '2'>('1');
  const [scores, setScores] = useState<Omit<RubrikSkor, 'rataRata'>>({
    keteraturanSuasana: 4,
    ekspektasiPesertaDidik: 3,
    perhatianKepedulian: 4,
    instruksiAdaptif: 3,
  });
  const [catatanKualitatif, setCatatanKualitatif] = useState('');
  const [fotoBuktiUrl, setFotoBuktiUrl] = useState('/src/assets/images/classroom_supervision_hero_1790340344236.jpg');
  const [isSubmittingObs, setIsSubmittingObs] = useState(false);

  // Refleksi Form State
  const [selectedObsIdForRefleksi, setSelectedObsIdForRefleksi] = useState<string>('');
  const [refleksiText, setRefleksiText] = useState('');
  const [rencanaPerbaikanText, setRencanaPerbaikanText] = useState('');
  const [isSubmittingRefleksi, setIsSubmittingRefleksi] = useState(false);

  // RTL Modal / Form State
  const [showAddRTLModal, setShowAddRTLModal] = useState(false);
  const [rtlGuruId, setRtlGuruId] = useState(users.find((u) => u.role === 'guru')?.id || '');
  const [rtlRekomendasi, setRtlRekomendasi] = useState('');
  const [rtlBentuk, setRtlBentuk] = useState<BentukKegiatanTL>('PMM');
  const [rtlTarget, setRtlTarget] = useState('2026-11-30');

  // Compute live average
  const currentAvg = Number(
    ((scores.keteraturanSuasana + scores.ekspektasiPesertaDidik + scores.perhatianKepedulian + scores.instruksiAdaptif) / 4).toFixed(2)
  );

  const getPredikat = (score: number) => {
    if (score >= 3.5) return { label: 'Sangat Baik (Membudaya)', color: 'text-emerald-700 bg-emerald-50' };
    if (score >= 2.5) return { label: 'Baik (Terlihat Efektif)', color: 'text-blue-700 bg-blue-50' };
    if (score >= 1.5) return { label: 'Cukup (Mulai Berkembang)', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Kurang (Perlu Pembinaan Khusus)', color: 'text-rose-700 bg-rose-50' };
  };

  const handleScoreChange = (field: keyof Omit<RubrikSkor, 'rataRata'>, val: number) => {
    setScores((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmitRubrik = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingObs(true);

    const success = await addObservasi({
      guruId: targetGuruId,
      supervisorId: currentUser?.id,
      tanggalObservasi: tanggalObs,
      jamObservasi: jamObs,
      kelas: kelasObs,
      fokusPerilaku,
      semester: semesterObs,
      skorRubrik: {
        ...scores,
        rataRata: currentAvg,
      },
      catatanKualitatif,
      fotoBuktiUrl,
    });

    setIsSubmittingObs(false);
    if (success) {
      setSubTab('daftar');
      setCatatanKualitatif('');
    }
  };

  const handleSubmitRefleksiForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObsIdForRefleksi) return;

    setIsSubmittingRefleksi(true);
    await submitRefleksi(selectedObsIdForRefleksi, refleksiText, rencanaPerbaikanText);
    setIsSubmittingRefleksi(false);
    setSubTab('daftar');
  };

  const handleAddRTL = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtlRekomendasi) return;

    await addTindakLanjut({
      guruId: rtlGuruId,
      rekomendasi: rtlRekomendasi,
      bentukKegiatan: rtlBentuk,
      targetSelesai: rtlTarget,
    });

    setShowAddRTLModal(false);
    setRtlRekomendasi('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Sub-Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Modul 2: Observasi Kelas & Refleksi Mandiri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Penilaian rubrik digital 4 aspek standar Ditjen GTK, refleksi pasca observasi, dan kesepakatan tindak lanjut.
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSubTab('daftar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              subTab === 'daftar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Observasi
          </button>

          {isSupervisor && (
            <button
              onClick={() => setSubTab('input-rubrik')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                subTab === 'input-rubrik' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Input Rubrik Observasi
            </button>
          )}

          <button
            onClick={() => {
              // Preselect my observation if guru
              const myObs = observasiList.find((o) => o.guruId === currentUser?.id);
              if (myObs) {
                setSelectedObsIdForRefleksi(myObs.id);
                setRefleksiText(myObs.refleksiGuru || '');
                setRencanaPerbaikanText(myObs.rencanaPerbaikanGuru || '');
              }
              setSubTab('refleksi-guru');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              subTab === 'refleksi-guru' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Refleksi Pasca Observasi
          </button>

          <button
            onClick={() => setSubTab('rtl')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              subTab === 'rtl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tindak Lanjut (RTL)
          </button>

          <button
            onClick={() => setActiveTab('instrumen')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
          >
            Instrumen GTK Lengkap (8 Indikator)
          </button>
        </div>
      </div>

      {/* ================= SUB-TAB 1: DAFTAR OBSERVASI ================= */}
      {subTab === 'daftar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {observasiList.map((obs) => {
              const predikat = getPredikat(obs.skorRubrik.rataRata);
              return (
                <div
                  key={obs.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 font-mono">
                          SEMESTER {obs.semester} · KELAS {obs.kelas}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{obs.guruNama}</h3>
                        <p className="text-xs text-slate-500 font-mono">
                          NIP: {obs.guruNip} · {obs.guruMapel}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 font-mono">
                          {obs.skorRubrik.rataRata.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 block">/ 4.00</span>
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Observer:</span>
                        <span className="font-semibold text-slate-800">{obs.supervisorNama}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Waktu:</span>
                        <span className="font-semibold text-slate-800">{obs.tanggalObservasi}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-slate-400 block text-[11px]">Fokus Perilaku:</span>
                      <p className="text-xs font-medium text-slate-800">{obs.fokusPerilaku}</p>
                    </div>

                    {/* Scores Progress Grid */}
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 mb-4 border border-slate-100 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">1. Keteraturan Suasana Kelas</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {obs.skorRubrik.keteraturanSuasana} / 4
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">2. Ekspektasi Pada Peserta Didik</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {obs.skorRubrik.ekspektasiPesertaDidik} / 4
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">3. Perhatian dan Kepedulian</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {obs.skorRubrik.perhatianKepedulian} / 4
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">4. Instruksi Adaptif & Diferensiasi</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {obs.skorRubrik.instruksiAdaptif} / 4
                        </span>
                      </div>
                    </div>

                    {/* Catatan Kualitatif */}
                    <div className="text-xs text-slate-600 mb-3">
                      <strong className="text-slate-800 block text-[11px] mb-0.5">Catatan Observer:</strong>
                      <p className="italic bg-blue-50/40 p-2.5 rounded-lg border border-blue-100/60">
                        "{obs.catatanKualitatif}"
                      </p>
                    </div>

                    {/* Refleksi Status */}
                    {obs.refleksiGuru ? (
                      <div className="text-xs text-slate-600">
                        <strong className="text-emerald-700 block text-[11px] mb-0.5">
                          ✓ Refleksi Mandiri Guru Selesai:
                        </strong>
                        <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                          {obs.refleksiGuru}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex items-center justify-between">
                        <span>Menunggu refleksi pasca observasi dari guru</span>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${predikat.color}`}>
                      {predikat.label}
                    </span>

                    {(currentUser?.role === 'guru' || isSupervisor) && (
                      <button
                        onClick={() => {
                          setSelectedObsIdForRefleksi(obs.id);
                          setRefleksiText(obs.refleksiGuru || '');
                          setRencanaPerbaikanText(obs.rencanaPerbaikanGuru || '');
                          setSubTab('refleksi-guru');
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {obs.refleksiGuru ? 'Edit Refleksi' : 'Isi Refleksi'} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: INPUT RUBRIK OBSERVASI DIGITAL ================= */}
      {subTab === 'input-rubrik' && isSupervisor && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Form Rubrik Penilaian Observasi Kelas (Skala 1 - 4)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Instrumen pengamatan kinerja guru sesuai dengan Pedoman Supervisi Akademik Kemendikbudristek.
            </p>
          </div>

          <form onSubmit={handleSubmitRubrik} className="space-y-6">
            {/* Pra-Observasi Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Guru yang Disupervisi
                </label>
                <select
                  value={targetGuruId}
                  onChange={(e) => setTargetGuruId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {users
                    .filter((u) => u.role === 'guru')
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nama} — {g.mapel} ({g.sekolah})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas / Rombel & Semester
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={kelasObs}
                    onChange={(e) => setKelasObs(e.target.value)}
                    placeholder="Contoh: X-1"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                  <select
                    value={semesterObs}
                    onChange={(e) => setSemesterObs(e.target.value as '1' | '2')}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-800"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Observasi
                </label>
                <input
                  type="date"
                  required
                  value={tanggalObs}
                  onChange={(e) => setTanggalObs(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  value={jamObs}
                  onChange={(e) => setJamObs(e.target.value)}
                  placeholder="08:00 - 09:30 WIB"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fokus Pengamatan / Perilaku Utama (Pra-Observasi)
              </label>
              <input
                type="text"
                required
                value={fokusPerilaku}
                onChange={(e) => setFokusPerilaku(e.target.value)}
                placeholder="Misal: Penerapan Disiplin Positif & Pembelajaran Berdiferensiasi"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
              />
            </div>

            {/* Rubrik Penilaian 4 Aspek */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Penilaian 4 Indikator Rubrik Observasi
                </h3>
                <div className="text-xs">
                  <span className="text-slate-500">Rata-rata: </span>
                  <span className="font-bold text-blue-700 font-mono text-sm">{currentAvg} / 4.00</span>
                </div>
              </div>

              {/* Aspek 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    1. Keteraturan Suasana Kelas
                  </span>
                  <span className="text-xs font-semibold text-blue-700 font-mono">
                    Skor: {scores.keteraturanSuasana}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guru menegakkan kesepakatan kelas, memfasilitasi interaksi kondusif, dan merespons disrupsi secara suportif.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleScoreChange('keteraturanSuasana', v)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        scores.keteraturanSuasana === v
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {v} - {v === 4 ? 'Sangat Baik' : v === 3 ? 'Baik' : v === 2 ? 'Cukup' : 'Kurang'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspek 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    2. Ekspektasi Pada Peserta Didik
                  </span>
                  <span className="text-xs font-semibold text-blue-700 font-mono">
                    Skor: {scores.ekspektasiPesertaDidik}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guru mengkomunikasikan keyakinan atas potensi murid, memotivasi peserta didik, dan menantang pemikiran kritis.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleScoreChange('ekspektasiPesertaDidik', v)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        scores.ekspektasiPesertaDidik === v
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {v} - {v === 4 ? 'Sangat Baik' : v === 3 ? 'Baik' : v === 2 ? 'Cukup' : 'Kurang'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspek 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    3. Perhatian dan Kepedulian Guru
                  </span>
                  <span className="text-xs font-semibold text-blue-700 font-mono">
                    Skor: {scores.perhatianKepedulian}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guru peka terhadap kebutuhan emosional dan akademik siswa, mendengarkan aktif, dan bersikap empatik.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleScoreChange('perhatianKepedulian', v)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        scores.perhatianKepedulian === v
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {v} - {v === 4 ? 'Sangat Baik' : v === 3 ? 'Baik' : v === 2 ? 'Cukup' : 'Kurang'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspek 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    4. Instruksi yang Adaptif & Diferensiasi
                  </span>
                  <span className="text-xs font-semibold text-blue-700 font-mono">
                    Skor: {scores.instruksiAdaptif}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Guru menyesuaikan penjelasan sesuai tingkat pemahaman peserta didik, variasi media, dan diferensiasi tugas.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleScoreChange('instruksiAdaptif', v)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        scores.instruksiAdaptif === v
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {v} - {v === 4 ? 'Sangat Baik' : v === 3 ? 'Baik' : v === 2 ? 'Cukup' : 'Kurang'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catatan Kualitatif */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Kualitatif Objektif & Umpan Balik Konstruktif
              </label>
              <textarea
                rows={4}
                required
                value={catatanKualitatif}
                onChange={(e) => setCatatanKualitatif(e.target.value)}
                placeholder="Tuliskan aspek unggul yang teramati serta saran konkret perbaikan proses belajar mengajar..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Upload Foto Dokumentasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto Dokumentasi Pelaksanaan Kelas (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={fotoBuktiUrl}
                  onChange={(e) => setFotoBuktiUrl(e.target.value)}
                  placeholder="URL Foto atau path dokumentasi"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setFotoBuktiUrl('/src/assets/images/classroom_supervision_hero_1790340344236.jpg')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0"
                >
                  Gunakan Foto Kelas
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubTab('daftar')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmittingObs}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
              >
                {isSubmittingObs ? 'Menyimpan...' : 'Simpan Nilai Observasi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SUB-TAB 3: REFLEKSI PASCA OBSERVASI GURU ================= */}
      {subTab === 'refleksi-guru' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Form Pasca-Observasi: Refleksi Mandiri Guru
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Guru mengevaluasi proses pembelajaran yang telah berlangsung, mengidentifikasi tantangan, dan merumuskan rencana aksi mandiri.
            </p>
          </div>

          <form onSubmit={handleSubmitRefleksiForm} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Sesi Observasi Kelas
              </label>
              <select
                value={selectedObsIdForRefleksi}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedObsIdForRefleksi(val);
                  const found = observasiList.find((o) => o.id === val);
                  if (found) {
                    setRefleksiText(found.refleksiGuru || '');
                    setRencanaPerbaikanText(found.rencanaPerbaikanGuru || '');
                  }
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Pilih Sesi Observasi --</option>
                {observasiList.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.guruNama} — {o.kelas} ({o.tanggalObservasi})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                1. Refleksi Keberhasilan & Tantangan Pembelajaran
              </label>
              <textarea
                rows={4}
                required
                value={refleksiText}
                onChange={(e) => setRefleksiText(e.target.value)}
                placeholder="Apa yang sudah berjalan dengan efektif? Bagian mana yang dirasa peserta didik masih kesulitan memahami? Bagaimana dinamika interaksi kelas?..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                2. Rencana Aksi Perbaikan Mandiri Guru
              </label>
              <textarea
                rows={4}
                required
                value={rencanaPerbaikanText}
                onChange={(e) => setRencanaPerbaikanText(e.target.value)}
                placeholder="Langkah konkret apa yang akan Anda lakukan di pertemuan mendatang (misal: penataan kelompok kecil, penambahan apersepsi kontekstual, pembuatan lembar kerja berdiferensiasi)?..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubTab('daftar')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmittingRefleksi || !selectedObsIdForRefleksi}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
              >
                {isSubmittingRefleksi ? 'Menyimpan...' : 'Kirim Refleksi Mandiri'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= SUB-TAB 4: RENCANA TINDAK LANJUT (RTL) ================= */}
      {subTab === 'rtl' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Rencana Tindak Lanjut (RTL) Supervisi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kegiatan pembinaan tindak lanjut melalui Platform Merdeka Mengajar (PMM), Coaching, MGMP, atau Bimtek.
              </p>
            </div>

            {isSupervisor && (
              <button
                onClick={() => setShowAddRTLModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Tambah Rekomendasi RTL
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tindakLanjutList.map((tl) => (
              <div
                key={tl.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Bentuk: {tl.bentukKegiatan}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        tl.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tl.status === 'Dalam Proses'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tl.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-1">{tl.guruNama}</h3>
                  <p className="text-[11px] text-slate-500">{tl.sekolah}</p>

                  <div className="mt-3 text-xs text-slate-700">
                    <strong className="text-slate-900 block text-[11px]">Rekomendasi Observer:</strong>
                    <p className="mt-0.5 leading-relaxed">{tl.rekomendasi}</p>
                  </div>

                  {tl.catatanPerkembangan && (
                    <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-100">
                      <strong>Progres:</strong> {tl.catatanPerkembangan}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Target: {tl.targetSelesai}</span>

                  <div className="flex items-center gap-1.5">
                    {tl.status !== 'Selesai' && (
                      <button
                        onClick={() =>
                          updateTindakLanjut(tl.id, {
                            status: 'Selesai',
                            catatanPerkembangan: 'Kegiatan tindak lanjut telah diselesaikan dengan bukti dukung terverifikasi.',
                          })
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Tambah RTL */}
          {showAddRTLModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
                <h3 className="text-base font-bold text-slate-900">
                  Tambah Rekomendasi Tindak Lanjut (RTL)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tetapkan bentuk peningkatan kompetensi guru sesuai hasil temuan observasi kelas.
                </p>

                <form onSubmit={handleAddRTL} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pilih Guru
                    </label>
                    <select
                      value={rtlGuruId}
                      onChange={(e) => setRtlGuruId(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                    >
                      {users
                        .filter((u) => u.role === 'guru')
                        .map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nama} ({g.mapel})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bentuk Kegiatan
                    </label>
                    <select
                      value={rtlBentuk}
                      onChange={(e) => setRtlBentuk(e.target.value as BentukKegiatanTL)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                    >
                      <option value="PMM">Platform Merdeka Mengajar (PMM Pelatihan Mandiri)</option>
                      <option value="Coaching">Coaching Rekan Sejawat / Kepala Sekolah</option>
                      <option value="MGMP">Diseminasi & Praktik Baik di MGMP Mata Pelajaran</option>
                      <option value="Bimtek">Bimbingan Teknis / Workshop Eksternal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Uraian Rekomendasi
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={rtlRekomendasi}
                      onChange={(e) => setRtlRekomendasi(e.target.value)}
                      placeholder="Contoh: Mengikuti modul pelatihan diferensiasi proses dan membuat lembar refleksi peserta didik..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Waktu Penyelesaian
                    </label>
                    <input
                      type="date"
                      required
                      value={rtlTarget}
                      onChange={(e) => setRtlTarget(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRTLModal(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                    >
                      Simpan RTL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
