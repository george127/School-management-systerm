import "../Css/details.css";
import Header from "../../Header/HeaderPage";
import Navigation from "../../Navigation/NavPage";
import { NavLink } from "react-router-dom";
import Image from "../images/Software/Typescript_logo.png";
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
          <span>TypeScript</span>
        </div>
        <div className="details-page container">
          <div className="details-items">
            {/* == First Item == */}
            <div className="item">
              <div className="image-container">
                <img src={Image} alt="TypeScript Development Course" />
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
                  {/* Course Overview */}
                  <div
                    className={`content ${activeContent === 1 ? "show" : ""}`}
                  >
                    <div className="concept-data">
                      <h3>🚀 Full-Stack Web Development with TypeScript</h3>
                      <p>
                        This course is designed to equip you with the skills
                        needed to build scalable and high-performance web
                        applications using TypeScript:
                      </p>
                      <div className="data-item">
                        📌 1: Introduction to TypeScript
                      </div>
                      <div className="data-item">
                        📌 2: TypeScript Basics and Syntax
                      </div>
                      <div className="data-item">
                        📌 3: Working with Types in TypeScript
                      </div>
                      <div className="data-item">
                        📌 4: Advanced TypeScript Features (Generics,
                        Interfaces, etc.)
                      </div>
                      <div className="data-item">
                        📌 5: TypeScript with React.js
                      </div>
                      <div className="data-item">
                        📌 6: Error Handling and Debugging in TypeScript
                      </div>
                      <div className="data-item">
                        📌 7: TypeScript and Node.js
                      </div>
                      <div className="data-item">
                        📌 8: TypeScript Best Practices and Code Organization
                      </div>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  <div
                    className={`content ${activeContent === 2 ? "show" : ""}`}
                  >
                    <div className="course-data">
                      <h3>🎯 Learning Goals</h3>
                      <ul>
                        <li>
                          ✅ Master TypeScript fundamentals and its integration
                          with JavaScript
                        </li>
                        <li>
                          ✅ Utilize TypeScript&apos; type system to enhance code
                          quality and reduce errors
                        </li>
                        <li>
                          ✅ Implement advanced features like interfaces,
                          generics, and type aliases
                        </li>
                        <li>
                          ✅ Learn to use TypeScript effectively with React.js
                        </li>
                        <li>
                          ✅ Write clean, maintainable, and scalable TypeScript
                          code for both front-end and back-end
                        </li>
                        <li>
                          ✅ Build real-world projects using TypeScript and
                          integrate it with frameworks like React and Node.js
                        </li>
                      </ul>

                      <h4>🔥 What You’ll Build:</h4>
                      <p>This course includes hands-on projects, such as:</p>
                      <ul>
                        <li>
                          🌍 A TypeScript-based React Application with Type
                          Safety
                        </li>
                        <li>
                          🛍️ An E-Commerce Platform with Backend Integration
                          using TypeScript
                        </li>
                        <li>
                          📊 A Dashboard with Real-Time Data Fetching and Type
                          Safety
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Career Paths */}
                  <div
                    className={`content ${activeContent === 3 ? "show" : ""}`}
                  >
                    <div className="Roles-container">
                      <h3>💼 Career Opportunities in TypeScript</h3>
                      <p>
                        After completing this course, you’ll be ready to work in
                        the following roles:
                      </p>
                      <ul>
                        <li>
                          🔹 <strong>Full-Stack Developer</strong> - Build and
                          manage full-stack applications using TypeScript.
                        </li>
                        <li>
                          🔹 <strong>Frontend Developer</strong> - Specialize in
                          TypeScript with React.js to build optimized,
                          maintainable applications.
                        </li>
                        <li>
                          🔹 <strong>Backend Developer</strong> - Develop APIs
                          and server-side applications with TypeScript and
                          Node.js.
                        </li>
                        <li>
                          🔹 <strong>Freelance Developer</strong> - Build
                          scalable, maintainable applications for clients using
                          TypeScript.
                        </li>
                        <li>
                          🔹 <strong>Startup Founder</strong> - Build a scalable
                          business using TypeScript for both client-side and
                          server-side code.
                        </li>
                      </ul>

                      <h4>🚀 Take Your Skills to the Next Level</h4>
                      <p>
                        By the end of this course, you’ll have a portfolio of
                        real-world projects and the confidence to build
                        production-ready applications using TypeScript!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* == Second Item */}
            <div className="item">
              <div className="text">
                <h1>TypeScript Development Course</h1>
                <p>
                  A comprehensive course on full-stack development using
                  TypeScript, which is a statically typed superset of
                  JavaScript. It covers both frontend and backend development,
                  teaching you how to build highly optimized, type-safe web
                  applications. The course includes hands-on projects, advanced
                  TypeScript features like generics and interfaces, as well as
                  integrating TypeScript with frameworks like React.js and
                  Node.js.
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
                  The TypeScript Developer Certification validates your
                  expertise in building type-safe, scalable web applications
                  using TypeScript. It covers frontend and backend development,
                  working with types, and integrating TypeScript with popular
                  frameworks like React.js and Node.js. This certification helps
                  demonstrate your skills to potential employers and clients.
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
                  The course is 13 weeks long, including hours of video lessons
                  and hands-on coding exercises. It also includes real-world
                  project assignments and a final capstone project.
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
                  Benefits of completing the TypeScript Development
                  Certification include:
                  <ul>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Learn to write type-safe, scalable code with TypeScript.
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Master frontend development with React.js and TypeScript.
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Gain real-world project experience in building dynamic
                      applications.
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Receive a certification to showcase your TypeScript
                      skills.
                    </li>
                    <li>
                      <span className="material-symbols-outlined">
                        done_all
                      </span>
                      Improve your job prospects as a TypeScript developer.
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
                  The course covers TypeScript, React.js, Node.js, working with
                  types, interfaces, and generics. Additional topics include
                  error handling, debugging, and best practices for TypeScript
                  applications.
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

                <div className="info-text">
                  <div className="icons">
                    <span className="material-symbols-outlined icon-person">
                      person
                    </span>
                  </div>
                  <p>
                    <b>Instructor:</b> John Doe (Certified Frontend Developer
                    with 10 years of teaching experience)
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
