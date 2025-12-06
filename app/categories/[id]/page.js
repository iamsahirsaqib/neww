'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaShoppingCart, FaEye } from 'react-icons/fa';

const CategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState('');

  const API_URL = "https://check.hrgraphics.site";

  useEffect(() => {
    if (id) {
      fetchCategoryProducts();
    }
  }, [id]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get_products_by_category.php?id=${id}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setCategoryName(data.category_name);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation to detail page
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: parseFloat(product.originalPrice),
      image: product.image,
      quantity: 1,
      color: '', // Default
      size: '', // Default
      stock: product.stock
    };

    const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated')); // Notify other components
    
    setCartMessage(`Added ${product.name} to cart!`);
    setTimeout(() => setCartMessage(''), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', background: '#000', minHeight: '100vh', color: 'white' }}>
        <div className="spinner"></div>
        <style jsx>{`.spinner { border: 4px solid #333; border-top: 4px solid #fff; borderRadius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        
        {/* Success Message */}
        {cartMessage && (
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#27ae60',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 1000,
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                ✓ {cartMessage}
            </div>
        )}

        {/* Header */}
        <div className="cat-header">
          <button onClick={() => router.back()} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          <h1>{categoryName}</h1>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="no-products">
            <h3>No products found in this category.</h3>
            <Link href="/" className="home-link">Go Home</Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                  <Link href={`/product-detail/${product.id}`} className="product-card">
                    <div className="image-wrapper">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={250} 
                        height={250} 
                        unoptimized={true}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      {product.discount > 0 && (
                        <span className="discount-tag">-{product.discount}%</span>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <div className="price-row">
                        <span className="current-price">AED {parseFloat(product.price).toFixed(0)}</span>
                        {parseFloat(product.originalPrice) > parseFloat(product.price) && (
                          <span className="old-price">AED {parseFloat(product.originalPrice).toFixed(0)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Action Buttons Overlay */}
                  <div className="card-actions">
                      <button 
                        className="action-btn cart-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <FaShoppingCart size={14} /> Add
                      </button>
                      <Link href={`/product-detail/${product.id}`} className="action-btn view-btn">
                        <FaEye size={14} /> View
                      </Link>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .category-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 30px 15px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .cat-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }
        .cat-header h1 {
          font-size: 24px;
          color: #333;
          margin: 0;
          text-transform: capitalize;
        }
        .back-btn {
          background: white;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: #f0f0f0;
        }
        
        .products-grid {
          display: grid;
          /* Adjusted for smaller cards: min-width 180px */
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 15px;
        }
        
        .product-card-wrapper {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            position: relative;
            padding-bottom: 10px;
        }
        .product-card-wrapper:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .image-wrapper {
          height: 180px; /* Smaller height */
          position: relative;
          background: #f4f4f4;
        }
        .discount-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #e53935;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }
        .product-info {
          padding: 10px;
          flex-grow: 1;
        }
        .product-info h3 {
          font-size: 14px;
          margin: 0 0 6px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
          font-weight: 500;
        }
        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .current-price {
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }
        .old-price {
          text-decoration: line-through;
          color: #999;
          font-size: 12px;
        }

        .card-actions {
            display: flex;
            gap: 8px;
            padding: 0 10px;
            margin-top: auto;
        }
        .action-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 6px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: background 0.2s;
            text-decoration: none;
        }
        .cart-btn {
            background: #222;
            color: white;
        }
        .cart-btn:hover {
            background: #444;
        }
        .view-btn {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
        }
        .view-btn:hover {
            background: #e0e0e0;
        }

        .no-products {
          text-align: center;
          padding: 50px;
          color: #666;
        }
        .home-link {
          display: inline-block;
          margin-top: 15px;
          color: #3498db;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
            .products-grid {
                grid-template-columns: repeat(2, 1fr); /* 2 cols on mobile */
                gap: 10px;
            }
            .image-wrapper {
                height: 150px;
            }
            .product-info h3 {
                font-size: 13px;
            }
            .card-actions {
                flex-direction: column; /* Stack buttons on tiny screens */
                gap: 5px;
            }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
