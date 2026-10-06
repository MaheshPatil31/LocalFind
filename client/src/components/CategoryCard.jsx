import React from 'react';
export default function CategoryCard({ icon, title, description }) {
  return (
    <article className="category-card">
      <span className="category-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
