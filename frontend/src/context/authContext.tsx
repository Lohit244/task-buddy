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
  refetchUser: (user?: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  authLoading: false,
  authError: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  refetchUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  /**
   * Pass in the username, password and type of user to login.
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
          localStorage.setItem("user", JSON.stringify(usr));
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
      localStorage.removeItem("user");
    }
    setUser(null);
  };

  // get data from token
  useEffect(() => {
    if (typeof Storage === "undefined") return;
    try {
      const user = localStorage.getItem("user");
      if (!user) return;
      const userObj = JSON.parse(user);
      const token = userObj.token;
      const parsedToken: any = jwt(token);
      if (!parsedToken.exp || parsedToken.exp < Date.now() / 1000) {
        logout();
        return;
      }
      refetchUser(userObj);
      // this will also ensure that the token is correct
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
    // TODO: data validation
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
          localStorage.setItem("user", JSON.stringify(usr));
        }
      }
      setAuthLoading(false);
    } catch (err) {
      setAuthError("Request Failed, please try again");
    }
  };

  /**
   * Update the user's progress from the backend
   * and update the userProgress object returned from the `useAuth` hook
   */
  const refetchUser = async (user?: User) => {
    if (!user) return;
    try {
      setAuthLoading(true);
      setAuthError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const resData = await res.json();
      if (resData.error) {
        setAuthError(resData.error);
      }
      if (resData.user) {
        setUser({
          name: resData.user.name,
          token: user.token,
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
  const { user, error, login, logout, register } = useAuth();
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
