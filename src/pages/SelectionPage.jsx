import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/SelectionPage.css'; // Import the CSS file

const SelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="selection-container">
      
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Welcome</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Select your role to continue</p>

      <div className="button-group">
        
        <button 
          className="card-btn"
          onClick={() => navigate('/investor')} // <--- Update this line
        >
          Investor
        </button>

        {/* Organization Button */}
        <button 
          className="card-btn"
          onClick={() => navigate('/organization')}
        >
          Organization
        </button>

      </div>
    </div>
  );
};

export default SelectionPage;