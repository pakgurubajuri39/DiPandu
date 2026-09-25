import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  Save,
  ArrowRight,
  School,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { pdfGenerator } from '../services/pdfGenerator';

export const MaterialGeneratorView: React.FC = () => {
  const { settings, currentUser, addPerencanaan, showNotification } = useApp();

  const [jenjang, setJenjang] = useState<'SD' | 'SMP' | 'SMA'>('SMA');
  const [kelas, setKelas] = useState<string>('10');
  const [mapel, setMapel] = useState<string>('Matematika');
  const [topik, setTopik] = useState<string>('Sistem Persamaan Linear Tiga Variabel (SPLTV)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Subject options based on prompt specifications
  const subjectsByJenjang: Record<'SD' | 'SMP' | 'SMA', string[]> = {
    SD: ['IPAS', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris'],
    SMP: ['Matematika', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris'],
    SMA: [
      'Matematika',
      'Fisika',
      'Kimia',
      'Biologi',
      'B. Indonesia',
      'B. Inggris',
      'Sejarah',
      'Geografi',
      'Sosiologi',
      'Ekonomi',
    ],
  };

  const gradesByJenjang: Record<'SD' | 'SMP' | 'SMA', string[]> = {
    SD: ['4', '5', '6'],
    SMP: ['7', '8', '9'],
    SMA: ['10', '11', '12'],
  };

  const handleJenjangChange = (val: 'SD' | 'SMP' | 'SMA') => {
    setJenjang(val);
    setKelas(gradesByJenjang[val][0]);
    setMapel(subjectsByJenjang[val][0]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) return;

    setIsGenerating(true);
    const res = await api.generateMaterial({
      jenjang,
      kelas,
      mapel,
      topik,
    });
    setIsGenerating(false);

    if (res.success && res.material) {
      setGeneratedResult(res.material);
      showNotification('Modul pembelajaran Kurikulum Merdeka berhasil disusun.', 'success');
    }
  };

  const handleCopyMarkdown = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification('Teks Markdown disalin ke clipboard.', 'info');
  };

  const handleDownloadPDF = () => {
    if (!generatedResult) return;
    pdfGenerator.downloadMaterialPDF(generatedResult, settings);
  };

  const handleSaveToPerencanaan = async () => {
    if (!generatedResult) return;
    await addPerencanaan({
      guruId: currentUser?.id,
      guruNama: currentUser?.nama,
      jenisDokumen: 'Modul Ajar',
      judul: `Modul Ajar ${generatedResult.mapel} Kelas ${generatedResult.kelas}: ${generatedResult.topik}`,
      fileName: `Modul_${generatedResult.mapel}_Kelas${generatedResult.kelas}_${generatedResult.topik.replace(/\s+/g, '_')}.pdf`,
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Engine Kurikulum Merdeka · {settings.institutionName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Generator Modul Materi Pembelajaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hasilkan materi ajar terstruktur standar nasional: Capaian & Tujuan, Ringkasan Materi, Contoh Soal & Pembahasan, serta Asesmen 5 PG + 3 Esai.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Parameter Input Kurikulum</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pilih jenjang sekolah, tingkat kelas, mata pelajaran, dan topik.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Jenjang Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenjang Sekolah
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SD', 'SMP', 'SMA'] as const).map((j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => handleJenjangChange(j)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      jenjang === j
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Tingkat Kelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {gradesByJenjang[jenjang].map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Pelajaran ({jenjang})
              </label>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {subjectsByJenjang[jenjang].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Topik / Materi Pembelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik / Materi Spesifik
              </label>
              <input
                type="text"
                required
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Termodinamika & Hukum Kekekalan Energi"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Menyusun Materi...' : 'Generate Modul Pembelajaran'}
            </button>
          </form>

          {/* Quick preset suggestions */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Contoh Topik Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'SPLTV Kontekstual',
                'Metabolisme & Enzim',
                'Dinamika Rotasi',
                'Teks Argumentasi',
                'Ekonomi Pasar Monopoli',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopik(preset)}
                  className="text-[11px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-600 transition"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Preview Panel */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {generatedResult ? (
            <div>
              {/* Output Actions Bar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Pratinjau Modul ({generatedResult.jenjang} - Kelas {generatedResult.kelas})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin' : 'Salin Markdown'}
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh PDF
                  </button>

                  <button
                    onClick={handleSaveToPerencanaan}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Simpan ke Perencanaan
                  </button>
                </div>
              </div>

              {/* Rendered Markdown Formatted Output */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[750px] overflow-y-auto font-sans text-xs text-slate-800 leading-relaxed bg-white">
                {/* Header Kop */}
                <div className="text-center border-b border-slate-200 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    {settings.institutionName}
                  </h3>
                  <h4 className="text-xs font-bold text-slate-700 mt-0.5">
                    MODUL MATERI PEMBELAJARAN
                  </h4>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono flex items-center justify-center gap-3">
                    <span>Jenjang: {generatedResult.jenjang} - Kelas {generatedResult.kelas}</span>
                    <span>·</span>
                    <span>Mata Pelajaran: {generatedResult.mapel}</span>
                    <span>·</span>
                    <span>Topik: {generatedResult.topik}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="prose prose-xs max-w-none text-slate-800 space-y-4">
                  {generatedResult.markdown
                    .split('\n\n')
                    .filter((block: string) => !block.startsWith('---') && !block.startsWith('@Copyright'))
                    .map((block: string, i: number) => {
                      if (block.startsWith('## ')) {
                        return (
                          <h2
                            key={i}
                            className="text-sm font-bold text-slate-900 border-l-3 border-blue-600 pl-2.5 mt-6 mb-2"
                          >
                            {block.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (block.startsWith('### ')) {
                        return (
                          <h3 key={i} className="text-xs font-bold text-slate-900 mt-4 mb-1">
                            {block.replace('### ', '')}
                          </h3>
                        );
                      }
                      return (
                        <p key={i} className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {block}
                        </p>
                      );
                    })}
                </div>

                {/* Footer Requirement */}
                <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
                  {settings.copyright || '@Copyright by. Pak GuruAI'}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-600">
                Pilih parameter di sebelah kiri dan klik "Generate Modul Pembelajaran"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Modul akan disusun secara pedagogis dan terstruktur sesuai kerangka Kurikulum Merdeka.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
