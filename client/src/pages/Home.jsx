import { useState } from 'react';
import '../css/Home.css'
import logo from '../assets/logo.png';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

function Home(){
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
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
        <section className="home-page">
            <section className="hero">
                <video autoPlay loop muted playsInline className="back-video">
                    <source src="/videos/mine.mp4" type="video/mp4" />
                </video>
                
                <nav>
                    <img src={logo} className="logo" alt="Logo" />
                    
                    <ul className="desktop-nav">
                        <li><a href="#home">HOME</a></li>
                        <li><a href="#videos">VIDEOS</a></li>
                        <li><a href="#memories">MEMORIES</a></li>
                        <li><a href="#contact">CONTACT US</a></li>
                    </ul>
                    
                    <div className="auth-buttons">
                        <button className="login" onClick={() => {setShowLogin(true); closeMobileMenu();}}>Login</button>
                        <button className="signup" onClick={() => {setShowSignup(true); closeMobileMenu();}}>Sign Up</button>
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
                        <li><a href="#home" onClick={closeMobileMenu}>HOME</a></li>
                        <li><a href="#videos" onClick={closeMobileMenu}>VIDEOS</a></li>
                        <li><a href="#memories" onClick={closeMobileMenu}>MEMORIES</a></li>
                        <li><a href="#contact" onClick={closeMobileMenu}>CONTACT US</a></li>
                    </ul>
                    
                    <div className="auth-buttons mobile-auth">
                        <button className="login" onClick={() => {setShowLogin(true); closeMobileMenu();}}>Login</button>
                        <button className="signup" onClick={() => {setShowSignup(true); closeMobileMenu();}}>Sign Up</button>
                    </div>
                </div>
                
                <section className="content">
                    <h1>Chemet-Smes</h1>
                    <a href="#more">More</a>
                </section>
                
                {showLogin && (
                    <Login 
                        setShowLogin={setShowLogin} 
                        showLogin={showLogin} 
                        myEmail={myEmail} 
                        myPassword={myPassword} 
                        setMyEmail={setMyEmail} 
                        setMyPassword={setMyPassword} 
                    />
                )}

                {showSignup && (
                    <SignUp 
                        showSignUp={showSignup}
                        setShowSignUp={setShowSignup}
                    />
                )}
            </section>
        </section>
    );
}

export default Home;