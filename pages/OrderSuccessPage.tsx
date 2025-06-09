
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '../components/Common/Icons';
import Button from '../components/Common/Button';
import { ROUTES, IFOOD_THEME_COLORS } from '../constants';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 sm:py-12 md:py-20 px-3">
      <CheckCircleIcon className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-4 sm:mb-6 text-[${IFOOD_THEME_COLORS.greenBanner}]`} />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Pedido Realizado!</h1>
      {orderId && (
        <p className="text-sm sm:text-md md:text-lg mb-1 sm:mb-2" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
          O ID do seu pedido é: <strong style={{color: IFOOD_THEME_COLORS.red}}>{orderId}</strong>
        </p>
      )}
      <p className="text-sm sm:text-md md:text-lg mb-6 sm:mb-8 max-w-md" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
        Obrigado por escolher o GourmetGo! Seu pedido já está sendo preparado e em breve chegará até você.
      </p>
      <div className="flex flex-col w-full max-w-xs sm:max-w-none sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <Link to={ROUTES.HOME} className="w-full sm:w-auto">
          <Button variant="primary" size="md" fullWidth>Voltar ao Cardápio</Button>
        </Link>
        {/* <Link to="/meus-pedidos" className="w-full sm:w-auto">
          <Button variant="outline" size="md" fullWidth className="w-full">Ver Meus Pedidos</Button>
        </Link> */}
      </div>
    </div>
  );
};

export default OrderSuccessPage;