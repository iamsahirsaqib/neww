'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa'

const CartPage = () => {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Load Cart from LocalStorage on Mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  // 2. Helper to update state and LocalStorage simultaneously
  const updateCart = (updatedCart) => {
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // 3. Update Quantity (Logic from first file, adapted to index)
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(index)
      return
    }
    
    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    updateCart(updatedCart)
  }

  // 4. Remove Item
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    updateCart(updatedCart)
  }

  // 5. Clear Cart
  const clearCart = () => {
    updateCart([])
  }

  // 6. Calculate Totals (Including Shipping from first file)
  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
  const shipping = 13 // Fixed shipping from your first file
  const totalPrice = subtotal + shipping

  // 7. Proceed to Checkout Logic
  const proceedToCheckout = () => {
    if (cart.length > 0) {
      router.push('/customer-details')
    }
  }

  // Prevent hydration mismatch or flash of empty content
  if (loading) {
    return <div className="cart-page container"><p>Loading cart...</p></div>
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p className="cart-empty" style={{ marginBottom: '20px' }}>Your cart is empty.</p>
            <button 
                onClick={() => router.push('/')}
                className="qty-btn" 
                style={{ padding: '10px 20px', width: 'auto' }}
            >
                Continue Shopping
            </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {/* Note: Using index as key because generic cart items might not have unique IDs from previous steps */}
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <Image 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name || item.title} 
                    fill 
                    className="image" 
                    unoptimized={true} // Added for external images compatibility
                  />
                </div>
                <div className="cart-item-details">
                  <h2 className="item-title">{item.name || item.title}</h2>
                  
                  {/* Optional: Show color/size if they exist in data */}
                  {(item.color || item.size) && (
                    <p className="item-desc" style={{ fontSize: '0.9rem', color: '#666' }}>
                        {item.color} {item.size ? `• ${item.size}` : ''}
                    </p>
                  )}
                  
                  <p className="item-price">Price: AED {parseFloat(item.price).toFixed(2)}</p>

                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                    >
                      –
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-total">
                    Total: AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>

            {/* Changed from Link to onClick to use the router logic */}
            <button className="proceed-btn" onClick={proceedToCheckout}>
              Proceed
            </button>
          </div>

          <div className="cart-total" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
            <p style={{ margin: 0, color: '#666' }}>Subtotal: AED {subtotal.toFixed(2)}</p>
            <p style={{ margin: 0, color: '#666' }}>Shipping: AED {shipping.toFixed(2)}</p>
            <h3 className="total-label" style={{ marginTop: '10px' }}>
                Grand Total: AED {totalPrice.toFixed(2)}
            </h3>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage
