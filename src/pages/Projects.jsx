import React, { useState, useEffect } from 'react';
import { fetchProjects, createProject } from '../services/api';
import '../assets/projects.css';

const Projects = ({ onAddOffering }) => { // <--- Destructure prop here
    const [projects, setProjects] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: ''
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchProjects();
            if (data && data.result) {
                setProjects(data.result);
            }
        } catch (error) {
            console.error("Error loading projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.projectName) return alert("Project Name is required");

        const result = await createProject(formData);
        if (result && result.success) {
            alert("Project Created!");
            setFormData({ projectName: '', projectDescription: '' });
            setShowCreateForm(false);
            loadProjects(); 
        } else {
            alert("Error creating project");
        }
    };

    return (
        <div className="page-container">
            {/* LEFT COLUMN: Project List */}
            <div className="card project-list-section">
                <div className="card-header">
                    <h3 className="card-title">My Projects</h3>
                    {!showCreateForm && (
                        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
                             New Project
                        </button>
                    )}
                </div>

                <div className="project-grid-list">
                    {loading ? (
                        <div className="empty-state">Loading...</div>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">No projects found.</div>
                    ) : (
                        projects.map((proj) => (
                            <div key={proj.project_id} className="project-item-card compact">
                                <h4 className="proj-name">{proj.project_name}</h4>
                                <p className="proj-desc">{proj.project_description || "No description provided."}</p>
                                
                                {/* Button Container */}
                                <div className="card-action-footer">
                                    <button 
                                        className="add-offering-btn"
                                        onClick={() => onAddOffering(proj.project_name)}
                                    >
                                         Add Offering
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Create Form */}
            {showCreateForm && (
                <div className="card form-section slide-in">
                    <div className="card-header">
                        <h5 className="card-title">New Project</h5>
                        <button className="btn-close" onClick={() => setShowCreateForm(false)}>×</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-group">
                            <label htmlFor="projectName">Name *</label>
                            <input type="text" id="projectName" className="form-input" value={formData.projectName} onChange={handleInputChange} placeholder="Enter project name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="projectDescription">Description</label>
                            <textarea id="projectDescription" className="form-input" rows="4" value={formData.projectDescription} onChange={handleInputChange} placeholder="Enter description..." />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Projects;