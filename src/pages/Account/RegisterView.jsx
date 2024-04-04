import './Register.scss';

import { useState } from 'react';
import { PropTypes } from 'prop-types';

export function RegisterView({ isConnected }) {
  const [lastname, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (event, setter) => {
    const errorDiv = document.querySelector('.form-error');
    errorDiv.textContent = '';

    setter(event.target.value);
  };

  console.log(isConnected);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');

      passwordInput.classList.add('error');
      confirmPasswordInput.classList.add('error');

      const errorDiv = document.querySelector('.form-error');
      errorDiv.textContent = 'Passwords are not the same';
      return;
    }

    // on vérifie que le mot de passe contient au moins 8 caractères dont au moins une lettre et un chiffre et un caractère spécial parmi $@$!%*?&#.
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#]{8,}$/;
    if (!regex.test(password)) {
      const passwordInput = document.getElementById('password');
      passwordInput.classList.add('error');

      const errorDiv = document.querySelector('.form-error');
      errorDiv.textContent =
        'Password must contain at least 8 characters including a letter, a number and a special character';
      return;
    }

    const formData = {
      lastname: lastname,
      firstname: firstname,
      email: email,
      password: password
    };

    try {
      // await fetch('http://193.168.146.103:3000/users', {
      await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then((response) =>
        response.json().then((res) => {
          if (res.error) {
            const errorDiv = document.querySelector('.form-error');
            errorDiv.textContent = res.error;
          } else {
            window.location.href = '/login';
          }
        })
      );
    } catch (error) {
      console.error('Error during registration', error);
    }
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="lastname" className="form-label">
          Lastname :
        </label>
        <input
          type="text"
          id="lastname"
          value={lastname}
          onChange={(e) => handleChange(e, setName)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="firstname" className="form-label">
          Firstname :
        </label>
        <input
          type="text"
          id="firstname"
          value={firstname}
          onChange={(e) => handleChange(e, setFirstname)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email :
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => handleChange(e, setEmail)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password :
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => handleChange(e, setPassword)}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm password :
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => handleChange(e, setConfirmPassword)}
          className="form-input"
          required
        />
      </div>
      <div className="form-error"></div>
      <div className="form-last-row">
        <span className="login-link">
          <a href="/login">You already have an account ?</a>
        </span>
        <button type="submit" className="submit-button">
          Register
        </button>
      </div>
    </form>
  );
}

RegisterView.propTypes = {
  isConnected: PropTypes.bool
};
