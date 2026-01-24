import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import '../assets/OrganizationPage.css'; // Re-use existing styles

const InvestorLayout = () => {
  const role = sessionStorage.getItem('role');

  // Security Check
  if (role !== 'investor') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="org-page-container">
      <nav className="org-nav-bar">
        {/* Determine active state automatically */}
        <NavLink 
          to="/investor/offerings" 
          className={({ isActive }) => `org-tab-btn ${isActive ? 'active' : ''}`}
        >
          View Offerings
        </NavLink>
        
        {/* You can easily add "My Portfolio" here later */}
      </nav>

      <main className="org-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default InvestorLayout;