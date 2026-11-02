
import './Home.css'
import AudienceSection from '../components/AudienceSection'
import JobCategories from '../components/JobCategories'
import FeaturedJobs from '../components/FeaturedJobs'
import HowItWorks from '../components/HowItWorks'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

function Home() {
  return (
    <main className="home">

      <section className="hero-section">

        <div className="hero-content">
          <span className="hero-tag">
            COIMBATORE'S LOCAL WORKFORCE PLATFORM
          </span>

          <h1>
            Find the Right Work.
            <br />
            Build a Better Future.
          </h1>

          <p>
            Connecting skilled workers with businesses across
            Coimbatore through smarter job matching.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="What job are you looking for?"
            />

            <select defaultValue="Coimbatore">
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruppur">Tiruppur</option>
              <option value="Erode">Erode</option>
            </select>

            <button type="button">Search Jobs</button>
          </div>

          <div className="hero-actions">
            <button className="worker-btn">
              I'm Looking for Work
            </button>

            <button className="employer-btn">
              I'm Hiring Workers
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-icon">👷</div>
            <h3>Opportunities for Everyone</h3>
            <p>
              Find work that matches your skills,
              experience and location.
            </p>
          </div>

          <div className="floating-card">
            <span>✓</span>
            Smart Worker Matching
          </div>
        </div>

      </section>

      <AudienceSection />
      <JobCategories/>
      <FeaturedJobs/>
      <HowItWorks/>
      <WhyChooseUs />
      <Footer/>

    </main>
  )
}

export default Home
