
import React from 'react';
import { Dish } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../Common/Button';
import { PlusCircleIcon, MinusIcon, PlusIcon } from '../Common/Icons'; // Added MinusIcon, PlusIcon
import { IFOOD_THEME_COLORS } from '../../constants';

interface DishCardProps {
  dish: Dish;
}

const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { cartItems, addItemToCart, updateItemQuantity } = useCart();
  
  const cartItem = cartItems.find(item => item.dish.id === dish.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (dish.available) {
      // Ensures item is added with quantity 1 when "Adicionar" is clicked
      addItemToCart(dish, 1); 
    }
  };

  const handleIncreaseQuantity = () => {
    if (dish.available && currentQuantity > 0) { // Should only be callable if currentQuantity > 0
      updateItemQuantity(dish.id, currentQuantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (dish.available && currentQuantity > 0) {
      updateItemQuantity(dish.id, currentQuantity - 1);
    }
  };


  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-row items-start p-3 sm:p-4 gap-3 sm:gap-4 transition-all duration-300 hover:shadow-lg ${!dish.available ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
    >
      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
        <img 
          src={dish.imageUrl} 
          alt={dish.name} 
          className="w-full h-full object-cover rounded-lg" 
        />
        {!dish.available && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
            <span 
              className="text-white font-semibold text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md"
              style={{ backgroundColor: IFOOD_THEME_COLORS.textSecondaryDark }}
            >
              Indisponível
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow min-w-0">
        <h3 
          className="text-sm sm:text-base md:text-lg font-semibold mb-0.5 sm:mb-1 truncate" 
          title={dish.name}
          style={{ color: IFOOD_THEME_COLORS.textPrimaryDark }}
        >
          {dish.name}
        </h3>
        <p 
          className="text-xs sm:text-sm mb-1 sm:mb-2 text-ellipsis overflow-hidden"
          style={{ color: IFOOD_THEME_COLORS.textSecondaryDark, maxHeight: '2.8em', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }} // Max 2 lines
        >
          {dish.description}
        </p>
        <p 
          className="text-sm sm:text-base md:text-lg font-bold mt-auto mb-2 sm:mb-3"
          style={{ color: IFOOD_THEME_COLORS.red }}
        >
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </p>

        {currentQuantity > 0 && dish.available ? (
          <div className={`flex items-center justify-between bg-[${IFOOD_THEME_COLORS.pinkBgCategories}] text-[${IFOOD_THEME_COLORS.red}] px-3 py-2 rounded-md shadow-sm w-full sm:w-auto sm:self-start`}>
            <button
              onClick={handleDecreaseQuantity}
              className={`text-xl font-bold px-2 hover:text-[${IFOOD_THEME_COLORS.redHover}] transition disabled:opacity-50`}
              aria-label="Diminuir quantidade"
              disabled={!dish.available}
            >
              <MinusIcon className="w-5 h-5"/>
            </button>
            <span className="font-medium text-sm sm:text-base">{currentQuantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className={`text-xl font-bold px-2 hover:text-[${IFOOD_THEME_COLORS.redHover}] transition disabled:opacity-50`}
              aria-label="Aumentar quantidade"
              disabled={!dish.available}
            >
              <PlusIcon className="w-5 h-5"/>
            </button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={!dish.available}
            variant="primary"
            size="sm" // Changed from xs to sm for better height consistency with controller
            className="w-full sm:w-auto sm:self-start"
            leftIcon={<PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />} // Icon size can be adjusted if needed
          >
            {dish.available ? 'Adicionar' : 'Indisponível'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DishCard;
