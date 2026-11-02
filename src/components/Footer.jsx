import './Footer.css'

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand Information */}
        <div className="footer-brand">
          <h2>Coimbatore<span>Works</span></h2>

          <p>
            Connecting local workers with employment
            opportunities and helping businesses find
            the right workforce across Coimbatore.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <a href="#workers">Find Workers</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        {/* For Users */}
        <div className="footer-links">
          <h3>For Users</h3>
          <a href="#workers">For Workers</a>
          <a href="#employers">For Employers</a>
          <a href="#featured-jobs">Job Opportunities</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>📍 Coimbatore, Tamil Nadu</p>
          <p>🌐 Coimbatore Workers Platform</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Coimbatore Workers Platform.
          All rights reserved.
        </p>
      </div>

    </footer>
  )
}

export default Footer