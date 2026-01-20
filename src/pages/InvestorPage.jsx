import React, { useState } from 'react';
import ViewOffering from '../pages/viewOffering'; 
import '../assets/OrganizationPage.css';

const InvestorPage = () => {
  const [activeTab, setActiveTab] = useState('viewOffering');

  return (
    <div className="org-page-container">
      
      
      <header className="org-nav-bar">
        <button
          className={`org-tab-btn ${activeTab === 'viewOffering' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewOffering')}
        >
          View Offering
        </button>
      </header>

      
      <main className="org-content-area">
        {activeTab === 'viewOffering' && (
          <ViewOffering />
        )}
      </main>
      
    </div>
  );
};

export default InvestorPage;