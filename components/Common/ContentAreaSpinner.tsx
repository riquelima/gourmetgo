import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

const ContentAreaSpinner: React.FC = () => {
  const logoUrl = "https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/logonavegador.png";

  return (
    <div className="w-full h-64 flex items-center justify-center relative" role="status" aria-live="polite">
      <div 
        className={`w-24 h-24 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[${IFOOD_THEME_COLORS.red}]/70 animate-spin-slow absolute`}
      ></div>
      <img
        src={logoUrl}
        alt="Logo GourmetGo"
        className="w-20 h-20 relative z-10 object-contain"
      />
      <span className="sr-only">Carregando conteúdo...</span>
    </div>
  );
};

export default ContentAreaSpinner;