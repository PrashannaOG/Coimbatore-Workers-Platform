
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './WorkerApplications.css'

function WorkerApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch applications submitted by the logged-in worker.
  const fetchApplications = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/worker/applications',
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load applications.')
      }

      setApplications(data.applications || [])
      setError('')

    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Application statistics.
  const totalApplications = applications.length

  const pendingApplications = applications.filter(
    application => application.status === 'Pending'
  ).length

  const shortlistedApplications = applications.filter(
    application => application.status === 'Shortlisted'
  ).length

  const acceptedApplications = applications.filter(
    application => application.status === 'Accepted'
  ).length

  const rejectedApplications = applications.filter(
    application => application.status === 'Rejected'
  ).length

  return (
    <main className="worker-applications-page">
      <div className="worker-applications-container">

        {/* Page Header */}
        <div className="worker-applications-header">
          <div>
            <h1>My Applications</h1>
            <p>Track the jobs you have applied for and their current status.</p>
          </div>

          <Link to="/jobs" className="browse-jobs-button">
            Browse Jobs
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="worker-applications-summary">

          <div className="worker-application-summary-card">
            <span>Total Applications</span>
            <h2>{totalApplications}</h2>
          </div>

          <div className="worker-application-summary-card">
            <span>Pending</span>
            <h2>{pendingApplications}</h2>
          </div>

          <div className="worker-application-summary-card">
            <span>Shortlisted</span>
            <h2>{shortlistedApplications}</h2>
          </div>

          <div className="worker-application-summary-card">
            <span>Accepted</span>
            <h2>{acceptedApplications}</h2>
          </div>

          <div className="worker-application-summary-card">
            <span>Rejected</span>
            <h2>{rejectedApplications}</h2>
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="worker-applications-message">
            Loading your applications...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="worker-applications-error">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="worker-applications-empty">
            <h2>No Applications Yet</h2>

            <p>
              You haven't applied for any jobs yet.
              Explore available opportunities and submit your first application.
            </p>

            <Link to="/jobs" className="browse-jobs-button">
              Find Jobs
            </Link>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && applications.length > 0 && (
          <div className="worker-applications-list">

            {applications.map(application => (
              <article
                className="worker-application-card"
                key={application.application_id}
              >

                {/* Job Header */}
                <div className="worker-application-card-header">

                  <div>
                    <h2>{application.job_title}</h2>
                    <p>{application.work_category}</p>
                  </div>

                  <span
                    className={`worker-application-status ${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                </div>

                {/* Job and Employer Details */}
                <div className="worker-application-details">

                  <div>
                    <span>Employer</span>
                    <strong>
                      {application.business_name || application.employer_name || 'Not available'}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{application.job_location || 'Not available'}</strong>
                  </div>

                  <div>
                    <span>Job Type</span>
                    <strong>{application.job_type || 'Not available'}</strong>
                  </div>

                  <div>
                    <span>Salary</span>
                    <strong>
                      ₹{Number(application.salary_min).toLocaleString('en-IN')}
                      {' - '}
                      ₹{Number(application.salary_max).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div>
                    <span>Application ID</span>
                    <strong>{application.application_id}</strong>
                  </div>

                  <div>
                    <span>Applied On</span>
                    <strong>{application.applied_at}</strong>
                  </div>

                </div>

                {/* Cover Letter */}
                <div className="worker-application-cover-letter">
                  <h3>Your Cover Letter</h3>

                  <p>
                    {application.cover_letter || 'No cover letter provided.'}
                  </p>
                </div>

              </article>
            ))}

          </div>
        )}

        {/* Back to Dashboard */}
        <Link
          to="/worker/dashboard"
          className="worker-applications-back-link"
        >
          ← Back to Dashboard
        </Link>

      </div>
    </main>
  )
}

export default WorkerApplications
