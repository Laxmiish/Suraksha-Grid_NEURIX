const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const loginUser = async ({ mobile, password, role }) => {
  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password, role }),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Unable to connect to server. Please verify backend status.' };
  }
};

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Unable to connect to server. Please verify backend status.' };
  }
};

export const uploadEkycZip = async (file, shareCode) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('share_code', shareCode);
    const response = await fetch(`${API_BASE}/api/ekyc/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Unable to connect to server. Please verify backend status.' };
  }
};

export const getWorkerProfile = async (referenceId) => {
  try {
    const response = await fetch(`${API_BASE}/api/worker/profile/${referenceId}`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getWorkerBenefits = async (referenceId) => {
  try {
    const response = await fetch(`${API_BASE}/api/worker/benefits/${referenceId}`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getUnionHistory = async (referenceId) => {
  try {
    const response = await fetch(`${API_BASE}/api/worker/union-history/${referenceId}`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getLabourBoards = async (referenceId) => {
  try {
    const response = await fetch(`${API_BASE}/api/worker/labour-boards/${referenceId}`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getJobsites = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/contractor/jobsites`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getJobsiteWorkers = async (jobsiteId) => {
  try {
    const response = await fetch(`${API_BASE}/api/jobsites/${jobsiteId}/workers`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const markAttendance = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Failed to record attendance' };
  }
};

export const getHouseholdHelpers = async (employerId) => {
  try {
    const response = await fetch(`${API_BASE}/api/household/my-helpers/${employerId}`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const getAvailableDomesticWorkers = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/household/domestic-workers`);
    return response.json();
  } catch (err) {
    return null;
  }
};

export const markHouseholdAttendance = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/household/mark-attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Failed to record attendance' };
  }
};

export const hireHouseholdHelper = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/api/household/hire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Failed to hire helper' };
  }
};