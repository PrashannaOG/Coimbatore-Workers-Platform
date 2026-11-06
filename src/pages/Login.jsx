
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  })

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value, checked, type } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const identifier = formData.identifier.trim()

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
    const isMobile = /^[6-9]\d{9}$/.test(identifier)

    if (!isEmail && !isMobile) {
      setError(
        'Please enter a valid email address or 10-digit Indian mobile number.'
      )
      return
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',

        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          identifier: identifier,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.')
        return
      }

      setMessage('Login successful! Redirecting...')

      if (data.user.role === 'worker') {
        navigate('/worker/dashboard')
      } else if (data.user.role === 'employer') {
        navigate('/employer/dashboard')
      } else {
        setError('Unknown account role.')
      }

    } catch (error) {
      console.error('Login Error:', error)

      setError(
        'Unable to connect to the server. Please check whether the backend is running.'
      )

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">

      <div className="login-container">

        <div className="login-heading">
          <h1>Welcome Back!</h1>
          <p>Login to your CoimbatoreWorks account.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="identifier">
              Email Address or Mobile Number
            </label>

            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Enter email or mobile number"
              value={formData.identifier}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>
          </div>

          <div className="login-options">

            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="login-register">

          <p>Don't have an account?</p>

          <Link to="/register/worker">
            Register as a Worker
          </Link>

          <span>or</span>

          <Link to="/register/employer">
            Register as an Employer
          </Link>

        </div>

      </div>

    </main>
  )
}

export default Login
