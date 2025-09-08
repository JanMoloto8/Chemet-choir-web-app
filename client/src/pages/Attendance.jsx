import React, { useState, useContext, useEffect } from 'react';
import '../css/Attendance.css';
import { Check, Users, Clock, Calendar } from 'lucide-react';
import Nav from '../components/Nav';
import { AuthContext } from "../context/AuthContext";

const Attendance = () => {
  const { user, token, logout } = useContext(AuthContext);
 
  const [people, setPeople] = useState([]);
  const [error, setError] = useState(null);
  const [presentPeople, setPresentPeople] = useState(new Set());
  const [absentPeople, setAbsentPeople] = useState(new Set());
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [currentTime] = useState(new Date().toLocaleTimeString());
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [part, setPart] = useState(user.voicePart);
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const toggleAttendance = (personId) => {
    const newPresentPeople = new Set(presentPeople);
    if (newPresentPeople.has(personId)) {
      newPresentPeople.delete(personId);
    } else {
      newPresentPeople.add(personId);
    }
    setPresentPeople(newPresentPeople);
  };

  const getPresentList = () => {
    if (attendanceExists && attendanceData) {
      return people.filter(person => attendanceData.present.includes(person.name));
    }
    return people.filter(person => presentPeople.has(person.id));
  };

  const getAbsentList = () => {
    if (attendanceExists && attendanceData) {
      return people.filter(person => attendanceData.absent.includes(person.name));
    }
    return people.filter(person => !presentPeople.has(person.id));
  };

// Fetch existing attendance data
  const fetchAttendanceData = async () => {
    try {
      const currentDateStr = getCurrentDateString();
      const response = await fetch(
        `http://localhost:5000/api/presence/register?voicePart=${part}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched attendance data:', data); // Debug log
        
        // Check if we have records
        if (data && data.records && data.records.length > 0) {
          const record = data.records[0]; // Get the first (should be only) record
          
          // Check if the record has attendance data
          if (record && (record.present?.length > 0 || record.absent?.length > 0)) {
            setAttendanceExists(true);
            setAttendanceData({
              present: record.present || [],
              absent: record.absent || [],
              voicePart: record.voicePart,
              createdAt: record.createdAt
            });
          } else {
            setAttendanceExists(false);
            setAttendanceData(null);
          }
        } else {
          // No records found
          setAttendanceExists(false);
          setAttendanceData(null);
        }
      } else if (response.status === 404) {
        // No attendance data found for today
        setAttendanceExists(false);
        setAttendanceData(null);
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setAttendanceExists(false);
      setAttendanceData(null);
    }
  };

  // Fetch users for the voice part
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/presence/users?voicePart=${part}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      const mappedUsers = (data.users || []).map(user => ({
        id: user.uid,
        name: user.username,
        department: part
      }));
    
      setPeople(mappedUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit attendance data
  const submitAttendance = async () => {
    setSubmitting(true);
    try {
      const presentList = people
        .filter(person => presentPeople.has(person.id))
        .map(person => person.name);
      
      const absentList = people
        .filter(person => !presentPeople.has(person.id))
        .map(person => person.name);

      const attendancePayload = {
        voicePart: part,
        present: presentList,
        absent: absentList,
        createdAt: new Date().toISOString(),

      };

      const response = await fetch('http://localhost:5000/api/presence/submit', {
        method: 'POST',
        headers: {
       
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendancePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }

      // Refresh attendance data after successful submission
      await fetchAttendanceData();
      setIsRegisterOpen(false);
      
      // Show success message (you can replace this with a toast notification)
      alert('Attendance submitted successfully!');
    } catch (err) {
      setError('Failed to submit attendance: ' + err.message);
      alert('Failed to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (part) {
      fetchUsers();
    }
  }, [part]);

  useEffect(() => {
    if (part && people.length > 0) {
      fetchAttendanceData();
    }
  }, [part, people]);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="attendance-container">
          <div className="attendance-wrapper">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              ...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="attendance-container">
          <div className="attendance-wrapper">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              Error: {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="attendance-container">
        <div className="attendance-wrapper">
          <div className="attendance-header">
            <div className="attendance-header-left">
              <h1 className="attendance-title">Attendance Register</h1>
              <div className="attendance-date-time">
                <div className="attendance-date">
                  <Calendar className="attendance-icon" />
                  <span>{currentDate}</span>
                </div>
                <div className="attendance-time">
                  <Clock className="attendance-icon" />
                  <span>{currentTime}</span>
                </div>
              </div>
            </div>
            <div className="attendance-header-right">
              <div className="attendance-count">
                {attendanceExists 
                  ? `${getPresentList().length}/${people.length}`
                  : `${presentPeople.size}/${people.length}`
                }
              </div>
              <div className="attendance-status-label">Present</div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            {/* Show action button only if attendance doesn't exist */}
            {!attendanceExists && (
              <button
                onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                className="attendance-action-button"
              >
                {isRegisterOpen ? 'Close Register' : 'Open Register'}
              </button>
            )}
            
            {attendanceExists && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                backgroundColor: '#e8f5e8', 
                border: '1px solid #4caf50', 
                borderRadius: '4px',
                color: '#2e7d32',
                textAlign: 'center'
              }}>
                Attendance taken for today
              </div>
            )}
          </div>

          {/* Show attendance interface if register is open OR if attendance exists */}
          {(isRegisterOpen || attendanceExists) && (
            <div className="attendance-main-content">
              {/* Show attendance list only if taking new attendance */}
              {!attendanceExists && (
                <div className="attendance-list">
                  <h2 className="attendance-section-title">
                    <Users className="attendance-icon" />
                    Mark Attendance
                  </h2>
                  <div className="attendance-people-list">
                    {people.map((person) => {
                      const isPresent = presentPeople.has(person.id);
                      return (
                        <div
                          key={person.id}
                          className={`attendance-person-item ${isPresent ? 'present' : 'absent'}`}
                          onClick={() => toggleAttendance(person.id)}
                        >
                          <div className="attendance-person-info">
                            <div className={`attendance-checkbox ${isPresent ? 'checked' : ''}`}>
                              {isPresent && <Check className="attendance-check-icon" />}
                            </div>
                            <div>
                              <div className="attendance-person-name">{person.name}</div>
                              <div className="attendance-person-department">{person.department}</div>
                            </div>
                          </div>
                          <div className={`attendance-status-badge ${isPresent ? 'badge-present' : 'badge-absent'}`}>
                            {isPresent ? 'Present' : 'Absent'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="attendance-side-panels">
                <div className="attendance-panel attendance-present-panel">
                  <h3 className="attendance-panel-title">Present ({getPresentList().length})</h3>
                  <div className="attendance-panel-list">
                    {getPresentList().length > 0 ? (
                      getPresentList().map((person) => (
                        <div key={person.id} className="attendance-panel-item">
                          <div className="attendance-panel-name">{person.name}</div>
                          <div className="attendance-panel-department">{person.department}</div>
                        </div>
                      ))
                    ) : (
                      <div className="attendance-empty-message">No one marked present yet</div>
                    )}
                  </div>
                </div>

                <div className="attendance-panel attendance-absent-panel">
                  <h3 className="attendance-panel-title">Absent ({getAbsentList().length})</h3>
                  <div className="attendance-panel-list">
                    {getAbsentList().length > 0 ? (
                      getAbsentList().map((person) => (
                        <div key={person.id} className="attendance-panel-item">
                          <div className="attendance-panel-name">{person.name}</div>
                          <div className="attendance-panel-department">{person.department}</div>
                        </div>
                      ))
                    ) : (
                      <div className="attendance-empty-message">Everyone is present!</div>
                    )}
                  </div>
                </div>

                {/* Show quick actions only when taking new attendance */}
                {!attendanceExists && (
                  <div className="attendance-quick-actions">
                    <h3 className="attendance-panel-title">Quick Actions</h3>
                    <button
                      onClick={() => setPresentPeople(new Set(people.map(p => p.id)))}
                      className="attendance-action-button mark-all"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => setPresentPeople(new Set())}
                      className="attendance-action-button clear-all"
                    >
                      Clear All
                    </button>

                    <button
                      onClick={submitAttendance}
                      disabled={submitting}
                      className="attendance-action-button submit-button"
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Attendance;