import React from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

const categories = [
  {
    icon: '🍽️',
    title: 'Restaurants',
    description: 'Great places to eat around you.',
  },
  {
    icon: '🔧',
    title: 'Home services',
    description: 'Help for repairs and upkeep.',
  },
  {
    icon: '💆',
    title: 'Beauty & wellness',
    description: 'Care, fitness and wellbeing.',
  },
  {
    icon: '🎓',
    title: 'Learning',
    description: 'Classes and tutors for every goal.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Search',
    description: 'Find businesses and services by name, category or area.',
  },
  {
    number: '02',
    title: 'Compare',
    description: 'Check ratings, services, photos, location and working hours.',
  },
  {
    number: '03',
    title: 'Connect',
    description: 'Call a business, get directions or send a service enquiry.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">Made for Hyderabad</p>

          <h1>Find trusted local businesses and services near you.</h1>

          <p className="hero-copy">
            Discover local businesses, compare services and connect with
            trusted providers across Hyderabad.
          </p>

          <SearchBar />

          <Link className="hero-link" to="/businesses">
            Explore local businesses →
          </Link>
        </div>
      </section>

      <section
        id="categories"
        className="categories container"
        aria-labelledby="categories-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Explore</p>
          <h2 id="categories-title">Find what you need</h2>
          <p>
            Explore popular categories and discover businesses around
            Hyderabad.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
            />
          ))}
        </div>

        <div className="section-action">
          <Link className="secondary-button" to="/businesses">
            View all businesses
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Simple &amp; useful</p>
            <h2>How LocalFind works</h2>
            <p>
              Find the right local service in just a few simple steps.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="business-cta">
        <div className="container business-cta-content">
          <div>
            <p className="eyebrow">For business owners</p>
            <h2>Want more customers to discover your business?</h2>
            <p>
              List your business on LocalFind and let customers discover your
              services, location and contact information.
            </p>
          </div>

          <Link className="primary-button" to="/register">
            List your business
          </Link>
        </div>
      </section>
    </>
  );
}