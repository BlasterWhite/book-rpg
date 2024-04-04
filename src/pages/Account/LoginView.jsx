import './Login.scss';
import { AuthContext } from '../../composants/AuthContext/AuthContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginView() {
  const { login } = useContext(AuthContext);
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
      await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).then((response) =>
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
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email :
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
      </div>
      <div className="form-error"></div>
      <div className="form-last-row">
        <span className="login-link">
          <a href="/register">You don&apos;t have an account yet ?</a>
        </span>
        <button type="submit" className="submit-button">
          Login
        </button>
      </div>
    </form>
  );
}
