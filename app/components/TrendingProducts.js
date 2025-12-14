'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FaTag } from 'react-icons/fa';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URLs
  const API_URL = "https://check.hrgraphics.site";
  const TRACK_PRODUCT_VIEW_URL = "https://check.hrgraphics.site/track-product-view.php";
  const BASE_IMAGE_URL = "https://check.hrgraphics.site/";

  // --- Helper: Price Cleaner ---
  const getPriceValue = (priceStr) => {
    if (!priceStr) return 0;
    const str = String(priceStr);
    const cleaned = str.replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // --- Helper: Tracking ---
  const trackProductView = async (product) => {
    try {
      const productViewData = {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        page_url: window.location.href,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        action: 'product_click_trending'
      };

      await fetch(TRACK_PRODUCT_VIEW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productViewData),
        keepalive: true 
      });
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  };

  // --- Handle Click ---
  const handleProductClick = async (e, product) => {
    e.preventDefault(); 
    await trackProductView(product);
    window.location.href = `/product-detail/${product.id}`;
  };

  // --- Helper: Image Component ---
  const ProductImage = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => { setImgSrc(src); }, [src]);

    return (
      <img
        src={imgSrc}
        alt={alt}
        // Using inline styles to match your Page.js exactly
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc('https://via.placeholder.com/300x300/cccccc/969696?text=Image+Error');
        }}
      />
    );
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${API_URL}/get_trending_products.php`);
        const data = await response.json();
        
        let productsArray = [];
        if (data.success && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (Array.isArray(data)) {
            productsArray = data;
        }

        const formattedProducts = productsArray.map((item, index) => {
            // --- Image Logic ---
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
            
            // --- Price Logic ---
            const originalPriceRaw = item.regular_price || item.old_price || item.price || '0';
            const currentPriceRaw = item.sale_price || item.price || '0';

            return {
              id: item.id || index + 1,
              name: item.title || item.name || `Product ${index + 1}`,
              originalPrice: originalPriceRaw.toString(), 
              price: currentPriceRaw.toString(),
              image: finalImageUrl,
              discountPercent: item.discount_percent || 0,
            };
        });

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div className="container" style={{textAlign:'center', padding:'50px'}}>Loading...</div>;
  if (products.length === 0) return null; 

  return (
    <section className="trendingProducts">
      <div className="container">
        <h1>Trending Products</h1>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }, // Matching the grid layout count typically
          }}
          style={{ paddingBottom: '40px' }}
        >
          {products.map((product) => {
             const originalValue = getPriceValue(product.originalPrice);
             const priceValue = getPriceValue(product.price);
             const hasDiscount = originalValue > priceValue && originalValue > 0;
             const discountPercent = product.discountPercent || 
               (hasDiscount ? Math.round(((originalValue - priceValue) / originalValue) * 100) : 0);

            return (
                <SwiperSlide key={product.id}>
                  {/* Matching Structure to Page.js */}
                  <div 
                    className="productCard" 
                    onClick={(e) => handleProductClick(e, product)}
                    style={{ cursor: 'pointer', padding: '10px' }} 
                  >
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
                            <span style={{ color: 'rgba(20, 20, 20, 0.95)', fontWeight: 'bold' }}>
                                AED {product.price}
                            </span>
                            
                            {discountPercent > 0 && (
                                <span className="product-page-discount-tag">
                                    <FaTag className="product-page-tag-icon" />
                                    <span className="product-page-tag-text">{discountPercent}% OFF</span>
                                </span>
                            )}
                        </>
                        ) : (
                            <>AED {product.price}</>
                        )}
                    </p>
                    
                    {/* No Add to Cart Button here, as requested */}
                  </div>
                </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* EXACT CSS FROM PAGE.JS */}
      <style jsx>{`
        .productCard {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          /* Ensure basic card styling matches the grid layout if it had any defaults */
          background: #fff;
          border-radius: 8px;
        }
        
        .productCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        /* Ensure heading sizes match Page.js default H2 styles */
        h2 {
            font-size: 1.2rem;
            margin: 10px 0;
            color: #333;
        }

        .price {
            margin: 10px 0;
            font-size: 1rem;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        /* Discount Tag Styles matching Page.js */
        .product-page-discount-tag {
            display: inline-flex;
            align-items: center;
            background-color: #d32f2f;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            margin-left: 5px;
        }

        :global(.product-page-tag-icon) {
            font-size: 8px;
            margin-right: 3px;
        }
      `}</style>
    </section>
  );
};

export default TrendingProducts;
