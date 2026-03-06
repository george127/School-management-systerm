// app/components/PersonalDetails.jsx
"use client";

import { useState } from "react";
import { Form, Row, Col, Container, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import "./style/PersonalDetails.css";

function PersonalDetails({ handleShowNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    nationality: "",
    address: "",
    profileImage: "", // Will store the image URL after upload
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Track selected file
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits.";
      isValid = false;
    }
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
      isValid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Gender selection is required.";
      isValid = false;
    }
    if (!formData.nationality?.trim()) {
      newErrors.nationality = "Nationality is required.";
      isValid = false;
    }
    if (!formData.address?.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }
    if (!formData.profileImage && !selectedFile) {
      newErrors.profileImage = "Profile image is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('personalDetails', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Function to upload file to your backend
  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setIsUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl; // Assuming your API returns the image URL
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSub = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setError(null);
      
      try {
        let profileImageUrl = formData.profileImage;

        // Upload file if selected and not already uploaded
        if (selectedFile && !profileImageUrl) {
          profileImageUrl = await uploadFileToServer(selectedFile);
        }

        // Prepare data for submission
        const submissionData = {
          ...formData,
          profileImage: profileImageUrl,
        };

        // Submit to your API
        const response = await fetch('/api/personal-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
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
        setFormData(prev => ({ ...prev, profileImage: profileImageUrl }));
        
        // Save to localStorage
        saveToLocalStorage(submissionData);
        
      } catch (error) {
        console.error("Error:", error);
        setSubmitError(error.message || "An error occurred during form submission.");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitError("Please correct the errors above.");
    }
  };

  const handleNextClick = () => {
    if (handleShowNext) {
      handleShowNext();
    } else {
      router.push("/Program");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setSubmitError("Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSubmitError("File size too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
    setSubmitError("");
    setErrors(prev => ({ ...prev, profileImage: "" }));
    
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profileImage: previewUrl }));
  };

  return (
    <div className="layout">
      <div className="icons-container">
        <div className="icons">
          <p>Personal Details</p>
          <span
            className="material-symbols-outlined"
            style={{ color: formSubmitted ? "green" : "black" }}
          >
            {formSubmitted ? "task_alt" : "lock"}
          </span>
        </div>
        <div className="icons">
          <p>Program Applying For</p>
          <span className="material-symbols-outlined">lock</span>
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
      
      <Container className="form-container">
        <h3>Personal Details</h3>
        
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        
        {/* Show upload status */}
        {isUploading && (
          <Alert variant="info">
            Uploading image... Please wait.
          </Alert>
        )}
        
        <Form onSubmit={handleSub}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFullName" className="form-group">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formBasicEmail" className="form-group">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formAddress" className="form-group">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formPhoneNumber" className="form-group">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDateOfBirth" className="form-group">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  isInvalid={!!errors.dob}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dob}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formGender" className="form-group">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender}
                  disabled={loading || isUploading}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formNationality" className="form-group">
                <Form.Label>Nationality</Form.Label>
                <Form.Control
                  type="text"
                  name="nationality"
                  placeholder="Enter your nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  isInvalid={!!errors.nationality}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nationality}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formProfileImage" className="form-group">
                <Form.Label>Upload Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  isInvalid={!!errors.profileImage}
                  disabled={loading || isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profileImage}
                </Form.Control.Feedback>
                {selectedFile && (
                  <small className="text-success">
                    File selected: {selectedFile.name}
                  </small>
                )}
                {formData.profileImage && selectedFile && (
                  <div className="mt-2">
                    <img 
                      src={formData.profileImage} 
                      alt="Preview" 
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="btn-container">
            <button 
              type="submit" 
              className="btn" 
              disabled={loading || isUploading}
            >
              {loading ? "Submitting..." : isUploading ? "Uploading..." : "Submit"}
              <span className="material-symbols-outlined">east</span>
            </button>
            
            {showNextButton && (
              <button
                onClick={handleNextClick}
                className="btn"
                disabled={loading || isUploading}
              >
                Next
                <span className="material-symbols-outlined">east</span>
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

export default PersonalDetails;