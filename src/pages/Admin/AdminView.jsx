import './AdminView.scss';
import { NavLink } from 'react-router-dom';

export function AdminView() {
  return (
    <div className="admin-view">
      <h1>Admin</h1>
      <div className="admin-view-buttons">
        <NavLink to={'/admin/book'}>Book management</NavLink>
        <NavLink to={'/admin/weapon'}>Weapons management</NavLink>
        <NavLink to={'/admin/equipment'}>Equipment management</NavLink>
        <NavLink to={'/admin/enemy'}>Enemy management</NavLink>
      </div>
    </div>
  );
}
