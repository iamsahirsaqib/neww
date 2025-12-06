'use client'; // Moved to the very top

import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeaturedCategories from './components/Categories';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import TrendingProducts from './components/TrendingProducts';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import Loader from './components/Loader'; // 👈 Import Loader


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'], // bold weights added
  display: 'swap',
});



// Client-side wrapper component to handle route checking
function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isExcludedPage = pathname === '/admin-dashboard';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <Loader />}
      <div
        style={{
          filter: loading ? 'blur(10px)' : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {!isExcludedPage && <Header />}
        {children}
        
         {pathname === '/' && <Footer />}
      </div>
    </div>
  );
}

// Root Layout Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>

        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}