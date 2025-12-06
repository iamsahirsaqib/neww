'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; // <--- Import Link

const FeaturedCategories = () => {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://check.hrgraphics.site";

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-categories.php`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll with seamless loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || categories.length === 0) return;

    let scrollPosition = 0;
    const itemWidth = 150; 
    const gap = 20; 
    const totalWidth = categories.length * (itemWidth + gap);

    const interval = setInterval(() => {
      scrollPosition += 1;
      
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollPosition;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [categories.length]);

  if (loading) {
    return (
      <section className="ffeatured-section">
        <h2 className="fsection-title">Featured Categories</h2>
        <div className="loading-categories">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="ffeatured-section">
      <h2 className="fsection-title">Featured Categories</h2>

      <div className="fscroll-wrapper">
        <div className="fcategories-container" ref={containerRef}>
          {categories.map((category) => (
            // UPDATED: Using Next.js Link
            <Link
              href={`/categories/${category.id}`}
              key={category.id}
              className="fcategory-card"
            >
              <div className="fimage-circle">
                <img 
                  src={category.image_url || category.image} 
                  alt={category.name}
                  className="category-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' text-anchor='middle' dy='.3em' fill='%236b7280'%3ECategory%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="fcategory-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;