import "../css/Nav.css";
import logo from '../assets/logo.png';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Nav() {
    const { user, token, logout } = useContext(AuthContext);
    const [canSee, setCanSee] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("🔒 Are you sure you want to log out?");
        if (confirmLogout) {
            // Perform logout actions
            console.log("Logging out...");
            localStorage.clear();
            navigate("/");
            setIsOpen(false);
        }
    };

    // Update canSee based on user role and check admin status
    useEffect(() => {
        if (user.role !== 'Regular member') {
            setCanSee(true);
        }
        if (user.role == "admin") {
            setIsAdmin(true);
        }
    }, [user.role]);  

    return (
        <>
            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={toggleNav}>
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Overlay for mobile */}
            {isOpen && <div className="nav-overlay" onClick={toggleNav}></div>}

            <div className={`nav-bar ${isOpen ? 'nav-open' : ''}`}>
                <img className="logo" src={logo} alt="logo" />
                <ul className="nav-items">
                    {/* 🔐 Logout item */}
                    <li>
                        <a href="#" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => { setIsOpen(false); navigate('/Main') }}>
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => { setIsOpen(false); navigate('/absence') }}>
                            <i className="fas fa-file-alt"></i>
                            <span>Absence report</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => { setIsOpen(false); navigate('/rep') }}>
                            <i className="fas fa-music"></i>
                            <span>Repertoire</span>
                        </a>
                    </li>
                    {canSee && <li>
                        <a href="#" onClick={() => { setIsOpen(false); navigate('/attend') }}>
                            <i className="fas fa-user-plus"></i>
                            <span>Attendance</span>
                        </a>
                    </li>}

                    <li>
                        <a href="#" onClick={() => { setIsOpen(false); navigate('/events') }}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>Events</span>
                        </a>
                    </li>

                    {/* Admin only - User Management */}
                    {isAdmin && <li>
                        <a href="" onClick={() => { setIsOpen(false); navigate('/management') }}>
                            <i className="fas fa-users"></i>
                            <span>User Management</span>
                        </a>
                    </li>}
                </ul>
            </div>
        </>
    );
}

export default Nav;