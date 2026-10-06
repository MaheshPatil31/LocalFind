import React from 'react'
export default function BusinessActions({ business }) {
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}, ${business.area}, ${business.city}`)}`;
  return <div className="business-actions" aria-label="Business actions"><a className="action-primary" href={`tel:${business.phone}`}>Call</a><a className="action-secondary" href={directions} target="_blank" rel="noreferrer">Get Directions</a><a className="action-secondary" href="#enquiry">Send Enquiry</a></div>;
}
