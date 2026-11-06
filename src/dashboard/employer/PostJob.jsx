
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './PostJob.css'

function PostJob() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    jobTitle: '',
    workCategory: '',
    jobDescription: '',
    location: '',
    jobAddress: '',
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    vacancies: '1',
    experienceRequired: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(previousData => ({
      ...previousData,
      [name]: value,
    }))

    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (Number(formData.salaryMax) < Number(formData.salaryMin)) {
      setError('Maximum salary cannot be less than minimum salary.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/employer/jobs',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            salaryMin: Number(formData.salaryMin),
            salaryMax: Number(formData.salaryMax),
            vacancies: Number(formData.vacancies),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to publish job.')
      }

      setMessage(
        `Job published successfully! Job ID: ${result.jobId}`
      )

      setFormData({
        jobTitle: '',
        workCategory: '',
        jobDescription: '',
        location: '',
        jobAddress: '',
        jobType: '',
        salaryMin: '',
        salaryMax: '',
        vacancies: '1',
        experienceRequired: '',
      })

    } catch (err) {
      console.error('Job Posting Error:', err)

      setError(
        err instanceof TypeError
          ? 'Unable to connect to the server. Please check your Flask server.'
          : err.message
      )

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="post-job-page">

      <div className="post-job-container">

        <header className="post-job-header">
          <h1>Post a New Job</h1>
          <p>
            Find the right workers by publishing your job opportunity.
          </p>
        </header>

        <form
          className="post-job-form"
          onSubmit={handleSubmit}
        >

          <div className="post-job-form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Example: Electrician Required"
              value={formData.jobTitle}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="post-job-form-group">
            <label htmlFor="workCategory">Work Category</label>
            <select
              id="workCategory"
              name="workCategory"
              value={formData.workCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select work category</option>
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

          <div className="post-job-form-group">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Describe the responsibilities and requirements..."
              rows="5"
              maxLength={3000}
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="post-job-form-group">
            <label htmlFor="location">Work Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select work location</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruppur">Tiruppur</option>
              <option value="Erode">Erode</option>
              <option value="Pollachi">Pollachi</option>
              <option value="Mettupalayam">Mettupalayam</option>
            </select>
          </div>

          <div className="post-job-form-group">
            <label htmlFor="jobAddress">Workplace Address</label>
            <textarea
              id="jobAddress"
              name="jobAddress"
              placeholder="Enter the complete workplace address"
              rows="3"
              maxLength={250}
              value={formData.jobAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="post-job-form-group">
            <label htmlFor="jobType">Employment Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option value="">Select employment type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>

          <div className="post-job-salary-group">

            <div className="post-job-form-group">
              <label htmlFor="salaryMin">Minimum Salary (₹)</label>
              <input
                id="salaryMin"
                name="salaryMin"
                type="number"
                min="0"
                step="1"
                placeholder="Example: 12000"
                value={formData.salaryMin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="post-job-form-group">
              <label htmlFor="salaryMax">Maximum Salary (₹)</label>
              <input
                id="salaryMax"
                name="salaryMax"
                type="number"
                min="0"
                step="1"
                placeholder="Example: 18000"
                value={formData.salaryMax}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="post-job-form-group">
            <label htmlFor="vacancies">Number of Vacancies</label>
            <input
              id="vacancies"
              name="vacancies"
              type="number"
              min="1"
              max="1000"
              step="1"
              value={formData.vacancies}
              onChange={handleChange}
              required
            />
          </div>

          <div className="post-job-form-group">
            <label htmlFor="experienceRequired">
              Required Experience
            </label>

            <select
              id="experienceRequired"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleChange}
              required
            >
              <option value="">Select required experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1–3 years">1–3 years</option>
              <option value="3–5 years">3–5 years</option>
              <option value="Above 5 years">Above 5 years</option>
            </select>
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
            className="post-job-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Publishing Job...' : 'Publish Job'}
          </button>

          <Link
            to="/employer/dashboard"
            className="post-job-back-link"
          >
            Back to Employer Dashboard
          </Link>

        </form>

      </div>

    </main>
  )
}

export default PostJob
