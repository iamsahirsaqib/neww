'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(index);
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0);
  };

  const proceedToCheckout = () => {
    if (cart.length > 0) {
      router.push('/customer-details');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '50px 20px',
        textAlign: 'center'
      }}>
        <FaShoppingCart style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
        <h2 style={{ color: '#666', marginBottom: '15px' }}>Your Cart is Empty</h2>
        <p style={{ color: '#999', marginBottom: '30px' }}>Add some products to your cart!</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          <FaArrowLeft /> Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const shipping = 13;
  const total = subtotal + shipping;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      minHeight: '70vh'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <FaShoppingCart /> Shopping Cart ({cart.length} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px'
      }}>
        {/* Cart Items */}
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '20px',
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              marginBottom: '20px',
              backgroundColor: 'white'
            }}>
              <div style={{ flexShrink: 0 }}>
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.name}
                  width={120}
                  height={120}
                  style={{ 
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                  unoptimized={true}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  {item.name}
                </h3>
                
                {(item.color || item.size) && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                    {item.color && `Color: ${item.color}`}
                    {item.color && item.size && ' • '}
                    {item.size && `Size: ${item.size}`}
                  </p>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: '#f8f9fa',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        <FaMinus />
                      </button>
                      
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                        min="1"
                        style={{
                          width: '50px',
                          padding: '8px',
                          border: 'none',
                          textAlign: 'center',
                          fontSize: '16px'
                        }}
                      />
                      
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        style={{
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: '#f8f9fa',
                          cursor: 'pointer',
                          fontSize: '16px'
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(index)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      AED {parseFloat(item.price).toFixed(2)} each
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '25px',
            backgroundColor: 'white',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>Order Summary</h2>
            
            <div style={{ marginBottom: '20px' }}>
              {cart.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '16px'
              }}>
                <span>Subtotal</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '16px'
              }}>
                <span>Shipping</span>
                <span>AED {shipping.toFixed(2)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid #eee',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                <span>Total</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={proceedToCheckout}
              disabled={loading || cart.length === 0}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Proceed to Checkout
            </button>
            
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#3498db',
                border: '2px solid #3498db',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <FaArrowLeft /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;