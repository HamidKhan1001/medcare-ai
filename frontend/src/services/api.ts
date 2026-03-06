// src/services/api.ts

// Auth/users  → local FastAPI backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Image analysis → Colab (update REACT_APP_COLAB_URL in .env when ngrok URL changes)
const COLAB_URL = process.env.REACT_APP_COLAB_URL || '';

// Fetch with 10s timeout so UI never hangs forever
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Is the server running?');
    throw err;
  } finally {
    clearTimeout(id);
  }
};

// ── Token Management ──────────────────────

export const saveToken = (token: string) => {
  localStorage.setItem('medcare_token', token);
};

export const getToken = () => {
  return localStorage.getItem('medcare_token');
};

export const removeToken = () => {
  localStorage.removeItem('medcare_token');
};

export const saveUser = (user: any) => {
  localStorage.setItem('medcare_user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('medcare_user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('medcare_user');
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  removeUser();
};

// ── Auth API ──────────────────────────────

export const registerUser = async (data: {
  full_name: string;
  email: string;
  password: string;
  role: string;
  pmdc?: string;
}) => {
  const res = await fetchWithTimeout(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Registration failed');
  }

  return res.json();
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetchWithTimeout(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }

  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error('Failed to get profile');
  return res.json();
};

// ── Scan API (Colab) ──────────────────────

export const analyzeScan = async (
  scanType: string,
  file: File
) => {
  if (!COLAB_URL) throw new Error('Colab URL not set. Add REACT_APP_COLAB_URL to .env and restart.');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetchWithTimeout(
    `${COLAB_URL}/api/v1/analyze/${scanType}`,
    {
      method: 'POST',
      headers: {
        // Bypass ngrok browser-warning interstitial page
        'ngrok-skip-browser-warning': 'true',
      },
      body: formData,
    },
    60000  // 60s timeout — model inference takes time
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || 'Analysis failed');
  }

  return res.json();
};

export const getMyScans = async () => {
  const res = await fetch(`${BASE_URL}/users/scans`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error('Failed to get scans');
  return res.json();
};

// ── Doctor API ────────────────────────────

export const getPendingScans = async () => {
  const res = await fetch(`${BASE_URL}/users/doctor/pending-scans`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

export const approveScan = async (scanId: number) => {
  const res = await fetch(
    `${BASE_URL}/users/doctor/approve-scan/${scanId}`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    }
  );
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

export const rejectScan = async (scanId: number) => {
  const res = await fetch(
    `${BASE_URL}/users/doctor/reject-scan/${scanId}`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    }
  );
  if (!res.ok) throw new Error('Failed');
  return res.json();
};