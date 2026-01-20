import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectionPage from './pages/SelectionPage';
import OrganizationPage from './pages/OrganizationPage'; 
import InvestorPage from './pages/InvestorPage';
import Invest from './pages/Invest';
import OfferingInvestors from './pages/OfferingInvestors'; // <--- Import New Page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SelectionPage />} />
      <Route path="/investor" element={<InvestorPage />} />
      <Route path="/organization" element={<OrganizationPage />} />
      <Route path="/invest" element={<Invest />} />

      <Route path="/investors/:id" element={<OfferingInvestors />} />
    </Routes>
  );
};

export default App;