import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Building2, Calendar, ArrowRight } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diffDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Remote': return 'badge-remote';
      case 'Contract': return 'badge-contract';
      default: return 'badge-fulltime';
    }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
        <div>
          <span className={`badge ${getBadgeClass(job.jobType)}`} style={{ marginBottom: '0.4rem' }}>
            {job.jobType}
          </span>
          <span className="badge badge-category" style={{ marginLeft: '0.4rem' }}>
            {job.category}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Calendar size={12} /> {formatTime(job.createdAt)}
        </span>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        {job.title}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.9rem', marginBottom: '1rem' }}>
        <Building2 size={16} />
        <span>{job.company}</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} /> {job.location}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
            <DollarSign size={14} /> {job.salaryRange}
          </div>
        </div>

        <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
          Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
