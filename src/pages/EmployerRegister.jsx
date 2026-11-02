
import { Link } from 'react-router-dom'
import './EmployerRegister.css'

function EmployerRegister() {
  return (
    <main className="employer-register-page">

      <div className="employer-register-container">

        <div className="employer-register-heading">
          <h1>Join as an Employer</h1>
          <p>Create your business account and find the right workers.</p>
        </div>

        <form className="employer-register-form">

          <div className="form-group">
            <label>Contact Person Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Business / Company Name</label>
            <input
              type="text"
              placeholder="Enter your business name"
              required
            />
          </div>

          <div className="form-group">
            <label>Business Type</label>
            <select defaultValue="" required>
              <option value="" disabled>Select business type</option>
              <option>Individual / Contractor</option>
              <option>Shop / Retail</option>
              <option>Manufacturing / Factory</option>
              <option>Construction Company</option>
              <option>Service Business</option>
              <option>Logistics / Delivery</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your business email"
              required
            />
          </div>

          <div className="form-group">
            <label>Business Location</label>
            <select defaultValue="" required>
              <option value="" disabled>Select your location</option>
              <option>Coimbatore</option>
              <option>Tiruppur</option>
              <option>Erode</option>
              <option>Pollachi</option>
              <option>Mettupalayam</option>
            </select>
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <textarea
              placeholder="Enter your complete business address"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <input
              type="password"
              placeholder="Create a password"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              minLength={8}
              required
            />
          </div>

          <label className="employer-terms-label">
            <input type="checkbox" required />
            I agree to the Terms and Conditions.
          </label>

          <button type="submit" className="employer-register-submit">
            Create Employer Account
          </button>

        </form>

        <div className="employer-register-login">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>

    </main>
  )
}

export default EmployerRegister
