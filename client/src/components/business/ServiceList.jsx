import React from 'react';
export default function ServiceList({ services }) {
  if (!services?.length) return <p className="detail-copy">Service details will be added soon.</p>;
  return <ul className="services-list">{services.map((service) => <li key={service}>{service}</li>)}</ul>;
}
