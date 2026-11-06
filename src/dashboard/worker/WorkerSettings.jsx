import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './WorkerSettings.css'

function WorkerSettings() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const [passwordMessage, setPasswordMessage] = useState('')
const [passwordError, setPasswordError] = useState('')
const [isChangingPassword, setIsChangingPassword] = useState(false)

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

      } catch (error) {
        console.error('Settings Error:', error)
        setError('Unable to connect to the server. Please try again.')

      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

    function handlePasswordChange(event) {
    const { name, value } = event.target

    setPasswordData(previousData => ({
      ...previousData,
      [name]: value,
    }))

    setPasswordError('')
    setPasswordMessage('')
  }

    async function handlePasswordSubmit(event) {
    event.preventDefault()

    setPasswordError('')
    setPasswordMessage('')

    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must contain at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from your current password.')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/worker/change-password',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.message || 'Unable to change your password.')
        return
      }

      setPasswordMessage(data.message || 'Password changed successfully.')

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

    } catch (error) {
      console.error('Password Change Error:', error)
      setPasswordError('Unable to connect to the server. Please try again.')

    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return <p>Loading your settings...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!user) {
    return null
  }

  return (
    <main className="worker-settings-page">

      <div className="worker-settings-header">
        <h1>Account Settings</h1>
        <p>Manage your account and security preferences.</p>
      </div>

      <section className="worker-settings-card">

        <h2>Account Information</h2>
        <p className="worker-settings-description">
          Your registered account details.
        </p>

        <div className="worker-settings-details">

          <div>
            <span>Account ID</span>
            <strong>{user.id}</strong>
          </div>

          <div>
            <span>Full Name</span>
            <strong>{user.fullName}</strong>
          </div>

          <div>
            <span>Email Address</span>
            <strong>{user.email || 'Not provided'}</strong>
          </div>

          <div>
            <span>Mobile Number</span>
            <strong>{user.mobile || 'Not provided'}</strong>
          </div>

          <div>
            <span>Account Type</span>
            <strong>{user.role}</strong>
          </div>

        </div>

      </section>
            <section className="worker-settings-card">

        <h2>Change Password</h2>

        <p className="worker-settings-description">
          Update your password to keep your account secure.
        </p>

        <div className="worker-settings-password-form">

                  {passwordError && (
            <p className="form-error" role="alert">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p className="form-success" role="status">
              {passwordMessage}
            </p>
          )}

          <div>
            <label htmlFor="currentPassword">Current Password</label>
            
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            />
          </div>

          <div>
            <label htmlFor="newPassword">New Password</label>
            
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <button
  type="button"
  onClick={handlePasswordSubmit}
  disabled={isChangingPassword}
>
  {isChangingPassword ? 'Changing Password...' : 'Change Password'}
</button>

        </div>

      </section>
      <div className="worker-settings-actions">
        <Link to="/worker/dashboard">
          Back to Dashboard
        </Link>
      </div>

    </main>
  )
}

export default WorkerSettings