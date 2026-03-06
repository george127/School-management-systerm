// app/components/ProgramApplyingFor.jsx
"use client";

import { useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation"; // Changed from useNavigate

function ProgramApplyingFor({ handleShowNext }) { // Added handleShowNext prop
  // Removed Redux, using local state for loading
  const [loading, setLoading] = useState(false);

  const [formData, setLocalFormData] = useState({
    programName: "",
    courseDetails: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter(); // Changed from useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Program validation
    if (!formData.programName) {
      newErrors.programName = "Please select a program.";
      isValid = false;
    }

    // Course details validation
    if (!formData.courseDetails) {
      newErrors.courseDetails = "Please provide details about your choice.";
      isValid = false;
    } else if (formData.courseDetails.trim().length < 10) {
      newErrors.courseDetails = "Please provide at least 10 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to save data to localStorage (optional - for persistence)
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('programApplyingFor', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSub = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Set loading to true
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/program-applying-for', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit form');
        }

        // Success case
        setSuccessMessage("Form submitted successfully!");
        setSubmitError("");
        setShowNextButton(true);
        setFormSubmitted(true);
        
        // Optional: Save to localStorage
        saveToLocalStorage(formData);
        
      } catch (error) {
        console.error("Error Response from Backend:", error);
        setSubmitError(
          error.message || "An error occurred during form submission."
        );
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    } else {
      setSubmitError("Please correct the errors above.");
    }
  };

  const handleNextClick = () => {
    // Call the parent component's handleShowNext function
    if (handleShowNext) {
      handleShowNext();
    } else {
      // Fallback to router if no prop provided
      router.push("/Background");
    }
  };

  // Optional: Load saved data from localStorage on component mount
  useState(() => {
    try {
      const savedData = localStorage.getItem('programApplyingFor');
      if (savedData) {
        setLocalFormData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  return (
    <div className="layout">
      <Container className="form-container">
        <div className="icons-container">
          <div className="icons">
            <p>Personal Details</p>
            <span
              className="material-symbols-outlined"
              style={{ color: "green" }}
            >
              task_alt
            </span>
          </div>
          <div className="icons">
            <p>Program Applying For</p>
            <span
              className="material-symbols-outlined"
              style={{ color: formSubmitted ? "green" : "black" }}
            >
              {formSubmitted ? "task_alt" : "lock"}
            </span>
          </div>
          <div className="icons">
            <p>Educational Background</p>
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div className="icons">
            <p>Guardian Details</p>
            <span className="material-symbols-outlined">lock</span>
          </div>
        </div>

        <h3>Program Applying For</h3>

        {/* Show success or error message */}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <Form onSubmit={handleSub}>
          <Form.Group controlId="formProgram" className="form-group">
            <Form.Label>Select Program</Form.Label>
            <Form.Control
              as="select"
              name="programName"
              onChange={handleChange}
              isInvalid={!!errors.programName}
              value={formData.programName}
              disabled={loading} // Disable while submitting
            >
              <option value="">Choose a program</option>
              <option value="software-engineering">Software Engineering</option>
              <option value="cloud-computing">Cloud Computing</option>
              <option value="cyber-security">Cyber Security</option>
              <option value="data-analytics">Data Analytics</option>
              <option value="ai-machine-learning">AI & Machine Learning</option>
              <option value="devops">DevOps</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.programName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formCourseDetails" className="form-group">
            <Form.Label>Why do you want to join this program?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="courseDetails"
              placeholder="Tell us briefly why you chose this program"
              onChange={handleChange}
              isInvalid={!!errors.courseDetails}
              value={formData.courseDetails}
              disabled={loading} // Disable while submitting
            />
            <Form.Control.Feedback type="invalid">
              {errors.courseDetails}
            </Form.Control.Feedback>
            {formData.courseDetails && (
              <Form.Text className="text-muted">
                {formData.courseDetails.length} characters (minimum 10)
              </Form.Text>
            )}
          </Form.Group>
          
          <div className="btn-container">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
              <span className="material-symbols-outlined">east</span>
            </button>
            
            {showNextButton && (
              <button onClick={handleNextClick} className="btn" disabled={loading}>
                Next
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        </Form>
      </Container>
      
      {/* Conditional loading spinner */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default ProgramApplyingFor;