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
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>+-_/~])(?=.*[a-zA-Z]).{8,}$/;
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
      await fetch((import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000') + '/users', {
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
    <div className="register-page">
      <div className="register-page-left-panel">
        <h1>Start your own <span>adventure</span></h1>
        <div className="register-page-illustration">
          <img alt="Login placeholder" src="/src/assets/images/loginPlaceholder.webp" />
        </div>
      </div>
      <div className="register-page-right-panel">
        <h2>Create your account</h2>
        <form className="register-page-form" onSubmit={handleSubmit}>
          <div className="register-page-form-names-group">
            <div className="register-page-form-input-group">
              <label htmlFor="lastname" className="register-page-form-label">
                <img alt="Lock icon" src="/src/assets/icons/login_register/Account.webp" />
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => handleChange(e, setName)}
                className="register-page-form-input"
                placeholder="Last name"
                required
              />
            </div>
            <div className="register-page-form-input-group">
              <label htmlFor="firstname" className="register-page-form-label">
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => handleChange(e, setFirstname)}
                className="register-page-form-input register-page-form-input-first-name"
                placeholder="First name"
                required
              />
            </div>
          </div>
          <div className="register-page-form-input-group">
            <label htmlFor="email" className="register-page-form-label">
              <img alt="Lock icon" src="/src/assets/icons/login_register/Email.webp" />
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleChange(e, setEmail)}
              className="register-page-form-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="register-page-form-input-group">
            <label htmlFor="password" className="register-page-form-label">
              <img alt="Lock icon" src="/src/assets/icons/login_register/Lock.webp" />
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleChange(e, setPassword)}
              className="register-page-form-input"
              placeholder="Password"
              required
            />
          </div>
          <div className="register-page-form-input-group">
            <label htmlFor="confirmPassword" className="register-page-form-label">
              <img alt="Lock icon" src="/src/assets/icons/login_register/Lock.webp" />
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => handleChange(e, setConfirmPassword)}
              className="register-page-form-input"
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="register-page-form-actions">
            <a href="/login">Already have an account ?</a>
          </div>
          <button type="submit" className="register-page-form-submit-button">
            Register
          </button>
          <div className="form-error"></div>
        </form>
      </div>
    </div>
  );
}

RegisterView.propTypes = {
  isConnected: PropTypes.bool
};
