import './FeaturedJobs.css'

const jobs = [
  {
    title: 'Electrician',
    company: 'ABC Electrical Services',
    location: 'Gandhipuram, Coimbatore',
    salary: '₹15,000 – ₹20,000/month',
    type: 'Full-time',
    icon: '⚡',
  },
  {
    title: 'Delivery Executive',
    company: 'City Logistics',
    location: 'Peelamedu, Coimbatore',
    salary: '₹12,000 – ₹18,000/month',
    type: 'Full-time',
    icon: '🚚',
  },
  {
    title: 'Factory Helper',
    company: 'Coimbatore Industries',
    location: 'Singanallur, Coimbatore',
    salary: '₹13,000 – ₹17,000/month',
    type: 'Shift-based',
    icon: '🏭',
  },
  {
    title: 'Plumber',
    company: 'QuickFix Services',
    location: 'RS Puram, Coimbatore',
    salary: '₹14,000 – ₹19,000/month',
    type: 'Full-time',
    icon: '🔧',
  },
]

function FeaturedJobs() {
  return (
    <section className="featured-jobs" id="featured-jobs">

      <div className="featured-heading">
        <span>FIND YOUR NEXT OPPORTUNITY</span>
        <h2>Featured Job Opportunities</h2>
        <p>
          Explore sample job listings from different industries
          across Coimbatore.
        </p>
      </div>

      <div className="jobs-grid">

        {jobs.map((job, index) => (
          <div className="job-card" key={index}>

            <div className="job-card-top">
              <div className="job-icon">{job.icon}</div>
              <span className="job-type">{job.type}</span>
            </div>

            <h3>{job.title}</h3>

            <p className="job-company">{job.company}</p>

            <div className="job-details">
              <p>📍 {job.location}</p>
              <p>💰 {job.salary}</p>
            </div>

            <button type="button" className="apply-btn">
              View Details →
            </button>

          </div>
        ))}

      </div>

    </section>
  )
}

export default FeaturedJobs