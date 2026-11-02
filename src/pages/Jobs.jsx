
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Jobs.css'
import jobListings from '../data/jobs'



function Jobs() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All Locations')
  const [category, setCategory] = useState('All Categories')
  const [jobType, setJobType] = useState('All Types')
  const [savedJobs, setSavedJobs] = useState([])

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())

    const matchesLocation =
      location === 'All Locations' || job.location === location

    const matchesCategory =
      category === 'All Categories' || job.category === category

    const matchesType =
      jobType === 'All Types' || job.type === jobType

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory &&
      matchesType
    )
  })

  function toggleSavedJob(jobId) {
    setSavedJobs((previousSavedJobs) =>
      previousSavedJobs.includes(jobId)
        ? previousSavedJobs.filter((id) => id !== jobId)
        : [...previousSavedJobs, jobId]
    )
  }

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
            placeholder="Search job title or company..."
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

        <div className="jobs-results-heading">
          <h2>Available Opportunities</h2>
          <span>{filteredJobs.length} jobs found</span>
        </div>

        {filteredJobs.length > 0 ? (

          <div className="jobs-grid">

            {filteredJobs.map((job) => (

              <article className="job-card" key={job.id}>

                <div className="job-card-top">
                  <div className="job-company-icon">
                    {job.company.charAt(0)}
                  </div>

                  <button
                    type="button"
                    className={`save-job-btn ${
                      savedJobs.includes(job.id) ? 'saved' : ''
                    }`}
                    onClick={() => toggleSavedJob(job.id)}
                    aria-label={
                      savedJobs.includes(job.id)
                        ? 'Remove saved job'
                        : 'Save job'
                    }
                  >
                    {savedJobs.includes(job.id) ? '♥' : '♡'}
                  </button>
                </div>

                <h3>{job.title}</h3>
                <p className="job-company">{job.company}</p>

                <div className="job-details">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>👷 {job.experience}</span>
                </div>

                <div className="job-card-bottom">
                  <div>
                    <strong>{job.salary}</strong>
                    <span>/ month</span>
                    <p>{job.posted}</p>
                  </div>

                  <Link to="/login" className="apply-job-btn">
                    Login to Apply
                  </Link>
                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="no-jobs-found">
            <h3>No matching jobs found</h3>
            <p>Try changing your search or filters.</p>
            <button type="button" onClick={clearFilters}>
              Reset Filters
            </button>
          </div>

        )}

      </section>

      <p className="jobs-demo-note">
        Showing sample job listings for demonstration purposes.
      </p>

    </main>
  )
}

export default Jobs
