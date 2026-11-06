
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './WorkerSavedJobs.css'

function WorkerSavedJobs() {
  const navigate = useNavigate()

  const [savedJobs, setSavedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingJobIds, setRemovingJobIds] = useState([])

  // Fetch saved jobs from Flask backend
  async function fetchSavedJobs() {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(
        'http://localhost:5000/api/worker/saved-jobs',
        {
          method: 'GET',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to retrieve saved jobs.'
        )
      }

      setSavedJobs(data.saved_jobs || [])

    } catch (error) {
      console.error('Saved Jobs Error:', error)
      setError(error.message || 'Unable to connect to the server.')

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  // Remove a job from the saved list
  async function handleRemoveSavedJob(jobId) {
    if (removingJobIds.includes(jobId)) {
      return
    }

    setRemovingJobIds(previous => [...previous, jobId])

    try {
      const response = await fetch(
        `http://localhost:5000/api/worker/saved-jobs/${jobId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Unable to remove saved job.'
        )
      }

      setSavedJobs(previous =>
        previous.filter(job => Number(job.job_id) !== Number(jobId))
      )

    } catch (error) {
      console.error('Remove Saved Job Error:', error)
      alert(error.message || 'Unable to remove this job.')

    } finally {
      setRemovingJobIds(previous =>
        previous.filter(id => id !== jobId)
      )
    }
  }

  // Format salary information
  function formatSalary(min, max) {
    if (min == null && max == null) {
      return 'Salary not specified'
    }

    const formatAmount = amount =>
      Number(amount).toLocaleString('en-IN')

    if (min != null && max != null) {
      return `₹${formatAmount(min)} - ₹${formatAmount(max)}`
    }

    if (min != null) {
      return `From ₹${formatAmount(min)}`
    }

    return `Up to ₹${formatAmount(max)}`
  }

  // Display loading state
  if (isLoading) {
    return (
      <main className="saved-jobs-page">
        <div className="saved-jobs-container">
          <p>Loading your saved jobs...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="saved-jobs-page">

      <div className="saved-jobs-container">

        {/* Page Header */}
        <header className="saved-jobs-header">
          <div>
            <h1>My Saved Jobs</h1>
            <p>
              Keep track of the opportunities you are interested in.
            </p>
          </div>

          <Link to="/jobs" className="browse-jobs-btn">
            Explore More Jobs
          </Link>
        </header>

        {/* Error Message */}
        {error && (
          <div className="saved-jobs-error" role="alert">
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchSavedJobs}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Saved Jobs Count */}
        {!error && (
          <div className="saved-jobs-summary">
            <h2>
              Saved Opportunities ({savedJobs.length})
            </h2>
          </div>
        )}

        {/* Empty State */}
        {!error && savedJobs.length === 0 && (
          <div className="saved-jobs-empty">
            <div className="saved-jobs-empty-icon">♡</div>

            <h2>No Saved Jobs Yet</h2>

            <p>
              You haven't saved any jobs. Browse available
              opportunities and save the ones you like.
            </p>

            <Link to="/jobs" className="browse-jobs-btn">
              Find Jobs
            </Link>
          </div>
        )}

        {/* Saved Jobs List */}
        {!error && savedJobs.length > 0 && (
          <div className="saved-jobs-grid">

            {savedJobs.map(job => {
              const jobId = Number(job.job_id)
              const isRemoving = removingJobIds.includes(jobId)

              return (
                <article
                  className="saved-job-card"
                  key={job.saved_id}
                >

                  <div className="saved-job-top">
                    <div className="saved-job-category-icon">
                      {(job.work_category || 'J').charAt(0)}
                    </div>

                    <span
                      className={`saved-job-status ${
                        job.status === 'Active' ? 'active' : 'closed'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <h3>{job.job_title}</h3>

                  <p className="saved-job-category">
                    {job.work_category}
                  </p>

                  <div className="saved-job-details">

                    <span>📍 {job.location}</span>

                    <span>💼 {job.job_type}</span>

                    <span>👷 {job.experience_required}</span>

                    <span>👥 {job.vacancies} vacancies</span>

                  </div>

                  <div className="saved-job-description">
                    <p>{job.job_description}</p>
                  </div>

                  <div className="saved-job-information">

                    <div>
                      <strong>
                        {formatSalary(job.salary_min, job.salary_max)}
                      </strong>

                      <span>per month</span>
                    </div>

                    <p>
                      Employer: {job.employer_name || 'Not available'}
                    </p>

                    <p>
                      Saved: {job.saved_at || 'Date unavailable'}
                    </p>

                  </div>

                  <div className="saved-job-actions">

                    {job.status === 'Active' ? (
                      <button
                        type="button"
                        className="saved-job-apply-btn"
                        onClick={() => navigate('/jobs')}
                      >
                        View Job
                      </button>
                    ) : (
                      <span className="saved-job-closed-message">
                        This job is no longer available.
                      </span>
                    )}

                    <button
                      type="button"
                      className="saved-job-remove-btn"
                      onClick={() => handleRemoveSavedJob(jobId)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? 'Removing...' : 'Remove'}
                    </button>

                  </div>

                </article>
              )
            })}

          </div>
        )}

      </div>

    </main>
  )
}

export default WorkerSavedJobs
