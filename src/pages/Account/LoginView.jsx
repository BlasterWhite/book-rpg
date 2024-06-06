import './Login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password
    };

    try {
      await fetch(
        (import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000') + '/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      ).then((response) =>
        response.json().then((data) => {
          if (!data.error) {
            login(data);
            navigate('/');
          } else {
            const errorDiv = document.querySelector('.form-error');
            errorDiv.textContent = 'Invalid email or password';
          }
        })
      );
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire de connexion:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-left-panel">
        <h1>Start your own <span>adventure</span></h1>
        <div className="login-page-illustration">
          <img alt="Login placeholder" src="/icons/login_register/loginPlaceholder.webp" />
        </div>
      </div>
      <div className="login-page-right-panel">
        <h2>Login your account</h2>
        <form className="login-page-form" onSubmit={handleSubmit}>
          <div className="login-page-input-group">
            <label htmlFor="email" className="login-page-form-label">
              <img alt="Account icon" src="/icons/login_register/Account.webp" />
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-page-input"
              required
            />
          </div>
          <div className="login-page-input-group">
            <label htmlFor="password" className="login-page-form-label">
              <img alt="Lock icon" src="/icons/login_register/Lock.webp" />
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-page-input"
              required
            />
          </div>
          <div className="login-page-actions">
            <a href="/register">Create an account</a>
            <a href="">Forgot password</a>
          </div>
          <button type="submit" className="login-page-submit-button">
            Login
          </button>
          <div className="form-error"></div>
        </form>
      </div>
    </div>
  );
}
