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
        emailSubInvestments: false 
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
            if (data && data.success && Array.isArray(data.result)) {
                setContacts(data.result);
                setCurrentPage(1); 
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

        if (!formData.firstName.trim()) { newErrors.firstName = "First name is required"; isValid = false; }
        if (!formData.lastName.trim()) { newErrors.lastName = "Last name is required"; isValid = false; }
        if (!formData.email.trim()) { newErrors.email = "Email is required"; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = "Invalid email"; isValid = false; }
        
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
            emailSubInvestments: formData.emailSubInvestments ? 1 : 0
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
                if (["accredited", "emailSubNewsletter", "emailSubInvestments"].includes(header)) {
                    value = (value === "1" || value.toLowerCase() === "true") ? 1 : 0;
                }
                obj[header] = value;
            }
            result.push(obj);
        }
        return result;
    };

    const submitPayload = async (payload) => {
        const result = await bulkCreateContacts(payload);
        if (result && result.success) {
            alert("Contacts Added Successfully!");
            // Reset form
            setFormData({ 
                firstName: '', lastName: '', nickName: '', email: '', 
                phoneNumber: '', dob: '', address: '', investmentCapacity: '', 
                hearAboutUs: '', accredited: false, emailSubNewsletter: false, emailSubInvestments: false
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
            "emailSubNewsletter", "emailSubInvestments"
        ];
        const sampleRow = [
            "John", "Doe", "john@example.com", "1234567890", "Johnny", "1/1/1990", 
            "New York", "50000", "LinkedIn", "1", "1", "0"
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
        <div className="page-container">
            {/* Left Column: Directory Table */}
            <div className="card directory-section">
                <div className="card-header">
                    <h3 className="card-title">Contact Directory</h3>
                    {!showAddForm && (
                        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                            Add Contact
                        </button>
                    )}
                </div>

                <div className="div-table">
                    {/* Table Header Row */}
                    <div className="div-table-header">
                        <div className="div-table-cell">NAME</div>
                        <div className="div-table-cell">EMAIL</div>
                        <div className="div-table-cell">PHONE</div>
                        <div className="div-table-cell">RESIDENCY</div>
                        <div className="div-table-cell" style={{textAlign: 'right'}}>STATUS</div>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="div-table-empty">Loading data...</div>
                    ) : contacts.length === 0 ? (
                        <div className="div-table-empty">No contacts found.</div>
                    ) : (
                        currentContacts.map((contact, index) => (
                            <div className="div-table-row" key={index}>
                                <div className="div-table-cell col-name">
                                    {contact.firstName} {contact.lastName}
                                </div>
                                <div className="div-table-cell">{contact.email}</div>
                                <div className="div-table-cell">{contact.phoneNumber || '-'}</div>
                                <div className="div-table-cell">{contact.address || '-'}</div>
                                <div className="div-table-cell" style={{textAlign: 'right'}}>
                                    <span className={`status-badge ${contact.isInvested === 'YES' ? 'status-yes' : 'status-no'}`}>
                                        {contact.isInvested}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Footer */}
                {contacts.length > 0 && (
                    <div className="pagination-container">
                        <span style={{fontSize: '0.85rem', color: '#8898aa'}}>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, contacts.length)} of {contacts.length} entries
                        </span>
                        <div className="pagination-controls">
                            <button 
                                className="page-btn" 
                                onClick={paginatePrev} 
                                disabled={currentPage === 1}
                            >
                                &lt; Prev
                            </button>
                            <span style={{fontSize: '0.85rem', color: '#8898aa', display: 'flex', alignItems: 'center'}}>
                                Page {currentPage}
                            </span>
                            <button 
                                className="page-btn" 
                                onClick={paginateNext}
                                disabled={currentPage === totalPages}
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Add Contact Form (Conditional) */}
            {showAddForm && (
                <div className="card form-section">
                    <div className="card-header">
                        <h5 className="card-title">Add New Contact</h5>
                        <button className="btn btn-close" onClick={() => setShowAddForm(false)}>×</button>
                    </div>
                    
                    <div className="form-body">
                        {/* Tabs */}
                        <div className="tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('manual')}
                            >
                                Manual Entry
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('bulk')}
                            >
                                Bulk CSV Upload
                            </button>
                        </div>

                        {/* Manual Form Content */}
                        {activeTab === 'manual' && (
                            <form onSubmit={handleManualSubmit} noValidate>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">First Name *</label>
                                        <input type="text" id="firstName" className={`form-input ${errors.firstName ? 'error' : ''}`} value={formData.firstName} onChange={handleInputChange} />
                                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name *</label>
                                        <input type="text" id="lastName" className={`form-input ${errors.lastName ? 'error' : ''}`} value={formData.lastName} onChange={handleInputChange} />
                                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input type="email" id="email" className={`form-input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={handleInputChange} />
                                        {errors.email && <div className="error-text">{errors.email}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input type="tel" id="phoneNumber" className={`form-input ${errors.phoneNumber ? 'error' : ''}`} value={formData.phoneNumber} onChange={handleInputChange} />
                                        {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nickname</label>
                                        <input type="text" id="nickName" className="form-input" value={formData.nickName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" id="dob" className="form-input" value={formData.dob} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Residency</label>
                                        <input type="text" id="address" className="form-input" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Capacity</label>
                                        <input type="number" id="investmentCapacity" className={`form-input ${errors.investmentCapacity ? 'error' : ''}`} value={formData.investmentCapacity} onChange={handleInputChange} />
                                        {errors.investmentCapacity && <div className="error-text">{errors.investmentCapacity}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">How did you hear about us?</label>
                                        <input type="text" id="hearAboutUs" className="form-input" value={formData.hearAboutUs} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group" style={{justifyContent: 'flex-end'}}>
                                        <div className="checkbox-group">
                                            <input type="checkbox" id="accredited" checked={formData.accredited} onChange={handleInputChange} />
                                            <label className="form-label" style={{margin:0, cursor:'pointer'}} htmlFor="accredited">Is Accredited Investor?</label>
                                        </div>
                                    </div>
                                </div>
                                

                                <div className="section-divider"></div>
                                <h6 className="form-label" style={{color: '#8898aa'}}>Email Subscriptions</h6>
                                
                                <div className="subscription-grid">
                                    <div className="checkbox-group">
                                        <input type="checkbox" id="emailSubNewsletter" checked={formData.emailSubNewsletter} onChange={handleInputChange} />
                                        <label style={{fontSize:'0.9rem', fontWeight:600}} htmlFor="emailSubNewsletter">Newsletter/Updates</label>
                                    </div>
                                    <div className="checkbox-group">
                                        <input type="checkbox" id="emailSubInvestments" checked={formData.emailSubInvestments} onChange={handleInputChange} />
                                        <label style={{fontSize:'0.9rem', fontWeight:600}} htmlFor="emailSubInvestments">Investment Announcements</label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Contact</button>
                                </div>
                            </form>
                        )}

                        {/* Bulk Upload Content */}
                        {activeTab === 'bulk' && (
                            <div className="bulk-upload-area">
                                <h6 style={{fontSize:'1rem', margin:'0 0 10px 0'}}>Upload CSV File</h6>
                                <p className="text-muted">Ensure headers match: firstName, lastName, email...</p>
                                
                                <button type="button" onClick={downloadSampleCSV} className="btn btn-secondary" style={{marginBottom: '20px'}}>
                                    Download Sample CSV
                                </button>

                                <input 
                                    type="file" 
                                    className="form-input" 
                                    style={{marginBottom: '20px'}}
                                    accept=".csv" 
                                    onChange={handleFileChange} 
                                />
                                
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleBulkSubmit}
                                    disabled={!csvFile} 
                                    style={{width: '100%'}}
                                >
                                    Upload Contacts
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvitationPage;