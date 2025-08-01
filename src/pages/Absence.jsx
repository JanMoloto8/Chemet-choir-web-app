import React, { useState } from 'react';
import '../css/Absence.css';
import Nav from '../components/Nav';

export default function Absence() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        event: '',
        reason: '',
        file: null
    });
    const [absences, setAbsences] = useState([
        {
            id: 1,
            title: "Family Emergency",
            date: "Dec 15, 2023",
            event: "Christmas Rehearsal",
            status: "approved",
            reason: "Had to attend a family gathering.",
            proof: "hospital.pdf"
        },
        {
            id: 2,
            title: "Work Conference",
            date: "Dec 15, 2023",
            event: "Christmas Rehearsal",
            status: "pending",
            reason: "Had to attend a family gathering.",
            proof: "hospital.pdf"
        },
        {
            id: 3,
            title: "Lab Session",
            date: "Dec 15, 2023",
            event: "Christmas Rehearsal",
            status: "rejected",
            reason: "Had to attend a family gathering.",
            proof: "hospital.pdf"
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            file: file
        }));
    };

    const handleFileUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create new absence entry
        const newAbsence = {
            id: absences.length + 1,
            title: formData.title,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            event: formData.event,
            status: "pending",
            reason: formData.reason,
            proof: formData.file ? formData.file.name : null
        };

        setAbsences(prev => [newAbsence, ...prev]);
        
        // Reset form and close modal
        setFormData({ title: '', event: '', reason: '', file: null });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setFormData({ title: '', event: '', reason: '', file: null });
        setIsModalOpen(false);
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'approved': return 'status-approved';
            case 'pending': return 'status-pending';
            case 'rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    return (
        <>
            <Nav />

            <header className="header">
                <button className="report-btn" onClick={() => setIsModalOpen(true)}>
                    <i className="fas fa-plus"></i>
                    Report
                </button>
            </header>

            <div className="container">
                <section className="page-header">
                    <h1 className="page-title">Absence Report</h1>
                    <p className="page-subtitle">Manage your choir attendance and report absences</p>
                </section>

                <section className="absence-history">
                    <h2 className="section-title">
                        <i className="fas fa-history"></i>
                        Your Absence History
                    </h2>

                    <div className="absence-list">
                        {absences.map((absence) => (
                            <div key={absence.id} className="absence-item">
                                <div className="absence-header">
                                    <div>
                                        <div className="absence-title">{absence.title}</div>
                                        <div className="absence-date">
                                            Reported: {absence.date} Event: {absence.event}
                                        </div>
                                    </div>
                                    <div className={`absence-status ${getStatusClass(absence.status)}`}>
                                        {absence.status.charAt(0).toUpperCase() + absence.status.slice(1)}
                                    </div>
                                </div>
                                <div className="absence-reason">
                                    {absence.reason}
                                </div>
                                {absence.proof && (
                                    <div className="absence-proof">
                                        <i className="fas fa-paperclip"></i>
                                        {absence.proof} attached
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {isModalOpen && (
                <div className="modal-overlay1">
                    <div className="modal1">
                        <div className="modal-header1">
                            <h2 className="modal-title1">Report Absence</h2>
                            <button className="close-btn1" onClick={() => setIsModalOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group1">
                                <label htmlFor="absenceTitle" className="form-label1">
                                    Absence Title <span className="required">*</span>
                                </label>
                                <input 
                                    type="text"
                                    id="absenceTitle"
                                    name="title"
                                    className="form-input1"
                                    placeholder="e.g Medical Appointment, Family Emergency"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group1">
                                <label htmlFor="eventSelect" className="form-label1">
                                    Which event will you miss? <span className="required">*</span>
                                </label>
                                <select 
                                    id="eventSelect" 
                                    name="event"
                                    className="form-input1" 
                                    value={formData.event}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select an event</option>
                                    <option value="Wednesday rehearsal">Wednesday rehearsal</option>
                                    <option value="Friday rehearsal">Friday rehearsal</option>
                                    <option value="Sunday service">Sunday service</option>
                                    <option value="Christmas concert">Christmas concert</option>
                                </select>
                            </div>

                            <div className="form-group1">
                                <label className="form-label1" htmlFor="absenceReason">
                                    Reason for Absence <span className="required">*</span>
                                </label>
                                <textarea 
                                    id="absenceReason" 
                                    name="reason"
                                    className="form-input1 form-textarea" 
                                    placeholder="Please provide a detailed explanation for your absence..."
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group1">
                                <label className="form-label1">
                                    Upload Proof (Optional)
                                </label>
                                <div className="file-upload" onClick={handleFileUploadClick}>
                                    <div className="file-upload-icon">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <div className="file-upload-text">Click to upload or drag and drop</div>
                                    <div className="file-upload-subtext">Medical certificates, official documents, etc. (PDF, JPG, PNG)</div>
                                </div>
                                <input 
                                    type="file" 
                                    id="fileInput" 
                                    className="file-input" 
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                {formData.file && (
                                    <div className="uploaded-file">
                                        <i className="fas fa-paperclip"></i>
                                        <span className="file-name">{formData.file.name}</span>
                                        <button 
                                            type="button" 
                                            className="remove-file"
                                            onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-paper-plane"></i>
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}