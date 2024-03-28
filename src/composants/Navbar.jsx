import { NavLink } from 'react-router-dom';
import './Navbar.scss';

export function Navbar() {
  return (
    <nav className={'nav-header'}>
      <div className={'nav-item-left'}>
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/book'}>Library</NavLink>
      </div>
      <div className={'nav-item-right'}>
        <NavLink to={'/login'}>Login</NavLink>
        <NavLink to={'/register'}>Register</NavLink>
      </div>
    </nav>
  );
}
