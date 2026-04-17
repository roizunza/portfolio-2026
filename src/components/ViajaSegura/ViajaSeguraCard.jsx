import React from 'react';
import ProjectCard from '../Shared/ProjectCard';
import imagenPortada from '../../assets/viajasegura.png'; 
import { PROJECTS, COLORS } from '../../config/theme';

const ViajaSeguraCard = ({ onEjecutar, onClose, idioma, t }) => {
  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.viajaSegura.color}
      comment={idioma === 'es' ? "// Ingeniería de Datos Geoespaciales" : "// Geospatial Data Engineering"}
      image={imagenPortada}
      onEjecutar={onEjecutar}
      onClose={onClose}
      customBgColor={COLORS.background.panel}  
      customBtnColor={COLORS.background.header}
      btnText={t.ejecutar} // Pasamos la traducción del botón
    >
       <p className="project-text">{t.cardDescription1}</p>
       <p className="project-text">{t.cardDescription2}</p>
    </ProjectCard>
  );
};

export default ViajaSeguraCard;