export const API_BASE_URL = "https://look-like-project-new.onrender.com";

export function apiEndpoint(path) {
  return `${API_BASE_URL}${path}`;
}
