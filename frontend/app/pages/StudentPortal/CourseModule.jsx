import { useState } from 'react';
import './style/CourseModule.css';

const CourseModule = () => {
  const [selectedModule, setSelectedModule] = useState(0);
  const [progress, setProgress] = useState(35); // Example progress percentage

  // Generic course data structure that works for any subject
  const courseData = {
    title: "Course Title",
    instructor: "Instructor Name",
    description: "Course description and overview of what students will learn.",
    duration: "8 weeks",
    level: "Beginner",
    enrolledStudents: 1247,
    rating: 4.8,
    modules: [
      {
        id: 1,
        title: "Module 1: Introduction",
        duration: "2 hours",
        lessons: 3,
        completed: true,
        materials: [
          { 
            id: 1,
            type: "video", 
            title: "Welcome and Course Overview", 
            duration: "15 min",
            status: "completed"
          },
          { 
            id: 2,
            type: "document", 
            title: "Course Syllabus and Requirements", 
            duration: "10 min read",
            status: "completed"
          },
          { 
            id: 3,
            type: "quiz", 
            title: "Introduction Quiz", 
            duration: "10 min",
            status: "completed"
          }
        ]
      },
      {
        id: 2,
        title: "Module 2: Core Concepts",
        duration: "3 hours",
        lessons: 4,
        completed: true,
        materials: [
          { 
            id: 4,
            type: "video", 
            title: "Key Concepts Lecture", 
            duration: "25 min",
            status: "completed"
          },
          { 
            id: 5,
            type: "document", 
            title: "Study Guide and References", 
            duration: "20 min read",
            status: "completed"
          },
          { 
            id: 6,
            type: "assignment", 
            title: "Practice Exercise", 
            duration: "45 min",
            status: "completed"
          },
          { 
            id: 7,
            type: "quiz", 
            title: "Concepts Review", 
            duration: "15 min",
            status: "completed"
          }
        ]
      },
      {
        id: 3,
        title: "Module 3: Advanced Topics",
        duration: "4 hours",
        lessons: 5,
        completed: false,
        materials: [
          { 
            id: 8,
            type: "video", 
            title: "Advanced Techniques", 
            duration: "30 min",
            status: "in-progress"
          },
          { 
            id: 9,
            type: "video", 
            title: "Case Studies", 
            duration: "25 min",
            status: "not-started"
          },
          { 
            id: 10,
            type: "document", 
            title: "Research Materials", 
            duration: "30 min read",
            status: "not-started"
          },
          { 
            id: 11,
            type: "assignment", 
            title: "Project Work", 
            duration: "2 hours",
            status: "not-started"
          },
          { 
            id: 12,
            type: "quiz", 
            title: "Advanced Assessment", 
            duration: "20 min",
            status: "not-started"
          }
        ]
      },
      {
        id: 4,
        title: "Module 4: Final Project",
        duration: "5 hours",
        lessons: 3,
        completed: false,
        materials: [
          { 
            id: 13,
            type: "video", 
            title: "Project Guidelines", 
            duration: "20 min",
            status: "not-started"
          },
          { 
            id: 14,
            type: "assignment", 
            title: "Final Project Submission", 
            duration: "3 hours",
            status: "not-started"
          },
          { 
            id: 13,
            type: "document", 
            title: "Submission Guidelines", 
            duration: "15 min read",
            status: "not-started"
          }
        ]
      }
    ]
  };

  const handleMaterialClick = (material) => {
    // In real app, this would navigate to the material
    console.log("Opening material:", material);
    alert(`Opening: ${material.title}`);
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video': return '🎬';
      case 'document': return '📄';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': '#4CAF50',
      'in-progress': '#2196F3',
      'not-started': '#9E9E9E'
    };
    return colors[status] || '#666';
  };

  const getMaterialStatusText = (status) => {
    const texts = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'not-started': 'Not Started'
    };
    return texts[status] || 'Not Started';
  };

  return (
    <div className="course-module-container">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-banner">
          <img 
            src="/api/placeholder/800/200" 
            alt="Course Banner" 
            className="banner-image"
          />
          <div className="course-overlay">
            <h1>{courseData.title}</h1>
            <p>{courseData.description}</p>
          </div>
        </div>
        
        <div className="course-meta">
          <div className="meta-item">
            <i className="bi bi-person"></i>
            <span>Instructor: {courseData.instructor}</span>
          </div>
          <div className="meta-item">
            <i className="bi bi-clock"></i>
            <span>Duration: {courseData.duration}</span>
          </div>
          <div className="meta-item">
            <i className="bi bi-graph-up"></i>
            <span>Level: {courseData.level}</span>
          </div>
          <div className="meta-item">
            <i className="bi bi-people"></i>
            <span>Students: {courseData.enrolledStudents.toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <i className="bi bi-star-fill"></i>
            <span>Rating: {courseData.rating}/5.0</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Your Progress</h3>
          <span>{progress}% Complete</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <div className="stat">
            <strong>{courseData.modules.filter(m => m.completed).length}</strong>
            <span>Completed Modules</span>
          </div>
          <div className="stat">
            <strong>
              {courseData.modules.reduce((total, module) => 
                total + module.materials.filter(m => m.status === 'completed').length, 0
              )}
            </strong>
            <span>Completed Lessons</span>
          </div>
          <div className="stat">
            <strong>
              {courseData.modules.reduce((total, module) => total + module.materials.length, 0)}
            </strong>
            <span>Total Lessons</span>
          </div>
        </div>
      </div>

      <div className="course-content">
        {/* Modules Sidebar */}
        <div className="modules-sidebar">
          <h4>Course Modules</h4>
          <div className="modules-list">
            {courseData.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${selectedModule === index ? 'active' : ''} ${module.completed ? 'completed' : ''}`}
                onClick={() => setSelectedModule(index)}
              >
                <div className="module-status">
                  {module.completed ? (
                    <i className="bi bi-check-circle-fill"></i>
                  ) : (
                    <i className="bi bi-circle"></i>
                  )}
                </div>
                <div className="module-info">
                  <h5>{module.title}</h5>
                  <span>{module.duration} • {module.lessons} lessons</span>
                </div>
                <div className="module-arrow">
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Details */}
        <div className="module-details">
          {courseData.modules[selectedModule] && (
            <>
              <div className="module-header">
                <h2>{courseData.modules[selectedModule].title}</h2>
                <div className="module-meta">
                  <span className="duration">
                    <i className="bi bi-clock"></i>
                    {courseData.modules[selectedModule].duration}
                  </span>
                  <span className="lessons">
                    <i className="bi bi-list-ul"></i>
                    {courseData.modules[selectedModule].lessons} lessons
                  </span>
                  {courseData.modules[selectedModule].completed && (
                    <span className="completed-badge">
                      <i className="bi bi-check-circle"></i>
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="materials-list">
                <h4>Learning Materials</h4>
                <div className="materials-grid">
                  {courseData.modules[selectedModule].materials.map((material) => (
                    <div
                      key={material.id}
                      className="material-card"
                      onClick={() => handleMaterialClick(material)}
                    >
                      <div className="material-header">
                        <div className="material-icon">
                          {getMaterialIcon(material.type)}
                        </div>
                        <div className="material-title-section">
                          <h5>{material.title}</h5>
                          <span className="material-type">
                            {material.type.charAt(0).toUpperCase() + material.type.slice(1)} • {material.duration}
                          </span>
                        </div>
                      </div>
                      <div className="material-footer">
                        <span 
                          className="material-status"
                          style={{ color: getStatusColor(material.status) }}
                        >
                          {getMaterialStatusText(material.status)}
                        </span>
                        <button className="start-btn">
                          {material.status === 'completed' ? 'Review' : 
                           material.status === 'in-progress' ? 'Continue' : 'Start'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Progress */}
              <div className="module-progress">
                <h4>Module Progress</h4>
                <div className="progress-breakdown">
                  {courseData.modules[selectedModule].materials.map((material) => (
                    <div key={material.id} className="progress-item">
                      <div className="progress-info">
                        <span className="material-name">{material.title}</span>
                        <span 
                          className="progress-status"
                          style={{ color: getStatusColor(material.status) }}
                        >
                          {getMaterialStatusText(material.status)}
                        </span>
                      </div>
                      <div className="progress-indicator">
                        <div 
                          className={`status-dot ${material.status}`}
                          style={{ backgroundColor: getStatusColor(material.status) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn primary">
          <i className="bi bi-download"></i>
          Download Course Materials
        </button>
        <button className="action-btn secondary">
          <i className="bi bi-chat"></i>
          Ask Instructor
        </button>
        <button className="action-btn secondary">
          <i className="bi bi-share"></i>
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default CourseModule;