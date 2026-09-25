import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'monochrome' | 'white';
}

/**
 * Universal Official Logo Tut Wuri Handayani - Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
 * Dibangun menggunakan SVG murni (vector) agar tidak pernah rusak, tidak pernah 404,
 * dan selalu tajam pada resolusi layar maupun cetak PDF resmi.
 */
export const TutWuriHandayaniLogo: React.FC<LogoProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'color',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'monochrome') {
    return (
      <svg
        style={style}
        viewBox="0 0 100 100"
        fill="currentColor"
        className={`shrink-0 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Tut Wuri Handayani Kemendikbudristek"
      >
        <polygon points="50,4 93,25 80,82 50,96 20,82 7,25" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M50 20 C54 28 60 35 56 42 C53 46 47 46 44 42 C40 35 46 28 50 20 Z" fill="currentColor" />
        <path d="M47 42 L53 42 L51 52 L49 52 Z" fill="currentColor" />
        <path d="M50 60 C42 54 30 55 22 59 L22 72 C30 68 42 67 50 73 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 60 C58 54 70 55 78 59 L78 72 C70 68 58 67 50 73 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="60" x2="50" y2="73" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 38 Q30 42 42 50 Q30 52 16 48 Z" fill="currentColor" opacity="0.8" />
        <path d="M82 38 Q70 42 58 50 Q70 52 84 48 Z" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }

  return (
    <div
      style={style}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        aria-label="Logo Resmi Tut Wuri Handayani Kemendikbudristek"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="twhBgGrad" x1="60" y1="4" x2="60" y2="116" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E3A8A" />
            <stop offset="0.6" stopColor="#172554" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="twhGoldBorder" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#EAB308" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="twhFlameGrad" x1="60" y1="20" x2="60" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.3" stopColor="#F59E0B" />
            <stop offset="0.75" stopColor="#DC2626" />
            <stop offset="1" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Segi Lima / Perisai Lambang Pancasila & Tut Wuri Handayani */}
        <polygon
          points="60,6 112,28 97,97 60,114 23,97 8,28"
          fill="url(#twhBgGrad)"
          stroke="url(#twhGoldBorder)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Garis batas dalam emas tipis */}
        <polygon
          points="60,11 106,31 93,93 60,108 27,93 14,31"
          fill="none"
          stroke="#FACC15"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Sayap Kiri Tut Wuri Handayani (Sayap Pendidikan) */}
        <g fill="#38BDF8" opacity="0.95">
          <path d="M22 42 C32 45 44 50 52 58 C40 60 28 58 18 52 C16 48 18 44 22 42 Z" />
          <path d="M20 54 C30 57 42 61 48 68 C38 69 26 67 18 62 C16 58 18 55 20 54 Z" opacity="0.85" />
          <path d="M24 64 C32 67 40 70 46 76 C36 76 28 74 22 70 C20 67 22 65 24 64 Z" opacity="0.7" />
        </g>

        {/* Sayap Kanan Tut Wuri Handayani */}
        <g fill="#38BDF8" opacity="0.95">
          <path d="M98 42 C88 45 76 50 68 58 C80 60 92 58 102 52 C104 48 102 44 98 42 Z" />
          <path d="M100 54 C90 57 78 61 72 68 C82 69 94 67 102 62 C104 58 102 55 100 54 Z" opacity="0.85" />
          <path d="M96 64 C88 67 80 70 74 76 C84 76 92 74 98 70 C100 67 98 65 96 64 Z" opacity="0.7" />
        </g>

        {/* Obor Menyala (Semangat Pembelajaran Abadi) */}
        {/* Lidah Api Utama */}
        <path
          d="M60 20 C67 29 74 39 68 49 C64 55 56 55 52 49 C46 39 53 29 60 20 Z"
          fill="url(#twhFlameGrad)"
        />
        {/* Lidah Api Dalam (Inti Cahaya Kuning Terang) */}
        <path
          d="M60 28 C64 34 67 40 64 45 C62 48 58 48 56 45 C53 40 56 34 60 28 Z"
          fill="#FEF08A"
        />

        {/* Gagang / Tangkai Obor Emas */}
        <path
          d="M57 50 L63 50 L61 63 L59 63 Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1"
        />
        <ellipse cx="60" cy="50" rx="4" ry="1.5" fill="#FDE047" />

        {/* Buku Terbuka (Sumber Pengetahuan & Pendidikan) */}
        {/* Halaman Kiri Buku */}
        <path
          d="M60 72 C50 65 35 66 26 71 L26 88 C35 83 50 82 60 89 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.8"
        />
        {/* Halaman Kanan Buku */}
        <path
          d="M60 72 C70 65 85 66 94 71 L94 88 C85 83 70 82 60 89 Z"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.8"
        />
        {/* Garis Punggung Buku */}
        <line x1="60" y1="72" x2="60" y2="89" stroke="#0284C7" strokeWidth="3" />

        {/* Garis Isi Tulisan pada Lembar Buku */}
        <line x1="31" y1="76" x2="53" y2="74" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="31" y1="80" x2="53" y2="78" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="31" y1="84" x2="49" y2="82" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

        <line x1="67" y1="74" x2="89" y2="76" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="67" y1="78" x2="89" y2="80" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="71" y1="82" x2="89" y2="84" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Lingkaran Bintang Emas Puncak */}
        <circle cx="60" cy="15" r="2.5" fill="#FDE047" />

        {/* Pita Bawah Lambang */}
        <path
          d="M38 98 Q60 104 82 98 L78 103 Q60 108 42 103 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};
