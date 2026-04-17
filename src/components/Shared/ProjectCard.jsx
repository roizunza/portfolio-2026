import React from 'react';
import './ProjectCard.css'; 
import { FONTS, COLORS } from '../../config/theme'; 

const ProjectCard = ({ 
  title, defColor, comment, image, onEjecutar, onClose, children,
  customBgColor, customBtnColor, btnText 
}) => {
  
  const cardStyle = {
    backgroundColor: customBgColor || COLORS.background.panel,
    borderColor: COLORS.ui.border
  };

  const btnStyle = {
    backgroundColor: customBtnColor || COLORS.background.header,
    fontFamily: FONTS.main,
    color: '#FFFFFF'
  };

  return (
    <div className="project-detail-container" style={cardStyle}>
      <div className="card-window-bar" style={{ backgroundColor: COLORS.background.sidebarHeader, borderBottomColor: COLORS.ui.border }}>
        <div className="window-title" style={{ fontFamily: FONTS.data, color: COLORS.text.secondary }}>
          <span>📂</span> {title}
        </div>
        <div className="window-close-btn" onClick={onClose} style={{ color: COLORS.text.primary }}>[ X ]</div>
      </div>
      
      <img src={image} alt={title} className="project-hero-image" style={{ borderBottomColor: COLORS.ui.border }} />

      <div className="project-content">
        <div className="code-header" style={{ fontFamily: FONTS.main }}>
          <span style={{ color: defColor, fontWeight: 'bold' }}>def():</span>
          <span style={{ color: COLORS.text.primary, marginLeft: '10px' }}>{title}</span>
        </div>

        <div className="project-location-comment" style={{ fontFamily: FONTS.main, color: COLORS.text.codeComment }}>
          {comment}
        </div>

        <div className="project-description" style={{ fontFamily: FONTS.body, color: COLORS.text.secondary }}>
          {children}
        </div>

        <button className="execute-button" onClick={onEjecutar} style={btnStyle}>
          {btnText}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;