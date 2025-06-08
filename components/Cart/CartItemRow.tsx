
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
    <div className="flex items-center justify-between py-4 border-b last:border-b-0 transition-all duration-300" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
      <div className="flex items-center space-x-3">
        <img 
          src={item.dish.imageUrl} 
          alt={item.dish.name} 
          className="w-14 h-14 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
        <div>
          <h4 className="font-semibold text-sm" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>{item.dish.name}</h4>
          <p className="text-xs" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>R$ {item.dish.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex items-center border rounded-md" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
          <button 
            onClick={() => updateItemQuantity(item.dish.id, item.quantity - 1)}
            className="p-1.5 sm:p-2 disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            style={{color: IFOOD_THEME_COLORS.red}}
            // Removed: disabled={item.quantity <= 1} 
            // Now the button is always enabled, updateItemQuantity handles quantity 0 by removing the item.
            aria-label="Diminuir quantidade"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="px-2 sm:px-3 text-sm font-medium" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>{item.quantity}</span>
          <button 
            onClick={() => updateItemQuantity(item.dish.id, item.quantity + 1)}
            className="p-1.5 sm:p-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
             style={{color: IFOOD_THEME_COLORS.red}}
            aria-label="Aumentar quantidade"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm font-semibold w-16 sm:w-20 text-right" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>
          R$ {(item.dish.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>
        <button 
          onClick={() => removeItemFromCart(item.dish.id)} 
          className="text-slate-500 hover:text-red-500 transition-all duration-300 ease-in-out p-1 hover:scale-110 active:scale-95"
          aria-label="Remover item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
