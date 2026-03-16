import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cloud/AWS-Big-Data-Logo.png";
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
                    Close <span className="material-symbols-outlined">east</span>
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
                    Close <span className="material-symbols-outlined">east</span>
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
          <span>AWS Big Data Specialty</span>
        </div>

        <div className="details-page container">
          <div className="details-items">
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="AWS Certified Big Data Specialty" />
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
                      <h3>📊 AWS Certified Big Data Specialty</h3>
                      <p>Master data analytics and big data tools on AWS cloud.</p>
                      <div className="data-item">📌 1: Data Collection & Ingestion</div>
                      <div className="data-item">📌 2: Storage & Lifecycle Policies</div>
                      <div className="data-item">📌 3: AWS Data Analytics Tools (Athena, Redshift, Kinesis)</div>
                      <div className="data-item">📌 4: Machine Learning on AWS</div>
                      <div className="data-item">📌 5: Security and Compliance</div>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 2 ? "show" : ""}`}>
                    <div className="course-data">
                      <h3>🎯 Learning Goals</h3>
                      <ul>
                        <li>✅ Design and manage scalable big data solutions</li>
                        <li>✅ Integrate data pipelines with AWS services</li>
                        <li>✅ Query and visualize large datasets</li>
                        <li>✅ Apply ML models and analyze results</li>
                      </ul>
                      <h4>🔥 What You’ll Build:</h4>
                      <ul>
                        <li>📈 Data lake with S3, Glue, and Athena</li>
                        <li>📡 Real-time analytics using Kinesis and Redshift</li>
                        <li>🤖 ML workflow using SageMaker</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 3 ? "show" : ""}`}>
                    <div className="Roles-container">
                      <h3>💼 Career Opportunities</h3>
                      <ul>
                        <li>🔹 Big Data Engineer</li>
                        <li>🔹 Data Scientist (AWS Ecosystem)</li>
                        <li>🔹 AWS Data Analytics Specialist</li>
                        <li>🔹 Machine Learning Engineer (Cloud)</li>
                      </ul>
                      <p>Prepare for high-demand careers in cloud-powered data solutions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="text">
                <h1>AWS Certified Big Data Specialty</h1>
                <p>
                  Learn how to build secure, scalable data pipelines and analytical platforms using AWS tools and services.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Certification</h4>
                <p>
                  Validates expertise in data analytics, visualization, and machine learning using AWS.
                </p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Duration</h4>
                <p>12 weeks with weekly labs and case-study projects.</p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Benefits</h4>
                <ul>
                  <li><span className="material-symbols-outlined">done_all</span> End-to-end AWS data project skills</li>
                  <li><span className="material-symbols-outlined">done_all</span> Portfolio-ready projects in data analytics</li>
                  <li><span className="material-symbols-outlined">done_all</span> Job-ready certification</li>
                </ul>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Technologies Covered</h4>
                <p>
                  AWS S3, Glue, Athena, Kinesis, Redshift, EMR, SageMaker, QuickSight.
                </p>
              </div>
            </div>

            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 6,200</div>
              </div>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="Radios">
                  <h4>Mode Of Training</h4>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="modeOfTraining"
                      value="Physical Classroom Training"
                      checked={formData.modeOfTraining === "Physical Classroom Training"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Physical Classroom Training</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="modeOfTraining"
                      value="Online Training"
                      checked={formData.modeOfTraining === "Online Training"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Online Training</label>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="courseDate">Course Date</label>
                  <select id="courseDate" name="courseDate" required value={formData.courseDate} onChange={handleChange}>
                    <option value="">Select Course Date</option>
                    <option value="August 10">August 10</option>
                    <option value="September 15">September 15</option>
                    <option value="October 20">October 20</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="courseTime">Course Time</label>
                  <select id="courseTime" name="courseTime" required value={formData.courseTime} onChange={handleChange}>
                    <option value="">Select Course Time</option>
                    <option value="Morning 8:00 AM - 11:00 AM">Morning (8:00 AM - 11:00 AM)</option>
                    <option value="Afternoon 1:00 PM - 4:00 PM">Afternoon (1:00 PM - 4:00 PM)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="participants">No. Participants</label>
                  <select id="participants" name="participants" required value={formData.participants} onChange={handleChange}>
                    <option value="">Select Number of Participants</option>
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1} Participant{num > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

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
                    <label className="form-check-label">Employer-Sponsored</label>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="certificationName">Official Name for Certifications</label>
                  <textarea
                    name="certificationName"
                    placeholder="Name"
                    required
                    value={formData.certificationName}
                    onChange={handleChange}
                  />
                </div>

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

                <div className="btn-container">
                  <button type="submit" className="btn">
                    Submit Your Interest <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </form>

              <div className="course-info">
                <h4>Course Information</h4>
                <p>Total fee: Ghc 6,200. Includes labs, project work, and certification prep materials.</p>
                <p><b>Class Days:</b> Monday, Wednesday, Friday</p>
                <p><b>Location:</b> Accra, Mallam-Gbawe or Online via Zoom</p>
                <p><b>Instructor:</b> Dr. Linda Mensah (Data Scientist and AWS Certified Trainer)</p>
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
