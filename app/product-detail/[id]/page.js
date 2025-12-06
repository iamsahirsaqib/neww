'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { FaShoppingCart, FaExchangeAlt, FaTruck, FaClock, FaMoneyBillWave, FaTag, FaCheck, FaStar, FaPen } from 'react-icons/fa';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  
  // Product State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection State
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Notification state
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Live viewer state
  const [viewerCount, setViewerCount] = useState(11);

  // API Config
  const API_BASE = "https://check.hrgraphics.site";

  const names = ['Zain', 'Noor', 'Sara', 'Rayan', 'Lina', 'Omar', 'Maya', 'Khalil', 'Dania', 'Faris'];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];
  const times = ['just now', '5 minutes ago', '18 minutes ago', '36 minutes ago', '9 minutes ago'];

  const generateOrderInfo = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    return `${name} from ${location} just ordered this ${time}`;
  };

  // 1. Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/get-products2.php?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const productData = data.data;
          
          // Parse JSON fields
          const colors = typeof productData.colors === 'string' ? JSON.parse(productData.colors) : productData.colors || [];
          const sizes = typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes || [];
          const images = typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images || ['/images/placeholder.jpg'];
          
          const product = {
            id: productData.id,
            name: productData.title || 'Product',
            originalPrice: parseFloat(productData.price) || 0,
            price: parseFloat(productData.sale_price || productData.price) || 0,
            description: productData.description || 'Product description',
            colors: colors,
            sizes: sizes,
            images: images,
            discountPercent: productData.discount_percent || 0,
            deliveryCharges: parseFloat(productData.delivery_charges) || 13,
            stock: parseInt(productData.stock) || 0
          };
          
          setProduct(product);
          if (colors.length > 0) setSelectedColor(colors[0]);
          if (sizes.length > 0) setSelectedSize(sizes[0]);
          if (images.length > 0) setSelectedImage(images[0]);
        } else {
          throw new Error('Failed to load product');
        }
      } catch (err) {
        console.error(err);
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, left: 0 });
  }, [id]);

  // 2. Fetch Reviews Data
