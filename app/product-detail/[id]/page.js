'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { FaShoppingCart, FaExchangeAlt, FaTruck, FaClock, FaMoneyBillWave, FaTag, FaCheck, FaPen } from 'react-icons/fa';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = useParams();

  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Selection State
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Viewer & Notifications
  const [viewerCount, setViewerCount] = useState(11);
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // API Config
  const API_BASE = "https://check.hrgraphics.site";

  // --- DATA LISTS ---
  const names = [
    'Zain', 'Noor', 'Sara', 'Rayan', 'Lina', 'Omar', 'Maya', 'Khalil', 'Dania', 'Faris',
    'Reem', 'Tariq', 'Alya', 'Zayd', 'Sofia', 'Adnan', 'Mira', 'Nader', 'Salma', 'Bilal',
    'Yara', 'Jad', 'Leen', 'Rami', 'Aya', 'Samir', 'Huda', 'Amir', 'Dana', 'Ibrahim'
  ];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'];
  const times = ['just now', '5 minutes ago', '18 minutes ago', '36 minutes ago', '9 minutes ago', '1 hour ago'];

  const generateOrderInfo = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const time = times[Math.floor(Math.random() * times.length)];
    return `${name} from ${location} just ordered this ${time}`;
  };

  // --- 1. FETCH PRODUCT DATA ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/get-products2.php?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const productData = data.data;
          
          // Parse JSON fields from backend
          const colors = typeof productData.colors === 'string' ? JSON.parse(productData.colors) : productData.colors || [];
          const sizes = typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes || [];
          const images = typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images || ['/images/placeholder.jpg'];
          
          const mappedProduct = {
            id: productData.id,
            name: productData.title || 'Product',
            originalPrice: parseFloat(productData.price) || 0,
            price: parseFloat(productData.sale_price || productData.price) || 0,
            description: productData.description || 'Product description',
            colors: colors,
            sizes: sizes,
            images: images,
            discountPercent: productData.discount_percent || 0,
            stock: parseInt(productData.stock) || 0,
            deliveryCharges: parseFloat(productData.delivery_charges) || 13
          };
          
          setProduct(mappedProduct);
          // Set defaults
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

  // --- 2. FETCH REVIEWS ---
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_BASE}/get_reviews.php?product_id=${id}`);
            if (!res.ok) throw new Error(`Server status: ${res.status}`);
            
            const text = await res.text();
            if (!text) {
                setReviews([]);
                return;
            }

            try {
                const data = JSON.parse(text);
                if(data.success) {
                    setReviews(data.reviews);
                }
            } catch (jsonError) {
                console.error("JSON Parse Error", jsonError);
            }
        } catch(err) {
            console.error("Error fetching reviews", err);
        } finally {
            setReviewsLoading(false);
        }
    };
    fetchReviews();
  }, [id]);

  // --- 3. DYNAMIC FEATURES (Viewers & Notifications) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 20) + 5);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setNotifications(Array.from({ length: 5 }, () => generateOrderInfo()));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
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
    return () => clearInterval(interval);
  }, [notifications.length]);

  // --- 4. CART LOGIC (LocalStorage) ---
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
    
    // Check for duplicates
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
    alert('Product added to cart successfully!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
        router.push('/customer-details');
    }, 100);
  };

  // --- RENDERING ---
  if (loading) return <div className="pproduct-detail" style={{textAlign:'center', padding:'50px'}}>Loading Product...</div>;
  if (!product) return <div className="pproduct-detail" style={{textAlign:'center', padding:'50px'}}>Product not found</div>;

  const displayDiscount = product.discountPercent || 
    (product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0);

  return (
    <div className="pproduct-detail">
      {/* Product Images */}
      <div className="pproduct-images">
        <div className="thumbnails">
          {product.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Thumbnail ${idx}`}
              width={100}
              height={100}
              onClick={() => setSelectedImage(img)}
              className={selectedImage === img ? 'selected' : ''}
              unoptimized={true} 
            />
          ))}
        </div>
        <div className="main-image">
          <Image 
            src={selectedImage || product.images[0]} 
            alt="Selected Product" 
            width={500} 
            height={500} 
            unoptimized={true} 
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="pproduct-info">
        <h1>{product.name}</h1>
        <p className="pprice">
          {product.originalPrice && product.originalPrice > product.price ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#d32f2f', marginRight: '10px', fontWeight: 'bold' }}>
                AED {product.originalPrice.toFixed(2)}
              </span>
              <span style={{ color: 'rgba(20, 20, 20, 0.95)', fontWeight: 'bold' }}>
                AED {product.price.toFixed(2)}
              </span>
              {displayDiscount > 0 && (
                <span className="final-discount-tag">
                    <FaTag className="discount-tag-icon" />
                    <span className="discount-tag-text">{displayDiscount}% OFF</span>
                </span>
              )}
            </>
          ) : (
            <>AED {product.price.toFixed(2)}</>
          )}
        </p>
        <p>{product.description}</p>

        {/* Live Viewer */}
        <div className="live-viewers">
          <span className="live-dot"></span>
          <span className="viewer-count">{viewerCount}</span> people are viewing this product
        </div>

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
            <div className="pcolor-selection">
            <h3>Choose Color:</h3>
            {product.colors.map((color) => (
                <button
                key={color}
                className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                onClick={() => setSelectedColor(color)}
                >
                {color}
                </button>
            ))}
            </div>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
            <div className="psize-selection">
            <h3>Choose Size:</h3>
            {product.sizes.map((size) => (
                <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
                >
                {size}
                </button>
            ))}
            </div>
        )}

        {/* Quantity */}
        <div className="pquantity-selection">
          <h3>Quantity:</h3>
          <div className="pquantity-controls">
            <button onClick={() => setSelectedQuantity((q) => Math.max(q - 1, 1))}>-</button>
            <input
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Math.max(Number(e.target.value), 1))}
            />
            <button 
                onClick={() => setSelectedQuantity((q) => Math.min(q + 1, product.stock || 99))}
                disabled={product.stock > 0 && selectedQuantity >= product.stock}
            >
                +
            </button>
          </div>
          {product.stock <= 0 && <span style={{color:'red', marginLeft:'10px'}}>Out of Stock</span>}
        </div>

        {/* Notification */}
        <div className="notification-wrapper">
          <div className={`order-notification-bar ${slide ? 'slide-out' : 'slide-in'}`}>
            <span className="order-icon">🛒</span>
            {notifications[index]}
          </div>
        </div>

        {/* Buttons */}
        <div className="pbuttons-container">
          <button 
            className="padd-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            style={{opacity: product.stock <= 0 ? 0.5 : 1}}
          >
            <FaShoppingCart /> Add to Cart
          </button>
          <button 
            className="pbuy-now-btn" 
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            style={{opacity: product.stock <= 0 ? 0.5 : 1}}
          >
            <FaExchangeAlt /> Buy Now
          </button>
        </div>

        {/* Delivery Options */}
        <div className="delivery-options-wrapper">
          <h3>Delivery Options</h3>
          <div className="delivery-boxes">
            <div className="delivery-box">
              <FaTruck className="delivery-icon" />
              <h4>Standard Delivery</h4>
              <p>2–3 Business Days</p>
            </div>
            <div className="delivery-box">
              <FaClock className="delivery-icon" />
              <h4>Delivery Time</h4>
              <p>Guaranteed Timing</p>
            </div>
            <div className="delivery-box">
              <FaMoneyBillWave className="delivery-icon" />
              <h4>Cash on Delivery</h4>
              <p>Available – AED {product.deliveryCharges}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="luxury-reviews">
          {/* Header containing Count and Write Review Button */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
             <h3 className="luxury-reviews-count" style={{marginBottom: 0}}>{reviews.length} Reviews</h3>
             <button
               onClick={() => router.push(`/review/${product.id}`)}
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '8px',
                 padding: '8px 16px',
                 backgroundColor: '#000',
                 color: '#fff',
                 border: '1px solid #000',
                 borderRadius: '5px',
                 cursor: 'pointer',
                 fontSize: '14px',
                 fontWeight: 'bold',
                 transition: 'all 0.3s ease'
               }}
               onMouseOver={(e) => {
                 e.currentTarget.style.backgroundColor = '#333';
                 e.currentTarget.style.transform = 'translateY(-2px)';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.backgroundColor = '#000';
                 e.currentTarget.style.transform = 'translateY(0)';
               }}
             >
               <FaPen /> Write a Review
             </button>
          </div>

          <div className="luxury-existing-reviews">
            {reviewsLoading ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="luxury-no-reviews">No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="luxury-review">
                  <StarRating rating={parseInt(review.rating)} isInteractive={false} />
                  <p className="luxury-review-comment">{review.text || review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="review-images">
                        {review.images.map((img, idx) => (
                        <Image 
                            key={idx} 
                            src={img} 
                            alt="Review" 
                            width={100} 
                            height={100} 
                            unoptimized={true}
                        />
                        ))}
                    </div>
                  )}
                  <div style={{fontSize:'12px', color:'green', marginTop:'5px', display:'flex', alignItems:'center', gap:'5px'}}>
                      <FaCheck /> Verified Purchase
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// StarRating Component
const StarRating = ({ rating, isInteractive }) => {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{ cursor: isInteractive ? 'pointer' : 'default', color: i < rating ? '#ffc107' : '#e4e5e9' }}
          className={i < rating ? 'star filled' : 'star'}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default ProductDetail;
