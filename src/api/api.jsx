const API_BASE = 'http://localhost:5000';

export const loginUser = async ({ mobile, password, role }) => {
  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, password, role }),
    });
    return response.json();
  } catch (err) {
    return { success: false, message: 'Server se connect nahi ho paya' };
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
    return { success: false, message: 'Server se connect nahi ho paya' };
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
    return { success: false, message: 'Server se connect nahi ho paya' };
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