// 2. Fetch Reviews Data
  useEffect(() => {
    if (!id) return;
    
    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_BASE}/get_reviews.php?product_id=${id}`);
            
            // Check if response is OK
            if (!res.ok) {
                throw new Error(`Server status: ${res.status}`);
            }

            // Get text first to debug empty responses
            const text = await res.text();
            
            if (!text) {
                console.warn("Empty response from get_reviews.php");
                setReviews([]);
                return;
            }

            try {
                const data = JSON.parse(text);
                if(data.success) {
                    setReviews(data.reviews);
                } else {
                    console.error("API returned error:", data.message);
                }
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError, "Response was:", text);
            }

        } catch(err) {
            console.error("Error fetching reviews", err);
        } finally {
            setReviewsLoading(false);
        }
    };
    
    fetchReviews();
  }, [id]);

  // Live viewer & Notifications logic
  useEffect(() => {
    const vInterval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 20) + 5);
    }, 8000);
    return () => clearInterval(vInterval);
  }, []);

  useEffect(() => {
    setNotifications(Array.from({ length: 5 }, () => generateOrderInfo()));
  }, []);

  useEffect(() => {
    const nInterval = setInterval(() => {
      setSlide(true);
      setTimeout(() => {
        setIndex((prev) => {
          const nextIndex = (prev + 1) % notifications.length;
          setNotifications((old) => {
            const updated = [...old];
            updated[prev] = generateOrderInfo();
            return updated;
          });
          return nextIndex;
        });
        setSlide(false);
      }, 500);
    }, 5000);
    return () => clearInterval(nInterval);
  }, [notifications.length]);

  // Cart Functions
  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: selectedImage || product.images[0],
      quantity: selectedQuantity,
      color: selectedColor,
      size: selectedSize,
      stock: product.stock,
      deliveryCharges: product.deliveryCharges
    };
    
    const existingItemIndex = existingCart.findIndex(item => 
      item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size
    );
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartMessage(`Added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/customer-details'), 100);
  };

  // Helper to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} size={14} />
    ));
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;
  if (!product) return <div style={{textAlign:'center', padding:'50px'}}>Product not found</div>;

  const discountPercent = product.discountPercent || 
    (product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <div className="product-page-wrapper">
      <div className="pproduct-detail">
        {error && <div className="error-msg">{error}</div>}

        {/* Cart Success Message */}
        {cartMessage && (
          <div className="cart-message">
            <FaCheck /> {cartMessage}
            <button onClick={() => router.push('/cart')}>View Cart</button>
          </div>
        )}

        {/* --- LEFT: Images --- */}
        <div className="pproduct-images">
          <div className="thumbnails">
            {product.images.map((img, index) => (
              <div key={index} className="thumb-wrapper" onClick={() => setSelectedImage(img)}>
                <Image 
                  src={img} alt="thumb" width={80} height={80} 
                  className={selectedImage === img ? 'active' : ''}
                  unoptimized={true}
                />
              </div>
            ))}
          </div>
          <div className="main-image">
            <Image 
              src={selectedImage || product.images[0]} 
              alt="Main" width={600} height={600} 
              unoptimized={true}
            />
          </div>
        </div>

        {/* --- RIGHT: Info --- */}
        <div className="pproduct-info">
          <h1>{product.name}</h1>
          
          <div className="price-container">
            {discountPercent > 0 && (
              <span className="old-price">AED {product.originalPrice.toFixed(2)}</span>
            )}
            <span className="new-price">AED {product.price.toFixed(2)}</span>
            {discountPercent > 0 && <span className="discount-badge">{discountPercent}% OFF</span>}
          </div>
          
          <p className="description">{product.description}</p>

          <div className="live-viewers">
            <span className="live-dot"></span>
            <strong>{viewerCount}</strong> people are viewing this product
          </div>

          {/* Selections */}
          {product.colors.length > 0 && (
            <div className="selection-row">
              <h3>Color:</h3>
              <div className="options">
                {product.colors.map(c => (
                  <button 
                    key={c} 
                    className={selectedColor === c ? 'active' : ''}
                    onClick={() => setSelectedColor(c)}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="selection-row">
              <h3>Size:</h3>
              <div className="options">
                {product.sizes.map(s => (
                  <button 
                    key={s} 
                    className={selectedSize === s ? 'active' : ''}
                    onClick={() => setSelectedSize(s)}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="quantity-row">
            <h3>Quantity:</h3>
            <div className="qty-control">
              <button onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}>-</button>
              <input type="text" value={selectedQuantity} readOnly />
              <button onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}>+</button>
            </div>
            <span className="stock-info">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          {/* Notification */}
          <div className="notification-bar">
             <span>🛒</span> {notifications[index]}
          </div>

          {/* Actions */}
          <div className="action-buttons">
            <button className="add-cart" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <FaShoppingCart /> Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow} disabled={product.stock <= 0}>
                <FaExchangeAlt /> Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-grid">
             <div className="trust-item"><FaTruck/><span>Fast Delivery</span></div>
             <div className="trust-item"><FaClock/><span>2-3 Days</span></div>
             <div className="trust-item"><FaMoneyBillWave/><span>Cash on Delivery</span></div>
          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="reviews-container">
        <div className="reviews-header">
            <h2>Customer Reviews ({reviews.length})</h2>
            <button 
                className="write-review-btn" 
                onClick={() => router.push(`/review/${product.id}`)} // Redirect to review page with ID
            >
                <FaPen style={{marginRight:'8px'}}/> Write a Review
            </button>
        </div>

        {reviewsLoading ? (
            <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
            <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        ) : (
            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-top">
                            <div className="stars">{renderStars(review.rating)}</div>
                            <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                        
                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                            <div className="review-images">
                                {review.images.map((img, i) => (
                                    <img 
                                        key={i} 
                                        src={img} 
                                        alt="review" 
                                        onClick={() => window.open(img, '_blank')}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="verified-badge">
                            <FaCheck size={10} /> Verified Purchase
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- STYLES --- */}
      <style jsx>{`
        .product-page-wrapper {
            background-color: #fff;
            padding-bottom: 50px;
        }
        .pproduct-detail {
          display: flex;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        
        /* ... (Existing Image/Info Styles kept mostly same, simplified for brevity) ... */
        .pproduct-images { flex: 1; display: flex; gap: 20px; }
        .thumbnails { display: flex; flex-direction: column; gap: 10px; }
        .thumb-wrapper img { border-radius: 8px; cursor: pointer; border: 2px solid transparent; width: 80px; height: 80px; object-fit: cover; }
        .thumb-wrapper img.active { border-color: #3498db; }
        .main-image img { width: 100%; height: auto; border-radius: 12px; }
        
        .pproduct-info { flex: 1; }
        .price-container { font-size: 24px; margin: 15px 0; display: flex; align-items: center; gap: 10px; }
        .old-price { text-decoration: line-through; color: #d32f2f; font-size: 18px; }
        .new-price { font-weight: bold; color: #333; }
        .discount-badge { background: #e53935; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        
        .live-viewers { background: #f8f9fa; padding: 10px; border-radius: 6px; display: flex; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 20px; }
        .live-dot { width: 8px; height: 8px; background: red; border-radius: 50%; animation: pulse 1s infinite; }
        
        .selection-row { margin-bottom: 20px; }
        .selection-row h3 { font-size: 16px; margin-bottom: 8px; }
        .options { display: flex; gap: 10px; flex-wrap: wrap; }
        .options button { padding: 8px 15px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px; }
        .options button.active { border-color: #3498db; background: #f0f8ff; color: #3498db; }
        
        .quantity-row { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
        .qty-control { display: flex; border: 1px solid #ddd; border-radius: 4px; }
        .qty-control button { border: none; background: #f9f9f9; width: 35px; height: 35px; cursor: pointer; font-size: 18px; }
        .qty-control input { width: 40px; text-align: center; border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
        
        .notification-bar { background: #e8f4fd; padding: 12px; border-radius: 6px; color: #0066cc; margin-bottom: 20px; font-size: 14px; }
        
        .action-buttons { display: flex; gap: 15px; margin-bottom: 30px; }
        .action-buttons button { flex: 1; padding: 15px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; gap: 10px; align-items: center; font-size: 16px; transition: 0.2s; }
        .add-cart { background: #3498db; color: white; }
        .buy-now { background: #2ecc71; color: white; }
        .action-buttons button:hover { opacity: 0.9; transform: translateY(-2px); }
        .action-buttons button:disabled { background: #ccc; cursor: not-allowed; }

        .trust-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .trust-item { border: 1px solid #eee; padding: 15px; text-align: center; border-radius: 8px; font-size: 13px; color: #555; }
        .trust-item svg { display: block; margin: 0 auto 5px; font-size: 20px; color: #3498db; }

        .cart-message { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .cart-message button { margin-left: auto; padding: 5px 10px; border: 1px solid #155724; background: transparent; color: #155724; border-radius: 4px; cursor: pointer; }

        /* --- REVIEWS STYLES --- */
        .reviews-container {
            max-width: 1200px;
            margin: 40px auto 0;
            padding: 0 20px;
            border-top: 1px solid #eee;
            padding-top: 40px;
        }
        .reviews-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .write-review-btn {
            background: #222;
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
        }
        .write-review-btn:hover {
            background: #444;
            transform: translateY(-2px);
        }
        .no-reviews {
            text-align: center;
            padding: 40px;
            background: #f9f9f9;
            border-radius: 12px;
            color: #666;
        }
        .reviews-list {
            display: grid;
            gap: 20px;
        }
        .review-card {
            background: #fff;
            border: 1px solid #eee;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .review-top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .review-date {
            font-size: 12px;
            color: #999;
        }
        .review-text {
            color: #444;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .review-images {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .review-images img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            border: 1px solid #eee;
        }
        .verified-badge {
            font-size: 12px;
            color: #27ae60;
            display: flex;
            align-items: center;
            gap: 5px;
            font-weight: 500;
        }

        @keyframes pulse { 0% {opacity:1} 50% {opacity:0.5} 100% {opacity:1} }
        
        @media (max-width: 768px) {
            .pproduct-detail { flex-direction: column; }
            .thumbnails { flex-direction: row; order: 2; overflow-x: auto; }
            .action-buttons { flex-direction: column; }
            .reviews-header { flex-direction: column; gap: 15px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;