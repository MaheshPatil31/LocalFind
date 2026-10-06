import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultPosition = [17.385, 78.4867];

const emptyBusiness = {
  name: '',
  category: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  city: 'Hyderabad',
  area: '',
  pincode: '',
  latitude: '',
  longitude: '',
  services: '',
  workingHours: '',
};

const markerIcon = L.divIcon({
  className: 'localfind-map-marker',
  html: '<div></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function LocationMarker({
  latitude,
  longitude,
  onLocationChange,
}) {
  useMapEvents({
    click(event) {
      onLocationChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  if (
    latitude === '' ||
    longitude === '' ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return null;
  }

  return (
    <Marker
      position={[
        Number(latitude),
        Number(longitude),
      ]}
      icon={markerIcon}
    />
  );
}

export default function BusinessForm({
  initialBusiness,
  onSubmit,
  submitting = false,
}) {
  const [values, setValues] = useState(emptyBusiness);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialBusiness) {
      setValues(emptyBusiness);
      return;
    }

    setValues({
      name: initialBusiness.name || '',
      category: initialBusiness.category || '',
      description: initialBusiness.description || '',
      phone: initialBusiness.phone || '',
      email: initialBusiness.email || '',
      address: initialBusiness.address || '',
      city: initialBusiness.city || 'Hyderabad',
      area: initialBusiness.area || '',
      pincode: initialBusiness.pincode || '',
      latitude: initialBusiness.latitude ?? '',
      longitude: initialBusiness.longitude ?? '',
      services: Array.isArray(initialBusiness.services)
        ? initialBusiness.services.join(', ')
        : '',
      workingHours: initialBusiness.workingHours || '',
    });
  }, [initialBusiness]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
  }

  function handleLocationChange({
    latitude,
    longitude,
  }) {
    setValues((current) => ({
      ...current,
      latitude,
      longitude,
    }));

    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!values.name.trim()) {
      setError('Business name is required.');
      return;
    }

    if (!values.category.trim()) {
      setError('Category is required.');
      return;
    }

    if (!values.phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!values.address.trim()) {
      setError('Address is required.');
      return;
    }

    if (!values.area.trim()) {
      setError('Area is required.');
      return;
    }

    if (!values.pincode.trim()) {
      setError('Pincode is required.');
      return;
    }

    const latitude =
      values.latitude === ''
        ? undefined
        : Number(values.latitude);

    const longitude =
      values.longitude === ''
        ? undefined
        : Number(values.longitude);

    if (
      latitude !== undefined &&
      (Number.isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90)
    ) {
      setError(
        'Latitude must be between -90 and 90.',
      );
      return;
    }

    if (
      longitude !== undefined &&
      (Number.isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180)
    ) {
      setError(
        'Longitude must be between -180 and 180.',
      );
      return;
    }

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      area: values.area.trim(),
      pincode: values.pincode.trim(),
      latitude,
      longitude,
      services: values.services
        .split(',')
        .map((service) => service.trim())
        .filter(Boolean),
      workingHours: values.workingHours.trim(),
    };

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError(
        submitError.message ||
          'Unable to save the business.',
      );
    }
  }

  const mapLatitude =
    values.latitude !== ''
      ? Number(values.latitude)
      : defaultPosition[0];

  const mapLongitude =
    values.longitude !== ''
      ? Number(values.longitude)
      : defaultPosition[1];

  return (
    <form
      className="business-form"
      onSubmit={handleSubmit}
    >
      <section className="form-card">
        <div className="form-section-heading">
          <p className="eyebrow">
            Business information
          </p>

          <h2>
            {initialBusiness
              ? 'Edit your business'
              : 'Add your business'}
          </h2>

          <p className="page-copy">
            Add accurate information so customers can
            easily discover and contact your business.
          </p>
        </div>

        <div className="form-grid">
          <label>
            Business name
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Chandrakal Ladies Tailor"
              maxLength={120}
            />
          </label>

          <label>
            Category
            <input
              type="text"
              name="category"
              value={values.category}
              onChange={handleChange}
              placeholder="e.g. Tailor"
              maxLength={80}
            />
          </label>

          <label className="full-width">
            Description
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe your business and the services you provide."
              rows={5}
              maxLength={2000}
            />
          </label>

          <label className="full-width">
            Services
            <input
              type="text"
              name="services"
              value={values.services}
              onChange={handleChange}
              placeholder="Tailoring, Alterations, Blouse Stitching"
            />

            <span className="field-help">
              Separate multiple services with commas.
            </span>
          </label>

          <label className="full-width">
            Working hours
            <textarea
              name="workingHours"
              value={values.workingHours}
              onChange={handleChange}
              placeholder="Mon - Sat: 10 AM - 8 PM"
              rows={3}
              maxLength={500}
            />
          </label>
        </div>
      </section>

      <section className="form-card">
        <div className="form-section-heading">
          <p className="eyebrow">
            Contact information
          </p>

          <h2>How customers can reach you</h2>
        </div>

        <div className="form-grid">
          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={25}
            />
          </label>

          <label>
            Email
            <span className="optional-label">
              Optional
            </span>

            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="business@example.com"
              maxLength={254}
            />
          </label>
        </div>
      </section>

      <section className="form-card">
        <div className="form-section-heading">
          <p className="eyebrow">Location</p>

          <h2>Where is your business?</h2>

          <p className="page-copy">
            Enter your address and click on the map to
            select your exact business location.
          </p>
        </div>

        <div className="form-grid">
          <label className="full-width">
            Address
            <textarea
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Enter the complete business address"
              rows={3}
              maxLength={300}
            />
          </label>

          <label>
            City
            <input
              type="text"
              name="city"
              value={values.city}
              onChange={handleChange}
              maxLength={80}
            />
          </label>

          <label>
            Area
            <input
              type="text"
              name="area"
              value={values.area}
              onChange={handleChange}
              placeholder="e.g. Gachibowli"
              maxLength={100}
            />
          </label>

          <label>
            Pincode
            <input
              type="text"
              name="pincode"
              value={values.pincode}
              onChange={handleChange}
              placeholder="500032"
              maxLength={6}
            />
          </label>
        </div>

        <div className="business-location-picker">
          <div className="form-section-heading">
            <h3>Select business location</h3>

            <p className="page-copy">
              Click anywhere on the map to move the
              business marker.
            </p>
          </div>

          <MapContainer
            center={[
              mapLatitude,
              mapLongitude,
            ]}
            zoom={13}
            scrollWheelZoom
            style={{
              height: '350px',
              width: '100%',
              borderRadius: '12px',
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker
              latitude={values.latitude}
              longitude={values.longitude}
              onLocationChange={
                handleLocationChange
              }
            />
          </MapContainer>
        </div>

        <div className="location-coordinates">
          <div>
            <span>Latitude</span>

            <strong>
              {values.latitude || 'Not selected'}
            </strong>
          </div>

          <div>
            <span>Longitude</span>

            <strong>
              {values.longitude || 'Not selected'}
            </strong>
          </div>
        </div>
      </section>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <Link
          to="/owner/businesses"
          className="secondary-button"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting
            ? 'Saving…'
            : initialBusiness
              ? 'Save changes'
              : 'Create business'}
        </button>
      </div>
    </form>
  );
}