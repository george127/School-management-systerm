import { useState } from 'react';
import "./style/CourseContentManagement.css";

const CourseContentManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [contentType, setContentType] = useState("video");
  const [contentTitle, setContentTitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [moduleItems, setModuleItems] = useState([]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (contentTitle) {
            const newItem = {
              id: moduleItems.length + 1,
              title: contentTitle,
              type: contentType,
              duration: contentType === "video" ? "00:00" : "",
              status: "draft"
            };
            setModuleItems([...moduleItems, newItem]);
            setContentTitle("");
            setContentDescription("");
            setSelectedFile(null);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }
    if (!contentTitle) {
      alert("Please enter a title for your content");
      return;
    }
    simulateUpload();
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === parseInt(courseId));
    return course ? course.name : "Select a course";
  };

 

  return (
    <div className="management-container content-management">
      <div className="content-layout">
        <div className="content-sidebar">
          <div className="upload-card">
            <h4 className="upload-title">Upload New Content</h4>
            
            <div className="form-group">
              <label className="form-label">Select Course</label>
              <select 
                className="form-select"
                
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Choose a course...</option>
                  <option >
                    Course Name
                  </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Content Type</label>
              <div className="content-type-selector">
                <button 
                  type="button"
                  className={`type-btn ${contentType === 'video' ? 'active' : ''}`}
                  onClick={() => setContentType('video')}
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Video
                </button>
                <button 
                  type="button"
                  className={`type-btn ${contentType === 'document' ? 'active' : ''}`}
                  onClick={() => setContentType('document')}
                >
                  <span className="material-symbols-outlined">description</span>
                  Document
                </button>
                <button 
                  type="button"
                  className={`type-btn ${contentType === 'assignment' ? 'active' : ''}`}
                  onClick={() => setContentType('assignment')}
                >
                  <span className="material-symbols-outlined">assignment</span>
                  Assignment
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-group">
                <label className="form-label">Content Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Enter content title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  placeholder="Enter content description"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {contentType === 'video' ? 'Video File' : 
                   contentType === 'document' ? 'Document File' : 'Assignment Instructions'}
                </label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="content-file"
                    className="file-input"
                    onChange={handleFileSelect}
                    accept={contentType === 'video' ? 'video/*' : contentType === 'document' ? '.pdf,.doc,.docx' : '*'}
                  />
                  <label htmlFor="content-file" className="file-upload-label">
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <span className="file-text">
                      {selectedFile ? selectedFile.name : 'Choose file or drag & drop here'}
                    </span>
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">Uploading... {uploadProgress}% complete</div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-upload"
                disabled={isUploading || !selectedCourse || !contentTitle}
              >
                {isUploading ? (
                  <>
                    <div className="upload-spinner"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">cloud_upload</span>
                    Upload Content
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="content-main">
          <div className="content-list-card">
            <div className="content-header">
              <h4 className="content-title">Course Content</h4>
              <span className="course-badge">
                {selectedCourse ? getCourseName(selectedCourse) : "No course selected"}
              </span>
            </div>

              <div className="module-list">
                  <div className="module-item">
                    <div className="module-icon">
                      <span className="material-symbols-outlined">play_circle</span>
                       <span className="material-symbols-outlined">description</span>
                       <span className="material-symbols-outlined">assignment</span>
                    </div>
                    <div className="module-details">
                      <h6 className="module-title">title</h6>
                      <div className="module-meta">
                        <span className="module-type">type</span>
                        <span className="module-duration">duration</span>
                        <span className={`module-status ${status}`}>
                          status
                        </span>
                      </div>
                    </div>
                    <div className="module-actions">
                      <button className="icon-btn edit" title="Edit content">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="icon-btn delete" title="Delete content">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
              </div>
              <div className="empty-state">
                <span className="material-symbols-outlined">folder_off</span>
                <p>Please select a course to view its content</p>
              </div>
          </div>

          <div className="content-stats">
            <h5 className="stats-title">Content Statistics</h5>
            <div className="stats-grid">
              <div className="content-stat">
                <div className="stat-icon video">
                  <span className="material-symbols-outlined">play_circle</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Videos</div>
                </div>
              </div>
              <div className="content-stat">
                <div className="stat-icon document">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Documents</div>
                </div>
              </div>
              <div className="content-stat">
                <div className="stat-icon assignment">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div className="stat-content">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Assignments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentManagement;