
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './WorkerProfile.css'

function WorkerProfile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    workCategory: '',
    experience: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch('http://localhost:5000/api/me', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await response.json()

        if (!response.ok || data.user?.role !== 'worker') {
          navigate('/login', { replace: true })
          return
        }

        setUser(data.user)

        setFormData({
          fullName: data.user.fullName || '',
          location: data.user.location || '',
          workCategory: data.user.workCategory || '',
          experience: data.user.experience || '',
        })

      } catch (error) {
        console.error('Profile Error:', error)
        setError('Unable to connect to the server. Please try again.')

      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(previousData => ({
      ...previousData,
      [name]: value,
    }))
  }

  function handleEdit() {
    setError('')
    setIsEditing(true)
  }

  function handleCancel() {
    setFormData({
      fullName: user.fullName || '',
      location: user.location || '',
      workCategory: user.workCategory || '',
      experience: user.experience || '',
    })

    setError('')
    setIsEditing(false)
  }

  async function handleSave() {
    setError('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/worker/profile',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Unable to update your profile.')
        return
      }

      setUser(previousUser => ({
        ...previousUser,
        ...formData,
      }))

      setIsEditing(false)

    } catch (error) {
      console.error('Profile Update Error:', error)
      setError('Unable to connect to the server. Please try again.')
    }
  }

  if (isLoading) {
    return <p>Loading your profile...</p>
  }

  if (error && !user) {
    return <p>{error}</p>
  }

  if (!user) {
    return null
  }

  return (
    <main className="worker-profile-page">

      <div className="worker-profile-header">
        <h1>My Profile</h1>
        <p>View and manage your professional information.</p>
      </div>

      <section className="worker-profile-card">

        <div className="worker-profile-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>

        <h2>{user.fullName}</h2>
        <p>{user.workCategory || 'Work category not provided'}</p>

        {error && (
          <p className="form-error" role="alert">{error}</p>
        )}

        <div className="worker-profile-details">

          <div>
            <span>Account ID</span>
            <strong>{user.id}</strong>
          </div>

          <div>
            <span>Full Name</span>

            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={100}
              />
            ) : (
              <strong>{user.fullName}</strong>
            )}
          </div>

          <div>
            <span>Location</span>

            {isEditing ? (
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">Select Location</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Erode">Erode</option>
                <option value="Pollachi">Pollachi</option>
                <option value="Mettupalayam">Mettupalayam</option>
              </select>
            ) : (
              <strong>{user.location}</strong>
            )}
          </div>

          <div>
            <span>Work Category</span>

            {isEditing ? (
              <select
                name="workCategory"
                value={formData.workCategory}
                onChange={handleChange}
              >
                <option value="">Select Work Category</option>
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
            ) : (
              <strong>{user.workCategory || 'Not provided'}</strong>
            )}
          </div>

          <div>
            <span>Experience</span>

            {isEditing ? (
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="Above 5 years">Above 5 years</option>
              </select>
            ) : (
              <strong>{user.experience || 'Not provided'}</strong>
            )}
          </div>

        </div>

        <div className="worker-profile-actions">

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="worker-profile-cancel-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="worker-profile-edit-btn"
            >
              Edit Profile
            </button>
          )}

          <Link
            to="/worker/dashboard"
            className="worker-profile-back-btn"
          >
            Back to Dashboard
          </Link>

        </div>

      </section>

    </main>
  )
}

export default WorkerProfile
