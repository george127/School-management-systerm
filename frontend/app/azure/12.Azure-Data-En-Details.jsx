import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cloud/Azure/4.azure-data-engineer-associate.png";
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

  const handleScrollToSection = (sectionId, offset = 0) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const scrollToPosition = sectionPosition + offset;
      window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
  };
  
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://acg-7euk.onrender.com/api/details/Info",
        formData
      );
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
        {/* Pop-up Modal */}
        {showPopup && (
          <div className="details-pop">
            <div className="popup">
              <div className="popup-content">
                <span className="material-symbols-outlined check">check</span>
                <h2>Congratulations!</h2>
                <p>Your Details has been successful submitted. thank you!</p>
                <div className="btn-container">
                  <button
                    className="btn"
                    onClick={() => {
                      setShowPopup(false);
                    }}
                  >
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
                <span className="material-symbols-outlined error">
                  notification_important
                </span>{" "}
                <h2>Sorry!</h2>
                <p>Email already registered</p>
                <div className="btn-container">
                  <button
                    className="btn"
                    onClick={() => {
                      setErrorMessage(false);
                    }}
                  >
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
            <NavLink to="/Software">Software</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <span>Data Engineering on Microsoft Azure</span>
        </div>
        <div className="details-page container">
          <div className="details-items">
            {/* == First Item == */}
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="Data Engineering on Microsoft Azure" />
              </div>

              <div className="concept-container">
                {/* Buttons */}
                <div className="button-group">
                  <p
                    onClick={() => setActiveContent(1)}
                    className={`btn ${activeContent === 1 ? "active" : ""}`}
                  >
                    Course Details
                  </p>
                  <p
                    onClick={() => setActiveContent(2)}
                    className={`btn ${activeContent === 2 ? "active" : ""}`}
                  >
                    Course Info
                  </p>
                  <p
                    onClick={() => setActiveContent(3)}
                    className={`btn ${activeContent === 3 ? "active" : ""}`}
                  >
                    Job Role
                  </p>
                </div>

                {/* Content Section */}
                <div className="content-wrapper">
                  <div
                    className={`content ${activeContent === 1 ? "show" : ""}`}
                  >
                    <div className="concept-data">
                      <div className="data-item">
                        📌 1: Introduction to Azure Data Engineering
                      </div>
                      <div className="data-item">
                        📌 2: Azure Data Storage Solutions
                      </div>
                      <div className="data-item">
                        📌 3: Azure Data Factory and Data Pipelines
                      </div>
                      <div className="data-item">
                        📌 4: Azure Databricks for Big Data Processing
                      </div>
                      <div className="data-item">
                        📌 5: Azure Synapse Analytics
                      </div>
                      <div className="data-item">
                        📌 6: Data Security and Compliance in Azure
                      </div>
                      <div className="data-item">
                        📌 7: Monitoring and Optimizing Data Solutions
                      </div>
                      <div className="data-item">
                        📌 8: Capstone Project and Certification Preparation
                      </div>
                    </div>
                  </div>
                  <div
                    className={`content ${activeContent === 2 ? "show" : ""}`}
                  >
                    <div className="course-data">
                      <div className="course-detail">
                        <p>
                          <strong>
                            <i className="fas fa-info-circle"></i> Course
                            Description:
                          </strong>{" "}
                          This comprehensive course prepares you for a career in
                          cloud-based data engineering using Microsoft Azure. You&apos;ll
                          learn to design and implement data storage, data
                          processing, and data security solutions using Azure
                          services like Azure Data Factory, Azure Databricks,
                          Azure Synapse Analytics, and more.
                        </p>

                        <p>
                          <strong>
                            <i className="fas fa-user-graduate"></i> Course
                            Prerequisites:
                          </strong>{" "}
                          Basic understanding of databases and data processing
                          concepts. Familiarity with cloud concepts is helpful but
                          not required.
                        </p>
                      </div>

                      <h4>Learning Objectives:</h4>
                      <ul>
                        <li>
                          Design and implement data storage solutions on Azure
                        </li>
                        <li>
                          Create and manage data pipelines using Azure Data Factory
                        </li>
                        <li>
                          Process big data using Azure Databricks
                        </li>
                        <li>
                          Implement data security, compliance, and privacy
                          protections
                        </li>
                        <li>
                          Monitor and optimize data storage and processing
                        </li>
                        <li>
                          Prepare for Microsoft&apos;s DP-203 certification exam
                        </li>
                      </ul>

                      <h4>Course Structure:</h4>
                      <p>
                        This 8-module course combines theoretical knowledge with
                        hands-on labs using real Azure services:
                      </p>
                      <ul>
                        <li>Module 1: Azure Data Engineering Fundamentals</li>
                        <li>Module 2: Azure Data Storage Solutions</li>
                        <li>Module 3: Data Integration with Azure Data Factory</li>
                        <li>Module 4: Big Data Processing with Azure Databricks</li>
                        <li>Module 5: Data Warehousing with Azure Synapse</li>
                        <li>Module 6: Data Security and Compliance</li>
                        <li>Module 7: Monitoring and Optimization</li>
                        <li>Module 8: Capstone Project</li>
                      </ul>

                      <h4>Course Delivery:</h4>
                      <p>
                        Instructor-led training with hands-on labs in live Azure
                        environment. Includes access to Azure resources for
                        practical exercises.
                      </p>

                      <h4>Certification:</h4>
                      <p>
                        Course prepares you for Microsoft Certified: Azure Data
                        Engineer Associate (DP-203) exam. Includes one free exam
                        attempt voucher.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`content ${activeContent === 3 ? "show" : ""}`}
                  >
                    <div className="Roles-container">
                      <h3>Job Roles After Course Completion:</h3>
                      <p>
                        Graduates of this course will be prepared for these
                        in-demand roles:
                      </p>
                      <ul>
                        <li>
                          <strong>Azure Data Engineer:</strong> Design and
                          implement data solutions using Azure data services.
                        </li>
                        <li>
                          <strong>Cloud Data Architect:</strong> Plan and optimize
                          cloud-based data infrastructure.
                        </li>
                        <li>
                          <strong>Big Data Engineer:</strong> Process and analyze
                          large datasets using Azure Databricks and Synapse.
                        </li>
                        <li>
                          <strong>Data Integration Specialist:</strong> Build and
                          maintain ETL/ELT pipelines with Azure Data Factory.
                        </li>
                        <li>
                          <strong>BI Developer:</strong> Create analytics solutions
                          using Azure data services.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* == Second Item */}
            <div className="item">
              <div className="text">
                <h1>Data Engineering on Microsoft Azure</h1>
                <p>
                  Master the skills to design and implement data solutions on
                  Microsoft Azure. This comprehensive course covers all aspects
                  of Azure data engineering including storage, processing,
                  security, and analytics. You&apos;ll gain hands-on experience with
                  Azure Data Factory, Azure Databricks, Azure Synapse Analytics,
                  and other key services while preparing for the DP-203
                  certification exam.
                </p>
              </div>

              <div className="text">
                <h4>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                  Certification
                </h4>
                <p>
                  This course prepares you for the Microsoft Certified: Azure
                  Data Engineer Associate certification (DP-203). The
                  certification validates your ability to integrate, transform,
                  and consolidate data from various structured and unstructured
                  data systems into structures suitable for building analytics
                  solutions.
                </p>
              </div>
              <div className="text">
                <h4>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                  Duration
                </h4>
                <p>
                  The course is 12 weeks long, with 60 hours of instructor-led
                  training and 80+ hours of hands-on labs and projects.
                </p>
              </div>
              <div className="text">
                <h4>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                  Benefits
                </h4>
                <p>
                  Benefits of completing this Azure Data Engineering course:
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Hands-on experience with real Azure services
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Preparation for DP-203 certification exam
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Skills for high-demand cloud data engineering roles
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Access to Azure resources for practical learning
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Career guidance and job placement assistance
                    </li>
                  </ul>
                </p>
              </div>
              <div className="text">
                <h4>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                  Technologies Covered
                </h4>
                <p>
                  Azure Data Factory, Azure Databricks, Azure Synapse Analytics,
                  Azure Storage (Blob, Data Lake), Azure SQL Database, Cosmos DB,
                  Azure Stream Analytics, Azure Purview, and other Azure data
                  services.
                </p>
              </div>
            </div>
            {/* == Third Item */}
            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 7,500</div>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Mode of Training */}
                <div className="Radios">
                  <h4>Mode Of Training</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="modeOfTraining"
                      value="Physical Classroom Training"
                      checked={
                        formData.modeOfTraining ===
                        "Physical Classroom Training"
                      }
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Physical Classroom Training
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="modeOfTraining"
                      value="Synchronised Teaching Using Zoom / Ms Teams"
                      checked={
                        formData.modeOfTraining ===
                        "Synchronised Teaching Using Zoom / Ms Teams"
                      }
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Zoom / MS Teams</label>
                  </div>
                </div>

                {/* Course Date */}
                <div className="input-group">
                  <label htmlFor="courseDate">Course Date</label>
                  <select
                    id="courseDate"
                    name="courseDate"
                    required
                    value={formData.courseDate}
                    onChange={handleChange}
                  >
                    <option value="">Select Course Date</option>
                    <option value="January 10">January 10</option>
                    <option value="February 10">February 10</option>
                    <option value="March 10">March 10</option>
                    <option value="April 10">April 10</option>
                    <option value="May 10">May 10</option>
                  </select>
                </div>

                {/* Course Time */}
                <div className="input-group">
                  <label htmlFor="courseTime">Course Time</label>
                  <select
                    id="courseTime"
                    name="courseTime"
                    required
                    value={formData.courseTime}
                    onChange={handleChange}
                  >
                    <option value="">Select Course Time</option>
                    <option value="Morning 8:00 AM - 11:00 AM">
                      Morning (8:00 AM - 11:00 AM)
                    </option>
                    <option value="Afternoon 1:00 PM - 4:00 PM">
                      Afternoon (1:00 PM - 4:00 PM)
                    </option>
                    <option value="Evening 5:00 PM - 8:00 PM">
                      Evening (5:00 PM - 8:00 PM)
                    </option>
                  </select>
                </div>

                {/* No. of Participants */}
                <div className="input-group">
                  <label htmlFor="participants">No. Participants</label>
                  <select
                    id="participants"
                    name="participants"
                    required
                    value={formData.participants}
                    onChange={handleChange}
                  >
                    <option value="">Select Number of Participants</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} Participant{num > 0 && "s"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sponsorship */}
                <div className="Radios">
                  <h4>Sponsorship</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sponsorship"
                      value="Self-Sponsored"
                      checked={formData.sponsorship === "Self-Sponsored"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Self-Sponsored</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sponsorship"
                      value="Employer-Sponsored"
                      checked={formData.sponsorship === "Employer-Sponsored"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Employer-Sponsored
                    </label>
                  </div>
                </div>

                {/* Official Name for Certification */}
                <div className="input-group">
                  <label htmlFor="certificationName">
                    Official Name for Certifications
                  </label>
                  <textarea
                    name="certificationName"
                    placeholder="Name"
                    required
                    value={formData.certificationName}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label htmlFor="email">Enter Your Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="btn-container">
                  <button type="submit" className="btn">
                    Submit Your Interest
                    <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </form>
              <div className="course-info">
                <h4>Course Information</h4>
                <p>
                  The course fee is Ghc 7,500. You will be required to pay Ghc
                  2,500 for the first installment and Ghc 2,500 for each
                  additional month.
                </p>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-schedule">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Course duration:</b> 3 months, with classes held 3 days a
                    week (Monday to Wednesday). Students will work on projects
                    and labs from Thursday to Sunday.
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-language">
                      language
                    </span>
                  </div>
                  <p>
                    <b>Course language:</b> English
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-info">
                      info
                    </span>
                  </div>
                  <p>
                    <b>Additional Notes:</b> Students will receive access to
                    Azure resources for hands-on labs. Basic understanding of
                    databases is recommended.
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-calendar">
                      calendar_today
                    </span>
                  </div>
                  <p>
                    <b>Class Days:</b> Monday to Wednesday (9 hours/week)
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-time">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Class Time:</b> 8:00 AM - 11:00 AM (Morning Batch) or
                    1:00 PM - 4:00 PM (Afternoon Batch)
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-location">
                      location_on
                    </span>
                  </div>
                  <p>
                    <b>Location:</b> Accra, Mallam-Gbawe
                  </p>
                </div>
              </div>

              <div className="course-info">
                <h4>Course Cancellation/Reschedule Policy</h4>
                <p>
                  Once payment is made, it is <strong>non-refundable</strong>.
                  Students are expected to carefully review the course details
                  before making a payment.
                </p>
                <p>
                  In the event of unforeseen circumstances, we reserve the right
                  to reschedule the course. However, the course will still be
                  conducted at a later date, and enrolled students will be
                  notified in advance.
                </p>
                <p>A minimum of 5 students is required to start a class.</p>
              </div>
            </div>
          </div>
          <button
            className="back-to-top"
            onClick={() => handleScrollToSection("content")}
          >
            ↑ <br />
            Top
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Details;