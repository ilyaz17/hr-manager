import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@hr_auth_user';

export interface AuthUser {
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((val) => {
      if (val) setUser(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simple local auth — replace with real API call as needed
    if (!username.trim() || !password.trim()) return false;
    const authUser: AuthUser = { username: username.trim() };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
