// app/pages/StudentPortal/CourseMaterial.tsx
"use client";

import { useState } from "react";
import "./style/CourseMaterial.css";

// Types
interface Material {
  id: number;
  title: string;
  type: string;
  category: string;
  duration: string;
  size: string;
  uploadDate: string;
  instructor: string;
  description: string;
  thumbnail: string;
  views: number;
  likes: number;
  isNew: boolean;
  progress: number;
  dueDate?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CourseMaterials {
  categories: Category[];
  materials: Material[];
}

// Type for icons mapping
type FileIcons = {
  [key: string]: string;
};

// Type for colors mapping
type TypeColors = {
  [key: string]: string;
};

const CourseMaterial = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([1, 4]);

  // Sample course materials data
  const courseMaterials: CourseMaterials = {
    categories: [
      { id: 'all', name: 'All Materials', icon: '📚', count: 24 },
      { id: 'videos', name: 'Video Lectures', icon: '🎬', count: 8 },
      { id: 'documents', name: 'Documents', icon: '📄', count: 10 },
      { id: 'quizzes', name: 'Quizzes', icon: '📝', count: 3 },
      { id: 'assignments', name: 'Assignments', icon: '📋', count: 3 },
      { id: 'resources', name: 'Resources', icon: '🔗', count: 5 }
    ],
    materials: [
      {
        id: 1,
        title: "Introduction to React Hooks",
        type: "video",
        category: "videos",
        duration: "45:30",
        size: "125 MB",
        uploadDate: "2024-01-15",
        instructor: "Dr. Sarah Chen",
        description: "Learn about React Hooks including useState, useEffect, and custom hooks with practical examples.",
        thumbnail: "/api/placeholder/300/170",
        views: 1247,
        likes: 89,
        isNew: false,
        progress: 100
      },
      {
        id: 2,
        title: "Advanced JavaScript Patterns",
        type: "document",
        category: "documents",
        duration: "25 min read",
        size: "2.3 MB",
        uploadDate: "2024-01-18",
        instructor: "Prof. Michael Rodriguez",
        description: "Comprehensive guide to advanced JavaScript patterns and best practices for modern development.",
        thumbnail: "/api/placeholder/300/170",
        views: 892,
        likes: 45,
        isNew: true,
        progress: 75
      },
      {
        id: 3,
        title: "Mid-term Project Requirements",
        type: "assignment",
        category: "assignments",
        duration: "2 weeks",
        size: "1.1 MB",
        uploadDate: "2024-01-20",
        instructor: "Dr. Sarah Chen",
        description: "Build a responsive e-commerce dashboard using React and modern CSS frameworks.",
        thumbnail: "/api/placeholder/300/170",
        views: 567,
        likes: 23,
        isNew: true,
        progress: 0,
        dueDate: "2024-02-10"
      },
      {
        id: 4,
        title: "CSS Grid Masterclass",
        type: "video",
        category: "videos",
        duration: "38:15",
        size: "98 MB",
        uploadDate: "2024-01-12",
        instructor: "Prof. Emily Watson",
        description: "Master CSS Grid layout with real-world examples and responsive design techniques.",
        thumbnail: "/api/placeholder/300/170",
        views: 1567,
        likes: 112,
        isNew: false,
        progress: 100
      },
      {
        id: 5,
        title: "JavaScript Fundamentals Quiz",
        type: "quiz",
        category: "quizzes",
        duration: "30 min",
        size: "0.5 MB",
        uploadDate: "2024-01-22",
        instructor: "Prof. Michael Rodriguez",
        description: "Test your JavaScript knowledge with this comprehensive quiz covering ES6+ features.",
        thumbnail: "/api/placeholder/300/170",
        views: 734,
        likes: 34,
        isNew: true,
        progress: 0,
        dueDate: "2024-02-05"
      },
      {
        id: 6,
        title: "React Performance Optimization",
        type: "document",
        category: "documents",
        duration: "18 min read",
        size: "1.8 MB",
        uploadDate: "2024-01-25",
        instructor: "Dr. Sarah Chen",
        description: "Learn techniques to optimize React application performance and reduce bundle size.",
        thumbnail: "/api/placeholder/300/170",
        views: 423,
        likes: 28,
        isNew: true,
        progress: 25
      }
    ]
  };

