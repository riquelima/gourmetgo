
import React, { useState, useEffect, useCallback } from 'react';
import { Dish, Category } from '../types';
import { supabaseService } from '../services/supabaseService';
import DishCard from '../components/Menu/DishCard';
import CategoryChip from '../components/Menu/CategoryChip';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { SearchIcon } from '../components/Common/Icons';
import Input from '../components/Common/Input';
import { IFOOD_THEME_COLORS } from '../constants';

const PublicMenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const logoUrl = "https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/logosite.png";

  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedCategories, fetchedDishes] = await Promise.all([
        supabaseService.fetchCategories(),
        supabaseService.fetchDishes(selectedCategoryId || undefined, searchTerm || undefined)
      ]);
      setCategories(fetchedCategories);
      setDishes(fetchedDishes);
    } catch (err) {
      console.error("Failed to fetch menu data:", err);
      setError('Não foi possível carregar o cardápio. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, searchTerm]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(prevId => (prevId === categoryId ? null : categoryId));
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading && dishes.length === 0 && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" color={IFOOD_THEME_COLORS.red} />
        <p className="mt-4 text-md sm:text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-md sm:text-lg" style={{color: IFOOD_THEME_COLORS.red}}>{error}</div>;
  }
  
  const displayedDishes = dishes;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <section className="pt-1 sm:pt-2">
        <div className="flex justify-center items-center mt-6 mb-4">
          <img 
            src={logoUrl} 
            alt="GourmetGo Logo" 
            className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" 
          />
        </div>
        <div className="flex flex-col items-center text-center md:items-start md:text-left px-4 md:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0.5 sm:mb-1" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Seja Bem-Vindo!</h1>
          <p className="text-sm sm:text-md md:text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Pedir seu delivery no Gourmet Go é rápido e prático!</p>
        </div>
      </section>

      <section className="sticky top-[60px] sm:top-[68px] z-30 py-2 sm:py-3 -mx-3 sm:-mx-4 px-3 sm:px-4 mb-2" style={{backgroundColor: IFOOD_THEME_COLORS.lightGrayBg}}>
        <Input 
            type="text"
            placeholder="Buscar em GourmetGo"
            value={searchTerm}
            onChange={handleSearchChange}
            icon={<SearchIcon className="w-4 h-4 sm:w-5 sm:w-5"/>}
            className="text-sm" 
            containerClassName="w-full max-w-md mx-auto md:mx-0 transition-all duration-300 ease-in-out" 
        />
      </section>

      {categories.length > 0 && (
        <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Categorias</h2>
            <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 sm:pb-3 custom-scrollbar">
            <CategoryChip
                name="Todos"
                isActive={selectedCategoryId === null}
                onClick={() => handleCategoryClick(null)}
            />
            {categories.map(category => (
                <CategoryChip
                key={category.id}
                name={category.name}
                isActive={selectedCategoryId === category.id}
                onClick={() => handleCategoryClick(category.id)}
                />
            ))}
            </div>
        </section>
      )}
      
      {loading && <div className="flex justify-center py-6 sm:py-8"><LoadingSpinner color={IFOOD_THEME_COLORS.red}/></div>}

      {!loading && displayedDishes.length === 0 && (
        <div className="text-center py-8 sm:py-10">
          <p className="text-lg sm:text-xl" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Nenhum prato encontrado.</p>
          <p className="text-xs sm:text-sm" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>Tente ajustar sua busca ou filtros.</p>
        </div>
      )}

      {!loading && displayedDishes.length > 0 && (
        <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>
              {selectedCategoryId ? categories.find(c=>c.id === selectedCategoryId)?.name : 'Destaques do Cardápio'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
            {displayedDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} />
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenuPage;
