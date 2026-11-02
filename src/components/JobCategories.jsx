import './JobCategories.css'

const categories = [
    { icon: '🧹', name: 'Housekeeping', jobs: 'Cleaning Jobs' },
    { icon: '🛡️', name: 'Security', jobs: 'Security Guards' },
    { icon: '⚡', name: 'Electricians', jobs: 'Electrical Work' },
    { icon: '🔧', name: 'Plumbers', jobs: 'Plumbing Work' },
    { icon: '🚚', name: 'Drivers', jobs: 'Driving Jobs' },
    { icon: '📦', name: 'Delivery', jobs: 'Delivery Jobs' },
  { icon: '🏗️', name: 'Construction', jobs: 'Construction Workers' },
  { icon: '🏭', name: 'Factory Workers', jobs: 'Industrial Work' }, 
]

function JobCategories() {
  return (
    <section className="categories-section" id="jobs">

      <div className="categories-heading">
        <span>EXPLORE OPPORTUNITIES</span>
        <h2>Popular Job Categories</h2>
        <p>
          Explore different types of work opportunities
          available across Coimbatore.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>

            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.name}</h3>

            <p>{category.jobs}</p>

          </div>
        ))}
      </div>

    </section>
  )
}

export default JobCategories