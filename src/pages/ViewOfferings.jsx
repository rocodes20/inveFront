import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizationfetchOfferings, fetchProjects } from '../services/api';
import '../assets/viewOfferings.css';

const ViewOfferings = ({ onAddOffering }) => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [offersData, projectsData] = await Promise.all([
        OrganizationfetchOfferings(),
        fetchProjects()
      ]);

      if (offersData?.result) {
        let data = offersData.result;
        // Handle nested data structure if present
        if (!Array.isArray(data) && data.offers) {
          data = data.offers;
        }
        setOfferings(Array.isArray(data) ? data : []);
      }

      if (projectsData?.result) {
        setProjects(projectsData.result);
      }
    } catch (err) {
      console.error('ERROR loading offerings:', err);
      // alert('Failed to load offerings'); // Optional: suppress alert for cleaner UI
    } finally {
      setLoading(false);
    }
  };

  const filteredOfferings =
    selectedProject === 'All'
      ? offerings
      : offerings.filter(o => o.project_name === selectedProject);

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Helper to safely generate status class
  const getStatusClass = (status) => {
    if (!status) return 'vo-draft';
    const s = status.toLowerCase();
    if (s.includes('accepting') || s === 'open') return 'vo-accepting';
    if (s === 'closed') return 'vo-closed';
    if (s === 'pending') return 'vo-pending';
    return 'vo-draft';
  };

  return (
    <div className="page-container">
      <div className="vo-full-card">
        
        {/* HEADER SECTION: Title Left, Filter Right */}
        <div className="vo-header">
          <h3 className="vo-title">All Offerings</h3>
          
          <div className="vo-filter-container">
            <span>Filter by Project:</span>
            <select
              className="vo-filter-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.project_id} value={p.project_name}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="vo-table-container">
          <div className="vo-table-header">
            <div className="vo-table-cell">PROJECT</div>
            <div className="vo-table-cell">OFFERING NAME</div>
            <div className="vo-table-cell">TYPE</div>
            <div className="vo-table-cell">ENTITY</div>
            <div className="vo-table-cell">MIN INV.</div>
            <div className="vo-table-cell">STATUS</div>
            <div className="vo-table-cell">INVESTORS</div>
          </div>

          {loading ? (
            <div className="vo-empty-state">Loading...</div>
          ) : filteredOfferings.length === 0 ? (
            <div className="vo-empty-state">No offerings found</div>
          ) : (
            filteredOfferings.map((offer, index) => (
              <div className="vo-table-row" key={offer.offering_id || index}>
                <div className="vo-table-cell vo-text-bold">
                  {offer.project_name || 'N/A'}
                </div>

                <div className="vo-table-cell">
                  {offer.offer_name}
                </div>

                <div className="vo-table-cell">
                  <span className="vo-type-badge">
                    {offer.subscription_type}
                  </span>
                </div>

                <div className="vo-table-cell">
                  {offer.entity_name}
                </div>

                <div className="vo-table-cell">
                  {formatMoney(offer.minimum_investment)}
                </div>

                <div className="vo-table-cell">
                  <span className={`vo-status-badge ${getStatusClass(offer.status)}`}>
                    {offer.status}
                  </span>
                </div>

                <div className="vo-table-cell">
                  <button
                    className="vo-investors-btn"
                    onClick={() => navigate(`/organization/offerings/${offer.offering_id}/investors`)}
                  >
                    View {offer.investor_count || 0} Investors
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOfferings;