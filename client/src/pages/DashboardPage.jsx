import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, FileText, CheckCircle, Clock, Trash2, Eye, PlusCircle, UserCheck } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  // Seeker State
  const [myApplications, setMyApplications] = useState([]);
  
  // Employer State
  const [employerJobs, setEmployerJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobCandidates, setJobCandidates] = useState([]);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      if (user.role === 'seeker') {
        const res = await axiosInstance.get('/applications/mine');
        setMyApplications(res.data);
      } else if (user.role === 'employer') {
        const res = await axiosInstance.get('/jobs/employer/mine');
        setEmployerJobs(res.data);
      }
    } catch (err) {
      console.error('[Dashboard Fetch Error]:', err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Employer: View Applicants
  const handleViewApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    try {
      const res = await axiosInstance.get(`/applications/job/${jobId}`);
      setJobCandidates(res.data);
      setShowCandidatesModal(true);
    } catch (err) {
      alert('Error fetching candidates for job posting.');
    }
  };

  // Employer: Update Candidate Status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await axiosInstance.patch(`/applications/${appId}/status`, { status: newStatus });
      setJobCandidates(prev =>
        prev.map(c => (c._id === appId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert('Failed to update candidate status.');
    }
  };

  // Employer: Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      setEmployerJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job listing.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted': return 'status-submitted';
      case 'Under Review': return 'status-under-review';
      case 'Interview': return 'status-interview';
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'status-submitted';
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard data...</div>;
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-fulltime" style={{ marginBottom: '0.4rem', textTransform: 'capitalize' }}>
            <UserCheck size={14} /> {user?.role} Portal
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {user?.role === 'seeker'
              ? 'Track submitted job applications and review recruiter response status.'
              : 'Manage active job postings and evaluate incoming candidate applications.'}
          </p>
        </div>

        {user?.role === 'employer' && (
          <Link to="/post-job" className="btn btn-primary">
            <PlusCircle size={16} /> Post New Job
          </Link>
        )}
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* SEEKER VIEW */}
      {user?.role === 'seeker' && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#818cf8" /> My Submitted Applications ({myApplications.length})
          </h2>

          {myApplications.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Clock size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h3>No Applications Submitted Yet</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Explore active job openings and submit your first application!</p>
              <Link to="/" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myApplications.map(app => (
                <div key={app._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {app.job?.title || 'Position'}
                      </h3>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div style={{ color: '#a5b4fc', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Company: {app.job?.company || 'Enterprise Partner'}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', maxWidth: '600px' }}>
                      "{app.coverLetter.length > 120 ? app.coverLetter.substring(0, 120) + '...' : app.coverLetter}"
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                      Applied {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                    {app.job && (
                      <Link to={`/jobs/${app.job._id || app.job}`} className="btn btn-secondary btn-sm">
                        View Position
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EMPLOYER VIEW */}
      {user?.role === 'employer' && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="#818cf8" /> My Active Job Listings ({employerJobs.length})
          </h2>

          {employerJobs.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No Job Listings Created</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Post a position to start receiving applications from qualified candidates.</p>
              <Link to="/post-job" className="btn btn-primary"><PlusCircle size={16} /> Post Your First Job</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {employerJobs.map(job => (
                <div key={job._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span className="badge badge-remote">{job.jobType}</span>
                      <span className="badge badge-category">{job.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{job.title}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Location: {job.location} | Salary: {job.salaryRange}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button onClick={() => handleViewApplicants(job._id)} className="btn btn-primary btn-sm">
                      <Eye size={15} /> Review Candidates
                    </button>
                    <button onClick={() => handleDeleteJob(job._id)} className="btn btn-danger btn-sm" title="Delete job">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Employer: Candidates Review Modal */}
      {showCandidatesModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Candidate Applicants ({jobCandidates.length})</h2>
              <button onClick={() => setShowCandidatesModal(false)} className="btn btn-secondary btn-sm">Close</button>
            </div>

            {jobCandidates.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No candidate applications received yet for this listing.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobCandidates.map(candidate => (
                  <div key={candidate._id} style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{candidate.seeker?.name || 'Candidate'}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#818cf8' }}>{candidate.seeker?.email}</div>
                      </div>
                      <select
                        value={candidate.status}
                        onChange={(e) => handleUpdateStatus(candidate._id, e.target.value)}
                        className="select-field"
                        style={{ width: 'auto', padding: '0.35rem 0.7rem', fontSize: '0.85rem' }}
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Cover Letter:</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                        {candidate.coverLetter}
                      </p>
                    </div>

                    {candidate.resumeUrl && (
                      <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: '#38bdf8', textDecoration: 'underline' }}>
                        🔗 View Candidate Resume / Portfolio
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
