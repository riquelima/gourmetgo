
import React from 'react';
import { CartItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { TrashIcon, PlusIcon, MinusIcon } from '../Common/Icons';
import { IFOOD_THEME_COLORS } from '../../constants';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateItemQuantity, removeItemFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-3 sm:py-4 border-b last:border-b-0 transition-all duration-300" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0"> {/* flex-1 min-w-0 for name truncation */}
        <img 
          src={item.dish.imageUrl} 
          alt={item.dish.name} 
          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md sm:rounded-lg transition-transform duration-300 hover:scale-105"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs sm:text-sm truncate" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}} title={item.dish.name}>{item.dish.name}</h4>
          <p className="text-xs" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>R$ {item.dish.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <div className="flex items-center border rounded" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
          <button 
            onClick={() => updateItemQuantity(item.dish.id, item.quantity - 1)}
            className="p-1 sm:p-1.5 disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            style={{color: IFOOD_THEME_COLORS.red}}
            aria-label="Diminuir quantidade"
          >
            <MinusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span className="px-1.5 sm:px-2 text-xs sm:text-sm font-medium" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>{item.quantity}</span>
          <button 
            onClick={() => updateItemQuantity(item.dish.id, item.quantity + 1)}
            className="p-1 sm:p-1.5 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
             style={{color: IFOOD_THEME_COLORS.red}}
            aria-label="Aumentar quantidade"
          >
            <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <p className="text-xs sm:text-sm font-semibold w-12 sm:w-16 text-right" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>
          R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
        <button 
          onClick={() => removeItemFromCart(item.dish.id)} 
          className="text-slate-400 hover:text-red-500 transition-all duration-300 ease-in-out p-0.5 sm:p-1 hover:scale-110 active:scale-95"
          aria-label="Remover item"
        >
          <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;