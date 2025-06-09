
import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 border-t" style={{ backgroundColor: IFOOD_THEME_COLORS.white, borderColor: IFOOD_THEME_COLORS.grayInputBorder }}>
      <div className="container mx-auto px-4">
        <p className="text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
          &copy; {new Date().getFullYear()} GourmetGo Delivery. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-1" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>
          Desenvolvido por Intelektus <span style={{color: IFOOD_THEME_COLORS.red}}>❤</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;