
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Jobs.css'

function Jobs() {
  const navigate = useNavigate()

  // Job data and API states
  const [jobListings, setJobListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search and filter states
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [category, setCategory] = useState('All Categories')
  const [jobType, setJobType] = useState('All Types')

  // Saved jobs and saving status
  const [savedJobs, setSavedJobs] = useState([])
  const [savingJobIds, setSavingJobIds] = useState([])

  // Fetch saved jobs belonging to the logged-in worker
  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/worker/saved-jobs',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.status === 401) {
          return
        }

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to retrieve saved jobs.')
        }

        setSavedJobs(
          (data.saved_jobs || []).map(job => Number(job.job_id))
        )

      } catch (error) {
        console.error('Fetch Saved Jobs Error:', error)
      }
    }

    fetchSavedJobs()
  }, [])

  // Save or remove a job using the Flask backend
  async function toggleSavedJob(jobId) {
    if (savingJobIds.includes(jobId)) {
      return
    }

    const isSaved = savedJobs.includes(jobId)

    setSavingJobIds(previous => [...previous, jobId])

    try {
      const response = await fetch(
        `http://localhost:5000/api/worker/saved-jobs/${jobId}`,
        {
          method: isSaved ? 'DELETE' : 'POST',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        alert('Please log in as a worker to save jobs.')
        navigate('/login')
        return
      }

      if (!response.ok || !data.success) {
        alert(data.message || 'Unable to update saved jobs.')
        return
      }

      if (isSaved) {
        setSavedJobs(previous =>
          previous.filter(id => id !== jobId)
        )
      } else {
        setSavedJobs(previous =>
          previous.includes(jobId)
            ? previous
            : [...previous, jobId]
        )
      }

      alert(data.message)

    } catch (error) {
      console.error('Save Job Error:', error)
      alert('Unable to connect to the server. Please try again.')

    } finally {
      setSavingJobIds(previous =>
        previous.filter(id => id !== jobId)
      )
    }
  }

  // Apply for a job
  const handleApplyJob = async (jobId) => {
    const coverLetter = window.prompt(
      'Enter a short cover letter (optional):'
    )

    if (coverLetter === null) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coverLetter: coverLetter
          })
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        alert('Please log in as a worker to apply for this job.')
        navigate('/login')
        return
      }

      if (!response.ok) {
        alert(data.message || 'Unable to submit your application.')
        return
      }

      alert(data.message)

    } catch (error) {
      console.error('Application error:', error)
      alert('Unable to connect to the server. Please try again.')
    }
  }

  // Fetch active jobs from Flask backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('http://localhost:5000/api/jobs')
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to load available jobs.'
          )
        }

        setJobListings(data.jobs || [])

      } catch (err) {
        setError(err.message || 'Something went wrong.')

      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search and selected filters
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      (job.job_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (job.work_category || '').toLowerCase().includes(search.toLowerCase())

    const matchesLocation =
      location === 'All Locations' || job.location === location

    const matchesCategory =
      category === 'All Categories' || job.work_category === category

    const matchesType =
      jobType === 'All Types' || job.job_type === jobType

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesType
    )
  })

  // Clear all filters
  function clearFilters() {
    setSearch('')
    setLocation('All Locations')
    setCategory('All Categories')
    setJobType('All Types')
  }

  return (
    <main className="jobs-page">

      {/* Page Header */}
      <section className="jobs-heading">
        <h1>Find Your Next Job</h1>
        <p>
          Explore work opportunities and find a job that matches your skills.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="jobs-filter-section">

        <div className="jobs-search">
          <input
            type="search"
            placeholder="Search job title or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="jobs-filters">

          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option>All Locations</option>
            <option>Gandhipuram</option>
            <option>Peelamedu</option>
            <option>Singanallur</option>
            <option>RS Puram</option>
            <option>Saravanampatti</option>
            <option>Town Hall</option>
            <option>Coimbatore</option>
          </select>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All Categories</option>
            <option>Construction</option>
            <option>Electrician</option>
            <option>Plumbing</option>
            <option>Delivery</option>
            <option>Factory Work</option>
            <option>Security</option>
          </select>

          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value)}
          >
            <option>All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Temporary</option>
          </select>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>
      </section>

      {/* Job Results */}
      <section className="jobs-results">

        {/* Loading State */}
        {loading && (
          <div className="no-jobs-found">
            <p>Loading available jobs...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="no-jobs-found">
            <h3>Unable to Load Jobs</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Heading */}
        {!loading && !error && (
          <div className="jobs-results-heading">
            <h2>Available Opportunities</h2>
            <span>{filteredJobs.length} jobs found</span>
          </div>
        )}

        {/* Job Cards */}
        {!loading && !error && filteredJobs.length > 0 ? (

          <div className="jobs-grid">

            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(Number(job.id))
              const isSaving = savingJobIds.includes(Number(job.id))

              return (
                <article className="job-card" key={job.id}>

                  <div className="job-card-top">

                    <div className="job-company-icon">
                      {(job.work_category || 'J').charAt(0)}
                    </div>

                    <button
                      type="button"
                      className={`save-job-btn ${isSaved ? 'saved' : ''}`}
                      onClick={() => toggleSavedJob(Number(job.id))}
                      disabled={isSaving}
                      aria-label={
                        isSaved ? 'Remove saved job' : 'Save job'
                      }
                      title={isSaved ? 'Remove saved job' : 'Save job'}
                    >
                      {isSaving ? '...' : isSaved ? '♥' : '♡'}
                    </button>

                  </div>

                  <h3>{job.job_title}</h3>

                  <p className="job-company">
                    {job.work_category}
                  </p>

                  <div className="job-details">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.job_type}</span>
                    <span>👷 {job.experience_required}</span>
                    <span>👥 {job.vacancies} vacancies</span>
                  </div>

                  <div className="job-card-bottom">

                    <div>
                      <strong>
                        ₹{Number(job.salary_min).toLocaleString('en-IN')}
                        {' - '}
                        ₹{Number(job.salary_max).toLocaleString('en-IN')}
                      </strong>

                      <span>/ month</span>

                      <p>
                        Posted: {job.created_at}
                      </p>
                    </div>

                    <button
                      className="apply-job-btn"
                      onClick={() => handleApplyJob(job.id)}
                    >
                      Apply Now
                    </button>

                  </div>

                </article>
              )
            })}

          </div>

        ) : !loading && !error ? (

          /* No Matching Jobs */
          <div className="no-jobs-found">
            <h3>No matching jobs found</h3>
            <p>Try changing your search or filters.</p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Reset Filters
            </button>
          </div>

        ) : null}

      </section>

    </main>
  )
}

export default Jobs
