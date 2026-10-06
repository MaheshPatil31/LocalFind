import React from 'react';
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p><strong>LocalFind</strong> — Hyderabad, nearby.</p>
        <p>© {new Date().getFullYear()} LocalFind</p>
      </div>
    </footer>
  );
}
