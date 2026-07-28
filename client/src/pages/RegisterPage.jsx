import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, UserCheck, Building2, Mail, Key, User } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [role, setRole] = useState('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bio, setBio] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register({
        name,
        email,
        password,
        role,
        companyName: role === 'employer' ? companyName : '',
        bio
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <UserPlus size={28} color="#818cf8" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Join CareerPulse as a Job Seeker or Hiring Employer
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.8rem', background: 'rgba(30, 41, 59, 0.6)', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className={`btn ${role === 'seeker' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
          >
            <UserCheck size={16} /> Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`btn ${role === 'employer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
          >
            <Building2 size={16} /> Employer / Company
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.8rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={13} /> Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={13} /> Email Address *
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {role === 'employer' && (
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building2 size={13} /> Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. TechCorp Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="input-field"
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Key size={13} /> Password (min 6 chars) *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              minLength={6}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Professional Bio / Overview</label>
            <textarea
              rows={3}
              placeholder={role === 'seeker' ? 'Senior Full Stack Engineer with 5+ years experience...' : 'We build innovative enterprise cloud platforms...'}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
            {submitting ? 'Creating Account...' : `Register as ${role === 'seeker' ? 'Job Seeker' : 'Employer'}`}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already registered? <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
