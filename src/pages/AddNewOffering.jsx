import { useState, useEffect } from "react";
import { createOffering } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom"; 
import "../assets/AddNewOffering.css";
import SelectWithInfo from "../common/SelectWithInfo";
import {
    SUBSCRIPTION_OPTIONS,
    STATUS_OPTIONS,
    VISIBILITY_OPTIONS
} from "../common/constants";

function isAnyFieldEmpty(data) {
    return Object.values(data).some(
        (value) => value === "" || value === null || value === undefined
    );
}

function AddNewOffering() {

    const location = useLocation();
    const navigate = useNavigate();

    const projectState = location.state?.projectId || {};
    const { projectId: id, projectName } = projectState;

    const [formData, setFormData] = useState({
        offeringName: "", 
        subscriptionType: "",
        entityName: "",
        startDate: "",
        offeringSize: "",
        minimumInvestment: "",
        pricePerUnit: "",
        status: "",
        visibility: ""
    });

    const minValue = 0;

    // 3. Pre-fill Offering Name if Project Name exists
    useEffect(() => {
        if (projectName) {
            setFormData(prev => ({
                ...prev,
                offeringName: projectName
            }));        
        }
    }, [projectName]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Safety check if accessed without project
        if (!id) {
            alert("No project selected. Please go back to Projects and try again.");
            return;
        }

        if (isAnyFieldEmpty(formData)) {
            alert("Please fill all fields");
            return;
        }

        const requestBody = {
            project_id: id,
            offeringName: formData.offeringName, 
            subscriptionType: formData.subscriptionType,
            entityName: formData.entityName,
            startDate: formData.startDate,
            offeringSize: Number(formData.offeringSize),
            minimumInvestment: Number(formData.minimumInvestment),
            pricePerUnit: Number(formData.pricePerUnit),
            status: formData.status,
            visibility: formData.visibility
        };

        try {
            const result = await createOffering(requestBody);
            console.log("Success:", result);
            alert("Offering Created Successfully!");
            
            // Navigate back to offerings list after success
            navigate('/organization/offerings');
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to create offering.");
        }
    }

    // 4. If accessed directly without ID, show warning or redirect
    if (!id) {
        return (
            <div className="offering-page" style={{textAlign: 'center', padding: '40px'}}>
                <h3>No Project Selected</h3>
                <p>Please select a project from the Projects page first.</p>
                <button 
                    className="primary-btn" 
                    onClick={() => navigate('/organization/projects')}
                >
                    Go to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="offering-page">
            <div className="offering-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="ghost-btn"
                        style={{padding: '5px 10px', fontSize: '18px'}}
                        title="Go Back"
                    >
                        ←
                    </button>
                    <h2>Add New Offering</h2>
                </div>
                
                {/* Optional: Close icon acts as Cancel/Back */}
                <span className="close-icon" onClick={() => navigate('/organization/projects')} style={{cursor: 'pointer'}}>×</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="offering-grid four-column">
                    <div className="field">
                        <label>Offering Name</label>
                        <input
                            name="offeringName"
                            placeholder="Enter Offering Name"
                            value={formData.offeringName} 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <SelectWithInfo
                            label="Subscription Type"
                            value={formData.subscriptionType}
                            options={SUBSCRIPTION_OPTIONS}
                            onChange={(val) =>
                                setFormData({ ...formData, subscriptionType: val })
                            }
                        />
                    </div>

                    <div className="field">
                        <label>Entity Name</label>
                        <input
                            name="entityName"
                            placeholder="Enter Entity Name"
                            value={formData.entityName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="investor-section">
                    <div className="investor-header">
                        <span>Class A</span>
                    </div>

                    <div className="offering-grid five-column">
                        <div className="field">
                            <label>Offering Size</label>
                            <input
                                type="number"
                                name="offeringSize"
                                placeholder="Enter Offering Size"
                                value={formData.offeringSize}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Minimum Investment</label>
                            <input
                                type="number"
                                name="minimumInvestment"
                                min={minValue}
                                placeholder="Enter Minimum Investment"
                                value={formData.minimumInvestment}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label>Price Per Unit</label>
                            <input
                                type="number"
                                name="pricePerUnit"
                                placeholder="Enter Price Per Unit"
                                min={minValue}
                                value={formData.pricePerUnit}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <SelectWithInfo
                                label="Status"
                                value={formData.status}
                                options={STATUS_OPTIONS}
                                onChange={(val) => setFormData({ ...formData, status: val })}
                            />
                        </div>

                        <div className="field">
                            <SelectWithInfo
                                label="Visibility"
                                value={formData.visibility}
                                options={VISIBILITY_OPTIONS}
                                onChange={(val) => setFormData({ ...formData, visibility: val })}
                            />
                        </div>
                    </div>
                </div>

                <div className="offering-footer">
                    <div className="footer-left">
                        <button type="button" className="outline-btn">
                            Add Investor Class
                        </button>
                        <label className="checkbox">
                            <input type="checkbox" />
                            Display class name on investor portal
                        </label>
                    </div>

                    <div className="footer-right">
                        <div className="total-box">
                            <span>Total Offering Size</span>
                            <strong>{formData.offeringSize}</strong>
                        </div>

                        <button type="submit" className="primary-btn">
                            Create Offering
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddNewOffering;