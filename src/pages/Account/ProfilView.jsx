import './Login.scss';
import { AuthContext } from '../../composants/AuthContext/AuthContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfilView() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://via.placeholder.com/150" alt="Profile" className="profile-image" />
        <h1 className="profile-name">John Doe</h1>
      </div>
      <div className="profile-body">
        <p className="profile-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros,
          pulvinar facilisis justo mollis, auctor consequat urna.
        </p>
      </div>
    </div>
  );
}
