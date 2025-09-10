// SignUp.jsx
import "../css/signUp.css";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignUp({ showSignUp, setShowSignUp }) {
   const { user, token, login } = useContext(AuthContext);
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);

  if (!showSignUp) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Send signup request to backend
      const response = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.fullName,
          phoneNumber: formData.phone,
          codeOfConductSigned:false,
          gender:"",
          instrumentalSkills:[],
          role:"member",
          voicePart:""
        }),
      });

      const data = await response.json();

      if (response.ok) {
          // Optional: log in user automatically after signup
          const loginResponse = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok) {
            // Store user info and token in context + localStorage
            login(loginData.user, loginData.token);
          }

          alert("Account created successfully!");
          setShowSignUp(false);
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
            
          });
          navigate("/onboarding")
          console.log("Sign up successful");

      } else {
        alert("Sign up failed: " + data.error);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
    
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal signup-modal">
          <IoMdClose 
            className="close-icon" 
            onClick={() => setShowSignUp(false)} 
          />

          <div className="modal-header">
            <h2>Create Account</h2>
            <p className="welcome-text">Join Chemet-Smes today</p>
          </div>

          <form onSubmit={handleSignUp}>
            <label>Full Name</label>
            <div className={`input-icon ${errors.fullName ? 'error' : ''}`}>
           
              <input 
                type="text" 
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={errors.fullName ? 'error' : ''}
              />
            </div>
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}

            <label>Email Address</label>
            <div className={`input-icon ${errors.email ? 'error' : ''}`}>
              <FaEnvelope />
              <input 
                type="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}

            <label>Phone Number <span className="optional">(Optional)</span></label>
            <div className="input-icon">
          
              <input 
                type="tel" 
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <label>Password</label>
            <div className={`input-icon ${errors.password ? 'error' : ''}`}>
              <FaLock />
              <input 
                type="password" 
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}

            <label>Confirm Password</label>
            <div className={`input-icon ${errors.confirmPassword ? 'error' : ''}`}>
              <FaLock />
              <input 
                type="password" 
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

  

            <button 
              type="submit" 
              className="signup-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <p className="signin-text">
            Already have an account? <a href="#" onClick={handleSwitchToLogin}>Sign in</a>
          </p>
        </div>
      </div>

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
    </>


    
  );
}

export default SignUp;