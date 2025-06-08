
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
        <p className="mt-4 text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-lg" style={{color: IFOOD_THEME_COLORS.red}}>{error}</div>;
  }
  
  const displayedDishes = dishes;

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="text-left md:text-center pt-2">
        <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Seja Bem-Vindo!</h1>
        <p className="text-md md:text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Pedir seu delivery no Gourmet Go é rápido e prático!</p>
      </section>

      <section className="sticky top-[68px] z-30 py-3 -mx-4 px-4" style={{backgroundColor: IFOOD_THEME_COLORS.lightGrayBg}}>
        <Input 
            type="text"
            placeholder="Buscar em GourmetGo"
            value={searchTerm}
            onChange={handleSearchChange}
            icon={<SearchIcon className="w-5 h-5"/>}
            className="shadow-md"
            containerClassName="max-w-xl mx-auto" // Centered search bar for better focus
        />
      </section>

      {categories.length > 0 && (
        <section>
            <h2 className="text-xl font-semibold mb-3" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Categorias</h2>
            <div className="flex space-x-3 overflow-x-auto pb-3 custom-scrollbar">
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
      
      {loading && <div className="flex justify-center py-8"><LoadingSpinner color={IFOOD_THEME_COLORS.red}/></div>}

      {!loading && displayedDishes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Nenhum prato encontrado.</p>
          <p className="text-sm" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>Tente ajustar sua busca ou filtros.</p>
        </div>
      )}

      {!loading && displayedDishes.length > 0 && (
        <div>
            <h2 className="text-xl font-semibold mb-4" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>
              {selectedCategoryId ? categories.find(c=>c.id === selectedCategoryId)?.name : 'Destaques do Cardápio'}
            </h2>
            {/* Changed from grid to a single column list with responsive width */}
            <div className="space-y-4 md:space-y-5 w-full md:w-4/5 lg:w-3/5 xl:w-1/2 mx-auto">
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
