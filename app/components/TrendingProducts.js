'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FaTag } from 'react-icons/fa'; // Added for discount tag
import { useRouter } from 'next/navigation';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // API Configuration
  const API_URL = "https://check.hrgraphics.site";
  const TRACK_PRODUCT_VIEW_URL = "https://check.hrgraphics.site/track-product-view.php";
  const BASE_IMAGE_URL = "https://check.hrgraphics.site/";

  // --- HELPER FUNCTIONS (From First File) ---

  const getPriceValue = (priceStr) => {
    if (!priceStr) return 0;
    const str = String(priceStr);
    const cleaned = str.replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Function to track product view when user clicks
  const trackProductView = async (product) => {
    try {
      console.log('Tracking product view for:', product.name);
      
      const productViewData = {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        page_url: window.location.href,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        action: 'product_click_trending' // Distinguish click source
      };

      // Send tracking request with keepalive
      await fetch(TRACK_PRODUCT_VIEW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productViewData),
        keepalive: true 
      });
      return true;
    } catch (error) {
      console.error('Product view tracking failed:', error);
      return false;
    }
  };

  // Handle click: Track -> Navigate
  const handleProductClick = async (e, product) => {
    e.preventDefault();
    // Track the view
    await trackProductView(product);
    // Navigate
    window.location.href = `/product-detail/${product.id}`;
  };

  // --- DATA FETCHING ---
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

        // Format products using the same logic as your main page
        const formattedProducts = productsArray.map((item, index) => {
            // Image Parsing Logic
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
              originalPrice: item.price?.toString() || '0', // Assuming API sends original price in 'price' or similar field
              price: (item.sale_price || item.price || '0').toString(),
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

  // --- SUB-COMPONENT FOR IMAGE ---
  const ProductImage = ({ src, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => { setImgSrc(src); }, [src]);

    return (
      <img
        src={imgSrc}
        alt={alt}
        className="productImage"
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc('https://via.placeholder.com/300x300/cccccc/969696?text=Image+Error');
        }}
      />
    );
  };

  if (loading) {
    return <div className="container" style={{textAlign:'center', padding:'50px'}}>Loading Trending Products...</div>;
  }

  if (products.length === 0) return null; 

  return (
    <section className="trendingProducts">
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>Trending Products</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }, // Adjusted to 4 to match typical product grids
          }}
          style={{ paddingBottom: '40px' }} // Space for pagination dots
        >
          {products.map((product) => {
             // Calculate Discount logic for display
             const originalValue = getPriceValue(product.originalPrice);
             const priceValue = getPriceValue(product.price);
             const hasDiscount = originalValue > priceValue && originalValue > 0;
             const discountPercent = product.discountPercent || 
               (hasDiscount ? Math.round(((originalValue - priceValue) / originalValue) * 100) : 0);

            return (
                <SwiperSlide key={product.id}>
                <div 
                    className="productCard" 
                    onClick={(e) => handleProductClick(e, product)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="imageContainer">
                        <ProductImage src={product.image} alt={product.name} />
                    </div>
                    
                    <h3>{product.name}</h3>
                    
                    <p className="price">
                        {hasDiscount ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#d32f2f', marginRight: '10px', fontSize: '0.9em' }}>
                            AED {product.originalPrice}
                            </span>
                            <span style={{ color: 'rgba(20, 20, 20, 0.95)', fontWeight: 'bold' }}>
                            AED {product.price}
                            </span>
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
                    
                    {/* No Add To Cart Button here as requested */}
                </div>
                </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* STYLES (Merged from your provided file) */}
      <style jsx>{`
        .productCard {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            background: #fff;
            padding: 10px;
            border-radius: 8px;
            height: 100%;
        }
        
        .productCard:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .imageContainer {
            width: 100%;
            height: 250px;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        /* Using global selector for img inside scoped jsx or the subcomponent class */
        :global(.productImage) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .productCard:hover :global(.productImage) {
            transform: scale(1.05);
        }

        h3 {
            font-size: 16px;
            margin: 10px 0 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
        }

        .price {
            font-size: 16px;
            color: #333;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
        }

        /* Discount Tag Styles copied from File 1 */
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
