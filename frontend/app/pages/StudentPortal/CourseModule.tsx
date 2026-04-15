"use client";

import { useState } from "react";
import "./style/CourseModule.css";
import Image from "next/image";
import love from "./images/hardware-engineer-developers.avif";
// Types
interface Material {
  id: number;
  type: string;
  title: string;
  duration?: string; // Only videos will have duration
  status: "completed" | "in-progress" | "not-started";
  fileUrl?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: number;
  completed: boolean;
  materials: Material[];
}

interface CourseData {
  title: string;
  instructor: string;
  description: string;
  level: string;
  enrolledStudents: number;
  rating: number;
  modules: Module[];
}

// Type for status colors
type StatusColors = {
  [key in Material['status']]: string;
};

// Type for status texts
type StatusTexts = {
  [key in Material['status']]: string;
};

const CourseModule = () => {
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [progress] = useState<number>(35);

  // Course data structure - NO durations on modules, only videos have duration
  const courseData: CourseData = {
    title: "Course Title",
    instructor: "Instructor Name",
    description: "Course description and overview of what students will learn.",
    level: "Beginner",
    enrolledStudents: 1247,
    rating: 4.8,
    modules: [
      {
        id: 1,
        title: "Module 1: Introduction",
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
            status: "completed"
          },
          { 
            id: 3,
            type: "assignment", 
            title: "Introduction Assignment", 
            status: "completed"
          }
        ]
      },
      {
        id: 2,
        title: "Module 2: Core Concepts",
        lessons: 3,
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
            status: "completed"
          },
          { 
            id: 6,
            type: "assignment", 
            title: "Practice Exercise", 
            status: "completed"
          }
        ]
      },
      {
        id: 3,
        title: "Module 3: Advanced Topics",
        lessons: 3,
        completed: false,
        materials: [
          { 
            id: 7,
            type: "video", 
            title: "Advanced Techniques",
            duration: "30 min",
            status: "in-progress"
          },
          { 
            id: 8,
            type: "document", 
            title: "Research Materials", 
            status: "not-started"
          },
          { 
            id: 9,
            type: "assignment", 
            title: "Project Work", 
            status: "not-started"
          }
        ]
      },
      {
        id: 4,
        title: "Module 4: Final Project",
        lessons: 3,
        completed: false,
        materials: [
          { 
            id: 10,
            type: "video", 
            title: "Project Guidelines",
            duration: "20 min",
            status: "not-started"
          },
          { 
            id: 11,
            type: "document", 
            title: "Submission Guidelines", 
            status: "not-started"
          },
          { 
            id: 12,
            type: "assignment", 
            title: "Final Project Submission", 
            status: "not-started"
          }
        ]
      }
    ]
  };

  const handleMaterialClick = (material: Material): void => {
    console.log("Opening material:", material);
    alert(`Opening: ${material.title}`);
  };

  const getMaterialIcon = (type: string): string => {
    switch (type) {
      case 'video': return '🎬';
      case 'document': return '📄';
      case 'assignment': return '📋';
      default: return '📄';
    }
  };

  const getStatusColor = (status: Material['status']): string => {
    const colors: StatusColors = {
      'completed': '#4CAF50',
      'in-progress': '#2196F3',
      'not-started': '#9E9E9E'
    };
    return colors[status] || '#666';
  };

  const getMaterialStatusText = (status: Material['status']): string => {
    const texts: StatusTexts = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'not-started': 'Not Started'
    };
    return texts[status] || 'Not Started';
  };

  // Helper to get display duration - only show for videos
  const getDisplayDuration = (material: Material): string => {
    if (material.type === 'video' && material.duration) {
      return ` • ${material.duration}`;
    }
    return '';
  };

  // Helper to get material type display
  const getMaterialTypeDisplay = (material: Material): string => {
    const type = material.type.charAt(0).toUpperCase() + material.type.slice(1);
    const duration = getDisplayDuration(material);
    return `${type}${duration}`;
  };

  return (
    <div className="course-module-container">
      {/* Course Header */}
      <div className="course-header">
        <div className="course-banner">
          <Image
            src={love}
            alt="Course Banner"
            className="banner-image"
            width={800}
            height={200}
          />

          <div className="course-overlay">
            <h1>{courseData.title}</h1>
            <p>{courseData.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
<div className="progress-section">
  <div className="progress-header">
    <div className="progress-title">
      <i className="bi bi-graph-up-arrow"></i>
      <h3>Learning Journey</h3>
    </div>
    <div className="progress-percentage">
      <span className="percentage-number">{progress}%</span>
      <span className="percentage-label">Complete</span>
    </div>
  </div>
  
  <div className="progress-bar-container">
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      >
        <div className="progress-glow"></div>
      </div>
    </div>
    <div className="progress-milestones">
      <div className="milestone" style={{ left: '25%' }}>
        <div className="milestone-dot"></div>
        <span>25%</span>
      </div>
      <div className="milestone" style={{ left: '50%' }}>
        <div className="milestone-dot"></div>
        <span>50%</span>
      </div>
      <div className="milestone" style={{ left: '75%' }}>
        <div className="milestone-dot"></div>
        <span>75%</span>
      </div>
      <div className="milestone" style={{ left: '100%' }}>
        <div className="milestone-dot"></div>
        <span>100%</span>
      </div>
    </div>
  </div>
  
  <div className="progress-stats">
    <div className="stat-card">
      <div className="stat-icon completed-modules">
        <i className="bi bi-journal-check"></i>
      </div>
      <div className="stat-info">
        <strong>{courseData.modules.filter(m => m.completed).length}</strong>
        <span>Completed Modules</span>
      </div>
      <div className="stat-trend">
        <i className="bi bi-arrow-up-short"></i>
        <span>+{courseData.modules.filter(m => m.completed).length}</span>
      </div>
    </div>
    
    <div className="stat-card">
      <div className="stat-icon completed-lessons">
        <i className="bi bi-check-circle-fill"></i>
      </div>
      <div className="stat-info">
        <strong>
          {courseData.modules.reduce((total, module) => 
            total + module.materials.filter(m => m.status === 'completed').length, 0
          )}
        </strong>
        <span>Completed Lessons</span>
      </div>
      <div className="stat-trend">
        <i className="bi bi-arrow-up-short"></i>
        <span>
          +{courseData.modules.reduce((total, module) => 
            total + module.materials.filter(m => m.status === 'completed').length, 0
          )}
        </span>
      </div>
    </div>
    
    <div className="stat-card">
      <div className="stat-icon total-lessons">
        <i className="bi bi-book-half"></i>
      </div>
      <div className="stat-info">
        <strong>
          {courseData.modules.reduce((total, module) => total + module.materials.length, 0)}
        </strong>
        <span>Total Lessons</span>
      </div>
      <div className="stat-trend">
        <i className="bi bi-flag"></i>
      </div>
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
                  <span>{module.lessons} lessons</span>
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
                            {getMaterialTypeDisplay(material)}
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