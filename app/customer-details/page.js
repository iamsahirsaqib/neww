'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaArrowRight,
  FaLocationArrow,
  FaCity,
  FaGlobe,
  FaHashtag,
  FaShoppingCart,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

const emirates = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Fujairah',
  'Ras Al Khaimah',
  'Umm Al Quwain',
];

const CustomerDetailsPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    emirate: '',
    city: '',
    zipCode: '',
    email: '',
  });
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 13,
    total: 0
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
        
        // Calculate cart summary
        const subtotal = cartData.reduce((sum, item) => 
          sum + (parseFloat(item.price) * item.quantity), 0);
        const shipping = 13;
        const total = subtotal + shipping;
        
        setCartSummary({
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2)
        });
      } catch (err) {
        console.error('Error parsing cart:', err);
        setCart([]);
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.emirate) {
      setError('Please select an emirate');
      return false;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return false;
    }
    if (cart.length === 0) {
      setError('Your cart is empty');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save customer details to localStorage
      localStorage.setItem('customerDetails', JSON.stringify(formData));
      
      // Save cart summary for payment page
      const orderSummary = {
        customer: formData,
        cart: cart,
        summary: cartSummary,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
      
      // Redirect to payment method page
      router.push('/payment-method');
      
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View cart function
  const viewCart = () => {
    router.push('/cart');
  };

  return (
    <div className="customerDetailsContainer">
      <div className="luxuryFormWrapper">
        <h1 className="luxuryFormTitle">Customer Details</h1>
        <p className="luxuryFormSubtitle">Please provide your details to proceed to payment.</p>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary" style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaShoppingCart /> Order Summary
              </h3>
              <button 
                onClick={viewCart}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View Cart ({cart.length})
              </button>
            </div>
            
            <div style={{ fontSize: '14px' }}>
              {cart.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: index < cart.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <span style={{ maxWidth: '70%' }}>
                    {item.name} 
                    {item.color && ` (${item.color})`}
                    {item.size && ` - ${item.size}`}
                  </span>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {item.quantity} × AED {parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Subtotal:</span>
                  <span>AED {cartSummary.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Shipping:</span>
                  <span>AED {cartSummary.shipping}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                  <span>Total:</span>
                  <span>AED {cartSummary.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="luxuryForm">
          {/* First Name */}
          <div className="formGroup">
            <label htmlFor="firstName" className="formLabel">
              <FaUser className="formIcon" /> First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Last Name */}
          <div className="formGroup">
            <label htmlFor="lastName" className="formLabel">
              <FaUser className="formIcon" /> Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phone */}
          <div className="formGroup">
            <label htmlFor="phone" className="formLabel">
              <FaPhone className="formIcon" /> Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="05x-xxx-xxxx"
              className="formInput"
              required
              disabled={loading}
              pattern="[0-9]{10}"
              title="10-digit UAE phone number"
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email */}
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              <FaEnvelope className="formIcon" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Address */}
          <div className="formGroup">
            <label htmlFor="address" className="formLabel">
              <FaLocationArrow className="formIcon" /> Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Building, Street, Area"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Emirate */}
          <div className="formGroup">
            <label htmlFor="emirate" className="formLabel">
              <FaGlobe className="formIcon" /> Emirate
            </label>
            <select
              id="emirate"
              name="emirate"
              value={formData.emirate}
              onChange={handleInputChange}
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select an Emirate</option>
              {emirates.map((em, index) => (
                <option key={index} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="formGroup">
            <label htmlFor="city" className="formLabel">
              <FaCity className="formIcon" /> City Name
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Zip Code */}
          <div className="formGroup">
            <label htmlFor="zipCode" className="formLabel">
              <FaHashtag className="formIcon" /> Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="e.g., 00000"
              className="formInput"
              required
              disabled={loading}
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="luxuryNextButton"
            disabled={loading || cart.length === 0}
            style={{
              padding: '16px 24px',
              backgroundColor: loading || cart.length === 0 ? '#ccc' : '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Processing...
              </>
            ) : (
              <>
                <FaCheckCircle /> Proceed to Payment <FaArrowRight className="buttonIcon" />
              </>
            )}
          </button>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .customerDetailsContainer {
              max-width: 800px;
              margin: 0 auto;
              padding: 30px 20px;
              min-height: 80vh;
            }
            
            .luxuryFormWrapper {
              background: white;
              border-radius: 15px;
              padding: 40px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            
            .luxuryFormTitle {
              font-size: 32px;
              color: #2c3e50;
              margin-bottom: 10px;
              text-align: center;
            }
            
            .luxuryFormSubtitle {
              font-size: 18px;
              color: #666;
              text-align: center;
              margin-bottom: 40px;
            }
            
            .formGroup {
              margin-bottom: 25px;
            }
            
            .formLabel {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 8px;
              color: #333;
              font-size: 16px;
              font-weight: 500;
            }
            
            .formIcon {
              color: #3498db;
              font-size: 16px;
            }
          `}</style>
        </form>

        {cart.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <FaShoppingCart style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }} />
            <h3 style={{ color: '#666' }}>Your Cart is Empty</h3>
            <p style={{ color: '#999' }}>Add some products to your cart before proceeding.</p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsPage;