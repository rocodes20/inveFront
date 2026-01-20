import { useState } from "react";
import { createOffering } from "../services/api";
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

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isAnyFieldEmpty(formData)) {
            alert("Please fill all fields");
            return;
        }

        const requestBody = {
            
            ...formData,
            offeringSize: Number(formData.offeringSize),
            minimumInvestment: Number(formData.minimumInvestment),
            pricePerUnit: Number(formData.pricePerUnit)
            
        };

        try {
            const result = await createOffering(requestBody);
            console.log("Success:", result);
        } catch (err) {
            console.error("Error:", err);
        }
    }
    return (
        <div className="offering-page">

            <div className="offering-header">
                <h2>Add New Offering</h2>
                <span className="close-icon"></span>
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
                        {/* <span className="edit-icon">✎</span> */}
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
                            <strong>$0</strong>
                        </div>

                        <button type="submit" className="primary-btn">
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddNewOffering;
