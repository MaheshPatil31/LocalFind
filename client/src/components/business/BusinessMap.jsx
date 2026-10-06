import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function BusinessMap({ business }) {
  const latitude = Number(business.latitude);
  const longitude = Number(business.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return (
      <div className="map-placeholder">
        <span>Location not available</span>
        <p>
          This business has not added its map location yet.
        </p>
      </div>
    );
  }

  return (
    <div className="business-map">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '360px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{business.name}</strong>
            <br />
            {business.address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}