  const toggleFavorite = (materialId: number): void => {
    setFavorites((prev: number[]) => 
      prev.includes(materialId) 
        ? prev.filter((id: number) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const getFileIcon = (type: string): string => {
    const icons: FileIcons = {
      video: '🎬',
      document: '📄',
      quiz: '📝',
      assignment: '📋',
      resource: '🔗'
    };
    return icons[type] || '📄';
  };

  const getTypeColor = (type: string): string => {
    const colors: TypeColors = {
      video: '#FF6B6B',
      document: '#4ECDC4',
      quiz: '#45B7D1',
      assignment: '#96CEB4',
      resource: '#FFEAA7'
    };
    return colors[type] || '#666';
  };

  const filteredMaterials: Material[] = courseMaterials.materials.filter((material: Material) => {
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadMaterial = (material: Material): void => {
    // Simulate download
    console.log('Downloading:', material.title);
    alert(`Starting download: ${material.title}`);
  };

  return (
    <div className="course-material-container">
      {/* Header Section */}
      <div className="material-header">
        <div className="header-content">
          <h1>Course Materials</h1>
          <p>Access all your learning resources, lectures, and assignments in one place</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <span className="stat-number">{courseMaterials.materials.length}</span>
              <span className="stat-label">Total Materials</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">
                {courseMaterials.materials.filter((m: Material) => m.progress === 100).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <span className="stat-number">
                {courseMaterials.materials.filter((m: Material) => m.isNew).length}
              </span>
              <span className="stat-label">New This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search materials, topics, or instructors..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <select 
            value={selectedCategory} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {courseMaterials.categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          <button className="sort-btn">
            <i className="bi bi-filter"></i>
            Sort & Filter
          </button>
        </div>
      </div>

      <div className="material-content">
        {/* Categories Sidebar */}
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <div className="category-list">
            {courseMaterials.categories.map((category: Category) => (
              <div
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </div>
            ))}
          </div>

          {/* Recent Downloads */}
          <div className="recent-downloads">
            <h4>Recently Viewed</h4>
            <div className="recent-list">
              {courseMaterials.materials.slice(0, 3).map((material: Material) => (
                <div key={material.id} className="recent-item">
                  <span className="recent-icon">{getFileIcon(material.type)}</span>
                  <span className="recent-title">{material.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="materials-grid">
          {filteredMaterials.length === 0 ? (
            <div className="no-results">
              <i className="bi bi-search"></i>
              <h3>No materials found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredMaterials.map((material: Material) => (
              <div key={material.id} className="material-card">
                <div className="card-header">
                  <div 
                    className="type-badge"
                    style={{ backgroundColor: getTypeColor(material.type) }}
                  >
                    {getFileIcon(material.type)} {material.type.toUpperCase()}
                  </div>
                  <div className="card-actions">
                    <button 
                      className={`favorite-btn ${favorites.includes(material.id) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(material.id)}
                    >
                      <i className="bi bi-heart"></i>
                    </button>
                    {material.isNew && <span className="new-badge">NEW</span>}
                  </div>
                </div>

                <div className="card-thumbnail">
                  <img src={material.thumbnail} alt={material.title} />
                  <div className="thumbnail-overlay">
                    {material.type === 'video' && (
                      <button className="play-btn">
                        <i className="bi bi-play-fill"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="material-title">{material.title}</h3>
                  <p className="material-description">{material.description}</p>
                  
                  <div className="material-meta">
                    <div className="meta-item">
                      <i className="bi bi-person"></i>
                      <span>{material.instructor}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock"></i>
                      <span>{material.duration}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-calendar"></i>
                      <span>{formatDate(material.uploadDate)}</span>
                    </div>
                  </div>

                  {material.dueDate && (
                    <div className="due-date">
                      <i className="bi bi-exclamation-circle"></i>
                      Due: {formatDate(material.dueDate)}
                    </div>
                  )}

                  <div className="material-stats">
                    <div className="stat">
                      <i className="bi bi-eye"></i>
                      <span>{material.views} views</span>
                    </div>
                    <div className="stat">
                      <i className="bi bi-hand-thumbs-up"></i>
                      <span>{material.likes} likes</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {material.progress !== undefined && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${material.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button 
                    className="download-btn"
                    onClick={() => downloadMaterial(material)}
                  >
                    <i className="bi bi-download"></i>
                    Download
                  </button>
                  <button className="view-btn">
                    <i className="bi bi-play-circle"></i>
                    {material.type === 'quiz' ? 'Take Quiz' : 
                     material.type === 'assignment' ? 'Start Assignment' : 'View'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Access Footer */}
      <div className="quick-access">
        <h3>Quick Access</h3>
        <div className="quick-actions">
          <button className="quick-btn">
            <i className="bi bi-cloud-download"></i>
            Download All Materials
          </button>
          <button className="quick-btn">
            <i className="bi bi-star"></i>
            View Favorites
          </button>
          <button className="quick-btn">
            <i className="bi bi-calendar-check"></i>
            Upcoming Deadlines
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterial;