import React, { useEffect, useState, useContext } from 'react';
import '../css/Absence.css';
import Nav from '../components/Nav';
import { AuthContext } from "../context/AuthContext";

export default function Absence() {
    const { user, token, logout } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        event: '',
        reason: '',
        file: null
    });
    const [absences, setAbsences] = useState([]);
    const [updatingStatus, setUpdatingStatus] = useState({});

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

const handleFileDownload = (url) => {
    console.log(url)
    if (!url) {
        console.error("No file URL provided");
        return;
    }

    try {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "proof"); // Suggests a download filename
           link.download = `proof.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed:", error);
    }
};


    const handleSubmit = async (e) => {
        e.preventDefault();

        let proofUrl= "";

        // If there's a sheet music file, upload it to Cloudinary first
        if (formData.file) {
            const form = new FormData();
            form.append('file', formData.file);
            form.append('upload_preset', 'unsigned_preset');  // Your Cloudinary unsigned preset name
            form.append('resource_type', 'raw'); // ✅ this is key!
            try {
                const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/di4nj7zmo/raw/upload`, // ✅ fix here
                {
                    method: 'POST',
                    body: form
                }
                );

                const cloudinaryData = await cloudinaryResponse.json();

                if (cloudinaryResponse.ok) {
                    proofUrl = cloudinaryData.secure_url;
                    console.log(proofUrl)
                } else {
                    alert('Failed to upload sheet music to Cloudinary');
                    return;
                }
            } catch (err) {
                console.error('Cloudinary upload error:', err);
                alert('An error occurred while uploading the sheet music.');
                return;
            }
        }

        const newAbsence = {
            uid: user.uid,
            title: formData.title,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            event: formData.event,
            status: "pending",
            reason: formData.reason,
            proof: formData.file ? proofUrl : null,
            createdBy:user.username
        };

        try {
            const response = await fetch('https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/absences/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAbsence)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Submission failed:', errorData);
                return;
            }

            const result = await response.json();
            console.log('Absence submitted:', result);

            setAbsences(prev => [newAbsence, ...prev]);
            setFormData({ title: '', event: '', reason: '', file: null });
            setIsModalOpen(false);

        } catch (err) {
            console.error('Error submitting absence:', err);
        }
    };

    const handleStatusUpdate = async (absenceId, absenceUid, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [absenceId]: true }));

        try {
            const response = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/absences/update-status", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                id: absenceId,
                uid: absenceUid,     
                newStatus: newStatus  
            })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Status update failed:', errorData);
                return;
            }

            setAbsences(prev => prev.map(absence => absence.id === absenceId || absence._id === absenceId ? { ...absence, status: newStatus } : absence));

            // alert(`Status updated to ${newStatus}`);

        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [absenceId]: false }));
        }
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

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                let url;

                if (user?.role === "admin") {
                    url = "https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/absences/";
                } else {
                    url = `https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/absences/mine?uid=${user.uid}`;
                }
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to fetch absences:', errorData);
                    return;
                }

                const data = await response.json();
                setAbsences(data.absences); 

            } catch (err) {
                console.error('Error fetching absences:', err);
            }
        };

        if (user?.uid) {
            fetchAbsences();
        }
    }, [user]);

    return (
        <>
            <Nav />

            <header className="header">
                {user?.role !== "admin" && (
                    <button className="report-btn" onClick={() => setIsModalOpen(true)}>
                        <i className="fas fa-plus"></i>
                        Report
                    </button>
                )}
            </header>

            <div className="container">
                <section className="page-header">
                    <h1 className="page-title">Absence Report</h1>
                    <p className="page-subtitle">Manage your choir attendance and report absences</p>
                </section>

                <section className="absence-history">
                    <h2 className="section-title">
                        <i className="fas fa-history"></i>
                        {user?.role === "admin" ? "Absence History" : "Your Absence History"}
                    </h2>

                    <div className="absence-list">
                        {absences.map((absence, index) => (
                            <div key={absence.id || absence._id || index} className="absence-item">
                                <div className="absence-header">
                                    <div>
                                        <div className="absence-title">{absence.title}</div>
                                        <div className="absence-date">
                                            Reported: {absence.date} Event: {absence.event}
                                        </div>
                                        {user?.role === "admin" && absence.createdBy && (
                                            <div className="absence-user">
                                                <i className="fas fa-user"></i>
                                                Submitted by: {absence.createdBy || absence.createdBy.name || 'Unknown User'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="status-section">
                                        <div className={`absence-status ${getStatusClass(absence.status)}`}>
                                            {absence.status.charAt(0).toUpperCase() + absence.status.slice(1)}
                                        </div>
                                        {user?.role === "admin" && (
                                            <div className="admin-controls">
                                                <select 
                                                    className="status-select"
                                                    value={absence.status}
                                                    onChange={(e) => handleStatusUpdate(absence.id || absence._id,absence.uid, e.target.value)}
                                                    disabled={updatingStatus[absence.id || absence._id]}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                {updatingStatus[absence.id || absence._id] && (
                                                    <div className="updating-indicator">
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absence-reason">
                                    {absence.reason}
                                </div>
                                {absence.proof && (
                                    <div className="absence-proof" onClick={() => handleFileDownload(absence.proof)}>
                                        <i className="fas fa-paperclip"></i>
                                         Download proof
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

                        <div>
                            <div className="form-group1">
                                <label htmlFor="absenceTitle" className="form-label1">
                                    Absence Title <span className="required">*</span>
                                </label>
                                <select 
                                    id="absenceTitle" 
                                    name="title"
                                    className="form-input1"
                                    placeholder="e.g Medical Appointment, Family Emergency"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Title</option>
                                    
                                    {/* Health-related */}
                                    <option value="Illness/feeling unwell">Illness/feeling unwell</option>
                                    <option value="Medical appointment">Medical appointment</option>
                                    <option value="Doctor's visit">Doctor's visit</option>
                                    <option value="Emergency room visit">Emergency room visit</option>
                                    <option value="Mental health day">Mental health day</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Recovery/rest">Recovery/rest</option>
                                    
                                    {/* Work/School */}
                                    <option value="Work commitment">Work commitment</option>
                                    <option value="Mandatory overtime">Mandatory overtime</option>
                                    <option value="School exam">School exam</option>
                                    <option value="Class conflict">Class conflict</option>
                                    <option value="Business trip">Business trip</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Training session">Training session</option>
                                    <option value="Job interview">Job interview</option>
                                    
                                    {/* Family */}
                                    <option value="Family emergency">Family emergency</option>
                                    <option value="Childcare issues">Childcare issues</option>
                                    <option value="Family obligation">Family obligation</option>
                                    <option value="Caring for sick family member">Caring for sick family member</option>
                                    <option value="Family event">Family event</option>
                                    <option value="Babysitting">Babysitting</option>
                                    <option value="Parent-teacher conference">Parent-teacher conference</option>
                                    
                                    {/* Personal */}
                                    <option value="Prior commitment">Prior commitment</option>
                                    <option value="Transportation issues">Transportation issues</option>
                                    <option value="Car trouble">Car trouble</option>
                                    <option value="Personal emergency">Personal emergency</option>
                                    <option value="Double-booked">Double-booked</option>
                                    <option value="Moving/relocation">Moving/relocation</option>
                                    <option value="Home repairs">Home repairs</option>
                                    
                                    {/* Travel */}
                                    <option value="Out of town">Out of town</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="Travel delays">Travel delays</option>
                                    <option value="Flight cancellation">Flight cancellation</option>
                                    <option value="Holiday travel">Holiday travel</option>
                                    
                                    {/* Social/Religious/Legal */}
                                    <option value="Religious observance">Religious observance</option>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Funeral">Funeral</option>
                                    <option value="Court appearance">Court appearance</option>
                                    <option value="Legal appointment">Legal appointment</option>
                                    <option value="Volunteer commitment">Volunteer commitment</option>
                                    <option value="Community service">Community service</option>
                                    
                                    {/* Unexpected/Weather */}
                                    <option value="Weather-related">Weather-related</option>
                                    <option value="Power outage">Power outage</option>
                                    <option value="Home emergency">Home emergency</option>
                                    <option value="Pet emergency">Pet emergency</option>
                                    <option value="Last-minute conflict">Last-minute conflict</option>
                                    <option value="Technical difficulties">Technical difficulties</option>
                                    
                                    {/* Other */}
                                    <option value="Financial appointment">Financial appointment</option>
                                    <option value="Therapy appointment">Therapy appointment</option>
                                    <option value="Dental appointment">Dental appointment</option>
                                    <option value="Vehicle maintenance">Vehicle maintenance</option>
                                    <option value="Housing appointment">Housing appointment</option>
                                    <option value="Other">Other</option>
                                </select>
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
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    <i className="fas fa-paper-plane"></i>
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}