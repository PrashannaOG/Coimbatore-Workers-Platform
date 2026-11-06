
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './EmployerDashboard.css'

function EmployerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
  totalJobs: 0,
  activeJobs: 0,
  closedJobs: 0,
})
const fetchJobStats = useCallback(async () => {
  try {
    const response = await fetch('http://localhost:5000/api/employer/jobs', {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to fetch job statistics.')
    }

    const jobs = data.jobs || []

    setStats({
      totalJobs: jobs.length,
      activeJobs: jobs.filter(
        (job) => job.status === 'Active'
      ).length,
      closedJobs: jobs.filter(
        (job) => job.status === 'Closed'
      ).length,
    })

  } catch (error) {
    console.error('Job Statistics Error:', error)
  }
}, [])


  useEffect(() => {
  async function fetchCurrentUser() {
    try {
      const response = await fetch('http://localhost:5000/api/me', {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok || data.user?.role !== 'employer') {
        navigate('/login', { replace: true })
        return
      }

      setUser(data.user)

    } catch (error) {
      console.error('Employer Dashboard Error:', error)
      setError('Unable to connect to the server. Please try again.')

    } finally {
      setIsLoading(false)
    }
  }

  

 fetchCurrentUser()
fetchJobStats()

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    fetchJobStats()
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange)

return () => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
}

}, [navigate, fetchJobStats])
  if (isLoading) {
    return <p>Loading your dashboard...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (!user) {
    return null
  }

  return (
    <main className="employer-dashboard">

      <header className="employer-dashboard-header">
        <div>
          <h1>Employer Dashboard</h1>
          <p>Welcome back, {user.fullName}!</p>
        </div>

        <Link
          to="/"
          className="employer-home-btn"
        >
          Back to Home
        </Link>
      </header>

      <section className="employer-welcome-card">
        <h2>Welcome to CoimbatoreWorks</h2>
        <p>
          Manage your hiring activities and connect with skilled
          workers across Coimbatore and nearby locations.
        </p>
      </section>

      <section className="employer-dashboard-stats">

  {/* Total Jobs Posted */}
  <div className="employer-stat-card">
    <h3>Total Jobs Posted</h3>
    <p>{stats.totalJobs}</p>
    <span>All jobs posted by you</span>
  </div>

  {/* Active Jobs */}
  <div className="employer-stat-card">
    <h3>Active Job Listings</h3>
    <p>{stats.activeJobs}</p>
    <span>Currently available jobs</span>
  </div>

  {/* Closed Jobs */}
  <div className="employer-stat-card">
    <h3>Closed Job Listings</h3>
    <p>{stats.closedJobs}</p>
    <span>Jobs that are no longer active</span>
  </div>

  {/* Applications Received */}
  <div className="employer-stat-card">
    <h3>Applications Received</h3>
    <p>—</p>
    <span>Application tracking coming next</span>
  </div>

</section>

      <section className="employer-account-card">
        <h2>Account Information</h2>

        <div>
          <span>Account ID</span>
          <strong>{user.id}</strong>
        </div>

        <div>
          <span>Contact Person</span>
          <strong>{user.fullName}</strong>
        </div>

        <div>
          <span>Account Type</span>
          <strong>Employer</strong>
        </div>

        <div>
          <span>Location</span>
          <strong>{user.location}</strong>
        </div>

      </section>

      <section className="employer-quick-actions">
        <h2>Quick Actions</h2>

        <div>
          <Link to="/employer/post-job">
            Post a New Job
          </Link>

          <Link to="/employer/jobs">
            Manage Job Listings
          </Link>

          <Link to="/employer/applications">
            View Applications
          </Link>
        </div>

      </section>

    </main>
  )
}

export default EmployerDashboard
