
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './EmployerRegister.css'

function EmployerRegister() {
  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    businessType: '',
    mobile: '',
    email: '',
    location: '',
    address: '',
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

    const mobilePattern = /^[6-9]\d{9}$/

    if (!mobilePattern.test(formData.mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    // Frontend demonstration only
    console.log('Employer Registration Data:', {
      contactName: formData.contactName,
      businessName: formData.businessName,
      businessType: formData.businessType,
      mobile: formData.mobile,
      email: formData.email,
      location: formData.location,
      address: formData.address,
    })

    setError('')
    setMessage(
      'Registration form validated successfully! Backend registration is not connected yet.'
    )
  }

  return (
    <main className="employer-register-page">

      <div className="employer-register-container">

        <div className="employer-register-heading">
          <h1>Join as an Employer</h1>
          <p>Create your business account and find the right workers.</p>
        </div>

        <form
          className="employer-register-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label htmlFor="contactName">Contact Person Name</label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              placeholder="Enter your full name"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessName">Business / Company Name</label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            >
              <option value="">Select business type</option>
              <option value="Individual / Contractor">Individual / Contractor</option>
              <option value="Shop / Retail">Shop / Retail</option>
              <option value="Manufacturing / Factory">Manufacturing / Factory</option>
              <option value="Construction Company">Construction Company</option>
              <option value="Service Business">Service Business</option>
              <option value="Logistics / Delivery">Logistics / Delivery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employerMobile">Mobile Number</label>
            <input
              id="employerMobile"
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
            <label htmlFor="employerEmail">Email Address</label>
            <input
              id="employerEmail"
              name="email"
              type="email"
              placeholder="Enter your business email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employerLocation">Business Location</label>
            <select
              id="employerLocation"
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
            <label htmlFor="businessAddress">Business Address</label>
            <textarea
              id="businessAddress"
              name="address"
              placeholder="Enter your complete business address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="employerPassword">Create Password</label>
            <input
              id="employerPassword"
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
            <label htmlFor="employerConfirmPassword">Confirm Password</label>
            <input
              id="employerConfirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <label className="employer-terms-label">
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

          <button
            type="submit"
            className="employer-register-submit"
          >
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
