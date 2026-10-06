import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <section className="container not-found"><h1>Page not found</h1><Link to="/">Back to LocalFind</Link></section>;
}
