import React, { useState } from 'react';
import Invitation from '../pages/Invitation'; 
import AddNewOffering from '../pages/AddNewOffering';
import '../assets/OrganizationPage.css'; 

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('invitation');

  return (
    <div className="org-page-container">
      
      {/* Navigation Header */}
      <div className="org-nav-bar">
        <button
          className={`org-tab-btn ${activeTab === 'invitation' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitation')}
        >
          Invitation
        </button>

        <button
          className={`org-tab-btn ${activeTab === 'offering' ? 'active' : ''}`}
          onClick={() => setActiveTab('offering')}
        >
          Add Offering
        </button>
      </div>

      {/* Page Content */}
      <div className="org-content-area">
        {activeTab === 'invitation' ? (
          <Invitation />
        ) : (
          <AddNewOffering />
        )}
      </div>
      
    </div>
  );
};

export default OrganizationPage;