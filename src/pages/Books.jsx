import { NavLink } from 'react-router-dom';

export function Books() {
  return (
    <div>
      <h1>Books</h1>
      <NavLink to={'/book/1'}>Book 1</NavLink>
      <NavLink to={'/book/2'}>Book 2</NavLink>
      <NavLink to={'/book/3'}>Book 3</NavLink>
      <NavLink to={'/book/4'}>Book 4</NavLink>
    </div>
  );
}
