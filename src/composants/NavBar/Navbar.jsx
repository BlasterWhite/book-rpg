import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ProtectedRoute } from '@/pages/ProtectedRoute.jsx';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

function Portal({ children }) {
  return createPortal(children, document.body);
}

export function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();

  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();

  const [isOpen, setIsOpen] = useState(false);

  window.addEventListener('click', function (event) {
    if (isOpen && referenceElement && !referenceElement.contains(event.target)) {
      setIsOpen(false);
    }
  });

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom'
  });

  const navigate = useNavigate();

  function goToProfile() {
    navigate('/profile');
  }

  function toggleMenu(e) {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

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
          <div className={'more-options'} ref={setReferenceElement} onClick={toggleMenu}>
            <img src={'/icons/more.svg'} alt={'More options'} />
          </div>
          <Portal>
            <div
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className={'popper-menu ' + (isOpen ? 'open' : 'close')}>
              <div className={'content'}>
                <button onClick={goToProfile}>
                  Profile
                  <img src={'/icons/profile.svg'} alt={'Profile'} />
                </button>
                <button onClick={logout}>
                  Logout
                  <img src={'/icons/logout.svg'} alt={'Logout'} />
                </button>
              </div>
            </div>
          </Portal>
        </div>
      )}
    </nav>
  );
}
