import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, redirect, permissions = ['admin'] }) {
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to={redirect} />;
  }

  try {
    const parsedUser = JSON.parse(user);
    if (permissions.includes(parsedUser.permission)) {
      return children;
    }
    return <Navigate to={redirect} />;
  } catch (error) {
    return <Navigate to={redirect} />;
  }
}
