import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cloud/AWS-Security-Specialty.webp";
import { useState } from "react";
import axios from "axios";
import Footer from "../../footer/Footer";

const Details = () => {
  const [formData, setFormData] = useState({
    modeOfTraining: "Physical Classroom Training",
    courseDate: "",
    courseTime: "",
    participants: "",
    sponsorship: "Self-Sponsored",
    certificationName: "",
    email: "",
  });

  const [activeContent, setActiveContent] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScrollToSection = (sectionId, offset = 0) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
      const scrollToPosition = sectionPosition + offset;
      window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://acg-7euk.onrender.com/api/details/Info", formData);
      console.log(response.data);
      setShowPopup(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(true);
      } else {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <div id="content">
        {showPopup && (
          <div className="details-pop">
            <div className="popup">
              <div className="popup-content">
                <span className="material-symbols-outlined check">check</span>
                <h2>Congratulations!</h2>
                <p>Your Details have been successfully submitted. Thank you!</p>
                <div className="btn-container">
                  <button className="btn" onClick={() => setShowPopup(false)}>
                    Close
                    <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="details-pop">
            <div className="popup">
              <div className="popup-content">
                <span className="material-symbols-outlined error">notification_important</span>
                <h2>Sorry!</h2>
                <p>Email already registered</p>
                <div className="btn-container">
                  <button className="btn" onClick={() => setErrorMessage(false)}>
                    Close
                    <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Header />
        <Navigation />

        <div className="container navigate">
          <div className="items">
            <NavLink to="/">Home</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <div className="items">
            <NavLink to="/Aws">Aws</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <span>AWS Security Specialty</span>
        </div>

        <div className="details-page container">
          <div className="details-items">
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="AWS Certified Security Specialty" />
              </div>
              <div className="concept-container">
                <div className="button-group">
                  <p onClick={() => setActiveContent(1)} className={`btn ${activeContent === 1 ? "active" : ""}`}>
                    Course Details
                  </p>
                  <p onClick={() => setActiveContent(2)} className={`btn ${activeContent === 2 ? "active" : ""}`}>
                    Course Info
                  </p>
                  <p onClick={() => setActiveContent(3)} className={`btn ${activeContent === 3 ? "active" : ""}`}>
                    Job Role
                  </p>
                </div>

                <div className="content-wrapper">
                  <div className={`content ${activeContent === 1 ? "show" : ""}`}>
                    <div className="concept-data">
                      <h3>🔐 AWS Certified Security Specialty</h3>
                      <p>This course provides deep knowledge on securing AWS environments.</p>
                      <div className="data-item">📌 1: Identity and Access Management (IAM)</div>
                      <div className="data-item">📌 2: Data Protection & Encryption</div>
                      <div className="data-item">📌 3: Security Logging & Monitoring</div>
                      <div className="data-item">📌 4: Infrastructure Security</div>
                      <div className="data-item">📌 5: Incident Response & Compliance</div>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 2 ? "show" : ""}`}>
                    <div className="course-data">
                      <h3>🎯 Learning Goals</h3>
                      <ul>
                        <li>✅ Configure secure access controls</li>
                        <li>✅ Implement logging and threat detection</li>
                        <li>✅ Use encryption to protect data at rest and in transit</li>
                        <li>✅ Manage incidents and perform risk assessments</li>
                      </ul>

                      <h4>🔥 What You’ll Build:</h4>
                      <ul>
                        <li>🛡️ Secure AWS account structures using Organizations</li>
                        <li>🔍 Implement GuardDuty, Macie, and CloudTrail</li>
                        <li>💾 Encrypt data with KMS and enforce least privilege with IAM</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 3 ? "show" : ""}`}>
                    <div className="Roles-container">
                      <h3>💼 Career Opportunities</h3>
                      <ul>
                        <li>🔹 Cloud Security Engineer</li>
                        <li>🔹 Security Architect (Cloud)</li>
                        <li>🔹 Compliance Officer (Cloud Systems)</li>
                        <li>🔹 DevSecOps Engineer</li>
                      </ul>
                      <p>
                        Ideal for professionals aiming to ensure secure operations within AWS infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="text">
                <h1>AWS Certified Security Specialty</h1>
                <p>
                  Learn to secure AWS services, implement encryption, monitor cloud systems, and enforce compliance policies.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Certification</h4>
                <p>
                  Proves your ability to secure AWS environments and apply best practices in cloud security.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Duration</h4>
                <p>10 weeks of training including labs and hands-on security exercises</p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Benefits</h4>
                <ul>
                  <li><span className="material-symbols-outlined">done_all</span> Learn cloud security fundamentals</li>
                  <li><span className="material-symbols-outlined">done_all</span> Apply practical encryption and compliance techniques</li>
                  <li><span className="material-symbols-outlined">done_all</span> Prepare for AWS security exams and real-world roles</li>
                </ul>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Technologies Covered</h4>
                <p>
                  AWS IAM, CloudTrail, GuardDuty, Macie, Shield, WAF, KMS, VPC security, compliance tools.
                </p>
              </div>
            </div>

            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 5,850</div>
              </div>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="Radios">
                  <h4>Mode Of Training</h4>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="modeOfTraining" value="Physical Classroom Training" checked={formData.modeOfTraining === "Physical Classroom Training"} onChange={handleChange} />
                    <label className="form-check-label">Physical Classroom Training</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="modeOfTraining" value="Synchronised Teaching Using Zoom / Ms Teams" checked={formData.modeOfTraining === "Synchronised Teaching Using Zoom / Ms Teams"} onChange={handleChange} />
                    <label className="form-check-label">Zoom / MS Teams</label>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="courseDate">Course Date</label>
                  <select id="courseDate" name="courseDate" required value={formData.courseDate} onChange={handleChange}>
                    <option value="">Select Course Date</option>
                    <option value="January 5">January 5</option>
                    <option value="February 5">February 5</option>
                    <option value="March 5">March 5</option>
                    <option value="April 5">April 5</option>
                    <option value="May 5">May 5</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="courseTime">Course Time</label>
                  <select id="courseTime" name="courseTime" required value={formData.courseTime} onChange={handleChange}>
                    <option value="">Select Course Time</option>
                    <option value="Morning 8:00 AM - 11:00 PM">Morning (8:00 AM - 11:00 PM)</option>
                    <option value="Afternoon 1:00 PM - 3:00 PM">Afternoon (1:00 PM - 3:00 PM)</option>
                    <option value="Evening 4:00 PM - 7:00 PM">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="participants">No. Participants</label>
                  <select id="participants" name="participants" required value={formData.participants} onChange={handleChange}>
                    <option value="">Select Number of Participants</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} Participant{num > 0 && "s"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Radios">
                  <h4>Sponsorship</h4>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="sponsorship" value="Self-Sponsored" checked={formData.sponsorship === "Self-Sponsored"} onChange={handleChange} />
                    <label className="form-check-label">Self-Sponsored</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="sponsorship" value="Employer-Sponsored" checked={formData.sponsorship === "Employer-Sponsored"} onChange={handleChange} />
                    <label className="form-check-label">Employer-Sponsored</label>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="certificationName">Official Name for Certifications</label>
                  <textarea name="certificationName" placeholder="Name" required value={formData.certificationName} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Enter Your Email</label>
                  <input type="email" name="email" placeholder="Enter Your Email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="btn-container">
                  <button type="submit" className="btn">
                    Submit Your Interest
                    <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </form>
              <div className="course-info">
                <h4>Course Information</h4>
                <p>Total fee: Ghc 5,850. Includes security labs, group case studies, certification preparation, and career guidance.</p>
                <p><b>Class Days:</b> Monday to Wednesday</p>
                <p><b>Location:</b> Accra, Mallam-Gbawe or Online</p>
                <p><b>Instructor:</b> Nana Yaw (Certified AWS Security Specialist)</p>
              </div>
            </div>
          </div>
          <button className="back-to-top" onClick={() => handleScrollToSection("content")}>↑ <br /> Top</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Details;
