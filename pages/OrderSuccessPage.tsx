
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '../components/Common/Icons';
import Button from '../components/Common/Button';
import { ROUTES, IFOOD_THEME_COLORS } from '../constants';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
      <CheckCircleIcon className={`w-20 h-20 md:w-24 md:h-24 mb-6 text-[${IFOOD_THEME_COLORS.greenBanner}]`} />
      <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Pedido Realizado!</h1>
      {orderId && (
        <p className="text-md md:text-lg mb-2" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
          O ID do seu pedido é: <strong style={{color: IFOOD_THEME_COLORS.red}}>{orderId}</strong>
        </p>
      )}
      <p className="text-md md:text-lg mb-8 max-w-md px-4" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
        Obrigado por escolher o GourmetGo! Seu pedido já está sendo preparado e em breve chegará até você.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link to={ROUTES.HOME}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto">Voltar ao Cardápio</Button>
        </Link>
        {/* <Link to="/meus-pedidos">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">Ver Meus Pedidos</Button>
        </Link> */}
      </div>
    </div>
  );
};

export default OrderSuccessPage;