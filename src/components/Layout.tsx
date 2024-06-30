import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './Navbar/Navbar';
import Footer from './Footer.tsx/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow container mx-auto p-4 mt-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};


export default React.memo(Layout);
