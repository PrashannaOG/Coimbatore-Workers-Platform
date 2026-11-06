import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './EmployerApplications.css'

function EmployerApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null)

  // Fetch applications received by this employer.
  const fetchApplications = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/employer/applications',
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

  // Update application status.
  const handleStatusChange = async (application, newStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to mark this application as ${newStatus}?`
    )

    if (!confirmed) return

    setUpdatingApplicationId(application.application_id)

    try {
      const response = await fetch(
        `http://localhost:5000/api/employer/applications/${application.application_id}/status`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update application status.')
      }

      await fetchApplications()

      alert(data.message)

    } catch (err) {
      alert(err.message || 'Something went wrong.')
    } finally {
      setUpdatingApplicationId(null)
    }
  }

  // Application summary statistics.
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

  return (
    <main className="employer-applications-page">
      <div className="employer-applications-container">

        {/* Page Header */}
        <div className="employer-applications-header">
          <div>
            <h1>Job Applications</h1>
            <p>Review and manage applications received for your jobs.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="applications-summary">

          <div className="application-summary-card">
            <span>Total Applications</span>
            <h2>{totalApplications}</h2>
          </div>

          <div className="application-summary-card">
            <span>Pending</span>
            <h2>{pendingApplications}</h2>
          </div>

          <div className="application-summary-card">
            <span>Shortlisted</span>
            <h2>{shortlistedApplications}</h2>
          </div>

          <div className="application-summary-card">
            <span>Accepted</span>
            <h2>{acceptedApplications}</h2>
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="applications-message">
            Loading applications...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="applications-error">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="applications-empty-state">
            <h2>No Applications Yet</h2>

            <p>
              You haven't received any job applications yet.
              Applications from workers will appear here.
            </p>
          </div>
        )}

        {/* Applications List */}
        {!loading && !error && applications.length > 0 && (
          <div className="employer-applications-list">

            {applications.map(application => (
              <article
                className="employer-application-card"
                key={application.application_id}
              >

                {/* Application Header */}
                <div className="application-card-header">

                  <div>
                    <h2>{application.worker_name}</h2>
                    <p>{application.job_title}</p>
                  </div>

                  <span
                    className={`application-status ${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                </div>

                {/* Worker Details */}
                <div className="application-details">

                  <div>
                    <span>Work Category</span>
                    <strong>{application.work_category || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Experience</span>
                    <strong>{application.experience || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{application.worker_location || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{application.worker_email || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Mobile</span>
                    <strong>{application.worker_mobile || 'Not provided'}</strong>
                  </div>

                  <div>
                    <span>Application ID</span>
                    <strong>{application.application_id}</strong>
                  </div>

                </div>

                {/* Cover Letter */}
                <div className="application-cover-letter">
                  <h3>Cover Letter</h3>

                  <p>
                    {application.cover_letter || 'No cover letter provided.'}
                  </p>
                </div>

                {/* Application Footer */}
                <div className="application-card-footer">

                  <span>
                    Applied: {application.created_at}
                  </span>

                  <div className="application-actions">

                    <button
                      type="button"
                      className="shortlist-application-button"
                      onClick={() => handleStatusChange(application, 'Shortlisted')}
                      disabled={
                        updatingApplicationId === application.application_id ||
                        application.status === 'Shortlisted'
                      }
                    >
                      Shortlist
                    </button>

                    <button
                      type="button"
                      className="accept-application-button"
                      onClick={() => handleStatusChange(application, 'Accepted')}
                      disabled={
                        updatingApplicationId === application.application_id ||
                        application.status === 'Accepted'
                      }
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      className="reject-application-button"
                      onClick={() => handleStatusChange(application, 'Rejected')}
                      disabled={
                        updatingApplicationId === application.application_id ||
                        application.status === 'Rejected'
                      }
                    >
                      Reject
                    </button>

                  </div>

                </div>

                {updatingApplicationId === application.application_id && (
                  <p className="application-updating-message">
                    Updating application...
                  </p>
                )}

              </article>
            ))}

          </div>
        )}

        {/* Back to Dashboard */}
        <Link
          to="/employer/dashboard"
          className="back-to-dashboard-link"
        >
          ← Back to Dashboard
        </Link>

      </div>
    </main>
  )
}

export default EmployerApplications