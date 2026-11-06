
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './WorkerDashboard.css'

function WorkerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
  availableJobs: 0,
  applicationsSent: 0,
  shortlisted: 0,
  accepted: 0,
})

  // Retrieve the currently logged-in user's information.
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch('http://localhost:5000/api/me', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await response.json()

        if (!response.ok) {
          navigate('/login', { replace: true })
          return
        }

        if (data.user.role !== 'worker') {
          navigate('/login', { replace: true })
          return
        }

        setUser(data.user)

      } catch (error) {
        console.error('Dashboard Error:', error)
        setError('Unable to connect to the server. Please try again.')

      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

  // Retrieve live worker dashboard statistics.
useEffect(() => {
  async function fetchWorkerStats() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/worker/applications',
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error('Unable to retrieve dashboard statistics.')
      }

      setStats(data.stats)

    } catch (error) {
      console.error('Worker Statistics Error:', error)
    }
  }

  fetchWorkerStats()
}, [])

  // Log out using the Flask backend.
  async function handleLogout(event) {
    event.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        setError('Logout failed. Please try again.')
        return
      }

      navigate('/login', { replace: true })

    } catch (error) {
      console.error('Logout Error:', error)
      setError('Unable to connect to the server. Please try again.')
    }
  }

  // Display loading information while checking the session.
  if (isLoading) {
    return (
      <div className="worker-dashboard">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  // Display an error if the backend cannot be reached.
  if (error && !user) {
    return (
      <div className="worker-dashboard">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const firstLetter = user.fullName.charAt(0).toUpperCase()
  const profileFields = [
  user.fullName,
  user.location,
  user.workCategory,
  user.experience,
]

const completedFields = profileFields.filter(
  field => field && field.trim() !== ''
).length

const profileCompletion = Math.round(
  (completedFields / profileFields.length) * 100
)

  return (
    <div className="worker-dashboard">

      {/* Sidebar */}
      <aside className="worker-sidebar">

        <div className="worker-sidebar-logo">
          <h2>Coimbatore<span>Works</span></h2>
        </div>

        <nav className="worker-sidebar-nav">

          <Link to="/worker/dashboard" className="active">
            <span>📊</span>
            Dashboard
          </Link>

          <Link to="/worker/profile">
            <span>👤</span>
            My Profile
          </Link>

          <Link to="/jobs">
            <span>🔍</span>
            Find Jobs
          </Link>

          <Link to="/worker/applications">
            <span>📄</span>
            My Applications
          </Link>

          <Link to="/worker/saved-jobs">
            <span>❤️</span>
            Saved Jobs
          </Link>

          <Link to="/worker/settings">
            <span>⚙️</span>
            Settings
          </Link>

        </nav>

        <div className="worker-sidebar-bottom">
          <Link to="/login" onClick={handleLogout}>
            <span>🚪</span>
            Logout
          </Link>
        </div>

      </aside>

      {/* Main Content */}
      <main className="worker-dashboard-main">

        {/* Top Header */}
        <header className="worker-dashboard-header">

          <div>
            <h1>Worker Dashboard</h1>
            <p>Manage your work opportunities and applications.</p>
          </div>

          <div className="worker-header-profile">
            <div className="worker-avatar">{firstLetter}</div>

            <div>
              <h4>Welcome, {user.fullName}!</h4>
              <span>Worker Account</span>
            </div>
          </div>

        </header>

        {error && (
          <p className="form-error" role="alert">{error}</p>
        )}

        {/* Welcome Section */}
        <section className="worker-welcome">
          <div>
            <h2>Find Your Next Opportunity!</h2>
            <p>
              Discover suitable jobs and take the next step
              in your career.
            </p>
          </div>

          <Link to="/jobs" className="worker-find-jobs-btn">
            Explore Jobs
          </Link>
        </section>

        
        
{/* Live Dashboard Statistics */}
<section className="worker-stats">

  <div className="worker-stat-card">
    <span>Available Jobs 📋</span>
    <h3>{stats.availableJobs}</h3>
    <p>Currently active jobs</p>
  </div>

  <div className="worker-stat-card">
    <span>Applications Sent 📨</span>
    <h3>{stats.applicationsSent}</h3>
    <p>Total applications submitted</p>
  </div>

  <div className="worker-stat-card">
    <span>Shortlisted ⭐</span>
    <h3>{stats.shortlisted}</h3>
    <p>Applications shortlisted</p>
  </div>

  <div className="worker-stat-card">
    <span>Accepted 🎉</span>
    <h3>{stats.accepted}</h3>
    <p>Applications accepted</p>
  </div>

</section>


        {/* Dashboard Content */}
        <section className="worker-dashboard-content">

          <div className="worker-dashboard-card">
            <div className="worker-card-heading">
              <h2>My Profile</h2>
              <Link to="/worker/profile">Edit Profile</Link>
            </div>

            <div className="worker-profile-info">
  <div className="worker-large-avatar">{firstLetter}</div>

            <div>
              <h3>{user.fullName}</h3>
              <p>Worker · {user.location}</p>
              <p>Work Category: {user.workCategory || 'Not provided'}</p>
              <p>Experience: {user.experience || 'Not provided'}</p>
              <p>Account ID: {user.id}</p>
            </div>
          </div>

            <div className="worker-profile-progress">
  <div>
    <span>Profile Completion</span>
    <strong>{profileCompletion}%</strong>
  </div>

  <div className="worker-progress-track">
    <div
      className="worker-progress-fill"
      style={{ width: `${profileCompletion}%` }}
    ></div>
  </div>

  <p>
    {profileCompletion === 100
      ? 'Your basic profile information is complete!'
      : 'Complete your profile to improve your job opportunities.'}
  </p>
</div>
          </div>

          <div className="worker-dashboard-card">
            <div className="worker-card-heading">
              <h2>Recent Applications</h2>
              <Link to="/worker/applications">View All</Link>
            </div>

            <p>Application information will appear here once applications are connected.</p>

          </div>

        </section>

        {/* Recommended Jobs */}
        <section className="worker-dashboard-card worker-recommended">

          <div className="worker-card-heading">
            <h2>Recommended Jobs</h2>
            <Link to="/jobs">View All Jobs</Link>
          </div>

          <p>Job recommendations will appear here once job matching is connected.</p>

        </section>

      </main>

    </div>
  )
}

export default WorkerDashboard
