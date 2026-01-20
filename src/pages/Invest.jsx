import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { investOffer } from "../services/api"; 
import "../assets/Invest.css"; 

function Invest() {
  const navigate = useNavigate();
  const { state } = useLocation();

  
  if (!state) {
    return (
      <div className="invest-page-container">
        
          <p>Invalid access. Please select an offer first.</p>
          <button className="btn-back" onClick={() => navigate('/')} style={{marginTop: '20px'}}>Go Home</button>
        
      </div>
    );
  }

  const {
    offeringId,
    offerName,
    pricePerUnit,
    minimumInvestment,
    entityName,
    subscriptionType
  } = state;
  
  const [amount, setAmount] = useState("");
  
  // Calculate units (prevent NaN)
  const units = amount && amount >= 0 
    ? Math.floor(amount / pricePerUnit) 
    : 0;

  async function submitInvestment() {
    if (Number(amount) < minimumInvestment/pricePerUnit) {
      alert(`Minimum quantity to invest is ${amount}`);
      return;
    }

    const payload = {
      contact_id: 3,         // TEMP
      project_id: 1,         // TEMP
      offering_id: offeringId,
      amount: Number(amount)
    };

    try {
      await investOffer(payload);
      alert("Investment successful!");
      navigate("/investor"); 
    } catch (err) {
      console.error(err);
      alert("Investment failed");
    }
  }

  return (
    <div className="invest-page-container">
      <div className="invest-card">
        
        
        <div className="invest-header">
          <h2>Invest in {offerName}</h2>
          <span className="invest-subtitle">Confirm your allocation details below</span>
        </div>

        
          <div className="info-item">
            <span className="info-label">Entity</span>
            <span className="info-value">{entityName || "—"}</span>
          </div>
          <div className="info-item" style={{textAlign: 'right'}}>
            <span className="info-label">Type</span>
            <span className="info-value">{subscriptionType || "—"}</span>
          </div>
        

        
        <div className="stats-grid">
          <div className="stat-row">
            <span className="info-label">Price / Unit</span>
            <span className="info-value">${pricePerUnit}</span>
          </div>
          <div className="stat-row">
            <span className="info-label">Min Investment</span>
            <span className="info-value">${minimumInvestment}</span>
          </div>
        </div>

        
        <div className="input-group">
          <label className="input-label">Investment Quantities </label>
          <div className="currency-input-wrapper">
            <span className="currency-symbol"></span>
            <input
              type="number"
              className="invest-input"
              placeholder={`Min: ${minimumInvestment/pricePerUnit}`}
              min={minimumInvestment/pricePerUnit}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        
        <div className="calc-box">
          <div className="calc-row">
            <span>Units to Receive:</span>
            <strong>{amount}</strong>
          </div>
          <div className="calc-row total">
            <span>Total Value:</span>
            <span>${(amount * pricePerUnit).toLocaleString()}</span>
          </div>
        </div>

        
        <div className="button-group">
          <button className="btn-back" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={submitInvestment}>
            Confirm Investment
          </button>
        </div>

      </div>
    </div>
  );
}

export default Invest;