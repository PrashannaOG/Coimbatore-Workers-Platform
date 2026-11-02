import './WhyChooseUs.css'

const benefits = [
  {
    icon: '📍',
    title: 'Location-Based Opportunities',
    description: 'Discover work opportunities and workers based on your preferred location.'
  },
  {
    icon: '🎯',
    title: 'Skill-Based Matching',
    description: 'Connect workers and employers based on skills and job requirements.'
  },
  {
    icon: '⚡',
    title: 'Quick Connections',
    description: 'Make it easier for workers and employers to discover each other.'
  },
  {
    icon: '📱',
    title: 'Easy to Use',
    description: 'Access opportunities through a simple and user-friendly platform.'
  },
  {
    icon: '🤝',
    title: 'Opportunities for Everyone',
    description: 'Support different types of workers, businesses and industries.'
  },
  {
    icon: '🔒',
    title: 'Secure Platform',
    description: 'Designed with user privacy and secure account access in mind.'
  }
]

function WhyChooseUs() {
  return (
    <section className="why-section">

      <div className="why-heading">
        <span>WHY CHOOSE US</span>
        <h2>A Smarter Way to Connect</h2>
        <p>
          Bringing local workers and businesses together
          through a simple and accessible platform.
        </p>
      </div>

      <div className="benefits-grid">

        {benefits.map((benefit, index) => (
          <div className="benefit-card" key={index}>

            <div className="benefit-icon">
              {benefit.icon}
            </div>

            <h3>{benefit.title}</h3>

            <p>{benefit.description}</p>

          </div>
        ))}

      </div>

    </section>
  )
}

export default WhyChooseUs 