import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseAuthError, AuthError } from '@/lib/auth-errors';

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_practice_date?: string;
  total_lessons_completed: number;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthContextType {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
        setError(null);
      } catch (err: any) {
        const authError = parseAuthError(err);
        setError(authError);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      
      // Clear state
      setUser(null);
      setProfile(null);
      setError(null);
      
      // Redirect to authentication entry
      router.push('/');
    } catch (err: any) {
      const authError = parseAuthError(err);
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { user, profile, loading, error, logout, clearError };
}
