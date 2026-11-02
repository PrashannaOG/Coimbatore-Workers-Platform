import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="login-page">

      <div className="login-container">

        <div className="login-heading">
          <h1>Welcome Back!</h1>
          <p>Login to your CoimbatoreWorks account.</p>
        </div>

        <form className="login-form">

          <div className="form-group">
            <label>Email Address or Mobile Number</label>
            <input
              type="text"
              placeholder="Enter email or mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-submit">
            Login
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