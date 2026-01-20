import { useEffect, useState } from "react";
import { fetchOfferings } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import "../assets/ViewOffering.css"; 

function ViewOffering() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await fetchOfferings();
        setOffers(data.result?.offers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  function applyOffer(offer) {
    navigate("/invest", {
      state: {
        offeringId: offer.offering_id,          
        offeringClassId: offer.offering_class_id,
        offerName: offer.offer_name,
        pricePerUnit: offer.price_per_unit,
        minimumInvestment: offer.minimum_investment,
        entityName: offer.entity_name,
        subscriptionType: offer.subscription_type
      }
    });
  }

  if (loading) return <p className="loading-text">Loading offerings...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="offerings-container">
      <h2 className="offerings-title">Available Offerings</h2>

      {offers.length === 0 && <p className="empty-text">No offerings available</p>}

      <div className="offerings-grid">
        {offers.map((offer) => (
          <div key={offer.offering_class_id} className="offering-card">
            
            {/* Header Section */}
            <h3>{offer.offer_name}</h3>
            <div className="card-meta">Entity: {offer.entity_name}</div>
            <div className="card-meta">Type: {offer.subscription_type}</div>
            
            {/* Divider */}
            <hr className="card-divider" />

            {/* Details Section */}
            <div className="card-row">
              <span className="card-label">Size</span>
              <span className="card-value">₹{offer.offering_size}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Min Investment</span>
              <span className="card-value">₹{offer.minimum_investment}</span>
            </div>
            <div className="card-row">
              <span className="card-label">Price / Unit</span>
              <span className="card-value">₹{offer.price_per_unit}</span>
            </div>

            

            {/* Action Button */}
            <button 
              className="apply-btn"
              onClick={() => applyOffer(offer)}
            >
              Apply Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewOffering;