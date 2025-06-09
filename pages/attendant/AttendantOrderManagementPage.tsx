
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, Role } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_COLORS, IFOOD_THEME_COLORS, NEW_ORDER_POLL_INTERVAL } from '../../constants';
import Input, { Select } from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { EyeIcon, PencilIcon, SearchIcon, CalendarIcon, ArrowPathIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '../../components/Common/Icons';
import { useAuth } from '../../contexts/AuthContext';
import NotificationPopup from '../../components/Common/NotificationPopup';


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const AttendantOrderManagementPage: React.FC = () => {
  const { user } = useAuth(); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>(OrderStatus.NEW);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [lastOrdersCount, setLastOrdersCount] = useState(0);
  const [showNewOrderNotification, setShowNewOrderNotification] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


  const fetchOrders = useCallback(async (isPolling: boolean = false) => {
    if (!isPolling) setLoading(true);
    setListError(null);
    try {
      const fetchedOrders = await supabaseService.fetchOrders({
        status: filterStatus || undefined,
        date: filterDate || undefined,
        searchTerm: searchTerm || undefined,
      });

      if (isPolling && fetchedOrders.length > lastOrdersCount && lastOrdersCount !== 0 && fetchedOrders[0]?.status === OrderStatus.NEW) {
         setShowNewOrderNotification(true);
      }
      setOrders(fetchedOrders);
      setLastOrdersCount(fetchedOrders.length);

    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setListError('Erro ao carregar pedidos.');
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [filterStatus, filterDate, searchTerm, lastOrdersCount]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterDate, searchTerm]);
  
  useEffect(() => {
    const intervalId = setInterval(() => fetchOrders(true), NEW_ORDER_POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);


  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalError(null);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setIsUpdatingStatus(true);
    setModalError(null);
    try {
      await supabaseService.updateOrderStatus(selectedOrder.id, newStatus as OrderStatus);
      fetchOrders();
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to update order status:", err);
      setModalError('Erro ao atualizar status do pedido.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    const iconClass = "w-3 h-3 sm:w-3.5 sm:h-3.5";
    switch(status) {
        case OrderStatus.NEW: return <ClockIcon className={iconClass}/>;
        case OrderStatus.PREPARING: return <PencilIcon className={iconClass}/>;
        case OrderStatus.SENT: return <TruckIcon className={iconClass}/>;
        case OrderStatus.DELIVERED: return <CheckCircleIcon className={iconClass}/>;
        case OrderStatus.CANCELED: return <XCircleIcon className={iconClass}/>;
        default: return null;
    }
  };
  
  const statusOptions = [{ value: '', label: 'Todos os Status' }, ...ORDER_STATUS_OPTIONS.map(s => ({ value: s, label: s }))];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Pedidos {user?.role === Role.ATTENDANT ? 'do Atendente' : '(Visão Admin)'}</h1>
         <Button onClick={() => fetchOrders()} variant="outline" isLoading={loading && orders.length === 0} leftIcon={<ArrowPathIcon className="w-4 h-4"/>} size="sm" className="w-full sm:w-auto">
            Atualizar Pedidos
        </Button>
      </div>
      
      <div className="p-3 sm:p-4 md:p-5 rounded-xl shadow-md flex flex-col sm:flex-row gap-3 sm:gap-4 items-center flex-wrap" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <div className="relative w-full sm:flex-grow">
             <Input 
                type="text"
                placeholder="Buscar pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<SearchIcon className="w-4 h-4"/>}
                containerClassName="w-full"
                className="text-sm"
            />
        </div>
        <Select
            placeholder="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | '')}
            options={statusOptions}
            containerClassName="w-full sm:w-auto sm:min-w-[160px]"
            className="text-sm"
        />
        <div className="relative w-full sm:w-auto">
             <Input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                icon={<CalendarIcon className="w-4 h-4"/>}
                containerClassName="w-full"
                className="text-sm"
            />
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-10"><LoadingSpinner size="lg" color={IFOOD_THEME_COLORS.red} /></div>
      ) : listError && orders.length === 0 ? (
        <p className="text-center py-4" style={{color: IFOOD_THEME_COLORS.red}}>{listError}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
            <p className="text-md sm:text-lg" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Nenhum pedido encontrado.</p>
             <p className="text-xs sm:text-sm" style={{color: IFOOD_THEME_COLORS.grayPlaceholder}}>Verifique os filtros ou aguarde novos pedidos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
          <table className="min-w-full divide-y" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
            <thead style={{backgroundColor: IFOOD_THEME_COLORS.tableHeaderBg}}>
              <tr>
                <th scope="col" className="px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>ID</th>
                <th scope="col" className="px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Cliente</th>
                <th scope="col" className="hidden md:table-cell px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Data</th>
                <th scope="col" className="hidden sm:table-cell px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Total</th>
                <th scope="col" className="px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Status</th>
                <th scope="col" className="px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>
              {orders.map((order, index) => (
                <tr key={order.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : `bg-[${IFOOD_THEME_COLORS.tableRowHoverBg}]`} hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}]/50`}>
                  <td className="px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs font-mono" style={{color: IFOOD_THEME_COLORS.red}}>#{order.id.slice(-6)}</td>
                  <td className="px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-xs" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}} title={order.customerName}>{order.customerName}</td>
                  <td className="hidden md:table-cell px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>{formatDate(order.createdAt)}</td>
                  <td className="hidden sm:table-cell px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>R$ {order.totalAmount.toFixed(2)}</td>
                  <td className="px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                     <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 inline-flex items-center space-x-1 text-[10px] sm:text-xs leading-5 font-semibold rounded-full border ${ORDER_STATUS_COLORS[order.status].bg} ${ORDER_STATUS_COLORS[order.status].text} ${ORDER_STATUS_COLORS[order.status].border || 'border-transparent'}`}>
                      {getStatusIcon(order.status)}
                      <span className="hidden sm:inline">{order.status}</span>
                      <span className="sm:hidden">{order.status.substring(0,3)}.</span>
                    </span>
                  </td>
                  <td className="px-2.5 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs font-medium space-x-0.5 sm:space-x-1">
                    <Button variant="ghost" size="xs" onClick={() => openDetailModal(order)} aria-label="Ver Detalhes" className={`p-1 sm:p-1.5 hover:bg-gray-200`}>
                        <EyeIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 hover:text-gray-700 transition-colors duration-300`}/>
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => openStatusModal(order)} aria-label="Alterar Status" className={`p-1 sm:p-1.5 hover:bg-[${IFOOD_THEME_COLORS.yellowAccent}]/30`}>
                        <PencilIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 hover:text-yellow-600 transition-colors duration-300`}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedOrder && isDetailModalOpen && (
         <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Detalhes do Pedido #${selectedOrder.id.slice(-6)}`} size="md">
           <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            <p><strong>Cliente:</strong> <span className="text-gray-900">{selectedOrder.customerName}</span></p>
            <p><strong>Telefone:</strong> <span className="text-gray-900">{selectedOrder.customerPhone}</span></p>
            <p><strong>Endereço:</strong> <span className="text-gray-900">{selectedOrder.customerAddress}</span></p>
            <p><strong>Data:</strong> <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span></p>
            <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[selectedOrder.status].bg} ${ORDER_STATUS_COLORS[selectedOrder.status].text} ${ORDER_STATUS_COLORS[selectedOrder.status].border || 'border-transparent'}`}>{selectedOrder.status}</span></p>
            <p><strong>Total:</strong> <span className="text-gray-900 font-semibold">R$ {selectedOrder.totalAmount.toFixed(2)}</span></p>
            {selectedOrder.notes && <p><strong>Observações:</strong> <span className="text-gray-900">{selectedOrder.notes}</span></p>}
            <h4 className="font-semibold pt-2 sm:pt-3 mt-2 sm:mt-3 border-t text-gray-800" style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}>Itens:</h4>
            <ul className="list-disc list-inside space-y-1 max-h-40 sm:max-h-48 overflow-y-auto custom-scrollbar pr-1 text-gray-700">
              {selectedOrder.items.map(item => (
                <li key={item.dish.id}>{item.quantity}x {item.dish.name} (R$ {item.dish.price.toFixed(2)})</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {selectedOrder && isStatusModalOpen && (
        <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title={`Alterar Status: Pedido #${selectedOrder.id.slice(-6)}`} size="sm">
          <div className="space-y-3 sm:space-y-4">
             <p className="text-xs sm:text-sm">Status Atual: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[selectedOrder.status].bg} ${ORDER_STATUS_COLORS[selectedOrder.status].text} ${ORDER_STATUS_COLORS[selectedOrder.status].border || 'border-transparent'}`}>{selectedOrder.status}</span></p>
            <Select
              label="Novo Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              options={ORDER_STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
              placeholder="Selecione o novo status"
            />
             {modalError && <p className="text-xs sm:text-sm text-center" style={{color: IFOOD_THEME_COLORS.red}}>{modalError}</p>}
            <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0 pt-2 sm:pt-3">
                <Button variant="outline" onClick={() => setIsStatusModalOpen(false)} size="sm" className="w-full sm:w-auto">Cancelar</Button>
                <Button variant="primary" onClick={handleStatusUpdate} isLoading={isUpdatingStatus} size="sm" className="w-full sm:w-auto">Salvar</Button>
            </div>
          </div>
        </Modal>
      )}
      
      {showNewOrderNotification && (
        <NotificationPopup 
            title="Novo Pedido Recebido!"
            message="Um novo pedido acabou de chegar. Atualize a lista para visualizá-lo."
            type="info"
            onClose={() => setShowNewOrderNotification(false)}
        />
      )}
    </div>
  );
};

export default AttendantOrderManagementPage;