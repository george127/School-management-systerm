import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Cyber/image.png";
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
            <NavLink to="/Cybersecurity">Cybersecurity</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <span>Offensive Security Certified Professional (OSCP)</span>
        </div>
        <div className="details-page container">
          <div className="details-items">
            {/* == First Item == */}
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="Offensive Security Certified Professional (OSCP)" />
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
                        📌 1: Penetration Testing with Kali Linux
                      </div>
                      <div className="data-item">
                        📌 2: Information Gathering & Reconnaissance
                      </div>
                      <div className="data-item">
                        📌 3: Vulnerability Scanning & Analysis
                      </div>
                      <div className="data-item">
                        📌 4: Buffer Overflow Exploitation
                      </div>
                      <div className="data-item">
                        📌 5: Client-Side Attacks
                      </div>
                      <div className="data-item">
                        📌 6: Privilege Escalation Techniques
                      </div>
                      <div className="data-item">
                        📌 7: Password Attacks & Cracking
                      </div>
                      <div className="data-item">
                        📌 8: OSCP Exam Preparation
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
                          The OSCP certification is the most practical penetration testing certification available. This intense program teaches you how to find vulnerabilities and execute organized attacks in a controlled environment, culminating in a challenging 24-hour exam.
                        </p>

                        <p>
                          <strong>
                            <i className="fas fa-user-graduate"></i> Course
                            Prerequisites:
                          </strong>{" "}
                          Strong understanding of networking, Linux, and Windows systems. Scripting knowledge (Python/Bash) recommended.
                        </p>
                      </div>

                      <h4>Learning Objectives:</h4>
                      <ul>
                        <li>
                          Conduct professional penetration tests
                        </li>
                        <li>
                          Perform advanced exploitation techniques
                        </li>
                        <li>
                          Write custom exploits and tools
                        </li>
                        <li>
                          Bypass security defenses
                        </li>
                        <li>
                          Document and report findings professionally
                        </li>
                        <li>
                          Think creatively to solve security challenges
                        </li>
                        <li>
                          Prepare for the OSCP certification exam
                        </li>
                      </ul>

                      <h4>Course Structure:</h4>
                      <p>
                        This intensive 8-module program covers:
                      </p>
                      <ul>
                        <li>Module 1: Kali Linux & Methodology</li>
                        <li>Module 2: Reconnaissance</li>
                        <li>Module 3: Vulnerability Analysis</li>
                        <li>Module 4: Exploitation Techniques</li>
                        <li>Module 5: Post-Exploitation</li>
                        <li>Module 6: Privilege Escalation</li>
                        <li>Module 7: Reporting</li>
                        <li>Module 8: Exam Preparation</li>
                      </ul>

                      <h4>Course Delivery:</h4>
                      <p>
                        Hands-on labs with vulnerable machines, practical exercises, and access to the PWK (Penetration Testing with Kali Linux) lab environment.
                      </p>

                      <h4>Certification:</h4>
                      <p>
                        Prepares for the Offensive Security Certified Professional (OSCP) certification - the gold standard in penetration testing certifications.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`content ${activeContent === 3 ? "show" : ""}`}
                  >
                    <div className="Roles-container">
                      <h3>Job Roles After Completion:</h3>
                      <p>
                        Graduates qualify for these high-demand positions:
                      </p>
                      <ul>
                        <li>
                          <strong>Penetration Tester</strong> - Conduct authorized simulated attacks
                        </li>
                        <li>
                          <strong>Red Team Operator</strong> - Simulate advanced adversaries
                        </li>
                        <li>
                          <strong>Security Consultant</strong> - Advise organizations on security
                        </li>
                        <li>
                          <strong>Vulnerability Researcher</strong> - Discover new vulnerabilities
                        </li>
                        <li>
                          <strong>Ethical Hacker</strong> - Identify security weaknesses
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
                <h1>OSCP Certification Training</h1>
                <p>
                  Become an Offensive Security Certified Professional through this intensive hands-on training that teaches penetration testing methodologies and tools used by security professionals worldwide.
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
                  Prepares for Offensive Security Certified Professional (OSCP) - the most respected penetration testing certification.
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
                  12-week intensive program with 60 instructor-led hours and 200+ lab hours.
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
                  Key benefits of this OSCP training:
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Hands-on penetration testing experience
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Access to PWK lab environment
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Learn real-world exploitation techniques
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Gain certification exam preparation
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Develop professional reporting skills
                    </li>
                  </ul>
                </p>
              </div>
              <div className="text">
                <h4>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                  Tools Covered
                </h4>
                <p>
                  Kali Linux, Metasploit, Burp Suite, Nmap, Wireshark, John the Ripper, Hydra, and custom exploit development tools.
                </p>
              </div>
            </div>
            {/* == Third Item */}
            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 9,500</div>
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
                    <option value="Morning 9:00 AM - 12:00 PM">
                      Morning (9:00 AM - 12:00 PM)
                    </option>
                    <option value="Afternoon 2:00 PM - 5:00 PM">
                      Afternoon (2:00 PM - 5:00 PM)
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
                  Course fee: Ghc 9,500 payable as Ghc 4,000 initial deposit and Ghc 2,750 monthly installments.
                </p>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-schedule">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Schedule:</b> 12 weeks, 3 sessions/week (Tue/Thu/Sat)
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-language">
                      language
                    </span>
                  </div>
                  <p>
                    <b>Language:</b> English
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-info">
                      info
                    </span>
                  </div>
                  <p>
                    <b>Requirements:</b> Laptop with 8GB+ RAM, virtualization enabled. Linux experience recommended.
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-calendar">
                      calendar_today
                    </span>
                  </div>
                  <p>
                    <b>Class Days:</b> Tuesday, Thursday, Saturday
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-time">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Times:</b> Weekdays 6PM-9PM, Saturday 10AM-2PM
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
                <h4>Course Policies</h4>
                <p>
                  <strong>Non-refundable policy:</strong> Payments are final once made.
                </p>
                <p>
                  <strong>Rescheduling:</strong> We may reschedule with advance notice to participants.
                </p>
                <p>
                  <strong>Minimum enrollment:</strong> 5 students required to commence class.
                </p>
                <p>
                  <strong>Exam attempt:</strong> Includes one OSCP exam attempt.
                </p>
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