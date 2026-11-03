
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './WorkerRegister.css'

function WorkerRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    location: '',
    category: '',
    experience: '',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    setError('')
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    // Validate Indian mobile number
    const mobilePattern = /^[6-9]\d{9}$/

    if (!mobilePattern.test(formData.mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    // Validate password matching
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    // Frontend demonstration only
    console.log('Worker Registration Data:', {
      fullName: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      location: formData.location,
      category: formData.category,
      experience: formData.experience,
    })

    setError('')
    setMessage('Registration form validated successfully! Backend registration is not connected yet.')
  }

  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-heading">
          <h1>Join as a Worker</h1>
          <p>Create your account and discover work opportunities.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select your location</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruppur">Tiruppur</option>
              <option value="Erode">Erode</option>
              <option value="Pollachi">Pollachi</option>
              <option value="Mettupalayam">Mettupalayam</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Work Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select your work category</option>
              <option value="Construction">Construction</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Driving">Driving</option>
              <option value="Delivery">Delivery</option>
              <option value="Factory Work">Factory Work</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Security">Security</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1–3 years">1–3 years</option>
              <option value="3–5 years">3–5 years</option>
              <option value="Above 5 years">Above 5 years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <label className="terms-label">
            <input type="checkbox" required />
            I agree to the Terms and Conditions.
          </label>

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
