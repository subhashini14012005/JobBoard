import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import { Sparkles, Briefcase, Users, Building, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    jobType: 'All'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.jobType && filters.jobType !== 'All') params.jobType = filters.jobType;

      const res = await axiosInstance.get('/jobs', { params });
      setJobs(res.data);
      setError('');
    } catch (err) {
      console.error('[Fetch Jobs Error]:', err);
      setError('Failed to load job listings. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleReset = () => {
    setFilters({ search: '', category: 'All', jobType: 'All' });
  };

  return (
    <div>
      <section className="hero-section">
        <span className="badge badge-remote" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <Sparkles size={14} /> Next-Gen Developer & Tech Career Portal
        </span>
        <h1 className="hero-title">
          Find Your Next <span>Dream Opportunity</span>
        </h1>
        <p className="hero-subtitle">
          Connect with top tech enterprises and innovative startups. Browse thousands of verified remote and hybrid roles.
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.6rem', borderRadius: '12px' }}>
              <Briefcase size={20} color="#818cf8" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>1,200+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Postings</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
              <Building size={20} color="#38bdf8" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>450+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Companies</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
              <TrendingUp size={20} color="#34d399" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>98%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Component */}
      <JobFilter filters={filters} setFilters={setFilters} onReset={handleReset} />

      {/* Error state */}
      {error && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Loading & Job Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <p>Fetching active opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No matching jobs found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing filters or searching for another keyword.</p>
          <button onClick={handleReset} className="btn btn-secondary">Clear Filters</button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Featured Job Listings ({jobs.length})</h2>
          </div>
          <div className="job-grid">
            {jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
