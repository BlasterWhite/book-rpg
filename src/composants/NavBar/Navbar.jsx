import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ProtectedRoute } from '@/pages/ProtectedRoute.jsx';

export function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <nav className={'nav-header'}>
      <div className={'nav-item-left'}>
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/book'}>Library</NavLink>
        <ProtectedRoute permissions={['admin']}>
          <NavLink to={'/admin'}>Admin</NavLink>
        </ProtectedRoute>
      </div>
      {!isLoggedIn ? (
        <div className={'nav-item-right'}>
          <NavLink to={'/login'}>Login</NavLink>
          <NavLink to={'/register'}>Register</NavLink>
        </div>
      ) : (
        <div className={'nav-item-right'}>
          <span>
            {user && user.firstname && user.lastname ? (
              <div className={'user-info'}>
                <span className={'user-name'}>
                  {user.firstname} {user.lastname}
                </span>
                <span className={'user-email'}>{user.email}</span>
              </div>
            ) : (
              'Unknown user'
            )}
          </span>
          <NavLink className={'nav-item-navlink'} to={'/profil'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
          </NavLink>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
