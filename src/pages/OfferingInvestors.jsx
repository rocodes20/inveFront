import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvestors } from '../services/api';
import '../assets/OfferingInvestors.css';

const OfferingInvestors = () => {
    const { offeringId } = useParams();
    const navigate = useNavigate();
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!offeringId) return;
        loadInvestments();
    }, [offeringId]);

    const loadInvestments = async () => {
        setLoading(true);
        try {
            const data = await fetchInvestors(offeringId);

            if (data && Array.isArray(data.result)) {
                const aggregated = aggregateShares(data.result);
                setInvestments(aggregated);
            } else {
                setInvestments([]);
            }
        } catch (error) {
            console.error('Error loading investments:', error);
            setInvestments([]);
        } finally {
            setLoading(false);
        }
    };

    const aggregateShares = (rows) => {
        const map = new Map();

        rows.forEach(inv => {
            const key = inv.email;

            if (!map.has(key)) {
                map.set(key, {
                    first_name: inv.first_name,
                    last_name: inv.last_name,
                    email: inv.email,
                    transaction_date: inv.transaction_date,
                    totalShares: Number(inv.amount)
                });
            } else {
                map.get(key).totalShares += Number(inv.amount);
            }
        });

        return Array.from(map.values());
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="investors-page">
            <div className="investors-card">

                <div className="investors-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h3>Investment History</h3>
                </div>

                <div className="investors-table">
                    <div className="investors-table-header">
                        <div>INVESTOR NAME</div>
                        <div>EMAIL</div>
                        <div>LAST TRANSACTION</div>
                        <div>TOTAL SHARES</div>
                        <div>VIEW ALL TRANSACTIONS</div>
                    </div>

                    {loading ? (
                        <div className="investors-empty">Loading investments...</div>
                    ) : investments.length === 0 ? (
                        <div className="investors-empty">
                            No investments found for this offering.
                        </div>
                    ) : (
                        investments.map((inv, index) => (
                            <div className="investors-table-row" key={index}>
                                <div className="cell cell-bold">
                                    {inv.first_name} {inv.last_name}
                                </div>

                                <div className="cell">
                                    {inv.email}
                                </div>

                                <div className="cell">
                                    {formatDate(inv.transaction_date)}
                                </div>

                                <div className="cell amount">
                                    {inv.totalShares}
                                </div>

                                <div className="cell">
                                    <button
                                        className="view-btn"
                                        onClick={() => {}}
                                    >
                                        View
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

export default OfferingInvestors;
