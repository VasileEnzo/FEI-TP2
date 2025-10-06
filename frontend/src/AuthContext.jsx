import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { registerUser, loginUser, saveSession, getSession, clearSession } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    setUser(s.user);
    setJwt(s.jwt);
    setReady(true);
  }, []);

  const value = useMemo(() => ({
    user,
    jwt,
    login: async (identifier, password) => {
      const data = await loginUser({ identifier, password });
      saveSession(data);
      setUser(data.user);
      setJwt(data.jwt);
      return data;
    },
    register: async (username, email, password) => {
      const data = await registerUser({ username, email, password });
      saveSession(data);
      setUser(data.user);
      setJwt(data.jwt);
      return data;
    },
    logout: () => {
      clearSession();
      setUser(null);
      setJwt(null);
    }
  }), [user, jwt]);

  if (!ready) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
