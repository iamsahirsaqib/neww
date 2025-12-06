"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

const HeroSlider = ({ showHero = true }) => {
  const [images, setImages] = useState([]); // Empty array - no default images
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  let touchStartX = 0;
  let touchEndX = 0;

  // Backend API URL
  const API_URL = "https://check.hrgraphics.site";

  // Fetch banners from backend on component mount
  useEffect(() => {
    fetchBannersFromBackend();
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const fetchBannersFromBackend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-banners.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "success" && data.banners) {
        // Extract URLs from banners array
        const bannerUrls = data.banners.map(banner => banner.url || banner);
        
        // Set images from backend (empty array if no banners)
        setImages(bannerUrls);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Do not set fallback images - keep empty array
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Next & Previous Functions
  const nextSlide = () => {
    if (images.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Mobile Swipe Handling
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (images.length <= 1) return;
    
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  };

  if (!showHero) return null;

  if (loading) {
    return (
      <div className="hero-slider loading">
        <div className="slides" style={{ transform: `translateX(0%)` }}>
          <div className="slide">
            <div className="image-placeholder">
              <div className="loading-spinner"></div>
              <p>Loading banners...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="hero-slider empty">
        <div className="slides" style={{ transform: `translateX(0%)` }}>
          <div className="slide">
            <div className="image-placeholder">
              <p>No banners available</p>
              <small>Add banners from admin dashboard</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="hero-slider" 
      ref={sliderRef} 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove} 
      onTouchEnd={handleTouchEnd}
    >
      <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="slide" key={index}>
            {/* Regular img tag instead of Next.js Image component */}
            <img 
              src={image} 
              alt={`hero-${index + 1}`}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                // Optional: Show a placeholder if image fails to load
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='500' viewBox='0 0 1200 500'%3E%3Crect width='1200' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage not available%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Only Desktop & when multiple images) */}
      {images.length > 1 && (
        <div className="slider-navigation">
          <button className="prev slider-btn" onClick={prevSlide}>
            <FaArrowCircleLeft size={40} />
          </button>
          <button className="next slider-btn" onClick={nextSlide}>
            <FaArrowCircleRight size={40} />
          </button>
        </div>
      )}

      {/* Pagination Dots (Only Mobile & when multiple images) */}
      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;