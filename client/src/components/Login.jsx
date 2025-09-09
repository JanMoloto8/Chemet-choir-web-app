import "../css/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../context/AuthContext";



function Login({ showLogin, setShowLogin,myEmail, myPassword, setMyEmail, setMyPassword }) {
  if (!showLogin) return null;
  const { login } = useContext(AuthContext);
  const navigate =useNavigate();
  const handleloginClick = ()=>{
    navigate('/Main');
  }
  const handleLogin = async (e) => {
 
        e.preventDefault();
  try {
    const response = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: myEmail, password: myPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      console.log("Token:", data.user);

      login(data.user, data.token);
      setShowLogin(false);
      setMyEmail("");
      setMyPassword("");
      handleloginClick();
    } else {
      alert("Login failed: " + data.error);
    }
  }  catch (error) {
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
