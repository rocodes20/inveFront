import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestors } from '../services/api';
import '../assets/viewOfferings.css'; // Reusing the table styles

const OfferingInvestors = () => {
    const { id } = useParams(); // Get offering ID from URL
    const navigate = useNavigate();
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(id) loadInvestors();
    }, [id]);

    const loadInvestors = async () => {
        setLoading(true);
        try {
            const data = await fetchInvestors(id);
            if (data && data.result) {
                setInvestors(data.result);
            }
        } catch (error) {
            console.error("Error loading investors:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="page-container">
            <div className="card full-width-card">
                <div className="card-header">
                    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <button className="btn-secondary" onClick={() => navigate(-1)}>
                            &larr; Back
                        </button>
                        <h3 className="card-title">Investor List</h3>
                    </div>
                </div>

                <div className="div-table">
                    <div className="div-table-header" style={{gridTemplateColumns: '1.5fr 2fr 1.5fr 1.5fr'}}>
                        <div className="div-table-cell">INVESTOR NAME</div>
                        <div className="div-table-cell">EMAIL</div>
                        <div className="div-table-cell">DATE INVESTED</div>
                        <div className="div-table-cell">AMOUNT</div>
                    </div>

                    {loading ? (
                        <div className="div-table-empty">Loading investors...</div>
                    ) : investors.length === 0 ? (
                        <div className="div-table-empty">No investors found for this offering.</div>
                    ) : (
                        investors.map((inv, index) => (
                            <div className="div-table-row" key={index} style={{gridTemplateColumns: '1.5fr 2fr 1.5fr 1.5fr'}}>
                                <div className="div-table-cell font-bold">
                                    {inv.first_name} {inv.last_name}
                                </div>
                                <div className="div-table-cell">{inv.email}</div>
                                <div className="div-table-cell">{formatDate(inv.transaction_date)}</div>
                                <div className="div-table-cell" style={{color:'#16a34a', fontWeight:'600'}}>
                                    {formatMoney(inv.amount)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfferingInvestors;