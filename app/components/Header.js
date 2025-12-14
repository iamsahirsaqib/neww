'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { FiUser, FiShoppingCart, FiSearch, FiX } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';

const Header = () => {
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  
  const { language, switchLanguage } = useLanguage();
  const [cartCount, setCartCount] = useState(0);

  // Close search when clicking outside
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        // Only close mobile search if clicked outside header area
        if (!event.target.closest('.hheader-wrapper')) {
            setMobileSearchOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 1. FETCH PRODUCTS FOR SEARCH ---
  useEffect(() => {
    const fetchForSearch = async () => {
        try {
            const res = await fetch('https://check.hrgraphics.site/get-products.php');
            const data = await res.json();
            
            let productsArray = [];
            if (data.products && Array.isArray(data.products)) {
                productsArray = data.products;
            } else if (data.data && Array.isArray(data.data)) {
                productsArray = data.data;
            } else if (Array.isArray(data)) {
                productsArray = data;
            }
            setAllProducts(productsArray);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    
    fetchForSearch();
    updateCartCount();

    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // Added parseInt to ensure quantities are treated as numbers, not strings
      const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
      setCartCount(total);
    }
  };

  const handleLanguageChange = (e) => {
    switchLanguage(e.target.value);
  };

  // --- 2. SEARCH LOGIC ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0 && allProducts.length > 0) {
      const lowerValue = value.toLowerCase();
      
      const filtered = allProducts.filter((item) => {
        const name = item.title || item.name || item.product_name || '';
        return name.toLowerCase().includes(lowerValue);
      });

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // --- 3. CLICK TO NAVIGATE ---
  const handleProductClick = (productId) => {
    setSearchTerm(''); 
    setSuggestions([]); 
    setMobileSearchOpen(false); 
    router.push(`/product-detail/${productId}`); 
  };

  return (
    <div className="hheader-wrapper" style={{ position: 'relative', zIndex: 100 }}>
      {/* INTERNAL CSS FOR RESPONSIVE DESIGN */}
      <style jsx>{`
        .hheader-wrapper {
          background: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .htop-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }
        
        /* Desktop Search */
        .desktop-search {
          flex: 1;
          max-width: 500px;
          margin: 0 20px;
          position: relative;
        }
        
        /* Mobile Search Toggle Button */
        .hsearch-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        /* Mobile Search Overlay */
        .mobile-search-container {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 99;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hsearch-input-wrapper {
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 50px;
            padding: 0 15px;
            background: #f9f9f9;
            height: 45px;
            transition: border-color 0.2s;
        }
        .hsearch-input-wrapper:focus-within {
            border-color: #333;
            background: #fff;
        }

        .hsearch-input {
            border: none;
            background: transparent;
            width: 100%;
            padding: 10px;
            outline: none;
            font-size: 14px;
        }

        /* Hide desktop search on mobile, show toggle */
        @media (max-width: 768px) {
            .desktop-search {
                display: none;
            }
            .hsearch-toggle {
                display: block;
                margin-left: auto;
                margin-right: 15px;
            }
            .mobile-search-container.open {
                display: block;
            }
            /* Adjust logo size on mobile */
            .hlogo-img {
                width: 120px;
                height: auto;
            }
        }
      `}</style>

      {/* Marquee */}
      <div className="hmarquee-bar" style={{ background: '#000', color: '#fff', padding: '8px', fontSize: '12px', textAlign: 'center' }}>
        <div className="hmarquee-content">
          🔥 Welcome to Al-Khaira — UAE&apos;s Trusted Fashion Destination!
        </div>
      </div>

      <header>
        <div className="htop-bar">
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <Image
              src="/images/Allogofn.png"
              alt="Al-Khaira"
              width={200}
              height={500}
              style={{ height: 'auto', maxHeight: '50px', width: 'auto' }}
              className="hlogo-img"
              priority
            />
          </Link>

          {/* --- DESKTOP SEARCH (Hidden on Mobile via CSS) --- */}
          <div className="desktop-search" ref={searchRef}>
             <div className="hsearch-input-wrapper">
               <FiSearch size={18} color="#666" />
               <input
                 type="text"
                 value={searchTerm}
                 onChange={handleSearchChange}
                 placeholder="Search products..."
                 className="hsearch-input"
                 autoComplete="off"
               />
             </div>
             {/* Suggestions List (Desktop) */}
             <SuggestionsList suggestions={suggestions} handleProductClick={handleProductClick} />
          </div>

          {/* --- MOBILE ICONS GROUP --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* Mobile Search Toggle */}
            <button
                className="hsearch-toggle"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
                {mobileSearchOpen ? <FiX size={22} /> : <FiSearch size={22} />}
            </button>

            {/* --- CART ICON WITH FIXED BADGE LOGIC --- */}
            <Link href="/cart" className="hicon-link cart-link" style={{ position: 'relative' }} aria-label="Cart">
                <FiShoppingCart size={22} />
                {cartCount > 0 ? (
                <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: 'red', color: 'white', fontSize: '10px',
                    borderRadius: '50%', width: '16px', height: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {cartCount}
                </span>
                ) : null}
            </Link>

            <div className="hlanguage-selector" style={{ display: 'flex', alignItems: 'center' }}>
                <FaGlobe size={16} style={{ marginRight: '5px' }} />
                <select 
                    value={language} 
                    onChange={handleLanguageChange} 
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px' }}
                >
                <option value="en">En</option>
                <option value="ur">Ar</option>
                </select>
            </div>

            <button
                onClick={() => router.push('/admin-page')}
                className="hauth-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <FiUser size={22} />
            </button>
          </div>
        </div>

        {/* --- MOBILE SEARCH DROPDOWN (Shown when toggled) --- */}
        <div className={`mobile-search-container ${mobileSearchOpen ? 'open' : ''}`}>
             <div className="hsearch-input-wrapper">
               <FiSearch size={18} color="#666" />
               <input
                 type="text"
                 value={searchTerm}
                 onChange={handleSearchChange}
                 placeholder="What are you looking for?"
                 className="hsearch-input"
                 autoComplete="off"
                 autoFocus={mobileSearchOpen} // Auto focus when opened
               />
               {searchTerm && (
                 <button onClick={() => { setSearchTerm(''); setSuggestions([]); }} style={{border:'none', background:'none'}}>
                    <FiX color="#999" />
                 </button>
               )}
             </div>
             
             {/* Suggestions List (Mobile) */}
             <div style={{ position: 'relative' }}>
                <SuggestionsList suggestions={suggestions} handleProductClick={handleProductClick} isMobile={true} />
             </div>
        </div>

      </header>
    </div>
  );
};

// --- Sub-component for Suggestions to avoid code duplication ---
const SuggestionsList = ({ suggestions, handleProductClick, isMobile }) => {
    if (suggestions.length === 0) return null;

    return (
        <div className="hsuggestions-dropdown" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: 'white',
            border: '1px solid #eee',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            maxHeight: '350px',
            overflowY: 'auto',
            zIndex: 9999,
            marginTop: isMobile ? '5px' : '0'
        }}>
            {suggestions.map((product) => {
                const displayName = product.title || product.name || product.product_name || 'Product';
                const displayPrice = product.sale_price || product.price || '0';
                
                let displayImage = '/placeholder.jpg';
                if (product.image) displayImage = product.image;
                else if (product.images) {
                    try {
                        const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                        displayImage = Array.isArray(parsed) ? parsed[0] : parsed;
                    } catch(e) { displayImage = product.images; }
                }

                return (
                    <div 
                        key={product.id} 
                        onClick={() => handleProductClick(product.id)}
                        style={{
                            padding: '12px 15px',
                            borderBottom: '1px solid #f9f9f9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                        <div style={{width: '40px', height: '40px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee'}}>
                            <img 
                                src={displayImage} 
                                alt={displayName} 
                                style={{width:'100%', height:'100%', objectFit:'cover'}} 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                        <div>
                            <span style={{display:'block', fontWeight:'600', fontSize:'14px', color:'#333'}}>
                                {displayName}
                            </span>
                            <span style={{fontSize:'12px', color:'#777'}}>
                                AED {displayPrice}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Header;
