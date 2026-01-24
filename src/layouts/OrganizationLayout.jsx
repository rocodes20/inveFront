
import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import '../assets/OrganizationPage.css'; 

const OrganizationLayout = () => {
  const role = sessionStorage.getItem('role');

  if (role !== 'organization') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="org-page-container">
      <nav className="org-nav-bar">

        <NavLink 
          to="/organization/invitations" 
          className={({ isActive }) => `org-tab-btn ${isActive ? 'active' : ''}`}
        >
          Invitation
        </NavLink>

        <NavLink 
          to="/organization/projects" 
          className={({ isActive }) => `org-tab-btn ${isActive ? 'active' : ''}`}
        >
          Projects
        </NavLink>

        <NavLink 
          to="/organization/offerings" 
          className={({ isActive }) => `org-tab-btn ${isActive ? 'active' : ''}`}
        >
          View Offerings
        </NavLink>

      </nav>

      <main className="org-content-area">

        <Outlet />
      </main>
    </div>
  );
};

export default OrganizationLayout;