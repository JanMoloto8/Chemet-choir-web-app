import "../css/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {auth} from "../firebase"; // Import the auth object from firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";



function Login({ showLogin, setShowLogin,myEmail, myPassword, setMyEmail, setMyPassword }) {
  if (!showLogin) return null;


  const handleLogin = async (e) => {
 
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, myEmail, myPassword);
            alert("Login successful!");
            setShowLogin(false); // Close the login modal on successful login
            setMyEmail("");
            setMyPassword("");
            console.log("User signed in successfully");
        } catch (error) {
          console.error("Error signing in:", error.code, error.message);
          alert('Login failed');
          setMyEmail("");
          setMyPassword("");

        }
    };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <IoMdClose className="close-icon" onClick={() => setShowLogin(false)} />

        <div className="modal-header">
          <h2>Welcome Back</h2>
        <p className="welcome-text">Sign in to your Chemet-Smes account</p>
        </div>

        <label>Email Address</label>
        <div className="input-icon">
          <FaEnvelope />
          <input type="email" placeholder="Enter your email" value={myEmail} onChange={(e) => setMyEmail(e.target.value)} />
        </div>

        <label>Password</label>
        <div className="input-icon">
          <FaLock />
          <input type="password" placeholder="Enter your password" value={myPassword} onChange={(e) => setMyPassword(e.target.value)} />
        </div>

        <div className="options">
          <label><input type="checkbox" /> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button className="signin-btn" onClick={handleLogin} >Sign In</button>

        <p className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
