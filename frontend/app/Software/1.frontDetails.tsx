import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Software/avt.frontend.png";
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
      const scrollToPosition = sectionPosition + offset; // Adjust with the offset value
      window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
  };
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://acg-7euk.onrender.com/api/details/Info",
        formData
      );
      console.log(response.data);
      setShowPopup(true); // Show the pop-up
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
          <span>FrontEnd</span>
        </div>
        <div className="details-page container">
          <div className="details-items">
            {/* == First Item == */}
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="Front-end development course" />
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
                        📌 1: Introduction to Frontend Development
                      </div>
                      <div className="data-item">📌 2: HTML Fundamentals</div>
                      <div className="data-item">
                        📌 3: CSS Basics & Styling Web Pages
                      </div>
                      <div className="data-item">
                        📌 4: Advanced CSS Techniques
                      </div>
                      <div className="data-item">
                        📌 5: JavaScript Essentials
                      </div>
                      <div className="data-item">📌 6: Advanced JavaScript</div>
                      <div className="data-item">
                        📌 7: JavaScript DOM Projects
                      </div>
                      <div className="data-item">
                        📌 8: Final Project & Deployment
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
                          This course is designed to teach you the essentials of
                          frontend development, including HTML, CSS, JavaScript,
                          and React. You will learn the basics of building
                          responsive and interactive websites, and by the end of
                          the course, you will have a solid foundation for
                          building modern web applications.
                        </p>

                        <p>
                          <strong>
                            <i className="fas fa-user-graduate"></i> Course
                            Prerequisites:
                          </strong>{" "}
                          None (This course is designed for beginners)
                        </p>
                      </div>

                      <h4>Learning Objectives:</h4>
                      <ul>
                        <li>
                          Understand the basics of HTML, CSS, and JavaScript
                        </li>
                        <li>
                          Learn how to use tools like Git and GitHub for version
                          control
                        </li>
                        <li>
                          Build responsive and mobile-friendly web pages using
                          CSS Flexbox and Grid
                        </li>
                        <li>
                          Understand JavaScript fundamentals and work with the
                          DOM
                        </li>
                        <li>Develop web applications using React</li>
                        <li>
                          Deploy your projects online using modern hosting
                          platforms
                        </li>
                      </ul>

                      <h4>Course Structure:</h4>
                      <p>
                        This course is divided into 7 major lessons, each
                        focusing on a key aspect of frontend development. Each
                        lesson includes a mix of video lectures, exercises, and
                        project work to help reinforce your learning:
                      </p>
                      <ul>
                        <li>Lesson 1: Introduction to Frontend Development</li>
                        <li>Lesson 2: HTML Fundamentals</li>
                        <li>Lesson 3: CSS Basics & Styling Web Pages</li>
                        <li>Lesson 4: Advanced CSS Techniques</li>
                        <li>Lesson 5: JavaScript Essentials</li>
                        <li>Lesson 6: Advanced JavaScript Concepts</li>
                        <li>Lesson 7: Introduction to React</li>
                      </ul>

                      <h4>Course Delivery:</h4>
                      <p>
                        This course is delivered online with recorded video
                        lessons and hands-on assignments.
                      </p>

                      <h4>Certification:</h4>
                      <p>
                        Upon successful completion of the course, you will
                        receive a certificate of completion that demonstrates
                        your knowledge of frontend development.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`content ${activeContent === 3 ? "show" : ""}`}
                  >
                    <div className="Roles-container">
                      <h3>Job Roles After Course Completion:</h3>
                      <p>
                        Upon finishing this course, you will be equipped to
                        pursue a variety of roles in the frontend development
                        field, including:
                      </p>
                      <ul>
                        <li>
                          <strong>Frontend Developer:</strong> Develop and
                          maintain the user interface of websites and web
                          applications.
                        </li>
                        <li>
                          <strong>Web Developer:</strong> Build and optimize
                          websites, ensuring good performance, user experience,
                          and functionality.
                        </li>
                        <li>
                          <strong>UI/UX Designer:</strong> Focus on designing
                          user-friendly, visually appealing interfaces and user
                          experiences.
                        </li>
                        <li>
                          <strong>React Developer:</strong> Specialize in
                          building web applications using React.js.
                        </li>
                        <li>
                          <strong>Freelance Web Developer:</strong> Work as a
                          freelancer, offering your services to clients for
                          building websites and web applications.
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
                <h1>Front-End Development Course</h1>
                <p>
                  A comprehensive course on front-end development that covers
                  HTML, CSS, JavaScript, and various frameworks and libraries.
                  It covers topics like responsive design, accessibility, and
                  best practices. The course covers various online platforms and
                  provides step-by-step tutorials and practice exercises. The
                  course also offers a certificate of completion and valuable
                  resources to help you become a successful front-end developer.
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
                  The Front-End Development Certification (FED) is an official
                  certification by the World Wide Web Consortium (W3C) that
                  validates advanced skills in front-end development. It covers
                  topics like HTML, CSS, JavaScript, and various frameworks and
                  libraries. The certification is available for both individuals
                  and organizations.
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
                  The course is 13 weeks long, covering hours of videos and hours
                  of hands-on practice exercises.
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
                  Benefits of completing the Front-End Development Certification
                  include:
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Gain valuable experience in front-end development
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Become a certified professional in front-end development
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Become a valuable resource for your career
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Get a certificate of completion
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Expand your knowledge and skills
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
                  The course covers HTML, CSS, JavaScript, and various
                  frameworks and libraries such as React and others. It also
                  covers topics like responsive design, accessibility, and best
                  practices.
                </p>
              </div>
            </div>
            {/* == Third Item */}
            <div className="item">
              <div className="payment-details">
                <div className="info">Fee:</div>
                <div className="info">Ghc 5,920</div>
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
                    <option value="January 5">January 5</option>
                    <option value="February 5">February 5</option>
                    <option value="March 5">March 5</option>
                    <option value="April 5">April 5</option>
                    <option value="May 5">May 5</option>
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
                    <option value="Morning 8:00 AM - 11:00 PM">
                      Morning (8:00 AM - 11:00 PM)
                    </option>
                    <option value="Afternoon 1:00 PM - 3:00 PM">
                      Afternoon (1:00 PM - 3:00 PM)
                    </option>
                    <option value="Evening 4:00 PM - 7:00 PM">
                      Evening (4:00 PM - 7:00 PM)
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
                  The course fee is Ghc 5,920. You will be required to pay Ghc
                  2,000 for the first installment and Ghc 1,960 for each
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
                    week (Monday to Wednesday). Students will work on a project
                    from Thursday to Sunday and submit it the following Monday.
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
                    <b>Additional Notes:</b> Students need to bring their own
                    laptop.
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
                    <b>Class Time:</b> 8:00 AM - 11:00 PM (Morning Batch) or
                    12:00 PM - 3:00 PM (Afternoon Batch)
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
                  Once payment is made, it is **non-refundable**. Students are
                  expected to carefully review the course details before making
                  a payment.
                </p>
                <p>
                  In the event of unforeseen circumstances, we reserve the right
                  to reschedule the course. However, the course will still be
                  conducted at a later date, and enrolled students will be
                  notified in advance.
                </p>
                <p>A minimum of 3 students is required to start a class.</p>
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
