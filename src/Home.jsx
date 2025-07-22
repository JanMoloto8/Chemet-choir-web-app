import { useState } from 'react';
import './Home.css'
import Login from './components/login';

function Home(){
    const [showLogin,setShowlogin] = useState(false);
    const [showSignup,setShowsignup] = useState(false);

    return(
            <section className="hero">
      <video autoPlay loop muted playsInline className="back-video">
        <source src="/mine.mp4" type="video/mp4" />
      </video>
        <nav>
            <ul>
                <li><a href="">HOME</a></li>
                <li><a href="">VIDEOS</a></li>
                <li><a href="">MEMORIES</a></li>
                <li><a href="">CONTACT US</a></li>
                <li></li>
            </ul>
            <div className="auth-buttons">
                <button className="login" onClick={()=>setShowlogin(true)}>Login</button>
                <button className="signup" onClick={()=>setShowsignup(true)}>signUp</button>
            </div>
        </nav>
        <section className="content">
            <h1>Chemet-Smes</h1>
            <a href="#">More</a>
        </section>
        {<Login setShowLogin={setShowlogin} showLogin={showLogin} />}
    </section>
    );
}


export default Home