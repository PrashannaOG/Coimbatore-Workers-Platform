import './HowItWorks.css'

const workerSteps = [
  {
    number: '01',
    icon: '👤',
    title: 'Create Your Account',
    description: 'Register on the platform and create your worker account.'
  },
  {
    number: '02',
    icon: '📋',
    title: 'Build Your Profile',
    description: 'Add your skills, experience, location and job preferences.'
  },
  {
    number: '03',
    icon: '💼',
    title: 'Find Suitable Work',
    description: 'Explore job opportunities and connect with employers.'
  }
]

const employerSteps = [
  {
    number: '01',
    icon: '🏢',
    title: 'Register Your Business',
    description: 'Create an employer account with your business details.'
  },
  {
    number: '02',
    icon: '📝',
    title: 'Post Job Requirements',
    description: 'Describe the job, required skills, salary and work location.'
  },
  {
    number: '03',
    icon: '🤝',
    title: 'Connect With Workers',
    description: 'Discover suitable workers and manage your hiring process.'
  }
]

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">

      <div className="how-heading">
        <span>SIMPLE AND CONVENIENT</span>
        <h2>How Does It Work?</h2>
        <p>
          Getting started is simple. Follow three easy steps
          to find work or hire the right people.
        </p>
      </div>

      <div className="how-columns">

        {/* Worker Workflow */}
        <div className="how-column">
          <h3>For Workers</h3>

          {workerSteps.map((step) => (
            <div className="how-step" key={step.number}>

              <div className="step-icon">
                {step.icon}
              </div>

              <div className="step-content">
                <span>STEP {step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>

            </div>
          ))}
        </div>

        {/* Employer Workflow */}
        <div className="how-column">
          <h3>For Employers</h3>

          {employerSteps.map((step) => (
            <div className="how-step" key={step.number}>

              <div className="step-icon">
                {step.icon}
              </div>

              <div className="step-content">
                <span>STEP {step.number}</span>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  )
}

export default HowItWorks