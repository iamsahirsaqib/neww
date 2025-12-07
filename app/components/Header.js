'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { FiUser, FiShoppingCart, FiSearch } from 'react-icons/fi';
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

  // --- 1. FETCH PRODUCTS FOR SEARCH ---
  useEffect(() => {
    const fetchForSearch = async () => {
        try {
            const res = await fetch('https://check.hrgraphics.site/get-products.php');
            const data = await res.json();
            
            // Console Log to help debug
            console.log("Search Data Loaded:", data);

            // Handle various API structures
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
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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
        // Check ALL possible name fields
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
    console.log("Navigating to product:", productId);
    setSearchTerm(''); 
    setSuggestions([]); 
    setMobileSearchOpen(false); 
    // Navigate to the detail page
    router.push(`/product-detail/${productId}`); 
  };

  return (
    <div className="hheader-wrapper" style={{ position: 'relative', zIndex: 100 }}>

      {/* Marquee */}
      <div className="hmarquee-bar">
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
              style={{ height: '500', width: 'auto' }}
              className="hlogo-img"
              priority
            />
          </Link>

          {/* Mobile Search Toggle */}
          <button
            className="hsearch-toggle"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <FiSearch size={22} />
          </button>

          {/* Search Bar */}
          <div className={`hsearch-bar ${mobileSearchOpen ? 'open' : ''}`} style={{ position: 'relative' }}>
            <div className="hsearch-wrapper">
              <FiSearch size={18} className="hsearch-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="hsearch-input"
                autoComplete="off"
              />
            </div>
            
            {/* --- SUGGESTIONS LIST --- */}
            {suggestions.length > 0 && (
              <div className="hsuggestions-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  zIndex: 9999,
              }}>
                {suggestions.map((product) => {
                  // Determine name and image dynamically
                  const displayName = product.title || product.name || product.product_name || 'Product';
                  const displayPrice = product.sale_price || product.price || '0';
                  
                  // Handle image arrays or strings
                  let displayImage = '/placeholder.jpg';
                  if (product.image) displayImage = product.image;
                  else if (product.images) {
                      try {
                          // If images is a JSON string string like '["img1.jpg"]'
                          const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                          displayImage = Array.isArray(parsed) ? parsed[0] : parsed;
                      } catch(e) { displayImage = product.images; }
                  }

                  return (
                    <div 
                        key={product.id} 
                        // CLICK EVENT
                        onClick={() => handleProductClick(product.id)}
                        style={{
                            padding: '12px 15px',
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                        {/* Thumbnail */}
                        <div style={{width: '40px', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee'}}>
                            <img 
                                src={displayImage} 
                                alt={displayName} 
                                style={{width:'100%', height:'100%', objectFit:'cover'}} 
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                        {/* Text */}
                        <div>
                            <span style={{display:'block', fontWeight:'600', fontSize:'14px', color:'#222'}}>
                                {displayName}
                            </span>
                            <span style={{fontSize:'12px', color:'#666'}}>
                                AED {displayPrice}
                            </span>
                        </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* ------------------------- */}
          </div>

          <Link href="/cart" className="hicon-link cart-link" aria-label="Cart">
            <FiShoppingCart size={22} />
            {cartCount > 0 && <span className="hcart-count">{cartCount}</span>}
          </Link>

          <div className="hlanguage-selector">
            <FaGlobe size={16} />
            <select value={language} onChange={handleLanguageChange} aria-label="Select language">
              <option value="en">English</option>
              <option value="ur">Arabic</option>
            </select>
          </div>

          <div className="hauth-dropdown">
            <button
              onClick={() => router.push('/admin-page')}
              className="hauth-btn"
              aria-label="Admin Login"
            >
              <FiUser size={22} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
