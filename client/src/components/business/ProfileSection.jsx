import React from 'react';

export default function ProfileSection({
  eyebrow,
  title,
  children,
  className = '',
  id,
}) {
  return (
    <section id={id} className={`profile-section ${className}`}>
      <div className="profile-section-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>

      {children}
    </section>
  );
}