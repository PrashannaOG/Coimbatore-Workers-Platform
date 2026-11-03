
import { Link } from 'react-router-dom'
import './WorkerDashboard.css'

function WorkerDashboard() {
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
          <Link to="/login">
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
            <div className="worker-avatar">W</div>
            <div>
              <h4>Welcome, Worker!</h4>
              <span>Worker Account</span>
            </div>
          </div>

        </header>

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

        {/* Statistics */}
        <section className="worker-stats">

          <div className="worker-stat-card">
            <span>Available Jobs 📋</span>
            <h3>12</h3>
            <p>Available</p>
          </div>

          <div className="worker-stat-card">
            <span>Application(s) sent📨</span>
            <h3>5</h3>
            <p>Applications Sent</p>
          </div>

          <div className="worker-stat-card">
            <span>Application(s) viewed👁️</span>
            <h3>3</h3>
            <p>Applications Viewed</p>
          </div>

          <div className="worker-stat-card">
            <span>Shortlisted⭐</span>
            <h3>2</h3>
            <p>Shortlisted</p>
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
              <div className="worker-large-avatar">W</div>

              <div>
                <h3>Your Name</h3>
                <p>Worker · Coimbatore</p>
                <p>Work Category: Not Added</p>
              </div>
            </div>

            <div className="worker-profile-progress">
              <div>
                <span>Profile Completion</span>
                <strong>60%</strong>
              </div>

              <div className="worker-progress-track">
                <div className="worker-progress-fill"></div>
              </div>

              <p>Complete your profile to improve your job opportunities.</p>
            </div>
          </div>

          <div className="worker-dashboard-card">
            <div className="worker-card-heading">
              <h2>Recent Applications</h2>
              <Link to="/worker/applications">View All</Link>
            </div>

            <div className="worker-application-item">
              <div>
                <h3>Electrician</h3>
                <p>ABC Electrical Services</p>
              </div>
              <span className="application-status pending">
                Pending
              </span>
            </div>

            <div className="worker-application-item">
              <div>
                <h3>Factory Helper</h3>
                <p>Coimbatore Industries</p>
              </div>
              <span className="application-status viewed">
                Viewed
              </span>
            </div>

            <div className="worker-application-item">
              <div>
                <h3>Delivery Executive</h3>
                <p>City Logistics</p>
              </div>
              <span className="application-status shortlisted">
                Shortlisted
              </span>
            </div>

          </div>

        </section>

        {/* Recommended Jobs */}
        <section className="worker-dashboard-card worker-recommended">

          <div className="worker-card-heading">
            <h2>Recommended Jobs</h2>
            <Link to="/jobs">View All Jobs</Link>
          </div>

          <div className="worker-recommended-job">
            <div>
              <h3>Electrician</h3>
              <p>ABC Electrical Services · Gandhipuram</p>
              <span>₹15,000 – ₹20,000 / month</span>
            </div>

            <Link to="/jobs">View Job</Link>
          </div>

          <div className="worker-recommended-job">
            <div>
              <h3>Delivery Executive</h3>
              <p>City Logistics · Peelamedu</p>
              <span>₹12,000 – ₹18,000 / month</span>
            </div>

            <Link to="/jobs">View Job</Link>
          </div>

        </section>

      </main>

    </div>
  )
}

export default WorkerDashboard
