const API_BASE_URL = import.meta.env.VITE_API_URL ||"http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

// Auth
export async function loginAPI(role: string, identifier: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, password }),
  });
  return handleResponse(res);
}

// Projects
export async function fetchAllProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function fetchFacultyProjects(facultyId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/faculty/${facultyId}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function fetchStudentProjects(studentId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/student/${studentId}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function fetchAvailableProjects() {
  const res = await fetch(`${API_BASE_URL}/projects/available`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function applyToProject(projectId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/apply`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function advanceProjectPhase(projectId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/advance-phase`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
