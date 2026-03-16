import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cloud/AWS-Certified-DevOps-Engineer-Professional.png";
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
          <span>AWS DevOps Pro</span>
        </div>

        <div className="details-page container">
          <div className="details-items">
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="AWS Certified DevOps Engineer Professional" />
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
                      <h3>🛠️ AWS Certified DevOps Engineer Professional</h3>
                      <p>This course focuses on DevOps principles and AWS tools for CI/CD and automation:</p>
                      <div className="data-item">📌 1: CI/CD Pipelines with AWS CodePipeline & CodeBuild</div>
                      <div className="data-item">📌 2: Infrastructure as Code with CloudFormation and Terraform</div>
                      <div className="data-item">📌 3: Monitoring and Logging with CloudWatch</div>
                      <div className="data-item">📌 4: Automation using Lambda and Systems Manager</div>
                      <div className="data-item">📌 5: High Availability and Disaster Recovery</div>
                      <div className="data-item">📌 6: Security Automation</div>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 2 ? "show" : ""}`}>
                    <div className="course-data">
                      <h3>🎯 Learning Goals</h3>
                      <ul>
                        <li>✅ Automate infrastructure and deployments</li>
                        <li>✅ Implement monitoring and logging solutions</li>
                        <li>✅ Build resilient and secure pipelines</li>
                        <li>✅ Design and maintain CI/CD environments</li>
                        <li>✅ Troubleshoot and optimize DevOps workflows</li>
                      </ul>

                      <h4>🔥 What You’ll Build:</h4>
                      <ul>
                        <li>🔁 End-to-end CI/CD pipelines with CodeDeploy</li>
                        <li>🧰 IaC templates to automate cloud provisioning</li>
                        <li>📊 Real-time monitoring dashboards with CloudWatch and SNS</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 3 ? "show" : ""}`}>
                    <div className="Roles-container">
                      <h3>💼 Career Opportunities</h3>
                      <ul>
                        <li>🔹 DevOps Engineer</li>
                        <li>🔹 Site Reliability Engineer</li>
                        <li>🔹 Automation Engineer</li>
                        <li>🔹 CI/CD Pipeline Specialist</li>
                      </ul>
                      <p>
                        This certification validates your ability to automate, monitor, and secure cloud-based applications using DevOps practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="text">
                <h1>AWS Certified DevOps Engineer Professional</h1>
                <p>
                  A high-level course that teaches how to build, deploy, and manage distributed applications using AWS DevOps tools and services.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Certification</h4>
                <p>
                  Demonstrates your expertise in implementing DevOps best practices like automation, continuous integration, and delivery in AWS.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Duration</h4>
                <p>
                  13-week program including labs, real-world projects, and pipeline implementation.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Benefits</h4>
                <ul>
                  <li><span className="material-symbols-outlined">done_all</span> Boost your DevOps and automation skills</li>
                  <li><span className="material-symbols-outlined">done_all</span> Master CI/CD, monitoring, and IaC tools</li>
                  <li><span className="material-symbols-outlined">done_all</span> Increase demand in cloud-native roles</li>
                </ul>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Technologies Covered</h4>
                <p>
                  AWS CodePipeline, CodeBuild, CloudFormation, Terraform, CloudWatch, SNS, Systems Manager, Lambda, and more.
                </p>
              </div>
            </div>

            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 6,100</div>
              </div>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="Radios">
                  <h4>Mode Of Training</h4>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="modeOfTraining" value="Physical Classroom Training" checked={formData.modeOfTraining === "Physical Classroom Training"} onChange={handleChange} />
                    <label className="form-check-label">Physical Classroom Training</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="modeOfTraining" value="Online via Zoom/MS Teams" checked={formData.modeOfTraining === "Online via Zoom/MS Teams"} onChange={handleChange} />
                    <label className="form-check-label">Online via Zoom/MS Teams</label>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="courseDate">Course Date</label>
                  <select id="courseDate" name="courseDate" required value={formData.courseDate} onChange={handleChange}>
                    <option value="">Select Course Date</option>
                    <option value="January 15">January 15</option>
                    <option value="February 15">February 15</option>
                    <option value="March 15">March 15</option>
                    <option value="April 15">April 15</option>
                    <option value="May 15">May 15</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="courseTime">Course Time</label>
                  <select id="courseTime" name="courseTime" required value={formData.courseTime} onChange={handleChange}>
                    <option value="">Select Course Time</option>
                    <option value="Morning 8:00 AM - 11:00 AM">Morning (8:00 AM - 11:00 AM)</option>
                    <option value="Afternoon 1:00 PM - 3:00 PM">Afternoon (1:00 PM - 3:00 PM)</option>
                    <option value="Evening 4:00 PM - 7:00 PM">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="participants">No. Participants</label>
                  <select id="participants" name="participants" required value={formData.participants} onChange={handleChange}>
                    <option value="">Select Number of Participants</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>{num + 1} Participant{num > 0 && "s"}</option>
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
                  <label htmlFor="certificationName">Official Name for Certification</label>
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
                <p>Total fee: Ghc 6,100. Pay in 3 installments with a down payment of Ghc 2,100 and monthly payments of Ghc 2,000.</p>
                <p><b>Class Days:</b> Monday to Wednesday</p>
                <p><b>Location:</b> Accra, Mallam-Gbawe or Online</p>
                <p><b>Instructor:</b> Samuel Tech (Certified AWS DevOps Specialist)</p>
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
