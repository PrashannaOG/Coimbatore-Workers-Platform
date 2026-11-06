
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

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  async function handleSubmit(event) {
    event.preventDefault()

    const mobilePattern = /^[6-9]\d{9}$/

    if (!mobilePattern.test(formData.mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }

    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions.')
      return
    }

    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:5000/api/register/employer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactName: formData.contactName.trim(),
            businessName: formData.businessName.trim(),
            businessType: formData.businessType,
            mobile: formData.mobile.trim(),
            email: formData.email.trim(),
            location: formData.location,
            address: formData.address.trim(),
            password: formData.password,
            acceptedTerms: acceptedTerms,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.')
      }

      setMessage(result.message)

      setFormData({
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

      setAcceptedTerms(false)

    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          'Unable to connect to the backend. Please make sure the Flask server is running.'
        )
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
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
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
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
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Employer Account'}
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
