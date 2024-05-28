import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // if no user {}
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const login = (data) => {
    setIsLoggedIn(true);
    data.user.token = data.token;
    setUser(data.user);
    document.cookie = `token=${data.token}; max-age=86400; path=/`;
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({});
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('user');
    if (isLoggedIn) {
      setIsLoggedIn(true);
    }
    if (user) {
      try {
        setUser(JSON.parse(user));
      } catch (error) {
        setUser({});
      }
    }
    setIsLoaded(true);
  }, []);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoaded,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
