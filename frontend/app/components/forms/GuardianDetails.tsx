// app/components/GuardianDetails.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Container,
  Alert,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { useRouter } from "next/navigation"; // Changed from useNavigate
import Image from "next/image"; // Next.js optimized image component
import Congratulations from "../../assets/Congratulations.jpg"; 

function GuardianDetails({ handleFormComplete }) { // Added prop for parent communication
  // Removed Redux, using local state for loading
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    guardianFullName: "",
    relationship: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter(); // Changed from useNavigate

  // Handle input changes and reset errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear field errors on input change
    setSubmitError(""); // Clear any submit error
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.guardianFullName?.trim()) {
      newErrors.guardianFullName = "Please enter the guardian's full name.";
      isValid = false;
    }

    if (!formData.relationship?.trim()) {
      newErrors.relationship =
        "Please enter the relationship with the guardian.";
      isValid = false;
    }

    if (!formData.guardianPhone?.trim()) {
      newErrors.guardianPhone = "Please enter the guardian's phone number.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.guardianPhone.replace(/\D/g, ''))) {
      newErrors.guardianPhone = "Please enter a valid 10-digit phone number.";
      isValid = false;
    }

    if (!formData.guardianEmail?.trim()) {
      newErrors.guardianEmail = "Please enter the guardian's email address.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.guardianEmail)) {
      newErrors.guardianEmail = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.guardianOccupation?.trim()) {
      newErrors.guardianOccupation = "Please enter the guardian's occupation.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to save data to localStorage (optional - for persistence)
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('guardianDetails', JSON.stringify(data));
      // Mark all forms as complete
      localStorage.setItem('allFormsCompleted', 'true');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Handle form submission
  const handleSub = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/guardian-details', {
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
        setFormSubmitted(true);
        
        // Optional: Save to localStorage
        saveToLocalStorage(formData);
        
        // Notify parent component that all forms are complete
        if (handleFormComplete) {
          handleFormComplete();
        }
        
        // Show modal after 2 seconds
        setTimeout(() => {
          setShowModal(true);
        }, 2000);
        
      } catch (error) {
        console.error("Error Response from Backend:", error);
        setSubmitError(
          error.message || "An error occurred during form submission."
        );
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitError("Please correct the errors above.");
    }
  };

  // Redirect to fees payment
  const handlePaymentClick = () => {
    setShowModal(false);
    router.push("/fees-payment");
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('guardianDetails');
      if (savedData) {
        setFormData(JSON.parse(savedData));
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
            style={{ color: "green" }}
          >
            task_alt
          </span>
        </div>
        <div className="icons">
          <p>Educational Background</p>
          <span
            className="material-symbols-outlined"
            style={{ color: "green" }}
          >
            task_alt
          </span>
        </div>
        <div className="icons">
          <p>Guardian Details</p>
          <span
            className="material-symbols-outlined"
            style={{ color: formSubmitted ? "green" : "black" }}
          >
            {formSubmitted ? "task_alt" : "lock"}
          </span>
        </div>
      </div>

      <h3>Guardian Details</h3>

      {/* Show success or error message */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <Form onSubmit={handleSub}>
        <Row>
          {/* Guardian Full Name */}
          <Col md={6}>
            <Form.Group controlId="formGuardianFullName" className="form-group">
              <Form.Label>Guardian&apos;s Full Name</Form.Label>
              <Form.Control
                type="text"
                name="guardianFullName"
                placeholder="Enter guardian's full name"
                value={formData.guardianFullName}
                onChange={handleChange}
                isInvalid={!!errors.guardianFullName}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {errors.guardianFullName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Relationship to Student */}
          <Col md={6}>
            <Form.Group controlId="formRelationship" className="form-group">
              <Form.Label>Relationship to Student</Form.Label>
              <Form.Control
                type="text"
                name="relationship"
                placeholder="Enter relationship (e.g. Father, Mother, Uncle)"
                value={formData.relationship}
                onChange={handleChange}
                isInvalid={!!errors.relationship}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {errors.relationship}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Guardian Phone Number */}
          <Col md={6}>
            <Form.Group controlId="formGuardianPhone" className="form-group">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="guardianPhone"
                placeholder="Enter guardian's phone number"
                value={formData.guardianPhone}
                onChange={handleChange}
                isInvalid={!!errors.guardianPhone}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {errors.guardianPhone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Guardian Email Address */}
          <Col md={6}>
            <Form.Group controlId="formGuardianEmail" className="form-group">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="guardianEmail"
                placeholder="Enter guardian's email address"
                value={formData.guardianEmail}
                onChange={handleChange}
                isInvalid={!!errors.guardianEmail}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {errors.guardianEmail}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Guardian Occupation */}
          <Col md={12}>
            <Form.Group controlId="formGuardianOccupation" className="form-group">
              <Form.Label>Occupation</Form.Label>
              <Form.Control
                type="text"
                name="guardianOccupation"
                placeholder="Enter guardian's occupation"
                value={formData.guardianOccupation}
                onChange={handleChange}
                isInvalid={!!errors.guardianOccupation}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {errors.guardianOccupation}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="btn-container">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Form>

      {/* Modal congratulating the user */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <div style={{ position: 'relative', width: '100%', height: '150px' }}>
              <Image 
                src={Congratulations} 
                alt="Congratulations"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>Congratulations!</h4>
          <p>Your form details have been successfully submitted!</p>
          <p>
            Would you like to proceed to make your fees payment, or return to
            the homepage?
          </p>
        </Modal.Body>
        <Modal.Footer className="btn-container justify-content-center">
          <button className="btn btn-primary" onClick={handlePaymentClick}>
            Proceed to Payment
            <span className="material-symbols-outlined ms-2">payment</span>
          </button>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
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

export default GuardianDetails;