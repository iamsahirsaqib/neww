'use client';

import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaShoppingCart, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const PaymentMethodPage = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const router = useRouter();

  // API URL
  const SAVE_ORDER_API = 'https://check.hrgraphics.site/save-order.php';

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load customer details from localStorage
    const savedCustomer = localStorage.getItem('customerDetails');
    if (savedCustomer) {
      setCustomerDetails(JSON.parse(savedCustomer));
    }
  }, []);

  const calculateCartSummary = () => {
    const subtotal = cart.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);
    const shipping = 13;
    const total = subtotal + shipping;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    if (!customerDetails) {
      setError('Customer details not found. Please go back and enter your details.');
      setLoading(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        customer: customerDetails,
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          color: item.color || '',
          size: item.size || '',
          image: item.image
        })),
        payment_method: 'cash_on_delivery'
      };

      console.log('Sending order to backend:', orderData);

      // Send order to backend
      const response = await fetch(SAVE_ORDER_API, {
        method: 'POST',
        mode: 'cors', // Explicitly requesting CORS
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Added Accept header
        },
        body: JSON.stringify(orderData)
      });

      // Check for HTTP errors (like 404 or 500)
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Order response:', result);

      if (result.success) {
        // Save order details
        const orderInfo = {
          orderId: result.order_id,
          customerId: result.customer_id,
          total: result.total,
          timestamp: new Date().toISOString(),
          paymentMethod: 'Cash on Delivery'
        };
        
        setOrderDetails(orderInfo);
        localStorage.setItem('orderDetails', JSON.stringify(orderInfo));
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
        
        // Show confirmation
        setIsConfirmed(true);
      } else {
        setError(result.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      // More specific error message for the user
      setError(err.message === 'Failed to fetch' 
        ? 'Network error. If this persists, the server might be blocking the connection (CORS).' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    // You can create an orders page later
    alert('Orders page coming soon!');
  };

  const handleEditDetails = () => {
    router.push('/customer-details');
  };

  if (cart.length === 0 && !isConfirmed) {
    return (
      <div className="payment-method-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '50px 20px',
        textAlign: 'center',
        minHeight: '70vh'
      }}>
        <FaShoppingCart style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '28px', color: '#666', marginBottom: '15px' }}>
          Your Cart is Empty
        </h1>
        <p style={{ color: '#999', marginBottom: '30px' }}>
          Add some products to your cart before proceeding to payment.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const cartSummary = calculateCartSummary();

  return (
    <div className="payment-method-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      minHeight: '80vh'
    }}>
      <div className="luxury-payment-wrapper" style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
      }}>
        {!isConfirmed ? (
          <>
            <h1 className="luxury-payment-title" style={{
              fontSize: '32px',
              color: '#2c3e50',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              Payment Method
            </h1>
            
            <p className="luxury-payment-subtitle" style={{
              fontSize: '18px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              We currently offer <strong>Cash on Delivery</strong> only. 
              Please pay when you receive the product.
            </p>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaCheckCircle style={{ color: '#c62828' }} />
                {error}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px'
            }}>
              {/* Left Column: Order & Customer Details */}
              <div>
                {/* Order Summary */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  padding: '25px',
                  marginBottom: '30px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    color: '#333',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaShoppingCart /> Order Summary ({cart.length} items)
                  </h3>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '15px',
                        paddingBottom: '15px',
                        borderBottom: index < cart.length - 1 ? '1px solid #eee' : 'none'
                      }}>
                        <div style={{ flexShrink: 0 }}>
                          <img
                            src={item.image || '/images/placeholder.jpg'}
                            alt={item.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '8px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                            {item.name}
                          </h4>
                          {(item.color || item.size) && (
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                              {item.color && `Color: ${item.color}`}
                              {item.color && item.size && ' • '}
                              {item.size && `Size: ${item.size}`}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>
                              Qty: {item.quantity}
                            </span>
                            <span style={{ fontWeight: 'bold' }}>
                              AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Subtotal:</span>
                      <span>AED {cartSummary.subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Shipping:</span>
                      <span>AED {cartSummary.shipping}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '2px solid #ddd',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      <span>Total:</span>
                      <span>AED {cartSummary.total}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                {customerDetails && (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    padding: '25px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{
                        fontSize: '20px',
                        color: '#333',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FaUser /> Customer Details
                      </h3>
                      <button
                        onClick={handleEditDetails}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          color: '#3498db',
                          border: '1px solid #3498db',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div style={{ lineHeight: '1.8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <FaUser style={{ color: '#666', fontSize: '14px' }} />
                        <span>
                          <strong>Name:</strong> {customerDetails.firstName} {customerDetails.lastName}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <FaPhone style={{ color: '#666', fontSize: '14px' }} />
                        <span>
                          <strong>Phone:</strong> {customerDetails.phone}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <FaEnvelope style={{ color: '#666', fontSize: '14px' }} />
                        <span>
                          <strong>Email:</strong> {customerDetails.email}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
                        <FaMapMarkerAlt style={{ color: '#666', fontSize: '14px', marginTop: '3px' }} />
                        <div>
                          <div><strong>Address:</strong> {customerDetails.address}</div>
                          <div>{customerDetails.city}, {customerDetails.emirate}</div>
                          <div>Zip: {customerDetails.zipCode}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payment Method */}
              <div>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  padding: '30px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    color: '#333',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    Confirm Your Order
                  </h3>
                  
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                  }}>
                    <FaMoneyBillWave style={{
                      fontSize: '60px',
                      color: '#27ae60',
                      marginBottom: '15px'
                    }} />
                    <h4 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                      Cash on Delivery
                    </h4>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                      Pay with cash when your order is delivered to your doorstep.
                      Our delivery executive will collect the payment.
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '30px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>
                      Payment Summary
                    </h4>
                    <div style={{ lineHeight: '1.8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Order Total:</span>
                        <span>AED {cartSummary.subtotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Shipping:</span>
                        <span>AED {cartSummary.shipping}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginTop: '15px',
                        paddingTop: '15px',
                        borderTop: '2px solid #ddd',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}>
                        <span>Amount to Pay:</span>
                        <span>AED {cartSummary.total}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: loading ? '#ccc' : '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <span style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid white',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 1s linear infinite'
                          }}></span>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle /> Confirm Order
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => router.push('/cart')}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'transparent',
                        color: '#3498db',
                        border: '2px solid #3498db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginTop: '15px'
                      }}
                    >
                      Back to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="confirmation-page" style={{
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <FaCheckCircle style={{ 
              fontSize: '80px', 
              color: '#2ecc71', 
              marginBottom: '20px' 
            }} />
            
            <h2 className="confirmation-message" style={{
              fontSize: '36px', 
              color: '#2c3e50',
              marginBottom: '15px'
            }}>
              Order Confirmed!
            </h2>
            
            <p className="confirmation-text" style={{
              fontSize: '18px', 
              color: '#666',
              marginBottom: '30px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 40px auto'
            }}>
              Your order has been successfully placed and will be processed shortly.
              Please keep <strong>cash ready</strong> for when our delivery executive arrives.
            </p>

            {orderDetails && (
              <div className="bill-section" style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '30px',
                marginBottom: '40px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <h3 className="order-summary-title" style={{
                  fontSize: '24px',
                  marginBottom: '25px',
                  color: '#333'
                }}>
                  Order Details
                </h3>
                
                <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Order ID:</span>
                    <span style={{ color: '#3498db', fontFamily: 'monospace' }}>
                      {orderDetails.orderId}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Date:</span>
                    <span>{new Date(orderDetails.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Payment Method:</span>
                    <span>{orderDetails.paymentMethod}</span>
                  </div>
                </div>

                <div style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>
                    Amount to Pay on Delivery
                  </h4>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    textAlign: 'center',
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '2px dashed #27ae60'
                  }}>
                    AED {orderDetails.total || cartSummary.total}
                  </div>
                </div>

                {customerDetails && (
                  <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '2px solid #ddd' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>
                      Delivery Address
                    </h4>
                    <div style={{ lineHeight: '1.6', color: '#666' }}>
                      <div><strong>{customerDetails.firstName} {customerDetails.lastName}</strong></div>
                      <div>{customerDetails.address}</div>
                      <div>{customerDetails.city}, {customerDetails.emirate}</div>
                      <div>Phone: {customerDetails.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleContinueShopping}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleViewOrders}
                style={{
                  padding: '15px 30px',
                  backgroundColor: 'transparent',
                  color: '#3498db',
                  border: '2px solid #3498db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                View Order History
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodPage;