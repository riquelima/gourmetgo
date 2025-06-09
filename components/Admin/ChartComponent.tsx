
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartData } from '../../types';
import { IFOOD_THEME_COLORS } from '../../constants';

interface ChartComponentProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData;
  options?: any;
  title?: string;
  className?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, options, title, className }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: IFOOD_THEME_COLORS.textSecondaryDark,
              font: {
                family: 'Poppins, sans-serif',
                size: 12,
              }
            }
          },
          title: {
            display: !!title,
            text: title,
            color: IFOOD_THEME_COLORS.textPrimaryDark,
            font: {
                size: 18,
                weight: '600' as const, // semibold
                family: 'Poppins, sans-serif',
            },
            padding: {
              bottom: 15,
            }
          },
          tooltip: {
            backgroundColor: IFOOD_THEME_COLORS.textPrimaryDark, // Dark tooltip for contrast
            titleColor: IFOOD_THEME_COLORS.white,
            bodyColor: IFOOD_THEME_COLORS.lightGrayBg,
            borderColor: IFOOD_THEME_COLORS.grayInputBorder,
            borderWidth: 1,
            titleFont: { family: 'Poppins, sans-serif', weight: '600' as const },
            bodyFont: { family: 'Poppins, sans-serif' },
            padding: 10,
            cornerRadius: 6,
          }
        },
        scales: (type === 'bar' || type === 'line') ? {
          x: {
            ticks: { color: IFOOD_THEME_COLORS.textSecondaryDark, font: { family: 'Poppins, sans-serif'}},
            grid: { color: IFOOD_THEME_COLORS.grayInputBorder + '80' } // Lighter grid lines
          },
          y: {
            ticks: { color: IFOOD_THEME_COLORS.textSecondaryDark, font: { family: 'Poppins, sans-serif'}},
            grid: { color: IFOOD_THEME_COLORS.grayInputBorder + '80' } // Lighter grid lines
          }
        } : undefined,
      };
      
      const finalOptions = { ...defaultOptions, ...options };

      // Ensure datasets have appropriate colors for light theme
      const processedData = {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || (dataset.label?.toLowerCase().includes('receita') || dataset.label?.toLowerCase().includes('revenue') ? `${IFOOD_THEME_COLORS.greenBanner}BF` : `${IFOOD_THEME_COLORS.red}BF`), 
          borderColor: dataset.borderColor || (dataset.label?.toLowerCase().includes('receita') || dataset.label?.toLowerCase().includes('revenue') ? IFOOD_THEME_COLORS.greenBanner : IFOOD_THEME_COLORS.red),
          borderWidth: dataset.borderWidth || 2,
          pointBackgroundColor: dataset.pointBackgroundColor || (dataset.label?.toLowerCase().includes('receita') || dataset.label?.toLowerCase().includes('revenue') ? IFOOD_THEME_COLORS.greenBanner : IFOOD_THEME_COLORS.red),
          pointBorderColor: dataset.pointBorderColor || IFOOD_THEME_COLORS.white,
          hoverBackgroundColor: dataset.hoverBackgroundColor || (dataset.label?.toLowerCase().includes('receita') || dataset.label?.toLowerCase().includes('revenue') ? IFOOD_THEME_COLORS.greenBanner : IFOOD_THEME_COLORS.red),
        }))
      };

      chartInstance.current = new Chart(chartRef.current, {
        type: type,
        data: processedData,
        options: finalOptions,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, data, options, title]);

  return (
    <div 
      className={`p-4 md:p-6 rounded-xl shadow-lg h-full min-h-[300px] md:min-h-[400px] ${className}`} 
      style={{backgroundColor: IFOOD_THEME_COLORS.white, borderColor: IFOOD_THEME_COLORS.grayInputBorder}}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;