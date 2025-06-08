
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, IFOOD_THEME_COLORS } from '../constants';
import Button from '../components/Common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6" style={{backgroundColor: IFOOD_THEME_COLORS.lightGrayBg}}>
      <h1 className="text-8xl md:text-9xl font-black animate-pulse" style={{color: IFOOD_THEME_COLORS.red}}>404</h1>
      <p className="text-2xl md:text-3xl font-bold mt-4 mb-2" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Página Não Encontrada</p>
      <p className="text-md md:text-lg mb-8" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
        Oops! Parece que a página que você está procurando não existe ou foi movida.
      </p>
      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="lg">
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
