'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from './components/Hero';
import FeaturedCategories from './components/Categories';
import TrendingProducts from './components/TrendingProducts';
import { FaTag, FaShoppingCart } from 'react-icons/fa';

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  // Your API URL
  const API_URL = "https://check.hrgraphics.site/get-products.php";
  // Base URL for images (Root domain of your backend)
  const BASE_IMAGE_URL = "https://check.hrgraphics.site/"; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        if (!text.trim()) throw new Error('Empty response');
        
        const data = JSON.parse(text);
        let productsArray = [];
        
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data.status === 'success' && Array.isArray(data.products)) {
          productsArray = data.products;
        }
        
        // Format products
        const formattedProducts = productsArray.map((item, index) => {
          // --- Image Parsing Logic ---
          let rawImage = item.images || item.image || item.product_image;
          let finalImageUrl = '';

          if (Array.isArray(rawImage) && rawImage.length > 0) {
            finalImageUrl = rawImage[0];
          } else if (typeof rawImage === 'string' && rawImage.trim() !== '') {
            try {
              const parsed = JSON.parse(rawImage);
              if (Array.isArray(parsed) && parsed.length > 0) {
                finalImageUrl = parsed[0];
              } else {
                finalImageUrl = rawImage;
              }
            } catch (e) {
              if (rawImage.includes(',')) {
                finalImageUrl = rawImage.split(',')[0].trim();
              } else {
                finalImageUrl = rawImage.trim();
              }
            }
          }

          if (finalImageUrl) {
            if (!finalImageUrl.startsWith('http') && !finalImageUrl.startsWith('data:')) {
              const cleanPath = finalImageUrl.startsWith('/') ? finalImageUrl.substring(1) : finalImageUrl;
              finalImageUrl = `${BASE_IMAGE_URL}${cleanPath}`;
            }
          } else {
            finalImageUrl = 'https://via.placeholder.com/300x300/cccccc/969696?text=No+Image';
          }
          
          return {
            id: item.id || index + 1,
            name: item.title || item.name || `Product ${index + 1}`,
            originalPrice: item.price?.toString() || '0',
            price: (item.sale_price || item.price || '0').toString(),
            image: finalImageUrl,
            discountPercent: item.discount_percent || 0,
            stock: item.stock || 10 // Default stock if missing
          };
        });
        
        setProducts(formattedProducts);
        setError(null);
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- ADD TO CART FUNCTION ---
  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Stop navigation to detail page
    e.stopPropagation(); 

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: parseFloat(product.originalPrice),
      image: product.image,
      quantity: 1,
      color: '', // Default since we are on listing page
      size: '',  // Default since we are on listing page
      stock: product.stock
    };

    // Check if item exists
    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    // Save back to storage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Update cart count event for header
    window.dispatchEvent(new Event('cartUpdated'));

    // Show Success Message
    setCartMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const getPriceValue = (priceStr) => {
    if (!priceStr) return 0;
    const str = String(priceStr);
    const cleaned = str.replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Image Component
  const ProductImage = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => { setImgSrc(src); }, [src]);

    return (
      <img
        src={imgSrc}
        alt={alt}
        width={300}
        height={300}
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc('https://via.placeholder.com/300x300/cccccc/969696?text=Image+Error');
        }}
      />
    );
  };

  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <TrendingProducts />

      {/* Cart Success Toast */}
      {cartMessage && (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <FaShoppingCart /> {cartMessage}
        </div>
      )}

      <div className="productsListing">
        <div className="container">
          <h1>Our Products</h1>
          
          {error && (
            <div style={{ padding: '10px', backgroundColor: '#fff3cd', color: '#856404', marginBottom: '20px' }}>
              <strong>Note:</strong> {error}
            </div>
          )}
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="productsGrid">
              {products.map((product) => {
                const originalValue = getPriceValue(product.originalPrice);
                const priceValue = getPriceValue(product.price);
                const hasDiscount = originalValue > priceValue && originalValue > 0;
                const discountPercent = product.discountPercent || 
                  (hasDiscount ? Math.round(((originalValue - priceValue) / originalValue) * 100) : 0);
                
                return (
                  <Link
                    key={product.id}
                    href={`/product-detail/${product.id}`}
                    passHref
                  >
                    <div className="productCard">
                      <div className="imageContainer">
                        <ProductImage src={product.image} alt={product.name} />
                      </div>
                      <h2>{product.name}</h2>
                      <p className="price">
                        {hasDiscount ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#d32f2f', marginRight: '10px' }}>
                              AED {product.originalPrice}
                            </span>
                            <span style={{ color: 'rgba(20, 20, 20, 0.95)', fontWeight: 'bold' }}>AED {product.price}</span>
                          </>
                        ) : (
                          <>AED {product.price}</>
                        )}
                        
                        {hasDiscount && discountPercent > 0 && (
                          <span className="product-page-discount-tag">
                            <FaTag className="product-page-tag-icon" />
                            <span className="product-page-tag-text">{discountPercent}% OFF</span>
                          </span>
                        )}
                      </p>

                      {/* Add To Cart Button - With click handler */}
                      <button 
                        className="addToCartButton"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
              <h3>No Products Available</h3>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .spinner {
            width: 40px; height: 40px; border: 4px solid #f3f3f3; 
            border-top: 4px solid #3498db; borderRadius: 50%; 
            animation: spin 1s linear infinite; margin: 0 auto 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Page;