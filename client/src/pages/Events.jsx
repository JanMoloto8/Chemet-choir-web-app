import React, { useState, useContext,useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";

import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Trash2
} from 'lucide-react';
import Nav from '../components/Nav';

import '../css/Events.css';

const EventsCalendar = () => {
    const { user, token, logout } = useContext(AuthContext);
    console.log(user.role)  
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'rehearsal',
    description: ''
  });

  const eventTypes = {
    rehearsal: { class: 'event-type-rehearsal', label: 'Rehearsal' },
    performance: { class: 'event-type-performance', label: 'Performance' },
    workshop: { class: 'event-type-workshop', label: 'Workshop' },
    meeting: { class: 'event-type-meeting', label: 'Meeting' },
    audition: { class: 'event-type-audition', label: 'Audition' }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (year, month, day) => {
    const dateKey = formatDateKey(year, month, day);
    return events.filter(event => event.date === dateKey);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

const handleAddEvent = async () => {
  if (newEvent.title && newEvent.date && newEvent.time) {
    try {
      const res = await fetch("http://localhost:5000/api/events/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        throw new Error("Failed to add event");
      }

      const savedEvent = await res.json();

      // Merge new event into state (in case you want instant UI update)
      setEvents((prev) => [...prev, savedEvent]);

      // Reset form
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "rehearsal",
        description: "",
      });
      setShowAddEvent(false);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  }
};

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events/list");
      const data = await res.json();

      const newEvents = data.events.map(event => {
        // Convert Firestore timestamp to JS Date object
        const eventDate = event.eventDateTime && event.eventDateTime._seconds
          ? new Date(event.eventDateTime._seconds * 1000)
          : null;

        // Format date as YYYY-MM-DD and time as HH:mm
        const formattedDate = eventDate
          ? eventDate.toISOString().split('T')[0]
          : '';

        const formattedTime = eventDate
          ? eventDate.toTimeString().slice(0, 5)
          : '';

        return {
          id: event.id,
          title: event.title || '',
          date: formattedDate,
          time: formattedTime,
          location: event.location || '',
          type: event.type || '',
          description: event.description || ''
        };
      });

      setEvents(newEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);
    return(
    <>
    <Nav/>
    <div className="calendar-root">
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <div className="calendar-header-left">
            <div className="calendar-icon-wrapper">
              <Calendar className="calendar-icon" />
            </div>
            <div>
              <h1 className="calendar-title">Events Calendar</h1>
              <p className="calendar-subtitle">Manage choir events and rehearsals</p>
            </div>
          </div>
          {user.role === 'admin' && (
            <button onClick={() => setShowAddEvent(true)} className="add-event-button">
              <Plus className="plus-icon" />
              Add Event
            </button>
          )}
        </div>

        {/* Continue with Calendar Grid, Sidebar, and Modal... */}
        <div className="calendar-main">
                {/* Calendar */}
                <div className="calendar-box">
                    <div className="calendar-box-header">
                    <button onClick={() => navigateMonth(-1)} className="calendar-nav-btn">
                        <ChevronLeft className="calendar-nav-icon" />
                    </button>
                    <h2 className="calendar-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={() => navigateMonth(1)} className="calendar-nav-btn">
                        <ChevronRight className="calendar-nav-icon" />
                    </button>
                    </div>

                    <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                    </div>

                    <div className="calendar-days">
                    {days.map((day, index) => {
                        const isToday =
                        today.getDate() === day &&
                        today.getMonth() === currentDate.getMonth() &&
                        today.getFullYear() === currentDate.getFullYear();

                        const dayEvents = day !== null
                        ? getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                        : [];

                        return (
                        <div
                            key={index}
                            className={`calendar-day ${isToday ? 'today' : ''}`}
                            onClick={() =>
                            day && setSelectedDate({
                                year: currentDate.getFullYear(),
                                month: currentDate.getMonth(),
                                day
                            })
                            }
                        >
                            {day && <div className="calendar-day-number">{day}</div>}
                            <div className="calendar-day-events">
                            {dayEvents.slice(0, 2).map(event => (
                                <div
                                key={event.id}
                                className={`calendar-day-event ${eventTypes[event.type]?.class || ''}`}
                                >
                                {event.title}
                                </div>
                            ))}
                            {dayEvents.length > 2 && (
                                <div className="calendar-more-events">+{dayEvents.length - 2} more</div>
                            )}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="calendar-sidebar">
                    {/* Upcoming Events */}
                    <div className="sidebar-box">
                    <h3 className="sidebar-title">Events</h3>
                    {events.slice(0, 5).map(event => (
                        <div key={event.id} className="sidebar-event">
                        <div className="sidebar-event-content">
                            <h4 className="sidebar-event-title">{event.title}</h4>
                            <div className="sidebar-event-meta">
                            <Clock className="sidebar-icon" />
                            {event.date} at {event.time}
                            </div>
                            {event.location && (
                            <div className="sidebar-event-meta">
                                <MapPin className="sidebar-icon" />
                                {event.location}
                            </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="delete-button"
                        >
                            <Trash2 className="sidebar-icon" />
                        </button>
                        </div>
                    ))}
                    </div>

                    {/* Event Types Legend */}
                    <div className="sidebar-box">
                    <h3 className="sidebar-title">Event Types</h3>
                    {Object.entries(eventTypes).map(([type, config]) => (
                        <div key={type} className="legend-item">
                        <span className={`legend-dot ${config.class}`}></span>
                        <span className="legend-label">{config.label}</span>
                        </div>
                    ))}
                    </div>
                </div>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Add New Event</h3>

              <div className="modal-form">
                <label className="modal-label">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="modal-input"
                  placeholder="Enter event title"
                />

                <div className="modal-row">
                  <div>
                    <label className="modal-label">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="modal-input"
                    />
                  </div>
                  <div>
                    <label className="modal-label">Time</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="modal-input"
                    />
                  </div>
                </div>

                <label className="modal-label">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="modal-input"
                  placeholder="Event location"
                />

                <label className="modal-label">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="modal-input"
                >
                  {Object.entries(eventTypes).map(([type, config]) => (
                    <option key={type} value={type}>{config.label}</option>
                  ))}
                </select>

                <label className="modal-label">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="modal-input"
                  placeholder="Event description (optional)"
                  rows={3}
                />
              </div>

              <div className="modal-buttons">
                <button onClick={() => setShowAddEvent(false)} className="modal-btn cancel">
                  Cancel
                </button>
                <button onClick={handleAddEvent} className="modal-btn add">
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </>

    )

};

export default EventsCalendar