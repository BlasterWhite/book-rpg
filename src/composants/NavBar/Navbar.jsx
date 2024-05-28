import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <nav className={'nav-header'}>
      <div className={'nav-item-left'}>
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/book'}>Library</NavLink>
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
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
