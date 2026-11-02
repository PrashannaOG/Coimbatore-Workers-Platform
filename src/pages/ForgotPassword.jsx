
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {
  return (
    <main className="forgot-password-page">

      <div className="forgot-password-container">

        <div className="forgot-password-icon">🔐</div>

        <h1>Forgot Your Password?</h1>

        <p>
          Enter the email address associated with your account.
          We'll help you reset your password.
        </p>

        <form className="forgot-password-form">

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              required
            />
          </div>

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
