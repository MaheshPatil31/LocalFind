import React, { useEffect, useState } from 'react';
import BusinessCard from '../components/business/BusinessCard.jsx';
import { businessApi } from '../services/api.js';

export default function BusinessesPage() {
  const [searchForm, setSearchForm] = useState({
    search: '',
    category: '',
    area: '',
  });

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    area: '',
    page: 1,
    limit: 9,
  });

  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [nearMe, setNearMe] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (nearMe) {
      return;
    }

    setLoading(true);
    setError('');

    businessApi
      .approved(filters)
      .then(({ businesses: items, pagination: meta }) => {
        setBusinesses(items);
        setPagination(meta);
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters, nearMe]);

  function change(event) {
    const { name, value } = event.target;

    setSearchForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    setNearMe(false);

    setFilters((current) => ({
      ...current,
      ...searchForm,
      page: 1,
    }));
  }

  function clear() {
    const emptyForm = {
      search: '',
      category: '',
      area: '',
    };

    setSearchForm(emptyForm);
    setNearMe(false);

    setFilters({
      ...emptyForm,
      page: 1,
      limit: 9,
    });
  }

  function goTo(page) {
    setFilters((current) => ({
      ...current,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function findNearby() {
    if (!navigator.geolocation) {
      setError('Your browser does not support location services.');
      return;
    }

    setLocationLoading(true);
    setLoading(true);
    setError('');
    setPagination(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await businessApi.nearby({
            latitude,
            longitude,
            radius,
          });

          setBusinesses(response.businesses);
          setNearMe(true);
        } catch (requestError) {
          setError(requestError.message);
          setBusinesses([]);
        } finally {
          setLocationLoading(false);
          setLoading(false);
        }
      },
      (locationError) => {
        setLocationLoading(false);
        setLoading(false);

        if (locationError.code === 1) {
          setError(
            'Location permission was denied. Please allow location access and try again.',
          );
        } else if (locationError.code === 2) {
          setError(
            'Your location could not be determined. Please try again.',
          );
        } else {
          setError(
            'Unable to get your location. Please try again.',
          );
        }
      },
    );
  }

  return (
    <section className="container discovery-page">
      <p className="eyebrow">Discover Hyderabad</p>

      <h1>Local businesses worth knowing</h1>

      <p className="page-copy">
        Browse approved businesses from around the city.
      </p>

      <form className="discovery-filters" onSubmit={submit}>
        <label className="search-field">
          <span className="sr-only">Search businesses</span>

          <input
            name="search"
            value={searchForm.search}
            onChange={change}
            placeholder="Search businesses, services, or places"
          />
        </label>

        <label>
          <span>Category</span>

          <input
            name="category"
            value={searchForm.category}
            onChange={change}
            placeholder="e.g. Home Services"
          />
        </label>

        <label>
          <span>Area</span>

          <input
            name="area"
            value={searchForm.area}
            onChange={change}
            placeholder="e.g. Gachibowli"
          />
        </label>

        <button type="submit">Search</button>

        <button
          className="clear-button"
          type="button"
          onClick={clear}
        >
          Clear filters
        </button>
      </form>

      <div className="near-me-controls">
        <button
          type="button"
          onClick={findNearby}
          disabled={locationLoading}
        >
          {locationLoading ? 'Finding nearby businesses…' : '📍 Near Me'}
        </button>

        <label>
          <span className="sr-only">Search radius</span>

          <select
            value={radius}
            onChange={(event) =>
              setRadius(Number(event.target.value))
            }
          >
            <option value="2000">Within 2 km</option>
            <option value="5000">Within 5 km</option>
            <option value="10000">Within 10 km</option>
          </select>
        </label>

        {nearMe && (
          <span className="near-me-active">
            Showing businesses near you
          </span>
        )}
      </div>

      {!loading && !error && pagination && !nearMe && (
        <p className="result-count">
          {pagination.total}{' '}
          {pagination.total === 1 ? 'business' : 'businesses'} found
        </p>
      )}

      {nearMe && !loading && !error && (
        <p className="result-count">
          {businesses.length}{' '}
          {businesses.length === 1
            ? 'nearby business'
            : 'nearby businesses'}{' '}
          found within {radius / 1000} km
        </p>
      )}

      {loading && (
        <p className="state-message">
          Loading businesses…
        </p>
      )}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {!loading && !error && businesses.length === 0 && (
        <p className="state-message">
          {nearMe
            ? `No approved businesses were found within ${
                radius / 1000
              } km of your location.`
            : 'No approved businesses match these filters. Try clearing them.'}
        </p>
      )}

      {!loading && !error && businesses.length > 0 && (
        <>
          <div className="public-business-grid">
            {businesses.map((business) => (
              <BusinessCard
                key={business._id}
                business={business}
              />
            ))}
          </div>

          {!nearMe && pagination?.totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Businesses pages"
            >
              <button
                disabled={!pagination.hasPrevious}
                onClick={() => goTo(pagination.page - 1)}
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={!pagination.hasNext}
                onClick={() => goTo(pagination.page + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}