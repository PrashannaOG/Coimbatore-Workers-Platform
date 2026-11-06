import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <h2>Coimbatore<span>Works</span></h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <a href="/#home">Home</a>
          <a href="/#jobs">Find Jobs</a>
          <a href="/#workers">Find Workers</a>
          <a href="/#how-it-works">How It Works</a>
        </div>

        {/* Navigation Buttons */}
        <div className="navbar-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register/worker" className="register-btn">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar