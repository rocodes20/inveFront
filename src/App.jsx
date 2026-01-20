import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/SelectionPage';
import OrganizationPage from './pages/OrganizationPage'; 
import InvestorPage from './pages/InvestorPage';
import Invest from './pages/Invest';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/investor" element={<InvestorPage />} />
      <Route path="/organization" element={<OrganizationPage />} />
      <Route path="/invest" element={<Invest />} />
    </Routes>
  );
};

export default App;