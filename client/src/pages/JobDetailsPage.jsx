import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { Building2, MapPin, DollarSign, Calendar, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('[Fetch Job Details Error]:', err);
        setError('Could not retrieve job posting.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      alert('Please provide a cover letter or introduction statement');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/applications', {
        jobId: job._id,
        coverLetter,
        resumeUrl: resumeUrl || 'https://example.com/resumes/my_resume.pdf'
      });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#f87171' }}>{error || 'Job Not Found'}</h3>
        <Link to="/" className="btn btn-secondary"><ArrowLeft size={16} /> Back to Job List</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Listings
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-remote" style={{ marginBottom: '0.6rem' }}>{job.jobType}</span>
            <span className="badge badge-category" style={{ marginLeft: '0.5rem' }}>{job.category}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', marginBottom: '0.4rem' }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '1.1rem' }}>
              <Building2 size={18} /> {job.company}
            </div>
          </div>

          <div>
            {!user ? (
              <button onClick={() => navigate('/login')} className="btn btn-primary">
                Log In to Apply
              </button>
            ) : user.role === 'seeker' ? (
              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary">
                <Send size={16} /> Apply for Position
              </button>
            ) : (
              <span className="badge badge-fulltime" style={{ padding: '0.6rem 1rem' }}>
                Employer View Mode
              </span>
            )}
          </div>
        </div>

        {/* Metadata items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <MapPin size={15} color="#38bdf8" /> {job.location}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Salary Compensation</div>
            <div style={{ fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <DollarSign size={15} /> {job.salaryRange}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted Date</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <Calendar size={15} color="#818cf8" /> {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.8rem' }}>Role Description</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', whitespace: 'pre-line' }}>{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.8rem' }}>Key Requirements & Qualifications</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {job.requirements.map((req, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={18} color="#818cf8" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Apply to {job.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Submitting application as <strong>{user?.name}</strong> ({user?.email})
            </p>

            {applySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4ade80' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 1rem auto' }} />
                <h3>Application Submitted Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Redirecting to your application tracking dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label">Cover Letter / Pitch *</label>
                  <textarea
                    rows={5}
                    className="input-field"
                    placeholder="Describe your background, why you're a great fit, and relevant experience..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Resume URL / Portfolio Link</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/my-resume.pdf"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
