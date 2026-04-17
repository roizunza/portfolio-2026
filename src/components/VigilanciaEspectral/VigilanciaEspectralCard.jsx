import React from 'react';
import ProjectCard from '../Shared/ProjectCard';
import imgVigilancia from '../../assets/vigilanciaespectral.png';
import { PROJECTS, COLORS } from '../../config/theme';

const VigilanciaEspectralCard = ({ onEjecutar, onClose, idioma, t }) => {
  return (
    <ProjectCard
      title={t.fileName}
      defColor="#15BE80" 
      comment={idioma === 'es' ? "// Auditoría de Datos Ambientales y ML" : "// Environmental Data Auditing & ML"}
      image={imgVigilancia}
      onEjecutar={onEjecutar}
      onClose={onClose}
      customBgColor={COLORS.background.panel}
      customBtnColor={COLORS.background.header}
      btnText={t.ejecutar}
    >
      <p className="project-text">
        {t.cardDescription1}
      </p>
      
      <p className="project-text">
        {t.cardDescription2}
      </p>
    </ProjectCard>
  );
};

export default VigilanciaEspectralCard;