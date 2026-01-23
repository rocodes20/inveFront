import React, { useState } from 'react';
import Invitation from '../pages/Invitation';
import AddNewOffering from '../pages/AddNewOffering';
import Projects from '../pages/Projects';
import ViewOfferings from '../pages/ViewOfferings';
import '../assets/OrganizationPage.css';

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('invitation');
  const [selectedProjectIdForOffering, setSelectedProjectIdForOffering] = useState(null);

  const handleNavigateToOffering = (projectId) => {
    setSelectedProjectIdForOffering(projectId);
    setActiveTab('offering');
  };

  const handleManualAddOffering = () => {
    setSelectedProjectIdForOffering(null);
    setActiveTab('offering');
  };

  const handleAddOfferingFromView = (projectId = null) => {
    setSelectedProjectIdForOffering(projectId);
    setActiveTab('offering');
  };

  return (
    <div className="org-page-container">
      <div className="org-nav-bar">
        <button
          className={`org-tab-btn ${activeTab === 'invitation' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitation')}
        >
          Invitation
        </button>

        <button
          className={`org-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>

        <button
          className={`org-tab-btn ${activeTab === 'view-offerings' ? 'active' : ''}`}
          onClick={() => setActiveTab('view-offerings')}
        >
          View Offerings
        </button>

        
      </div>

      <div className="org-content-area">
        {activeTab === 'invitation' && <Invitation />}

        {activeTab === 'projects' && (
          <Projects onAddOffering={handleNavigateToOffering} />
        )}

        {activeTab === 'view-offerings' && (
          <ViewOfferings onAddOffering={handleAddOfferingFromView} />
        )}

        {activeTab === 'offering' && (
          <AddNewOffering projectId={selectedProjectIdForOffering} />
        )}
      </div>
    </div>
  );
};

export default OrganizationPage;
