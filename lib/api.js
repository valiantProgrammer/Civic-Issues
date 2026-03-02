// lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}


export const setCookie = (name, value, days) => {
  if (typeof window === 'undefined') return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
};

export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name) => {
  if (typeof window === 'undefined') return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
};


const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || errorData.details || 'An error occurred';
    throw new ApiError(
      errorMessage,
      response.status
    );
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = getCookie('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authApi = {

  getUserReports: async () => {
    const response = await fetch(`/api/getReports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  getReports: async () => {
    const response = await fetch(`/api/admi-reports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  getAdminReports: async () => {
    const response = await fetch(`/api/admin-reports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  getAdministrationReports: async () => {
    const response = await fetch(`/api/admi-reports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  getReportsByStatus: async (status) => {
    const response = await fetch(`/api/reports?status=${status}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  updateReportStatus: async (reportId, status, rejectedReason = null) => {
    const url = `/api/admi-reports/${reportId}`;
    const payload = {
      status,
      rejectedReason,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  userSignin: async (credentials) => {
    const response = await fetch(`/api/user-Signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  userSignup: async (email, username) => {
    const response = await fetch(`/api/user-Signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username }),
    });
    return handleResponse(response);
  },

  adminSignin: async (credentials) => {
    const response = await fetch(`/api/admin-signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  adminSignup: async (userData) => {
    const response = await fetch(`/api/admin-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  administrationSignin: async (credentials) => {
    const response = await fetch(`/api/adminis-signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  administrationSignup: async (userData) => {
    const response = await fetch(`/api/adminis-Signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  verifyOtp: async (userData) => {
    const response = await fetch(`/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  sendOtp: async (email, username) => {
    const response = await fetch(`/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`/api/logout`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    eraseCookie('accessToken');
    eraseCookie('refreshToken');
    return handleResponse(response);
  },

  refreshToken: async () => {
    const refreshToken = getCookie('refreshToken'); // Use cookie helper
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return handleResponse(response);
  },

  // --- User Profile ---
  getProfile: async () => {
    const response = await fetch(`/api/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  tokenExist: async () => {
    const response = await fetch(`/api/tokenExist`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  submitReport: async (reportData) => {

    const response = await fetch(`/api/reports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    return handleResponse(response);
  },

};

const signinApis = ['userSignin', 'adminSignin', 'administrationSignin'];
signinApis.forEach(apiName => {
  const originalFn = authApi[apiName];
  authApi[apiName] = async (...args) => {
    const response = await originalFn(...args);
    if (response.accessToken && response.refreshToken) {
      setCookie('accessToken', response.accessToken, 1);
      setCookie('refreshToken', response.refreshToken, 7);
    }
    return response;
  };
});

// Request interceptor for automatic token refresh on 401 errors
const withAuth = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error.status === 401) {
        try {
          // Attempt to refresh the token
          const { accessToken, refreshToken } = await authApi.refreshToken();
          // Set the new tokens in cookies
          setCookie('accessToken', accessToken, 1);
          setCookie('refreshToken', refreshToken, 7);
          // Retry the original request with the new token
          return await fn(...args);
        } catch (refreshError) {
          // Clear cookies and redirect to login if refresh fails
          eraseCookie('accessToken');
          eraseCookie('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw refreshError;
        }
      }
      throw error;
    }
  };
};

// List of all API calls that require a valid access token
// const protectedApis = [
//   'getProfile', 'updateProfile',
//   'getAddresses', 'addAddress', 'updateAddress', 'deleteAddress',
//   'getCart', 'updateCart',
//   'getProducts', 'getProduct',
//   'logout'
// ];

// // Wrap the protected API calls with the authentication interceptor
// protectedApis.forEach(apiName => {
//   if (authApi[apiName]) {
//     authApi[apiName] = withAuth(authApi[apiName]);
//   }
// });

export default authApi;

