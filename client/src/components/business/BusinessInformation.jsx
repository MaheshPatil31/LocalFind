import React from 'react';
export default function BusinessInformation({ items }) {
  return <dl className="business-information">{items.map(({ label, value, href }) => <div key={label}><dt>{label}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>)}</dl>;
}
