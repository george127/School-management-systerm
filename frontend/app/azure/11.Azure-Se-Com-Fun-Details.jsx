import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cloud/Azure/3.security-compliance-and-identity-fundamentals.png";
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
            <NavLink to="/Azure">Azure</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <span>Microsoft Security, Compliance, and Identity Fundamentals</span>
        </div>

        <div className="details-page container">
          <div className="details-items">
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="Microsoft Security, Compliance, and Identity Fundamentals" />
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
                      <h3>🛡️ Microsoft Security, Compliance, and Identity Fundamentals</h3>
                      <p>This course introduces core security, compliance, and identity principles and Microsoft services.</p>
                      <div className="data-item">📌 Core Microsoft security capabilities</div>
                      <div className="data-item">📌 Compliance and trust in Microsoft</div>
                      <div className="data-item">📌 Identity concepts and solutions</div>
                      <div className="data-item">📌 Microsoft Entra, Defender, Purview, Priva</div>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 2 ? "show" : ""}`}>
                    <div className="course-data">
                      <h3>🎯 Learning Goals</h3>
                      <ul>
                        <li>✅ Understand security, compliance, and identity (SCI) concepts</li>
                        <li>✅ Describe Microsoft Entra ID and governance</li>
                        <li>✅ Explore compliance management with Microsoft Purview</li>
                        <li>✅ Identify Microsoft Defender solutions and their use cases</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`content ${activeContent === 3 ? "show" : ""}`}>
                    <div className="Roles-container">
                      <h3>💼 Career Opportunities</h3>
                      <ul>
                        <li>🔹 Security Analyst (Cloud)</li>
                        <li>🔹 Compliance Officer (Microsoft 365)</li>
                        <li>🔹 Identity Administrator</li>
                        <li>🔹 Information Protection Specialist</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="text">
                <h1>Microsoft Security, Compliance, and Identity Fundamentals</h1>
                <p>Master the fundamentals of security, compliance, and identity using Microsoft solutions like Entra, Defender, and Purview.</p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Certification</h4>
                <p>This certification proves your ability to explain and apply SCI principles in Microsoft cloud environments.</p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Duration</h4>
                <p>5 weeks of guided learning with practical labs</p>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Benefits</h4>
                <ul>
                  <li><span className="material-symbols-outlined">done_all</span> Understand Microsoft SCI ecosystem</li>
                  <li><span className="material-symbols-outlined">done_all</span> Prepare for SC-900 certification exam</li>
                  <li><span className="material-symbols-outlined">done_all</span> Gain industry-recognized certification</li>
                </ul>
              </div>
              <div className="text">
                <h4><span className="material-symbols-outlined">bottom_right_click</span> Technologies Covered</h4>
                <p>Microsoft Entra, Defender, Priva, Purview, Microsoft 365 Compliance Center</p>
              </div>
            </div>

            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 3,850</div>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Full form reused from other course pages */}
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
                  <label htmlFor="certificationName">Official Name for Certifications</label>
                  <textarea name="certificationName" placeholder="Name" required value={formData.certificationName} onChange={handleChange} />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Enter Your Email</label>
                  <input type="email" name="email" placeholder="Enter Your Email" required value={formData.email} onChange={handleChange} />
                </div>

                <div className="btn-container">
                  <button type="submit" className="btn">
                    Submit Your Interest <span className="material-symbols-outlined">east</span>
                  </button>
                </div>
              </form>

              <div className="course-info">
                <h4>Course Information</h4>
                <p><b>Total Fee:</b> Ghc 3,850 — covers all study materials, lab access, and exam registration guidance.</p>
                <p><b>Class Days:</b> Fridays and Saturdays</p>
                <p><b>Location:</b> Accra, Mallam-Gbawe or Online</p>
                <p><b>Instructor:</b> Josephine Mensah (Microsoft Certified Trainer)</p>
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
