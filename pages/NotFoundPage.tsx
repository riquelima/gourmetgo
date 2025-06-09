
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, IFOOD_THEME_COLORS } from '../constants';
import Button from '../components/Common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 sm:p-6" style={{backgroundColor: IFOOD_THEME_COLORS.lightGrayBg}}>
      <h1 className="text-7xl sm:text-8xl md:text-9xl font-black animate-pulse" style={{color: IFOOD_THEME_COLORS.red}}>404</h1>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-3 sm:mt-4 mb-1 sm:mb-2" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Página Não Encontrada</p>
      <p className="text-sm sm:text-md md:text-lg mb-6 sm:mb-8" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
        Oops! Parece que a página que você está procurando não existe ou foi movida.
      </p>
      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="md">
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;