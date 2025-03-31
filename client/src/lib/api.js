const API_BASE_URL = "http://localhost:3001/api";

async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export default {
  get: (url) => fetchWithToken(url),
  post: (url, body) => fetchWithToken(url, { method: "POST", body: JSON.stringify(body) }),
};
