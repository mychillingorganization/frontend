import React, { useState } from 'react';
import './MyTemplates.css';

// Dữ liệu mẫu hiển thị danh sách các Template
const templatesData =[
  { id: 1, title: 'Hackathon 2026 Certificate', lastEdited: '2 days ago' },
  { id: 2, title: 'Developer Conference Badge', lastEdited: '5 days ago' },
  { id: 3, title: 'Workshop Completion Award', lastEdited: '1 week ago' },
  { id: 4, title: 'Community Event Pass', lastEdited: '2 weeks ago' },
  { id: 5, title: 'Speaker Appreciation Certificate', lastEdited: '3 weeks ago' },
];

const MyTemplates = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  // Xử lý bật/tắt menu (Edit, Duplicate, Delete)
  const toggleMenu = (id) => {
    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      setActiveMenu(id);
    }
  };

  return (
    <div className="my-templates-container">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="nav-logo">
          <div className="logo-icon">
            <span style={{color: '#4285F4'}}>&lt;</span>
            <span style={{color: '#EA4335'}}>/</span>
            <span style={{color: '#FBBC05'}}>&gt;</span>
          </div>
          <span className="logo-text">BUGKATHON</span>
        </div>
        <h1 className="nav-title">Bugkathon</h1>
        <div className="nav-avatar">
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none">
            <path d="M0 22.028C0 9.86226 9.86226 0 22.028 0C34.1937 0 44.0559 9.86226 44.0559 22.028C44.0559 34.1937 34.1937 44.0559 22.028 44.0559C9.86226 44.0559 0 34.1937 0 22.028Z" fill="#CAC4D0"></path>
            <path d="M28.5933 14.5668C28.5933 18.1941 25.654 21.1347 22.0281 21.1347C18.4022 21.1347 15.4629 18.1941 15.4629 14.5668C15.4629 10.9394 18.4022 7.99891 22.0281 7.99891C25.654 7.99891 28.5933 10.9394 28.5933 14.5668ZM26.4049 14.5668C26.4049 16.985 24.4454 18.9454 22.0281 18.9454C19.6109 18.9454 17.6513 16.985 17.6513 14.5668C17.6513 12.1486 19.6109 10.1882 22.0281 10.1882C24.4454 10.1882 26.4049 12.1486 26.4049 14.5668Z" fill="#625B71"></path>
            <path d="M22.028 24.4186C14.9437 24.4186 8.90767 28.6093 6.6084 34.4806C7.16852 35.0372 7.75856 35.5634 8.3759 36.057C10.088 30.6665 15.4591 26.608 22.028 26.608C28.5967 26.608 33.9679 30.6665 35.6801 36.057C36.2975 35.5634 36.8874 35.0372 37.4476 34.4807C35.1483 28.6093 29.1123 24.4186 22.028 24.4186Z" fill="#625B71"></path>
          </svg>
        </div>
      </nav>

      <main className="main-content">
        {/* Tiêu đề & Công cụ tìm kiếm/tạo mới */}
        <header className="page-header">
          <div className="header-titles">
            <h2>My Templates</h2>
            <p>Manage and reuse your certificate designs.</p>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0961 17.4388C14.1513 17.4388 17.4387 14.1514 17.4387 10.0962C17.4387 6.04091 14.1513 2.75349 10.0961 2.75349C6.04084 2.75349 2.75342 6.04091 2.75342 10.0962C2.75342 14.1514 6.04084 17.4388 10.0961 17.4388Z" stroke="#99A1AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.2743 19.2745L15.3276 15.3278" stroke="#99A1AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <input type="text" placeholder="Search templates..." />
            </div>
            
            <button className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.58936 11.014H17.439" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M11.0142 4.58916V17.4388" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              Create New Template
            </button>
          </div>
        </header>

        {/* Danh sách các mẫu (Grid) */}
        <div className="template-grid">
          {templatesData.map((template) => (
            <div className="template-card" key={template.id}>
              <div className="card-preview">
                <div className="preview-placeholder">
                  <div className="mock-document"></div>
                  <span>Certificate Preview</span>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="card-info">
                  <h3>{template.title}</h3>
                  <p>Last edited {template.lastEdited}</p>
                </div>
                
                <div className="card-menu-wrapper">
                  <button className="btn-menu" onClick={() => toggleMenu(template.id)}>
                    <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
                      <g opacity="0.6">
                        <circle cx="16.5" cy="10.5" r="1.5" fill="black"/>
                        <circle cx="16.5" cy="16.5" r="1.5" fill="black"/>
                        <circle cx="16.5" cy="22.5" r="1.5" fill="black"/>
                      </g>
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {activeMenu === template.id && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                      </button>
                      <button className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Duplicate
                      </button>
                      <button className="dropdown-item text-danger">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        <span style={{color: '#EA4335'}}>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyTemplates;