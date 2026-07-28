import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Building2, MapPin, DollarSign, ListChecks } from 'lucide-react';

const PostJobPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || '',
    location: 'Remote',
    jobType: 'Full-time',
    category: 'Engineering',
    salaryRange: '$100,000 - $130,000 / year',
    description: '',
    requirementsStr: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const requirements = formData.requirementsStr
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      await axiosInstance.post('/jobs', {
        ...formData,
        requirements
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job posting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <PlusCircle size={28} color="#818cf8" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create New Job Listing</h1>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building2 size={13} /> Company Name *
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g. Acme Tech Solutions"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} /> Location *
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Remote, San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="select-field">
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="select-field">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={13} /> Salary Range *
              </label>
              <input
                type="text"
                name="salaryRange"
                placeholder="e.g. $120k - $150k / year"
                value={formData.salaryRange}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label">Job Description & Responsibilities *</label>
            <textarea
              name="description"
              rows={6}
              placeholder="Detail the core duties, team environment, key goals..."
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ListChecks size={13} /> Requirements (One per line)
            </label>
            <textarea
              name="requirementsStr"
              rows={4}
              placeholder="5+ years of React experience&#10;Strong TypeScript background&#10;Experience with AWS deployment"
              value={formData.requirementsStr}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
