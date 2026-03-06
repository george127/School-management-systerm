// app/components/EducationalBackground.jsx
"use client";

import { useState } from 'react';
import { Form, Container, Alert, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; // Changed from useNavigate

function EducationalBackground({ handleShowNext }) { // Added handleShowNext prop
  // Removed Redux, using local state for loading
  const [loading, setLoading] = useState(false);
  
  const [formData, setLocalFormData] = useState({
    qualification: '',
    institution: '',
    graduationYear: '',
    studyArea: '',
    certifications: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const router = useRouter(); // Changed from useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.qualification) {
      newErrors.qualification = 'Please enter your highest qualification.';
      isValid = false;
    }
    if (!formData.institution) {
      newErrors.institution = 'Please enter the institution name.';
      isValid = false;
    }
    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Please enter your year of graduation.';
      isValid = false;
    } else if (formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear()) {
      newErrors.graduationYear = 'Please enter a valid year of graduation.';
      isValid = false;
    }
    if (!formData.studyArea) {
      newErrors.studyArea = 'Please enter your area of study.';
      isValid = false;
    }
    if (!formData.certifications) {
      newErrors.certifications = 'Please list any additional courses or certifications.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to save data to localStorage (optional - for persistence)
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('educationalBackground', JSON.stringify(data));
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
        const response = await fetch('/api/educational-background', {
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
      router.push('/guardian'); // Changed from navigate
    }
  };

  return (
   <div className="layout">
     <Container className="form-container">
       <div className="icons-container">
        <div className="icons">
          <p>Personal Details</p>
          <span className="material-symbols-outlined" style={{ color: 'green' }}>
           task_alt
          </span>
        </div>
        <div className="icons">
          <p>Program Applying For</p>
          <span className="material-symbols-outlined" style={{ color: 'green' }}>
           task_alt
          </span>
        </div>
        <div className="icons">
          <p>Educational Background</p>
          <span className="material-symbols-outlined" style={{ color: formSubmitted ? 'green' : 'black' }}>
            {formSubmitted ? 'task_alt' : 'lock'}
          </span>
        </div>
        <div className="icons">
          <p>Guardian Details</p>
          <span className="material-symbols-outlined">
            lock
          </span>
        </div>
      </div>
      <h3>Educational Background</h3>

      {/* Show success or error message */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <Form onSubmit={handleSub}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formQualification" className="form-group">
              <Form.Label>Highest Qualification</Form.Label>
              <Form.Control
                type="text"
                name="qualification"
                placeholder="Enter your highest qualification"
                value={formData.qualification}
                onChange={handleChange}
                isInvalid={!!errors.qualification}
              />
              <Form.Control.Feedback type="invalid">{errors.qualification}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formInstitution" className="form-group">
              <Form.Label>Institution Name</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                placeholder="Enter the institution name"
                value={formData.institution}
                onChange={handleChange}
                isInvalid={!!errors.institution}
              />
              <Form.Control.Feedback type="invalid">{errors.institution}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formGraduationYear" className="form-group">
              <Form.Label>Year of Graduation</Form.Label>
              <Form.Control
                type="number"
                name="graduationYear"
                placeholder="Enter your year of graduation"
                value={formData.graduationYear}
                onChange={handleChange}
                isInvalid={!!errors.graduationYear}
              />
              <Form.Control.Feedback type="invalid">{errors.graduationYear}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formStudyArea" className="form-group">
              <Form.Label>Area of Study</Form.Label>
              <Form.Control
                type="text"
                name="studyArea"
                placeholder="Enter your area of study"
                value={formData.studyArea}
                onChange={handleChange}
                isInvalid={!!errors.studyArea}
              />
              <Form.Control.Feedback type="invalid">{errors.studyArea}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group controlId="formCertifications" className="form-group">
              <Form.Label>Additional Courses or Certifications</Form.Label>
              <Form.Control
                as="textarea"
                name="certifications"
                rows={3}
                placeholder="List any additional courses or certifications"
                value={formData.certifications}
                onChange={handleChange}
                isInvalid={!!errors.certifications}
              />
              <Form.Control.Feedback type="invalid">{errors.certifications}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="btn-container">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
            <span className="material-symbols-outlined">east</span>
          </button>
          {showNextButton && (
              <button onClick={handleNextClick} className="btn">
              Next
              <span className="material-symbols-outlined">east</span>
            </button>
          )}
          </div>
      </Form>
    </Container>
      {/* Conditional loading spinner */}
      {loading && <div className="loading-container"><div className="loading-spinner"></div></div>}
   </div>
  );
}

export default EducationalBackground;