
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import CartItemRow from '../components/Cart/CartItemRow';
import Button from '../components/Common/Button';
import Input, { Textarea } from '../components/Common/Input';
import { ROUTES, IFOOD_THEME_COLORS } from '../constants';
import { AppSettings } from '../types';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  React.useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const fetchedSettings = await supabaseService.fetchSettings();
        setSettings(fetchedSettings);
      } catch (e) {
        console.error("Failed to fetch settings:", e);
      }
    };
    fetchStoreSettings();
  }, []);

  const deliveryFee = settings?.deliveryFeeFixed || 0;
  const subtotal = getCartTotal();
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (cartItems.length === 0) {
      setFormError("Seu carrinho está vazio.");
      return;
    }
    if (!customerName || !customerPhone || !customerAddress) {
      setFormError("Por favor, preencha todos os campos obrigatórios: Nome, Telefone e Endereço.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName,
        customerPhone,
        customerAddress,
        items: cartItems,
        notes,
      };
      const newOrder = await supabaseService.createOrder(orderData);
      clearCart();
      navigate(ROUTES.ORDER_SUCCESS, { state: { orderId: newOrder.id } });
    } catch (err) {
      console.error("Failed to create order:", err);
      setFormError('Não foi possível finalizar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (getItemCount() === 0 && !loading) {
    return (
      <div className="text-center py-16 sm:py-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{color: IFOOD_THEME_COLORS.red}}>Seu Carrinho está Vazio</h1>
        <p className="text-md sm:text-lg mb-5 sm:mb-6" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Adicione itens do nosso cardápio para continuar.</p>
        <Button onClick={() => navigate(ROUTES.HOME)} variant="primary" size="md"> 
          Ver Cardápio
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 md:mb-8 text-center" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Finalizar Pedido</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        <div className="md:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-lg" style={{boxShadow: `0 4px 12px ${IFOOD_THEME_COLORS.shadow}`}}>
          <h2 className="text-lg sm:text-xl font-semibold pb-2 sm:pb-3 mb-4 sm:mb-5 border-b" style={{color: IFOOD_THEME_COLORS.textPrimaryDark, borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
            Informações para Entrega
          </h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-5">
            <Input
              label="Nome Completo*"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Seu nome"
              required
            />
            <Input
              label="Telefone para Contato*"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              required
            />
            <Textarea
              label="Endereço Completo para Entrega*"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Rua, Número, Bairro, Complemento, Cidade"
              required
              rows={3}
            />
            <Textarea
              label="Observações (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Sem cebola, ponto da carne, etc."
              rows={2}
            />
            {formError && <p className="text-xs sm:text-sm text-center" style={{color: IFOOD_THEME_COLORS.red}}>{formError}</p>}
             <Button type="submit" variant="primary" size="md" fullWidth isLoading={loading}>
              {loading ? 'Enviando Pedido...' : 'Confirmar e Pagar'}
            </Button>
          </form>
        </div>
        
        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg" style={{boxShadow: `0 4px 12px ${IFOOD_THEME_COLORS.shadow}`}}>
          <h2 className="text-lg sm:text-xl font-semibold pb-2 sm:pb-3 mb-1 sm:mb-2 border-b" style={{color: IFOOD_THEME_COLORS.textPrimaryDark, borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
            Resumo do Pedido
          </h2>
          <div className="max-h-60 overflow-y-auto custom-scrollbar pr-0.5 sm:pr-1">
            {cartItems.map(item => (
              <CartItemRow key={item.dish.id} item={item} />
            ))}
          </div>
          {cartItems.length > 0 && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t space-y-1.5 sm:space-y-2" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
              <div className="flex justify-between text-xs sm:text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
                <span>Subtotal:</span>
                <span style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
                <span>Taxa de Entrega:</span>
                <span style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-md sm:text-lg font-bold mt-1 sm:mt-2" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>
                <span>Total:</span>
                <span style={{color: IFOOD_THEME_COLORS.red}}>R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;