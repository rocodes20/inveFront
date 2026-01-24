import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import OrganizationLayout from './layouts/OrganizationLayout'; 
import InvestorLayout from './layouts/InvestorLayout.jsx';         

// Pages
import SelectionPage from './pages/SelectionPage';
import Invitation from './pages/Invitation';
import Projects from './pages/Projects';
import ViewOfferings from './pages/ViewOfferings';
import AddNewOffering from './pages/AddNewOffering';
import ApplyOffering from './pages/ApplyOffering';
import Invest from './pages/Invest';
import OfferingInvestors from './pages/OfferingInvestors';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />

      <Route path="/organization" element={<OrganizationLayout />}>

        <Route index element={<Navigate to="invitations" replace />} />
        
        <Route path="invitations" element={<Invitation />} />
        <Route path="projects" element={<Projects />} />
        <Route path="offerings" element={<ViewOfferings />} />
        <Route path="offerings/add" element={<AddNewOffering />} />
        <Route path="offerings/:offeringId/investors" element={<OfferingInvestors />} />

      </Route>

      <Route path="/investor" element={<InvestorLayout />}>

        <Route index element={<Navigate to="offerings" replace />} />
        
        <Route path="offerings" element={<ApplyOffering />} />
      </Route>

      <Route path="/invest" element={<Invest />} />
    </Routes>
  );
};

export default App;