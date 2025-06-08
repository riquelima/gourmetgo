
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { IFOOD_THEME_COLORS } from '../../constants';
import { SaveIcon } from '../../components/Common/Icons'; 

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentSettings = await supabaseService.fetchSettings();
        setSettings(currentSettings);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError('Erro ao carregar as configurações.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await supabaseService.updateSettings(settings);
      setSuccessMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError('Erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><LoadingSpinner size="lg" color={IFOOD_THEME_COLORS.red}/></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Configurações Gerais</h1>
      {error && <p className="p-3 rounded-lg mb-4 text-sm bg-red-50 border border-red-200" style={{ color: IFOOD_THEME_COLORS.red}}>{error}</p>}
      {successMessage && <p className="p-3 rounded-lg mb-4 text-sm bg-green-50 border border-green-200" style={{ color: IFOOD_THEME_COLORS.greenBanner}}>{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-xl shadow-xl space-y-6" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <div>
          <h2 className="text-lg md:text-xl font-semibold pb-2 mb-4" style={{color: IFOOD_THEME_COLORS.textPrimaryDark, borderBottom: `1px solid ${IFOOD_THEME_COLORS.grayInputBorder}`}}>Horário de Funcionamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Horário de Abertura"
              type="time"
              name="openingTime"
              value={settings.openingTime || ''}
              onChange={handleInputChange}
            />
            <Input
              label="Horário de Fechamento"
              type="time"
              name="closingTime"
              value={settings.closingTime || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-semibold pb-2 mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark, borderBottom: `1px solid ${IFOOD_THEME_COLORS.grayInputBorder}`}}>Status da Loja</h2>
          <div className="flex items-center mt-1">
            <input
              id="isStoreOpenManual"
              name="isStoreOpenManual"
              type="checkbox"
              checked={settings.isStoreOpenManual === undefined ? true : settings.isStoreOpenManual}
              onChange={handleInputChange}
              className={`h-4 w-4 rounded text-[${IFOOD_THEME_COLORS.red}] border-[${IFOOD_THEME_COLORS.grayInputBorder}] focus:ring-[${IFOOD_THEME_COLORS.red}] focus:ring-offset-0 transition-all duration-300`}
            />
            <label htmlFor="isStoreOpenManual" className="ml-3 block text-sm font-medium" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
              Loja aberta para pedidos (controle manual)
            </label>
          </div>
          <p className="text-xs mt-1" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>
            Desmarque para fechar a loja temporariamente, independente do horário de funcionamento.
          </p>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-semibold pb-2 mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark, borderBottom: `1px solid ${IFOOD_THEME_COLORS.grayInputBorder}`}}>Taxa de Entrega</h2>
          <Input
            label="Taxa de Entrega Fixa (R$)"
            type="number"
            name="deliveryFeeFixed"
            value={settings.deliveryFeeFixed || 0}
            onChange={handleInputChange}
            step="0.01"
            min="0"
          />
        </div>

        <div className="pt-4 text-right">
          <Button type="submit" variant="primary" size="lg" isLoading={saving} leftIcon={<SaveIcon className="w-5 h-5"/>}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
