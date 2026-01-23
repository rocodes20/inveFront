import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../assets/SelectionPage.css';

const SelectionPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
  setError('');
  setLoading(true);

  try {
    // ORG
    if (role === 'organization') {
      const userId = 2; 
      const userRole = 'organization';

      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('role', userRole);

      navigate('/organization');
      return;
    }

    // INVESTOR
    const response = await loginUser(email, password, role);
    console.log(response)
    const { userId, role: userRole } = response.result;

    sessionStorage.setItem('contactId', userId);
    sessionStorage.setItem('role', userRole);
    
    navigate(`/${userRole}`);
  } catch (err) {
    setError(err.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="selection-container">
      <h1>Login</h1>
      <p>Select role and login to continue</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error-text">{error}</p>}

      <div className="button-group">
        <button
          className="card-btn"
          onClick={() => handleLogin('investor')}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login as Investor'}
        </button>

        <button
          className="card-btn"
          onClick={() => handleLogin('organization')}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login as Organization'}
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
