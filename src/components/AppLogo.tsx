import React from 'react';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface AppLogoProps {
  className?: string;
  size?: number;
}

/**
 * AppLogo - Menampilkan Lambang Resmi Pendidikan Nasional Tut Wuri Handayani
 * Menggunakan format vektor SVG murni sehingga tidak pernah rusak, tidak pernah 404,
 * dan selalu tampil profesional di layar maupun dokumen cetak.
 */
export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-9 h-9', size }) => {
  return <TutWuriHandayaniLogo className={className} size={size} />;
};
