import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Marketing/image1.png";
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
            <NavLink to="/DigitalMarketing">Digital Marketing</NavLink>
            <span className="material-symbols-outlined">arrow_and_edge</span>
          </div>
          <span>Facebook Marketing Professional</span>
        </div>
        <div className="details-page container">
          <div className="details-items">
            {/* == First Item == */}
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="Facebook Marketing Professional" />
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
                        📌 1: Facebook Marketing Fundamentals
                      </div>
                      <div className="data-item">
                        📌 2: Business Manager & Ad Account Setup
                      </div>
                      <div className="data-item">
                        📌 3: Audience Research & Targeting
                      </div>
                      <div className="data-item">
                        📌 4: Ad Creative & Copywriting
                      </div>
                      <div className="data-item">
                        📌 5: Campaign Structures & Strategies
                      </div>
                      <div className="data-item">
                        📌 6: Facebook Pixel & Tracking
                      </div>
                      <div className="data-item">
                        📌 7: Analytics & Optimization
                      </div>
                      <div className="data-item">
                        📌 8: Scaling & Advanced Strategies
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
                          This comprehensive course teaches you professional Facebook marketing strategies to grow businesses. You'll learn to create high-converting ad campaigns, target the right audiences, analyze performance metrics, and optimize for maximum ROI using Facebook's advertising platform.
                        </p>

                        <p>
                          <strong>
                            <i className="fas fa-user-graduate"></i> Course
                            Prerequisites:
                          </strong>{" "}
                          Basic computer skills and Facebook account. No prior marketing experience required.
                        </p>
                      </div>

                      <h4>Learning Objectives:</h4>
                      <ul>
                        <li>
                          Set up and optimize Facebook Business Manager
                        </li>
                        <li>
                          Create effective ad campaigns for different objectives
                        </li>
                        <li>
                          Master audience targeting and segmentation
                        </li>
                        <li>
                          Design high-converting ad creatives
                        </li>
                        <li>
                          Implement Facebook Pixel for tracking
                        </li>
                        <li>
                          Analyze campaign performance and optimize
                        </li>
                        <li>
                          Scale successful campaigns profitably
                        </li>
                      </ul>

                      <h4>Course Structure:</h4>
                      <p>
                        This 8-module course combines theoretical knowledge with
                        hands-on practical exercises:
                      </p>
                      <ul>
                        <li>Module 1: Facebook Marketing Fundamentals</li>
                        <li>Module 2: Business Manager Setup</li>
                        <li>Module 3: Audience Research</li>
                        <li>Module 4: Ad Creative Development</li>
                        <li>Module 5: Campaign Strategies</li>
                        <li>Module 6: Tracking Implementation</li>
                        <li>Module 7: Performance Analysis</li>
                        <li>Module 8: Advanced Scaling Techniques</li>
                      </ul>

                      <h4>Course Delivery:</h4>
                      <p>
                        Instructor-led training with live demonstrations and hands-on campaign creation. Includes access to Facebook ad account for practical exercises.
                      </p>

                      <h4>Certification:</h4>
                      <p>
                        Course prepares you for Facebook Blueprint Certification. Includes one free exam attempt voucher.
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
                          <strong>Facebook Ads Specialist:</strong> Manage Facebook ad campaigns for businesses
                        </li>
                        <li>
                          <strong>Digital Marketing Executive:</strong> Handle social media advertising
                        </li>
                        <li>
                          <strong>Media Buyer:</strong> Purchase and optimize ad space
                        </li>
                        <li>
                          <strong>Social Media Manager:</strong> Oversee brand presence on social platforms
                        </li>
                        <li>
                          <strong>Freelance Facebook Marketer:</strong> Offer services to multiple clients
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
                <h1>Facebook Marketing Professional</h1>
                <p>
                  Master the art of Facebook marketing to drive business growth. This comprehensive course covers everything from setting up your Business Manager to creating high-converting ad campaigns, targeting the right audiences, and analyzing performance metrics. Gain practical skills that businesses desperately need in today's digital landscape.
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
                  This course prepares you for Facebook Blueprint Certification, validating your expertise in Facebook marketing and advertising.
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
                  The course is 6 weeks long, with 30 hours of instructor-led training and 40+ hours of practical exercises.
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
                  Benefits of completing this Facebook Marketing course:
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Hands-on experience with Facebook Ads Manager
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Preparation for Facebook Blueprint Certification
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Skills for high-demand digital marketing roles
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Practical campaign creation experience
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
                  Tools Covered
                </h4>
                <p>
                  Facebook Business Manager, Ads Manager, Audience Insights, Facebook Pixel, Creator Studio, Ads Reporting, and third-party tools for enhanced marketing capabilities.
                </p>
              </div>
            </div>
            {/* == Third Item */}
            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 4,500</div>
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
                  The course fee is Ghc 4,500. You will be required to pay Ghc
                  1,800 for the first installment and Ghc 1,350 for each
                  additional month.
                </p>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-schedule">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Course duration:</b> 6 weeks, with classes held 3 days a
                    week (Monday, Wednesday, Friday). Students will work on
                    practical assignments between sessions.
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
                    <b>Additional Notes:</b> Students will need access to a
                    Facebook account. Business Manager access will be provided
                    for training purposes.
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-calendar">
                      calendar_today
                    </span>
                  </div>
                  <p>
                    <b>Class Days:</b> Monday, Wednesday, Friday (6 hours/week)
                  </p>
                </div>

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-time">
                      schedule
                    </span>
                  </div>
                  <p>
                    <b>Class Time:</b> 9:00 AM - 11:00 AM (Morning Batch) or
                    4:00 PM - 6:00 PM (Evening Batch)
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