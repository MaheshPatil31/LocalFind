const apiUrl =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getHealth() {
  const response = await fetch(`${apiUrl}/health`);

  if (!response.ok) {
    throw new Error('The LocalFind API is unavailable.');
  }

  return response.json();
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,

    headers: {
      ...(isFormData
        ? {}
        : { 'Content-Type': 'application/json' }),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export const authApi = {
  register: (values) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
    }),

  login: (values) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(values),
    }),

  me: (token) =>
    request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

function authOptions(token, options = {}) {
  return {
    ...options,

    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };
}

export const businessApi = {
  approved: (filters = {}) => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    return request(
      `/businesses${query.size ? `?${query}` : ''}`,
    );
  },

  nearby: ({ latitude, longitude, radius = 5000 }) => {
    const query = new URLSearchParams({
      latitude,
      longitude,
      radius,
    });

    return request(`/businesses/nearby?${query}`);
  },

  public: (id) => request(`/businesses/${id}`),

  mine: (token) =>
    request('/businesses/mine', authOptions(token)),

  get: (token, id) =>
    request(
      `/businesses/mine/${id}`,
      authOptions(token),
    ),

  create: (token, values) =>
    request(
      '/businesses',
      authOptions(token, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    ),

  update: (token, id, values) =>
    request(
      `/businesses/mine/${id}`,
      authOptions(token, {
        method: 'PATCH',
        body: JSON.stringify(values),
      }),
    ),

  remove: (token, id) =>
    request(
      `/businesses/mine/${id}`,
      authOptions(token, {
        method: 'DELETE',
      }),
    ),

  uploadImages: (token, businessId, files) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    return request(
      `/businesses/mine/${businessId}/images`,
      authOptions(token, {
        method: 'POST',
        body: formData,
      }),
    );
  },

  deleteImage: (token, businessId, publicId) =>
    request(
      `/businesses/mine/${businessId}/images`,
      authOptions(token, {
        method: 'DELETE',
        body: JSON.stringify({ publicId }),
      }),
    ),
};

export const reviewApi = {
  list: (businessId) =>
    request(`/businesses/${businessId}/reviews`),

  create: (token, businessId, values) =>
    request(
      `/businesses/${businessId}/reviews`,
      authOptions(token, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    ),

  update: (token, reviewId, values) =>
    request(
      `/reviews/${reviewId}`,
      authOptions(token, {
        method: 'PATCH',
        body: JSON.stringify(values),
      }),
    ),

  remove: (token, reviewId) =>
    request(
      `/reviews/${reviewId}`,
      authOptions(token, {
        method: 'DELETE',
      }),
    ),
};

export const enquiryApi = {
  create: (token, businessId, values) =>
    request(
      `/businesses/${businessId}/enquiries`,
      authOptions(token, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    ),

  mine: (token) =>
    request('/enquiries/mine', authOptions(token)),

  business: (token, businessId) =>
    request(
      `/businesses/${businessId}/enquiries`,
      authOptions(token),
    ),

  updateStatus: (token, enquiryId, status) =>
    request(
      `/enquiries/${enquiryId}/status`,
      authOptions(token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    ),

  reply: (token, enquiryId, reply) =>
    request(
      `/enquiries/${enquiryId}/reply`,
      authOptions(token, {
        method: 'PATCH',
        body: JSON.stringify({ reply }),
      }),
    ),
};

export const adminApi = {
  businesses: (token) =>
    request(
      '/businesses/admin/all',
      authOptions(token),
    ),

  updateBusinessStatus: (token, businessId, status) =>
    request(
      `/businesses/admin/${businessId}/status`,
      authOptions(token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    ),
};