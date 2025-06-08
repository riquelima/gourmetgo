import React from 'react';
import { Dish } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../Common/Button';
import { PlusCircleIcon, CheckCircleIcon } from '../Common/Icons';
import { IFOOD_THEME_COLORS } from '../../constants';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addItemToCart, cartItems } = useCart();
  const isInCart = cartItems.some(item => item.dish.id === dish.id);

  const handleAddToCart = () => {
    if (dish.available) {
      addItemToCart(dish);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-row items-start p-4 gap-4 transition-all duration-300 hover:shadow-lg ${!dish.available ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
      style={{boxShadow: `0 2px 8px ${IFOOD_THEME_COLORS.shadow}`}} // Adjusted shadow for list view
    >
      <div className="relative flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
        <img 
          src={dish.imageUrl} 
          alt={dish.name} 
          className="w-full h-full object-cover rounded-lg" 
        />
        {!dish.available && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
            <span 
              className="text-white font-semibold text-xs px-2 py-1 rounded-md"
              style={{ backgroundColor: IFOOD_THEME_COLORS.textSecondaryDark }}
            >
              Indisponível
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow min-w-0"> {/* min-w-0 for proper truncation */}
        <h3 
          className="text-base md:text-lg font-semibold mb-1 truncate" 
          title={dish.name}
          style={{ color: IFOOD_THEME_COLORS.textPrimaryDark }}
        >
          {dish.name}
        </h3>
        <p 
          className="text-xs md:text-sm mb-2 text-ellipsis overflow-hidden"
          style={{ color: IFOOD_THEME_COLORS.textSecondaryDark, maxHeight: '3.2em', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }} // Limit to 2 lines
        >
          {dish.description}
        </p>
        <p 
          className="text-base md:text-lg font-bold mt-auto mb-3" // mt-auto pushes price and button down
          style={{ color: IFOOD_THEME_COLORS.red }}
        >
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </p>
        <Button
          onClick={handleAddToCart}
          disabled={!dish.available || isInCart}
          variant={isInCart ? "success" : "primary"}
          size="sm" // Potentially smaller button for list view
          className={`w-full md:w-auto md:self-start ${isInCart ? `bg-[${IFOOD_THEME_COLORS.greenBanner}] hover:bg-[#3DAA64]` : ''}`}
          leftIcon={isInCart ? <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" /> : <PlusCircleIcon className="w-4 h-4 md:w-5 md:h-5" />}
        >
          {isInCart ? 'Adicionado' : (dish.available ? 'Adicionar' : 'Indisponível')}
        </Button>
      </div>
    </div>
  );
};

export default DishCard;