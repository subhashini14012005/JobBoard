import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p>© {new Date().getFullYear()} <strong>CareerPulse MERN Platform</strong>. Built with React, Node.js, Express & MongoDB.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
          empowering job seekers & employers worldwide.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
