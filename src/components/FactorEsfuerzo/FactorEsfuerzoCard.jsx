import React from 'react';
import ProjectCard from '../Shared/ProjectCard';
import imgFactor from '../../assets/factoresfuerzo.png'; 
import { PROJECTS, COLORS } from '../../config/theme';

const FactorEsfuerzoCard = ({ onEjecutar, onClose, idioma, t }) => {
  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.factorEsfuerzo.color} 
      comment={idioma === 'es' ? "// Análisis Ferroviario" : "// Rail Analysis"}
      image={imgFactor}
      onEjecutar={onEjecutar}
      onClose={onClose}
      customBgColor={COLORS.background.panel}
      customBtnColor={COLORS.ui.actionButton}
      btnText={t.ejecutar}
    >
      <p className="project-text" style={{ color: COLORS.text.secondary }}>
        {t.cardDescription1}
      </p>
      
      <p className="project-text" style={{ color: COLORS.text.secondary }}>
        {t.cardDescription2}
      </p>
    </ProjectCard>
  );
};

export default FactorEsfuerzoCard;