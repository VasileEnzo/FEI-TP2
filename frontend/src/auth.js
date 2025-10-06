const API = process.env.REACT_APP_API_URL;

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error('Registro inválido');
  return res.json();
}

export async function loginUser({ identifier, password }) {
  const res = await fetch(`${API}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  if (!res.ok) throw new Error('Login inválido');
  return res.json();
}

export function saveSession({ jwt, user }) {
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getSession() {
  const jwt = localStorage.getItem('jwt');
  const user = localStorage.getItem('user');
  return { jwt, user: user ? JSON.parse(user) : null };
}

export function clearSession() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
}

export async function authFetch(path, options = {}) {
  const { jwt } = getSession();
  const headers = { ...(options.headers || {}) };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) throw new Error('Error de solicitud');
  return res.json();
}
