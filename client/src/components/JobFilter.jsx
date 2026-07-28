import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Customer Support', 'Other'];
const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

const JobFilter = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Search size={13} /> Keyword / Title
        </label>
        <input
          type="text"
          name="search"
          placeholder="e.g. React Engineer, Designer..."
          value={filters.search}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={13} /> Category
        </label>
        <select name="category" value={filters.category} onChange={handleChange} className="select-field">
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} /> Job Type
        </label>
        <select name="jobType" value={filters.jobType} onChange={handleChange} className="select-field">
          {jobTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <button onClick={onReset} className="btn btn-secondary" style={{ width: '100%' }} title="Reset filters">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default JobFilter;
