import { useState } from 'react';
import '../css/Home.css'
import logo from '../assets/logo.png';
import Login from '../components/login';
import SignUp from '../components/SignUp';

function Home(){
    const [showLogin, setShowlogin] = useState(false);
    const [showSignup, setShowsignup] = useState(false);
    const [myEmail, setMyEmail] = useState("");
    const [myPassword, setMyPassword] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return(
        <section className="hero">
            <video autoPlay loop muted playsInline className="back-video">
                <source src="/mine.mp4" type="video/mp4" />
            </video>
            <nav>
                <img src={logo} className="logo" />
                <ul>
                    <li><a href="">HOME</a></li>
                    <li><a href="">VIDEOS</a></li>
                    <li><a href="">MEMORIES</a></li>
                    <li><a href="">CONTACT US</a></li>
                </ul>
                <div className="auth-buttons">
                        <button className="login" onClick={() => {setShowlogin(true); closeMobileMenu()}}>Login</button>
                        <button className="signup" onClick={() => {setShowsignup(true);closeMobileMenu()}}>Sign Up</button>
                </div>
            </nav>
            
            <div 
                className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={toggleMobileMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <div 
                className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            ></div>
            
            <div className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><a href="" onClick={closeMobileMenu}>HOME</a></li>
                    <li><a href="" onClick={closeMobileMenu}>VIDEOS</a></li>
                    <li><a href="" onClick={closeMobileMenu}>MEMORIES</a></li>
                    <li><a href="" onClick={closeMobileMenu}>CONTACT US</a></li>
                </ul>
            </div>
            
            <section className="content">
                <h1>Chemet-Smes</h1>
                <a href="#">More</a>
            </section>
            
            {showLogin && (
                <Login 
                    setShowLogin={setShowlogin} 
                    showLogin={showLogin} 
                    myEmail={myEmail} 
                    myPassword={myPassword} 
                    setMyEmail={setMyEmail} 
                    setMyPassword={setMyPassword} 
                />
            )}

            {showSignup &&(
                <SignUp 
                showSignUp={showSignup}
                setShowSignUp={setShowsignup}
                />
            )
            }
        </section>
    );
}

export default Home;