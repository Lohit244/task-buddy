import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import jwt from "jwt-decode";

type User = {
  name: string;
  token: string;
};

type AuthContextValue = {
  user: User | null;
  authLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  refetchUser: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  authLoading: false,
  authError: null,
  login: async () => { },
  logout: () => { },
  register: async () => { },
  refetchUser: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  /**
   * Pass in the name and password of user to login.
   *
   * user object can be accessed from the `useAuth` hook's user property
   */
  const login = async (email: string, password: string) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/login`,
        requestOptions
      );
      const resData = await res.json();
      if (resData.error) {
        setAuthError(resData.error);
      } else if (resData.token) {
        const usr = {
          name: resData.name,
          token: resData.token,
        };
        setUser(usr);
        if (typeof Storage !== "undefined") {
          localStorage.setItem("token", resData.token);
        }
      }
      setAuthLoading(false);
    } catch (err) {
      setAuthError("Request Failed, please try again");
    }
  };

  /**
   * Remove the user object from local storage
   * and update the user object returned from the `useAuth` hook
   */
  const logout = () => {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
  };

  // get User from localStorage and make sure that the data is up to date
  useEffect(() => {
    if (typeof Storage === "undefined") return;
    try {
      const token = localStorage.getItem("token");
      if(!token) return;
      refetchUser(token);
    } catch (err) {
      setAuthError("Your past login data is corrupted, please login again");
      logout();
    }
  }, []);

  /**
   * Register a new user.
   *
   * It will also log the user in if the request is successful
   * and update the user object returned from the `useAuth` hook
   */
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    };
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDURL}/signup`,
        requestOptions
      );
      const resData = await res.json();
      if (resData.error) {
        setAuthError(resData.error);
      } else if (resData.token) {
        const usr = {
          name: resData.name,
          token: resData.token,
        };
        setUser(usr);
        if (typeof Storage !== "undefined") {
          localStorage.setItem("token", resData.token);
        }
      }
      setAuthLoading(false);
    } catch (err) {
      setAuthError("Request Failed, please try again");
    }
  };

  /**
   * Update the user's object from the backend
   * and update the user object returned from the `useAuth` hook
   */
  const refetchUser = async (token: string) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (resData.error) {
        setAuthError(resData.error);
      }
      if (resData.user) {
        setUser({
          name: resData.user.name,
          token: token,
        });
      }
      setAuthLoading(false);
    } catch (err) {
      setAuthError("Request Failed, please try again");
    }
  };

  const authContextValue = {
    user,
    authLoading,
    authError,
    login,
    logout,
    register,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * example usage: -
  ```
  const { user, authLoading, authError, login, logout, register, refetchUser } = useAuth();
  ```
 * user has the user's data if they are authenticated
 * else it is null. Login, logout and register are functions.
 * If anything has an error(login failed, register failed, etc),
 * the error propery will be updated with the error message
 */
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
