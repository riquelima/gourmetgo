
import React, { useState, useEffect, useCallback } from 'react';
import { Dish, Category } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Input, { Select, Textarea } from '../../components/Common/Input';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { PlusCircleIcon, PencilIcon, TrashIcon, SearchIcon, UploadIcon, ArrowPathIcon } from '../../components/Common/Icons';
import { IFOOD_THEME_COLORS } from '../../constants';


const AdminMenuManagementPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<Partial<Dish> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchDishesAndCategories = useCallback(async () => {
    setLoading(true);
    setFormError(null);
    try {
      const [fetchedCategories, fetchedDishes] = await Promise.all([
        supabaseService.fetchCategories(),
        supabaseService.fetchDishes(filterCategory || undefined, searchTerm || undefined)
      ]);
      setCategories(fetchedCategories);
      setDishes(fetchedDishes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setFormError('Erro ao carregar dados do cardápio.');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, searchTerm]);

  useEffect(() => {
    fetchDishesAndCategories();
  }, [fetchDishesAndCategories]);

  const openModalForCreate = () => {
    setCurrentDish({ name: '', description: '', price: 0, categoryId: categories[0]?.id || '', available: true });
    setImageFile(null);
    setImagePreview(null);
    setIsEditMode(false);
    setIsModalOpen(true);
    setFormError(null);
  };

  const openModalForEdit = (dish: Dish) => {
    setCurrentDish(dish);
    setImageFile(null);
    setImagePreview(dish.imageUrl);
    setIsEditMode(true);
    setIsModalOpen(true);
    setFormError(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentDish(null);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentDish) return;
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setCurrentDish({ ...currentDish, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setCurrentDish({ ...currentDish, [name]: parseFloat(value) });
    }
    else {
      setCurrentDish({ ...currentDish, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDish || !currentDish.name || !currentDish.categoryId || currentDish.price === undefined) {
      setFormError("Nome, categoria e preço são obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      let imageUrl = currentDish.imageUrl;
      if (imageFile) {
        imageUrl = await supabaseService.uploadImage(imageFile); 
      }

      const dishData = {
        ...currentDish,
        price: Number(currentDish.price),
        imageUrl: imageUrl || 'https://picsum.photos/seed/placeholder/400/300',
      };
      
      const { id, imageFile: _imageFile, ...dataToSend } = dishData as Partial<Dish> & {imageFile?: File, id?: string};

      if (isEditMode && currentDish.id) {
        await supabaseService.updateDish(currentDish.id, dataToSend as Partial<Dish>);
      } else {
        await supabaseService.addDish(dataToSend as Omit<Dish, 'id' | 'categoryName' | 'imageUrl'>);
      }
      fetchDishesAndCategories();
      handleModalClose();
    } catch (err) {
      console.error("Failed to save dish:", err);
      setFormError('Erro ao salvar o prato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDish = async (dishId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este prato?')) {
      setLoading(true); 
      try {
        await supabaseService.deleteDish(dishId);
        fetchDishesAndCategories(); // Refreshes list, setLoading will be handled by it
      } catch (err) {
        console.error("Failed to delete dish:", err);
        setFormError('Erro ao excluir o prato.'); 
        setLoading(false); // Manually set loading if fetchDishesAndCategories isn't called or fails
      }
    }
  };
  
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Gerenciar Cardápio</h1>
        <Button onClick={openModalForCreate} leftIcon={<PlusCircleIcon className="w-5 h-5"/>} variant="primary" size="md"> 
          Novo Prato
        </Button>
      </div>

      <div className="p-4 md:p-5 rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <Input 
            type="text"
            placeholder="Buscar prato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon />}
            containerClassName="w-full md:flex-grow"
        />
        <Select
            placeholder="Todas as Categorias"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[{ value: '', label: 'Todas as Categorias' }, ...categoryOptions]}
            containerClassName="w-full md:w-auto md:min-w-[200px]"
        />
         <Button onClick={() => fetchDishesAndCategories()} variant="outline" isLoading={loading && dishes.length > 0} leftIcon={<ArrowPathIcon className="w-4 h-4"/>} size="md">
            Atualizar
        </Button>
      </div>

      {loading && dishes.length === 0 ? (
        <div className="flex justify-center py-10"><LoadingSpinner size="lg" color={IFOOD_THEME_COLORS.red} /></div>
      ) : formError && dishes.length === 0 ? ( 
        <p className="text-center py-4" style={{color: IFOOD_THEME_COLORS.red}}>{formError}</p>
      ) : dishes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
          <p className="text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Nenhum prato encontrado.</p>
          <p className="text-sm" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>Tente limpar os filtros ou adicionar novos pratos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
          <table className="min-w-full divide-y" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
            <thead style={{backgroundColor: IFOOD_THEME_COLORS.tableHeaderBg}}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Imagem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Preço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Disponível</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
              {dishes.map((dish, index) => (
                <tr key={dish.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : `bg-[${IFOOD_THEME_COLORS.tableRowHoverBg}]`} hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}]/50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-md object-cover transition-transform duration-300 hover:scale-110"/>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>{dish.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>{dish.categoryName || categories.find(c=>c.id === dish.categoryId)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>R$ {dish.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      dish.available ? `bg-green-100 text-green-700` : `bg-red-100 text-red-700` 
                    }`}>
                      {dish.available ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openModalForEdit(dish)} aria-label="Editar" className={`p-1.5 hover:bg-[${IFOOD_THEME_COLORS.yellowAccent}]/30`}>
                        <PencilIcon className={`w-4 h-4 text-yellow-500 hover:text-yellow-600 transition-colors duration-300`}/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDish(dish.id)} aria-label="Excluir" className={`p-1.5 hover:bg-[${IFOOD_THEME_COLORS.red}]/20`}>
                        <TrashIcon className={`w-4 h-4 text-red-500 hover:text-[${IFOOD_THEME_COLORS.redHover}] transition-colors duration-300`}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && currentDish && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Editar Prato' : 'Novo Prato'} size="lg">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <Input label="Nome do Prato*" name="name" value={currentDish.name || ''} onChange={handleInputChange} required />
            <Textarea label="Descrição" name="description" value={currentDish.description || ''} onChange={handleInputChange} rows={3}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Preço (R$)*" name="price" type="number" value={currentDish.price || 0} onChange={handleInputChange} required step="0.01" min="0"/>
                <Select label="Categoria*" name="categoryId" value={currentDish.categoryId || ''} onChange={handleInputChange} options={categoryOptions} required placeholder="Selecione uma categoria"/>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 text-[${IFOOD_THEME_COLORS.textSecondaryDark}]`}>Imagem do Prato</label>
              <div className="mt-1 flex items-center space-x-4">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border transition-all duration-300 hover:scale-105" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}} />}
                <label htmlFor="imageFile" className={`cursor-pointer bg-[${IFOOD_THEME_COLORS.lightGrayBg}] hover:bg-[${IFOOD_THEME_COLORS.grayInputBorder}] text-[${IFOOD_THEME_COLORS.textPrimaryDark}] font-medium py-2 px-4 rounded-lg text-sm inline-flex items-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 border border-[${IFOOD_THEME_COLORS.grayInputBorder}]`}>
                  <UploadIcon className="w-4 h-4 mr-2"/>
                  {imageFile ? imageFile.name.substring(0,20)+'...' : (isEditMode ? 'Alterar Imagem' : 'Selecionar Imagem')}
                </label>
                <input id="imageFile" name="imageFile" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="available"
                name="available"
                type="checkbox"
                checked={currentDish.available === undefined ? true : currentDish.available}
                onChange={handleInputChange}
                className={`h-4 w-4 rounded text-[${IFOOD_THEME_COLORS.red}] border-[${IFOOD_THEME_COLORS.grayInputBorder}] focus:ring-[${IFOOD_THEME_COLORS.red}] focus:ring-offset-0 transition-all duration-300`}
              />
              <label htmlFor="available" className="ml-2 block text-sm" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>
                Disponível para venda
              </label>
            </div>

            {formError && <p className="text-sm text-center" style={{color: IFOOD_THEME_COLORS.red}}>{formError}</p>}
            
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleModalClose} size="md">Cancelar</Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting} size="md">
                    {isEditMode ? 'Salvar Alterações' : 'Adicionar Prato'}
                </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminMenuManagementPage;
