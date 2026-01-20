import React, { useState } from 'react';
import Invitation from '../pages/Invitation'; 
import AddNewOffering from '../pages/AddNewOffering';
import Projects from '../pages/Projects'; 
import ViewOfferings from '../pages/ViewOfferings'; // <--- Import
import '../assets/OrganizationPage.css'; 

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('invitation');
  const [selectedProjectForOffering, setSelectedProjectForOffering] = useState('');

  const handleNavigateToOffering = (projectName) => {
      setSelectedProjectForOffering(projectName); 
      setActiveTab('offering'); 
  };

  const handleManualAddOffering = () => {
      setSelectedProjectForOffering(''); 
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

        {/* NEW TAB BUTTON */}
        <button
          className={`org-tab-btn ${activeTab === 'view-offerings' ? 'active' : ''}`}
          onClick={() => setActiveTab('view-offerings')}
        >
          View Offerings
        </button>

        <button
          className={`org-tab-btn ${activeTab === 'offering' ? 'active' : ''}`}
          onClick={handleManualAddOffering}
        >
          Add Offering
        </button>
      </div>

      <div className="org-content-area">
        {activeTab === 'projects' && (
            <Projects onAddOffering={handleNavigateToOffering} />
        )}

        {activeTab === 'invitation' && <Invitation />}

        {/* NEW COMPONENT RENDER */}
        {activeTab === 'view-offerings' && <ViewOfferings />}

        {activeTab === 'offering' && (
            <AddNewOffering initialProjectName={selectedProjectForOffering} />
        )}
      </div>
      
    </div>
  );
};

export default OrganizationPage;