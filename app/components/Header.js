'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { FiMenu, FiUser, FiShoppingCart, FiChevronDown, FiSearch } from 'react-icons/fi';
import { FaGlobe } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { language, switchLanguage } = useLanguage();
  
  // New State for Cart Count
  const [cartCount, setCartCount] = useState(0);

  // Function to calculate total items from localStorage
  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    }
  };

  // Initial load and event listener
  useEffect(() => {
    // 1. Get count on initial load
    updateCartCount();

    // 2. Listen for custom event 'cartUpdated' (triggered from ProductDetail)
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    // 3. Optional: Listen for storage events (if tabs change)
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const handleLanguageChange = (e) => {
    switchLanguage(e.target.value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Demo search logic (replace with real API call if needed)
    const dummyData = ['Shirt', 'Shoes', 'Sunglasses', 'Shampoo'];
    const filtered = dummyData.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(value ? filtered : []);
  };

  return (
    <div className="hheader-wrapper">

      {/* ✅ Marquee */}
      <div className="hmarquee-bar">
        <div className="hmarquee-content">
          🔥 Welcome to Al-Khaira — UAE&apos;s Trusted Fashion Destination! Discover Modern Arab Elegance, Premium Quality Products & a Shopping Experience Loved Across the Emirates.
          🔥 مرحبًا بكم في الخيرہ — وجهة الموضة الموثوقة في الإمارات! اكتشفوا الأناقة العربية العصرية، ومنتجات عالية الجودة، وتجربة تسوق محبوبة في جميع أنحاء الإمارات. 🔥
        </div>
      </div>

      <header>
        {/* Top Bar */}
        <div className="htop-bar">
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

          {/* Search Icon (mobile only) */}
          <button
            className="hsearch-toggle"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <FiSearch size={22} />
          </button>

          {/* Search Bar */}
          <div className={`hsearch-bar ${mobileSearchOpen ? 'open' : ''}`}>
            <div className="hsearch-wrapper">
              <FiSearch size={18} className="hsearch-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="hsearch-input"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="hsuggestions">
                {suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/cart" className="hicon-link cart-link" aria-label="Cart">
            <FiShoppingCart size={22} />
            {/* Display Cart Count if > 0 */}
            {cartCount > 0 && <span className="hcart-count">{cartCount}</span>}
          </Link>

          <div className="hlanguage-selector">
            <FaGlobe size={16} />
            <select value={language} onChange={handleLanguageChange} aria-label="Select language">
              <option value="en">English</option>
              <option value="ur">Arabic</option>
            </select>
          </div>

          {/* Admin Login Button */}
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