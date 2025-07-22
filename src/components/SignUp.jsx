import "../css/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function Login({ showLogin, setShowLogin }) {
  if (!showLogin) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Login</h2>
          <IoMdClose className="close-icon" onClick={() => setShowLogin(false)} />
        </div>
        <p className="welcome-text">Welcome back.</p>

        <label>Email Address</label>
        <div className="input-icon">
          <FaEnvelope />
          <input type="email" placeholder="Enter your email" />
        </div>

        <label>Password</label>
        <div className="input-icon">
          <FaLock />
          <input type="password" placeholder="Enter your password" />
        </div>

        <div className="options">
          <label><input type="checkbox" /> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button className="signin-btn">Sign In</button>

        <p className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
