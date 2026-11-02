
import './AudienceSection.css'

function AudienceSection() {
  return (
    <section className="audience-section" id="audience">

      <div className="audience-heading">
        <span>ONE PLATFORM, TWO OPPORTUNITIES</span>
        <h2>What brings you here?</h2>
        <p>
          Whether you're looking for work or hiring skilled people,
          we make the process easier.
        </p>
      </div>

      <div className="audience-cards">

        {/* Worker Card */}
        <div className="audience-card worker-card" id="workers">
          <div className="audience-icon">👷</div>

          <h3>I'm Looking for Work</h3>

          <p>
            Discover job opportunities, showcase your skills
            and connect with employers across Coimbatore.
          </p>

          <ul>
            <li>✓ Find jobs near your location</li>
            <li>✓ Create your worker profile</li>
            <li>✓ Discover opportunities matching your skills</li>
          </ul>

          <button type="button" className="audience-btn worker-cta">
            Find Work →
          </button>
        </div>

        {/* Employer Card */}
        <div className="audience-card employer-card">
          <div className="audience-icon">🏢</div>

          <h3>I'm Looking for Workers</h3>

          <p>
            Find suitable workers, manage your workforce
            and connect with people who match your requirements.
          </p>

          <ul>
            <li>✓ Find workers based on skills</li>
            <li>✓ Post job opportunities</li>
            <li>✓ Manage your workforce efficiently</li>
          </ul>

          <button type="button" className="audience-btn employer-cta">
            Hire Workers →
          </button>
        </div>

        

      </div>

    </section>
  )
}

export default AudienceSection
