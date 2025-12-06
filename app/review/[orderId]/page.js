"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ReviewPage() {
  // We are using 'orderId' from the URL as the 'product_id' based on your backend setup
  const { orderId } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true); // New loading state
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // API Config
  const API_BASE = "https://check.hrgraphics.site";

  // 1. Fetch Product Details on Load (Robust Version)
  useEffect(() => {
    if (!orderId) return;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await fetch(`${API_BASE}/get_product_lite.php?id=${orderId}`);
        
        // Safety check: Read text first to prevent JSON crashes
        const text = await res.text();
        
        if (!text) {
            console.error("API returned empty response");
            return;
        }

        try {
            const data = JSON.parse(text);
            if (data.success) {
                setProduct(data.product);
            } else {
                console.warn("Product not found or API error:", data.message);
            }
        } catch (jsonErr) {
            console.error("JSON Parse Error:", jsonErr, "Response:", text);
        }

      } catch (error) {
        console.error("Network Error fetching product:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [orderId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 2. Submit Review to Backend
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please provide a rating before submitting your review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("product_id", orderId);
      formData.append("rating", rating);
      formData.append("review_text", reviewText);

      // Append images
      images.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(`${API_BASE}/submit_review.php`, {
        method: "POST",
        body: formData,
      });

      // Get text first for safety
      const text = await response.text();
      const result = JSON.parse(text);

      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Failed to submit review: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 16px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "white",
        }}
      >
        <div
          style={{
            background: "#0a0a0a",
            padding: "clamp(30px, 5vw, 40px)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(255,255,255,0.05)",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              fontSize: "clamp(50px, 10vw, 80px)",
              marginBottom: "20px",
              color: "#ffffff",
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
            }}
          >
            ✓
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              marginBottom: "15px",
              color: "#ffffff",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Thank You!
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 3vw, 16px)",
              marginBottom: "30px",
              color: "#cccccc",
              lineHeight: "1.6",
              maxWidth: "400px",
              margin: "0 auto 30px",
            }}
          >
            Your review has been submitted successfully. We appreciate your valuable feedback!
          </p>

          <Link href="/">
            <button
              style={{
                background: "white",
                color: "black",
                padding: "14px 35px",
                borderRadius: "50px",
                border: "none",
                fontSize: "clamp(14px, 3vw, 16px)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(255,255,255,0.15)",
                letterSpacing: "0.5px",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          background: "#0a0a0a",
          padding: "clamp(20px, 4vw, 40px)",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(255,255,255,0.05)",
          maxWidth: "700px",
          width: "100%",
          border: "1px solid #333",
        }}
      >
        {loadingProduct ? (
             <div style={{textAlign: 'center', padding: '50px', color: 'white'}}>
                <span style={{display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '24px'}}>⟳</span>
                <p>Loading Product...</p>
             </div>
        ) : (
        <>
            {/* Header Section */}
            <div
            style={{
                textAlign: "center",
                marginBottom: "clamp(25px, 5vw, 40px)",
                paddingBottom: "20px",
                borderBottom: "1px solid #333",
            }}
            >
            <h1
                style={{
                fontSize: "clamp(24px, 6vw, 36px)",
                marginBottom: "12px",
                color: "#ffffff",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
                }}
            >
                Share Your Experience
            </h1>

            {/* Product Preview Section */}
            {product && (
                <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
                marginBottom: "20px",
                background: "#151515",
                padding: "10px 20px",
                borderRadius: "12px",
                width: "fit-content",
                margin: "0 auto 20px auto",
                border: "1px solid #333"
                }}>
                <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    backgroundColor: "#222"
                    }}
                />
                <div style={{textAlign: 'left'}}>
                    <span style={{ display:'block', color: "#888", fontSize: "12px" }}>Reviewing:</span>
                    <span style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>{product.name}</span>
                </div>
                </div>
            )}

            <div style={{
                background: "linear-gradient(145deg, #0a0a0a, #151515)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid #444",
                textAlign: "center",
                marginBottom: "20px",
                transition: "all 0.3s ease",
            }}>
                <div style={{ fontSize: "22px", marginBottom: "12px" }}>✨</div>
                <div style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "#ffffff", fontWeight: "600", marginBottom: "8px" }}>
                Your Feedback Creates Impact
                </div>
                <div style={{ fontSize: "clamp(13px, 2.5vw, 14px)", color: "#cccccc" }}>
                Help us improve and serve you better
                </div>
            </div>
            </div>

            {/* Star Rating Section */}
            <div
            style={{
                textAlign: "center",
                marginBottom: "clamp(25px, 5vw, 35px)",
                padding: "clamp(20px, 4vw, 25px)",
                background: "#111111",
                borderRadius: "16px",
                border: "1px solid #333",
            }}
            >
            <h3
                style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                marginBottom: "clamp(15px, 3vw, 20px)",
                color: "#ffffff",
                fontWeight: "600",
                }}
            >
                How would you rate your experience?
            </h3>
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(3px, 1vw, 8px)",
                marginBottom: "15px",
                flexWrap: "wrap"
            }}>
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: star <= (hoverRating || rating) ? "#FFFFFF" : "#444444",
                    fontSize: "clamp(32px, 8vw, 48px)",
                    transition: "all 0.2s ease",
                    filter: star <= (hoverRating || rating) ? "drop-shadow(0 0 12px rgba(255,255,255,0.4))" : "none",
                    transform: star <= (hoverRating || rating) ? "scale(1.15)" : "scale(1)",
                    padding: "5px",
                    }}
                >
                    ★
                </button>
                ))}
            </div>
            <p
                style={{
                marginTop: "12px",
                fontSize: "clamp(13px, 3vw, 15px)",
                color: "#aaaaaa",
                fontStyle: "italic",
                minHeight: "20px",
                }}
            >
                {rating === 0
                ? "Tap a star to rate your experience"
                : rating <= 2
                    ? "We're sorry to hear that - how can we improve?"
                    : rating <= 4
                    ? "Thank you for your valuable feedback!"
                    : "We're thrilled you loved your experience! 🎉"}
            </p>
            </div>

            {/* Review Textarea */}
            <div style={{ marginBottom: "clamp(20px, 4vw, 30px)" }}>
            <label
                style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "clamp(15px, 3.5vw, 18px)",
                color: "#ffffff",
                fontWeight: "600",
                }}
            >
                Tell us more about your experience
            </label>
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you like? What could be improved?"
                rows={5}
                style={{
                width: "100%",
                padding: "clamp(14px, 3vw, 18px)",
                fontSize: "clamp(14px, 3vw, 16px)",
                border: "1px solid #333",
                borderRadius: "12px",
                background: "#111111",
                color: "white",
                resize: "vertical",
                minHeight: "120px",
                fontFamily: "inherit",
                }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#888" }}>
                <span>Share your honest thoughts</span>
                <span>{reviewText.length}/500</span>
            </div>
            </div>

            {/* Image Upload Section */}
            <div style={{ marginBottom: "clamp(20px, 4vw, 30px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <label style={{ fontSize: "16px", color: "#ffffff", fontWeight: "600" }}>Add photos (optional)</label>
                <span style={{ fontSize: "12px", color: "#888", background: "#1a1a1a", padding: "4px 12px", borderRadius: "12px" }}>
                {images.length}/5 images
                </span>
            </div>

            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                border: "2px dashed #444",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                background: "#111111",
                cursor: "pointer",
                marginBottom: "15px",
                }}
            >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📷</div>
                <p style={{ color: "#ccc", marginBottom: "8px" }}>Drag & drop images here</p>
                <label
                style={{
                    display: "inline-block",
                    background: "#222",
                    color: "white",
                    padding: "10px 25px",
                    borderRadius: "50px",
                    cursor: "pointer",
                    border: "1px solid #444",
                }}
                >
                Choose Files
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </label>
            </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" }}>
                {images.map((img, index) => (
                    <div key={index} style={{ position: "relative", aspectRatio: "1" }}>
                    <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px", border: "1px solid #444" }}
                    />
                    <button
                        onClick={() => removeImage(index)}
                        style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        background: "#000", color: "white", border: "1px solid #444",
                        borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer"
                        }}
                    >
                        ×
                    </button>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Submit Button */}
            <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            style={{
                background: isSubmitting ? "#333" : (rating === 0 ? "#222" : "white"),
                color: isSubmitting ? "#999" : (rating === 0 ? "#666" : "black"),
                padding: "18px 30px",
                borderRadius: "50px",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: (isSubmitting || rating === 0) ? "not-allowed" : "pointer",
                width: "100%",
                textTransform: "uppercase",
            }}
            >
            {isSubmitting ? "Submitting Review..." : rating === 0 ? "Please Select a Rating" : "Submit Your Review"}
            </button>
        </>
        )}

        <style jsx>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @media (max-width: 480px) { textarea { font-size: 16px; } }
        `}</style>
      </div>
    </div>
  );
}