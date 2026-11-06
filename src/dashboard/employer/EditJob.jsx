import './EditJob.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        jobTitle: '',
        workCategory: '',
        jobDescription: '',
        location: '',
        jobAddress: '',
        jobType: '',
        salaryMin: '',
        salaryMax: '',
        vacancies: '1',
        experienceRequired: '',
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch existing job details.
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/api/employer/jobs',
                    { credentials: 'include' }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Unable to load jobs.');
                }

                const job = data.jobs.find(
                    (item) => String(item.id) === String(jobId)
                );

                if (!job) {
                    throw new Error('Job not found.');
                }

                setFormData({
                    jobTitle: job.job_title || '',
                    workCategory: job.work_category || '',
                    jobDescription: job.job_description || '',
                    location: job.location || '',
                    jobAddress: job.job_address || '',
                    jobType: job.job_type || '',
                    salaryMin: String(job.salary_min ?? ''),
                    salaryMax: String(job.salary_max ?? ''),
                    vacancies: String(job.vacancies ?? 1),
                    experienceRequired: job.experience_required || '',
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    // Handle form input changes.
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Submit updated job details.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/employer/jobs/${jobId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        salaryMin: Number(formData.salaryMin),
                        salaryMax: Number(formData.salaryMax),
                        vacancies: Number(formData.vacancies),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to update job.');
            }

            alert('Job updated successfully!');
            navigate('/employer/jobs');

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="edit-job-container">Loading job details...</div>;
    }

    if (error && !formData.jobTitle) {
        return (
            <div className="edit-job-container">
                <p className="error-message">{error}</p>
                <button type="button" onClick={() => navigate('/employer/jobs')}>
                    Back to My Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="edit-job-container">
            <h2>Edit Job Listing</h2>
            <p>Update the details of your job posting.</p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>

                <label>Job Title</label>
                <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                />

                <label>Work Category</label>
                <select
                    name="workCategory"
                    value={formData.workCategory}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    {['Construction', 'Electrician', 'Plumbing', 'Driving',
                      'Delivery', 'Factory Work', 'Housekeeping', 'Security',
                      'Other'].map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <label>Job Description</label>
                <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="5"
                    required
                />

                <label>Location</label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Location</option>
                    {['Coimbatore', 'Tiruppur', 'Erode', 'Pollachi',
                      'Mettupalayam'].map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <label>Job Address</label>
                <input
                    type="text"
                    name="jobAddress"
                    value={formData.jobAddress}
                    onChange={handleChange}
                    required
                />

                <label>Job Type</label>
                <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Job Type</option>
                    {['Full-time', 'Part-time', 'Contract',
                      'Temporary'].map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <label>Minimum Salary (₹)</label>
                <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <label>Maximum Salary (₹)</label>
                <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <label>Number of Vacancies</label>
                <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    required
                />

                <label>Experience Required</label>
                <select
                    name="experienceRequired"
                    value={formData.experienceRequired}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Experience</option>
                    {['Fresher', 'Less than 1 year', '1–3 years',
                      '3–5 years', 'Above 5 years'].map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Job'}
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/employer/jobs')}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default EditJob;
