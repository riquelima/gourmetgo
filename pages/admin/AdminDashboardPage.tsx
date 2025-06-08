
import React, { useEffect, useState } from 'react';
import { supabaseService } from '../../services/supabaseService';
import { ChartData } from '../../types';
import ChartComponent from '../../components/Admin/ChartComponent';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { IFOOD_THEME_COLORS } from '../../constants';
import { ChartBarIcon, ShoppingBagIcon, CurrencyDollarIcon, IconProps } from '../../components/Common/Icons';

interface DashboardSummary {
  totalOrdersToday: number;
  revenueToday: number;
  pendingOrders: number;
}

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<IconProps>; 
  iconBgColor?: string;
  iconColor?: string;
}

const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ordersPerDay, setOrdersPerDay] = useState<ChartData | null>(null);
  const [revenuePerDay, setRevenuePerDay] = useState<ChartData | null>(null);
  const [ordersByStatus, setOrdersByStatus] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          summaryData,
          ordersDayData,
          revenueDayData,
          statusData
        ] = await Promise.all([
          supabaseService.getDashboardSummary(),
          supabaseService.getOrdersPerDay(7),
          supabaseService.getRevenuePerDay(7),
          supabaseService.getOrdersByStatus()
        ]);

        setSummary(summaryData);

        setOrdersPerDay({
          labels: ordersDayData.map(d => new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short'})),
          datasets: [{
            label: 'Pedidos por Dia',
            data: ordersDayData.map(d => d.count),
          }]
        });

        setRevenuePerDay({
          labels: revenueDayData.map(d => new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short'})),
          datasets: [{
            label: 'Receita por Dia (R$)',
            data: revenueDayData.map(d => d.revenue),
          }]
        });
        
        const statusChartBackgroundColors = [
            `${IFOOD_THEME_COLORS.pinkPromoBg}BF`, 
            `${IFOOD_THEME_COLORS.yellowAccent}BF`,
            `rgba(59, 130, 246, 0.75)`, // blue-500 with alpha
            `${IFOOD_THEME_COLORS.greenBanner}BF`,
            `rgba(100, 116, 139, 0.75)`, // slate-500 with alpha
        ];
         const statusChartBorderColors = [
            IFOOD_THEME_COLORS.red, 
            '#B45309', // amber-600
            '#2563EB', // blue-600
            IFOOD_THEME_COLORS.greenBanner,
            '#475569', // slate-600
        ];


        setOrdersByStatus({
            labels: statusData.map(s => s.status),
            datasets: [{
                label: 'Pedidos por Status',
                data: statusData.map(s => s.count),
                backgroundColor: statusData.map((s, index) => statusChartBackgroundColors[index % statusChartBackgroundColors.length]),
                borderColor: statusData.map((s, index) => statusChartBorderColors[index % statusChartBorderColors.length]),
                borderWidth: 1,
            }]
        });

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><LoadingSpinner size="lg" color={IFOOD_THEME_COLORS.red} /></div>;
  }

  if (error) {
    return <div className="text-center py-10" style={{color: IFOOD_THEME_COLORS.red}}>{error}</div>;
  }

  const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, iconBgColor, iconColor = IFOOD_THEME_COLORS.white }) => (
    <div className="p-5 md:p-6 rounded-xl shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{backgroundColor: IFOOD_THEME_COLORS.white}}>
        <div className={`p-3 rounded-full`} style={{backgroundColor: iconBgColor || IFOOD_THEME_COLORS.red}}>
             {React.cloneElement(icon, { className: `w-6 h-6 text-[${iconColor}]` })}
        </div>
        <div>
            <p className="text-sm font-medium" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>{title}</p>
            <p className="text-2xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold" style={{color: IFOOD_THEME_COLORS.textPrimaryDark}}>Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <InfoCard title="Pedidos Hoje" value={summary?.totalOrdersToday ?? 0} icon={<ShoppingBagIcon />} iconBgColor={`${IFOOD_THEME_COLORS.orangeButtonBanner}26`} iconColor={IFOOD_THEME_COLORS.orangeButtonBanner} />
        <InfoCard title="Receita Hoje" value={`R$ ${(summary?.revenueToday ?? 0).toFixed(2).replace('.', ',')}`} icon={<CurrencyDollarIcon />} iconBgColor={`${IFOOD_THEME_COLORS.greenBanner}26`} iconColor={IFOOD_THEME_COLORS.greenBanner}/>
        <InfoCard title="Pedidos Pendentes" value={summary?.pendingOrders ?? 0} icon={<ChartBarIcon />} iconBgColor={`${IFOOD_THEME_COLORS.yellowAccent}4D`} iconColor={'#A16207'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {ordersPerDay && (
          <ChartComponent type="bar" data={ordersPerDay} title="Pedidos nos Últimos 7 Dias" />
        )}
        {revenuePerDay && (
          <ChartComponent type="line" data={revenuePerDay} title="Receita nos Últimos 7 Dias" />
        )}
      </div>
      {ordersByStatus && (
        <div className="lg:col-span-2">
             {/* Ensure ChartComponent container is styled for light theme */}
            <ChartComponent 
                type="doughnut" 
                data={ordersByStatus} 
                title="Distribuição de Pedidos por Status" 
                options={{
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { 
                            position: 'right' as const, 
                            labels: { color: IFOOD_THEME_COLORS.textSecondaryDark, font: {family: 'Poppins, sans-serif'} }
                        }
                    } 
                }}
            />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
