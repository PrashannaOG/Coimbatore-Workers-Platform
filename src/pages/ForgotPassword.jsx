
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setError('')

    const emailValue = email.trim()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(emailValue)) {
      setError('Please enter a valid email address.')
      return
    }

    setMessage(
      'Email format validated. Actual password-reset emails are not connected yet.'
    )
  }

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">

        <div className="forgot-password-icon">🔐</div>

        <h1>Forgot Your Password?</h1>

        <p>
          Enter the email address associated with your account.
          We'll help you reset your password.
        </p>

        <form
          className="forgot-password-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>

            <input
              id="reset-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setMessage('')
              }}
              required
            />
          </div>

          {error && (
            <p className="forgot-error">{error}</p>
          )}

          {message && (
            <p className="forgot-success">{message}</p>
          )}

          <button type="submit">
            Reset Password
          </button>
        </form>

        <Link to="/login" className="back-to-login">
          ← Back to Login
        </Link>

      </div>
    </main>
  )
}

export default ForgotPassword
