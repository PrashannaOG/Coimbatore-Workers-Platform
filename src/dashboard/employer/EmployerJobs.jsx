
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './EmployerJobs.css'

function EmployerJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingJobId, setUpdatingJobId] = useState(null)

  // Fetch employer's job listings.
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/employer/jobs',
        {
          method: 'GET',
          credentials: 'include'
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load jobs.')
      }

      setJobs(data.jobs || [])
      setError('')

    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  // Close or reopen a job.
  const handleStatusChange = async (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active'

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === 'Closed' ? 'close' : 'reopen'} this job?`
    )

    if (!confirmed) return

    setUpdatingJobId(job.id)

    try {
      const response = await fetch(
        `http://localhost:5000/api/employer/jobs/${job.id}/status`,
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
        throw new Error(data.message || 'Unable to update job status.')
      }

      await fetchJobs()

      alert(data.message)

    } catch (err) {
      alert(err.message || 'Something went wrong.')
    } finally {
      setUpdatingJobId(null)
    }
  }

  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${job.job_title}"? This action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }

    try {
        setUpdatingJobId(job.id);

        const response = await fetch(
            `http://localhost:5000/api/employer/jobs/${job.id}`,
            {
                method: 'DELETE',
                credentials: 'include'
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Unable to delete job.');
        }

        await fetchJobs();

        alert('Job deleted successfully!');

    } catch (error) {
        console.error('Delete job error:', error);
        alert(error.message || 'Something went wrong.');

    } finally {
        setUpdatingJobId(null);
    }
};

  return (
    <main className="employer-jobs-page">
      <div className="employer-jobs-container">

        <div className="employer-jobs-header">
          <div>
            <h1>My Jobs</h1>
            <p>Manage the job opportunities you have posted.</p>
          </div>

          <Link
            to="/employer/post-job"
            className="post-new-job-button"
          >
            + Post New Job
          </Link>
        </div>

        <div className="employer-jobs-summary">
          <div className="jobs-summary-card">
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>

          <div className="jobs-summary-card">
            <span>Active Jobs</span>
            <h2>
              {jobs.filter(job => job.status === 'Active').length}
            </h2>
          </div>

          <div className="jobs-summary-card">
            <span>Closed Jobs</span>
            <h2>
              {jobs.filter(job => job.status === 'Closed').length}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="jobs-message">
            Loading your jobs...
          </div>
        )}

        {!loading && error && (
          <div className="jobs-error">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="jobs-empty-state">
            <h2>No Jobs Posted Yet</h2>

            <p>
              You haven't published any job opportunities.
              Start by creating your first job posting.
            </p>

            <Link
              to="/employer/post-job"
              className="post-first-job-button"
            >
              Post Your First Job
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="employer-jobs-list">
            {jobs.map(job => (
              <article
                className="employer-job-card"
                key={job.id}
              >
                <div className="job-card-header">
                  <div>
                    <h2>{job.job_title}</h2>
                    <p>{job.work_category}</p>
                  </div>

                  <span
                    className={`job-status ${
                      job.status === 'Active'
                        ? 'active'
                        : 'closed'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="job-card-details">
                  <div>
                    <span>Location</span>
                    <strong>{job.location}</strong>
                  </div>

                  <div>
                    <span>Job Type</span>
                    <strong>{job.job_type}</strong>
                  </div>

                  <div>
                    <span>Salary</span>
                    <strong>
                      ₹{Number(job.salary_min).toLocaleString('en-IN')}
                      {' - '}
                      ₹{Number(job.salary_max).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div>
                    <span>Vacancies</span>
                    <strong>{job.vacancies}</strong>
                  </div>

                  <div>
                    <span>Experience</span>
                    <strong>{job.experience_required}</strong>
                  </div>
                </div>

                <p className="job-card-description">
                  {job.job_description}
                </p>

                <div className="job-card-footer">
                  <span>
                    Job ID: {job.id}
                  </span>

                  <span>
                    Posted: {job.created_at}
                  </span>

                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="edit-job-button"
                  >
                    Edit Job
                  </Link>

                  <button
                    type="button"
                    className="job-status-action-button"
                    onClick={() => handleStatusChange(job)}
                    disabled={updatingJobId === job.id}
                  >
                    {updatingJobId === job.id
                      ? 'Updating...'
                      : job.status === 'Active'
                        ? 'Close Job'
                        : 'Reopen Job'}
                  </button>

                  <button
    type="button"
    className="delete-job-button"
    onClick={() => handleDeleteJob(job)}
    disabled={updatingJobId === job.id}
>
    {updatingJobId === job.id ? 'Deleting...' : 'Delete Job'}
</button>
                </div>
              </article>
            ))}
          </div>
        )}

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

export default EmployerJobs
