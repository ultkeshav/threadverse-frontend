import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthResponse, AuthUser } from "../types/auth";
import {
  loginUser,
  registerUser,
} from "../service/AuthService";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

 login: (
  email: string,
  password: string,
) => Promise<AuthUser>;

  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const TOKEN_KEY = "threadverse_token";
const USER_KEY = "threadverse_user";

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [user, setUser] = useState<AuthUser | null>(
    getStoredUser,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const saveAuth = (response: AuthResponse) => {
    const authUser: AuthUser = {
      userId: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authUser),
    );

    setToken(response.token);
    setUser(authUser);
  };

  const login = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  const response = await loginUser({
    email,
    password,
  });

  const authUser: AuthUser = {
    userId: response.userId,
    firstName: response.firstName,
    lastName: response.lastName,
    email: response.email,
    role: response.role,
  };

  saveAuth(response);

  return authUser;
};

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
  ) => {
    const response = await registerUser({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      password,
    });

    saveAuth(response);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}