import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  redirect: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string)
};
