import { Link } from 'react-router-dom'
import './WorkerRegister.css'

function WorkerRegister() {
  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-heading">
          <h1>Join as a Worker</h1>
          <p>Create your account and discover work opportunities.</p>
        </div>

        <form className="register-form">

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" placeholder="Enter your mobile number" required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email address" />
          </div>

          <div className="form-group">
            <label>Location</label>
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
            <label>Work Category</label>
            <select defaultValue="" required>
              <option value="" disabled>Select your work category</option>
              <option>Construction</option>
              <option>Electrician</option>
              <option>Plumbing</option>
              <option>Driving</option>
              <option>Delivery</option>
              <option>Factory Work</option>
              <option>Housekeeping</option>
              <option>Security</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <select defaultValue="" required>
              <option value="" disabled>Select experience</option>
              <option>Fresher</option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>3–5 years</option>
              <option>Above 5 years</option>
            </select>
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <input
              type="password"
              placeholder="Create a password"
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              required
              minLength={8}
            />
          </div>

          <label className="terms-label">
            <input type="checkbox" required />
            I agree to the Terms and Conditions.
          </label>

          <button type="submit" className="register-submit">
            Create Worker Account
          </button>

        </form>

        <div className="register-login">
          Already have an account? <Link to="/login">Login</Link>
        </div>

      </div>

    </main>
  )
}

export default WorkerRegister