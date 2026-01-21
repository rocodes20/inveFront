import React, { useState } from 'react';
import ApplyOffering from '../pages/applyOffering';
import Invest from './Invest'; 
import '../assets/OrganizationPage.css';

const InvestorPage = () => {
  const [activeTab, setActiveTab] = useState('ApplyOffering');

  return (
    <div className="org-page-container">
      
      
      <header className="org-nav-bar">
        <button
          className={`org-tab-btn ${activeTab === 'ApplyOffering' ? 'active' : ''}`}
          onClick={() => setActiveTab('ApplyOffering')}
        >
          View Offering
        </button>
      </header>

      
      <main className="org-content-area">
        {activeTab === 'ApplyOffering' && (
          <ApplyOffering />
        )}
      </main>
      
    </div>
  );
};

export default InvestorPage;