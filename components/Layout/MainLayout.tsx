
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { IFOOD_THEME_COLORS } from '../../constants';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: IFOOD_THEME_COLORS.lightGrayBg, color: IFOOD_THEME_COLORS.textPrimaryDark }}
    >
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
