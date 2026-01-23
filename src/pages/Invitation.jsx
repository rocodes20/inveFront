import React, { useState, useEffect } from 'react';
import { fetchContacts, bulkCreateContacts } from '../services/api';
import '../assets/invitation.css';

const InvitationPage = () => {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [activeTab, setActiveTab] = useState('manual');

    
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', nickName: '', email: '',
        phoneNumber: '', dob: '', address: '', investmentCapacity: '',
        hearAboutUs: '',
        accredited: false,
        emailSubNewsletter: false,
        emailSubInvestments: false,
        verified: false,            // Default: Not Verified
        contactType: ''   
    });

    const [csvFile, setCsvFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadContactData();
    }, []);

    const loadContactData = async () => {
        setLoading(true);
        try {
            const data = await fetchContacts();
            console.log(data)
            if (data && data.success && Array.isArray(data.result)) {
                setContacts(data.result);
                setCurrentPage(1);
            } else if (Array.isArray(data)) {
                setContacts(data);
            } else {
                setContacts([]);
            }
        } catch (error) {
            console.error("Error loading contacts:", error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(contacts.length / itemsPerPage);

    const paginateNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const paginatePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) { alert("Fill all required fields"); isValid = false; }

        else if (!/\S+@\S+\.\S+/.test(formData.email)) { alert("Invalid email"); newErrors.email = "Invalid email"; isValid = false; }

        if (formData.investmentCapacity && isNaN(formData.investmentCapacity)) {
            newErrors.investmentCapacity = "Capacity must be a number"; isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // 2. UPDATED PAYLOAD: Map the new fields for the backend
        const dataItem = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            nickName: formData.nickName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            dob: formData.dob,
            address: formData.address,
            investmentCapacity: formData.investmentCapacity,
            hearAboutUs: formData.hearAboutUs,
            accredited: formData.accredited ? 1 : 0,
            emailSubNewsletter: formData.emailSubNewsletter ? 1 : 0,
            emailSubInvestments: formData.emailSubInvestments ? 1 : 0,

            
            verified: formData.verified ? 1 : 0,
            contactType: formData.contactType
        };

        await submitPayload([dataItem]);
    };

    // --- CSV Handling ---
    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleBulkSubmit = async () => {
        if (!csvFile) {
            alert("Please select a file first.");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const items = csvToJSON(text);
            if (items.length === 0) {
                alert("CSV is empty or invalid.");
                return;
            }
            await submitPayload(items);
        };
        reader.readAsText(csvFile);
    };

    const formatDateForMySQL = (dateString) => {
        if (!dateString) return null;
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parts[0].padStart(2, '0');
                const day = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
            }
        }
        return dateString;
    };

    const csvToJSON = (csv) => {
        const lines = csv.split("\n");
        const result = [];
        const headers = lines[0].split(",").map(h => h.trim().replace(/[\r\n]+/g, ''));

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const obj = {};
            const currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
                let header = headers[j];
                let value = currentline[j] ? currentline[j].trim().replace(/[\r\n]+/g, '') : "";
                if (header === "dob") value = formatDateForMySQL(value);
                if (["accredited", "emailSubNewsletter", "emailSubInvestments", "verified"].includes(header)) {
                    value = (value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "yes") ? 1 : 0;
                }
                obj[header] = value;
            }
            result.push(obj);
        }
        return result;
    };

    const submitPayload = async (payload) => {
        const result = await bulkCreateContacts(payload);
        if (result && (result.success || result.message?.includes("Processed"))) {
            alert("Contacts Added Successfully!");
            // Reset form (including new defaults)
            setFormData({
                firstName: '', lastName: '', nickName: '', email: '',
                phoneNumber: '', dob: '', address: '', investmentCapacity: '',
                hearAboutUs: '', accredited: false, emailSubNewsletter: false,
                emailSubInvestments: false, verified: false, contactType: ''
            });
            setCsvFile(null);
            setErrors({});
            loadContactData();
            setShowAddForm(false);
        } else {
            alert("Error: " + (result.message || "Unknown error"));
        }
    };

    const downloadSampleCSV = () => {
        const headers = [
            "firstName", "lastName", "email", "phoneNumber", "nickName", "dob",
            "address", "investmentCapacity", "hearAboutUs", "accredited",
            "emailSubNewsletter", "emailSubInvestments", "contactType", "verified"
        ];
        const sampleRow = [
            "John", "Doe", "john@example.com", "1234567890", "Johnny", "1/1/1990",
            "New York", "50000", "LinkedIn", "1", "1", "0", "Individual", "1"
        ];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + sampleRow.join(",");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_contacts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="invitation-page-container">
            {/* Left Column: Directory Table */}
           <div className={`invitation-card invitation-directory-section ${!showAddForm ? 'invitation-full-width' : ''}`}>
                <div className="invitation-card-header">
                    <h3 className="invitation-card-title">Contact Directory</h3>
                    {!showAddForm && (
                        <button className="invitation-btn invitation-btn-primary" onClick={() => setShowAddForm(true)}>
                            Add Contact
                        </button>
                    )}
                </div>

                <div className="invitation-table">
                    {/* Header Row - Updated Columns */}
                    <div className="invitation-table-header">
                        <div className="invitation-table-cell">NAME</div>
                        <div className="invitation-table-cell">EMAIL</div>
                        <div className="invitation-table-cell">TYPE</div>
                        <div className="invitation-table-cell">VERIFIED</div>
                    </div>

                    {loading ? (
                        <div className="invitation-table-empty">Loading data...</div>
                    ) : contacts.length === 0 ? (
                        <div className="invitation-table-empty">No contacts found.</div>
                    ) : (
                        currentContacts.map((contact, index) => (
                            <div className="invitation-table-row" key={index}>
                                <div className="invitation-table-cell invitation-col-name">
                                    {contact.firstName} {contact.lastName}
                                </div>
                                <div className="invitation-table-cell">{contact.email}</div>
                                <div className="invitation-table-cell">{contact.contactType }</div>
                                <div className="invitation-table-cell">
                                    {contact.verified ? (
                                        <span className="invitation-status-badge invitation-status-yes">Yes</span>
                                    ) : (
                                        <span className="invitation-status-badge invitation-status-no">No</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Footer */}
                {contacts.length > 0 && (
                    <div className="invitation-pagination-container">
                        <span style={{ fontSize: '0.85rem', color: '#8898aa' }}>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, contacts.length)} of {contacts.length} entries
                        </span>
                        <div className="invitation-pagination-controls">

                            {currentPage > 1 && (
                                <button className="invitation-page-btn" onClick={paginatePrev}>
                                    &lt; Prev
                                </button>
                            )}

                            <span style={{ fontSize: '0.85rem', color: '#8898aa' }}>
                                Page {currentPage}
                            </span>


                            {currentPage < totalPages && (
                                <button className="invitation-page-btn" onClick={paginateNext}>
                                    Next &gt;
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Add Contact Form */}
            {showAddForm && (
                <div className="invitation-card invitation-form-section">
                    <div className="invitation-card-header">
                        <h5 className="invitation-card-title">Add New Contact</h5>
                        <button className="invitation-btn invitation-btn-close" onClick={() => setShowAddForm(false)}>×</button>
                    </div>

                    <div className="invitation-form-body">
                        <div className="invitation-tabs">
                            <button className={`invitation-tab-btn ${activeTab === 'manual' ? 'invitation-active' : ''}`} onClick={() => setActiveTab('manual')}>Manual Entry</button>
                            <button className={`invitation-tab-btn ${activeTab === 'bulk' ? 'invitation-active' : ''}`} onClick={() => setActiveTab('bulk')}>Bulk CSV Upload</button>
                        </div>

                        {activeTab === 'manual' && (
                            <form onSubmit={handleManualSubmit} noValidate>
                                <div className="invitation-form-grid">
                                    {/* Standard Fields */}
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">First Name *</label>
                                        <input type="text" id="firstName" className={`invitation-form-input ${errors.firstName ? 'invitation-input-error' : ''}`} value={formData.firstName} onChange={handleInputChange} />
                                        {errors.firstName && <div className="invitation-error-text">{errors.firstName}</div>}
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Last Name *</label>
                                        <input type="text" id="lastName" className={`invitation-form-input ${errors.lastName ? 'invitation-input-error' : ''}`} value={formData.lastName} onChange={handleInputChange} />
                                        {errors.lastName && <div className="invitation-error-text">{errors.lastName}</div>}
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Email *</label>
                                        <input type="email" id="email" className={`invitation-form-input ${errors.email ? 'invitation-input-error' : ''}`} value={formData.email} onChange={handleInputChange} />
                                        {errors.email && <div className="invitation-error-text">{errors.email}</div>}
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Phone</label>
                                        <input type="tel" id="phoneNumber" className="invitation-form-input" value={formData.phoneNumber} onChange={handleInputChange} />
                                    </div>

                                    {/* Contact Type Dropdown */}
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Contact Type</label>
                                        <select
                                            id="contactType"
                                            className="invitation-form-input"
                                            value={formData.contactType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Individual">Individual</option>
                                            <option value="Entity">Entity</option>
                                        </select>
                                    </div>

                                    {/* Verified Checkbox */}
                                    <div className="invitation-form-group" style={{ justifyContent: 'flex-end' }}>
                                        <div className="invitation-checkbox-group">
                                            <input
                                                type="checkbox"
                                                id="verified"
                                                checked={formData.verified}
                                                onChange={handleInputChange}
                                            />
                                            <label className="invitation-form-label" style={{ margin: 0, cursor: 'pointer' }} htmlFor="verified">
                                                Verified Contact?
                                            </label>
                                        </div>
                                    </div>
                                    {/* NEW INPUTS END */}

                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Nickname</label>
                                        <input type="text" id="nickName" className="invitation-form-input" value={formData.nickName} onChange={handleInputChange} />
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Date of Birth</label>
                                        <input type="date" id="dob" className="invitation-form-input" value={formData.dob} onChange={handleInputChange} />
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Residency</label>
                                        <input type="text" id="address" className="invitation-form-input" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">Capacity</label>
                                        <input type="number" id="investmentCapacity" className="invitation-form-input" value={formData.investmentCapacity} onChange={handleInputChange} />
                                    </div>
                                    <div className="invitation-form-group">
                                        <label className="invitation-form-label">How did you hear about us?</label>
                                        <input type="text" id="hearAboutUs" className="invitation-form-input" value={formData.hearAboutUs} onChange={handleInputChange} />
                                    </div>
                                    <div className="invitation-form-group" style={{ justifyContent: 'flex-end' }}>
                                        <div className="invitation-checkbox-group">
                                            <input type="checkbox" id="accredited" checked={formData.accredited} onChange={handleInputChange} />
                                            <label className="invitation-form-label" style={{ margin: 0, cursor: 'pointer' }} htmlFor="accredited">Is Accredited Investor?</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="invitation-section-divider"></div>
                                <h6 className="invitation-form-label" style={{ color: '#8898aa' }}>Email Subscriptions</h6>
                                <div className="invitation-subscription-grid">
                                    <div className="invitation-checkbox-group">
                                        <input type="checkbox" id="emailSubNewsletter" checked={formData.emailSubNewsletter} onChange={handleInputChange} />
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }} htmlFor="emailSubNewsletter">Newsletter/Updates</label>
                                    </div>
                                    <div className="invitation-checkbox-group">
                                        <input type="checkbox" id="emailSubInvestments" checked={formData.emailSubInvestments} onChange={handleInputChange} />
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }} htmlFor="emailSubInvestments">Investment Announcements</label>
                                    </div>
                                </div>

                                <div className="invitation-form-actions">
                                    <button type="button" className="invitation-btn invitation-btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                                    <button type="submit" className="invitation-btn invitation-btn-primary">Save Contact</button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'bulk' && (
                            <div className="invitation-bulk-upload-area">
                                <h6 style={{ fontSize: '1rem', margin: '0 0 10px 0' }}>Upload CSV File</h6>
                                <button type="button" onClick={downloadSampleCSV} className="invitation-btn invitation-btn-secondary" style={{ marginBottom: '20px' }}>Download Sample CSV</button>
                                <input type="file" className="invitation-form-input" style={{ marginBottom: '20px' }} accept=".csv" onChange={handleFileChange} />
                                <button type="button" className="invitation-btn invitation-btn-primary" onClick={handleBulkSubmit}  style={{ width: '100%' }}>Upload Contacts</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvitationPage;