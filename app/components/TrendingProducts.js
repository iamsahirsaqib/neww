'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // API URL - Replace with your actual domain if different
  const API_URL = "https://check.hrgraphics.site";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${API_URL}/get_trending_products.php`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return <div className="container" style={{textAlign:'center', padding:'50px'}}>Loading Trending Products...</div>;
  }

  // Don't render the section if there are no trending products
  if (products.length === 0) {
    return null; 
  }

  return (
    <section className="trendingProducts">
      <div className="container">
        <h2>Trending Products</h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="productCard">
                <div className="imageContainer">
                  <Image
                    // UPDATED: Using 'images' as requested
                    src={product.images}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="productImage"
                    // Add unoptimized if fetching external images or direct URLs
                    unoptimized={true} 
                  />
                </div>
                <h3>{product.name}</h3>
                <p className="price">AED: {product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TrendingProducts;