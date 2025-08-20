import "../css/Nav.css"
import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Nav(){
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    const toggleNav = () => {
        setIsOpen(!isOpen);
    };


    return(
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
                    <li>
                        <a href="#" onClick={() => {setIsOpen(false); navigate('/Main')}}>
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => {setIsOpen(false);navigate('/absence')}}>
                            <i className="fas fa-file-alt"></i>
                            <span>Absence report</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => {setIsOpen(false);navigate('/rep')}}>
                            <i className="fas fa-music"></i>
                            <span>Repertoire</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setIsOpen(false)}>
                            <i className="fas fa-user-plus"></i>
                            <span>Attendance</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => {setIsOpen(false);navigate('/events')}}>
                            <i className="fas fa-calendar-alt"></i>
                            <span>Events</span>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Nav