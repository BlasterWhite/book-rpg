import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children, permissions = ['admin'], redirect = '/login' }) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const checkPermissions = () => {
      if (user) {
        try {
          const userPermission = user?.permission || [];

          if (permissions.some((permission) => userPermission.includes(permission))) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } catch (error) {
          console.error('Error parsing user permissions', error);
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    };

    checkPermissions();
  }, [authLoading, user, permissions]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return <Navigate to={redirect} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string),
  redirect: PropTypes.string
};
