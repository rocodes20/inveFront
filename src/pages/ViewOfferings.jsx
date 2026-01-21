import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOfferings, fetchProjects } from '../services/api';

import '../assets/viewOfferings.css'; 

const ViewOfferings = () => {
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
                fetchOfferings(),
                fetchProjects()
            ]);

            
            if (offersData && offersData.result) {
                let data = offersData.result;
                
                if (!Array.isArray(data) && data.offers) {
                    data = data.offers;
                }
                
                 
                setOfferings(Array.isArray(data) ? data : []);
            }

            
            if (projectsData && projectsData.result) {
                setProjects(projectsData.result);
            }

        } catch (error) {
            console.error("CRITICAL ERROR loading data:", error);
            alert("Error loading data.");
        } finally {
            setLoading(false);
        }
    };

    const filteredOfferings = selectedProject === 'All' 
        ? offerings 
        : offerings.filter(offer => offer.project_name === selectedProject);

    const formatMoney = (amount) => {
        if (!amount && amount !== 0) return '-';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleViewInvestors = (offeringId) => {
        navigate(`/organization/offerings/${offeringId}/investors`);

    };

    return (
        <div className="page-container">
            <div className="card full-width-card">
                <div className="card-header">
                    <h3 className="card-title">All Offerings</h3>
                    <div className="filter-container">
                        <label>Filter by Project:</label>
                        <select 
                            className="filter-select" 
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

                <div className="div-table">
                    <div className="div-table-header">
                        <div className="div-table-cell col-project">PROJECT</div>
                        <div className="div-table-cell col-name">OFFERING NAME</div>
                        <div className="div-table-cell col-type">TYPE</div>
                        <div className="div-table-cell col-entity">ENTITY</div>
                        <div className="div-table-cell col-min">MIN INV.</div>
                        <div className="div-table-cell col-status">STATUS</div>
                        <div className="div-table-cell col-investors">INVESTORS</div>
                    </div>

                    {loading ? (
                        <div className="div-table-empty">Loading...</div>
                    ) : filteredOfferings.length === 0 ? (
                        <div className="div-table-empty">
                            No offerings found. <br/>
                            <small>(Check console logs if this is unexpected)</small>
                        </div>
                    ) : (
                        filteredOfferings.map((offer, index) => (
                            <div className="div-table-row" key={offer.offering_id || index}>
                                <div className="div-table-cell col-project font-bold">{offer.project_name || "N/A"}</div>
                                <div className="div-table-cell col-name">{offer.offer_name}</div>
                                <div className="div-table-cell col-type">
                                    <span className="badge-type">{offer.subscription_type}</span>
                                </div>
                                <div className="div-table-cell col-entity">{offer.entity_name}</div>
                                <div className="div-table-cell col-min">{formatMoney(offer.minimum_investment)}</div>
                                <div className="div-table-cell col-status">
                                    <span className={`status-badge ${offer.status?.toLowerCase()}`}>
                                        {offer.status}
                                    </span>
                                </div>
                                <div className="div-table-cell col-investors">
                                    <button 
                                        className="view-investors-btn"
                                        onClick={() => handleViewInvestors(offer.offering_id)}
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