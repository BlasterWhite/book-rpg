import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, redirect, permissions = ['admin'] }) {
  const user = localStorage.getItem('user');

  if (!user) {
    return redirect ? <Navigate to={redirect} /> : null;
  }

  try {
    const parsedUser = JSON.parse(user);
    if (permissions.includes(parsedUser.permission)) {
      return children;
    }
    return redirect ? <Navigate to={redirect} /> : null;
  } catch (error) {
    return redirect ? <Navigate to={redirect} /> : null;
  }
}
