'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCredentialsSubmit = e => {
    e.preventDefault()
    if (phone.match(/^\d{10,}$/) && password.length >= 4) {
      console.log('Sending OTP to', phone)
      setStep(2)
      setError('')
    } else {
      setError('Enter valid phone and password')
    }
  }

  const handleOtpSubmit = e => {
    e.preventDefault()
    if (otp === '123456') {
      router.push('/admin-dashboard')
    } else {
      setError('Invalid OTP')
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        
        {/* Left side: Form */}
        <div className="admin-login-left">
          <h2>Admin Login</h2>
          {error && <p className="error">{error}</p>}

          {step === 1 && (
            <form onSubmit={handleCredentialsSubmit}>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 0501234567"
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Send OTP</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <div>
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit">Verify & Login</button>
            </form>
          )}
        </div>

        {/* Slash Divider */}
        <div className="admin-login-slash"></div>

        {/* Right side: Welcome message */}
        <div className="admin-login-right">
          <h1>Welcome Back!</h1>
          <p className="quote">Al Khaira — where quality speaks for itself, and trust is built in every choice.</p>
        </div>
      </div>
    </div>
  )
}
