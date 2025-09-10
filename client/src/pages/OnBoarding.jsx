import React, { useState , useContext} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Users,
  FileText,
  CheckCircle,
} from 'lucide-react';
import '../css/Onboarding.css';
import ConductorLoading from '../components/ConductorLoading';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Step Components (moved outside to prevent re-creation) ---

function PersonalInfoStep({ formData, handleInputChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <Users className="icon" />
        <h2>Personal Information</h2>
        <p>Tell us more about yourself</p>
      </div>
      <div>
        <label>Full Name *</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label>Date of Birth (Optional)</label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        />
      </div>
      <div className="row">
        <div>
          <label>Gender (Optional)</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label>Pronouns (Optional)</label>
          <input
            type="text"
            value={formData.pronouns}
            onChange={(e) => handleInputChange('pronouns', e.target.value)}
            placeholder="e.g., they/them"
          />
        </div>
      </div>
      <div>
        <label>Phone Number *</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}

function VoiceInfoStep({ formData, handleInputChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <Music className="icon" />
        <h2>Voice & Musical Information</h2>
        <p>Help us place you in the right section</p>
      </div>
      <div>
        <label>Voice Part *</label>
        <div className="grid">
          {['Soprano', 'Alto', 'Tenor', 'Bass'].map((voice) => (
            <button
              key={voice}
              type="button"
              onClick={() => handleInputChange('voicePart', voice)}
              className={formData.voicePart === voice ? 'btn active' : 'btn'}
            >
              {voice}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label>Instrumental Skills (Optional)</label>
        <textarea
          value={formData.instrumentalSkills}
          onChange={(e) => handleInputChange('instrumentalSkills', e.target.value)}
          placeholder="List any instruments you play"
          rows="4"
        />
        <p className="note">
          This helps us know if you can assist with accompaniment occasionally
        </p>
      </div>
    </div>
  );
}

function MembershipStep({ formData, handleInputChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <Users className="icon" />
        <h2>Membership Role</h2>
        <p>Choose your role in the choir</p>
      </div>
      <div>
        <label>Choir Section Role *</label>
        <div className="column">
          {['Head of voice', 'Secretary', 'Regular member', 'Marketer', 'Treasurer'].map(
            (role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleInputChange('role', role)}
                className={formData.role === role ? 'btn active' : 'btn'}
              >
                {role}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function CodeOfConductStep({ formData, handleInputChange }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <FileText className="icon" />
        <h2>Code of Conduct</h2>
        <p>Please read and agree to our choir guidelines</p>
      </div>
      <div className="conduct-box">
        <h3>Choir Code of Conduct</h3>
        <ul>
          <li>
            <strong>1. Respect and Inclusivity:</strong> Treat everyone with respect and
            kindness.
          </li>
          <li>
            <strong>2. Attendance:</strong> Regular attendance is essential.
          </li>
          <li>
            <strong>3. Practice:</strong> Be prepared and practice at home.
          </li>
          <li>
            <strong>4. Communication:</strong> Notify your section leader of absences.
          </li>
          <li>
            <strong>5. Performance Standards:</strong> Dress and behave appropriately.
          </li>
          <li>
            <strong>6. Collaboration:</strong> Offer support and constructive feedback.
          </li>
          <li>
            <strong>7. Equipment:</strong> Respect all equipment and facilities.
          </li>
          <li>
            <strong>8. Confidentiality:</strong> Respect fellow members' privacy.
          </li>
        </ul>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="codeOfConduct"
          checked={formData.codeOfConductSigned}
          onChange={(e) => handleInputChange('codeOfConductSigned', e.target.checked)}
        />
        <label htmlFor="codeOfConduct">
          I have read and agree to the Choir Code of Conduct *
        </label>
      </div>
    </div>
  );
}

// --- Main Onboarding Component ---

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    pronouns: '',
    phoneNumber: '',
    voicePart: '',
    instrumentalSkills: '',
    role: '',
    codeOfConductSigned: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, token, login } = useContext(AuthContext);

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmit = async () => {
  if (!user || !user.uid) {
    alert("You must be logged in to complete onboarding.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("https://chemet-server-eububufcehb4bjav.southafricanorth-01.azurewebsites.net/api/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // If you want to secure it later, you can add:
        // "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        uid: user.uid,  // comes from AuthContext
        updates: {
          username: formData.fullName,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          pronouns: formData.pronouns || null,
          phoneNumber: formData.phoneNumber,
          voicePart: formData.voicePart,
          instrumentalSkills: formData.instrumentalSkills || "",
          role: formData.role,
          codeOfConductSigned: formData.codeOfConductSigned,
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Onboarding complete:", data);
      alert("Welcome to the choir! 🎶 Your profile has been updated. You can now log in");
      // You can redirect to dashboard here if needed
      // navigate("/dashboard");
    } else {
      console.error("Update failed:", data.error);
      alert("Failed to complete onboarding: " + data.error);
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    alert("Something went wrong while submitting your details.");
  } finally {
    setIsLoading(false);
    navigate("/")
  }
};

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim() !== '' && formData.phoneNumber.trim() !== '';
      case 2:
        return formData.voicePart !== '';
      case 3:
        return formData.role !== '';
      case 4:
        return formData.codeOfConductSigned;
      default:
        return false;
    }
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="step-item">
          <div className={`step-circle ${step <= currentStep ? 'active' : ''}`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`step-line ${step < currentStep ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isLoading ? (
        <ConductorLoading />
      ) : (
        <div className="onboarding-container">
          <div className="form-wrapper">
            <div className="form-header">
              <h1>Welcome to Our Choir!</h1>
              <p>
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <div className="form-body">
              <StepIndicator />
              {currentStep === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
              {currentStep === 2 && (
                <VoiceInfoStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
              {currentStep === 3 && (
                <MembershipStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
              {currentStep === 4 && (
                <CodeOfConductStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}
              <div className="navigation-buttons">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="nav-btn"
                >
                  <ChevronLeft className="nav-icon" />
                  Previous
                </button>
                {currentStep < totalSteps ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`nav-btn ${!isStepValid() ? 'disabled' : 'primary'}`}
                  >
                    Next
                    <ChevronRight className="nav-icon" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className={`nav-btn ${!isStepValid() ? 'disabled' : 'success'}`}
                  >
                    <CheckCircle className="nav-icon" />
                    Complete Registration
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Onboarding;
