import React from 'react';
import ProjectCard from '../Shared/ProjectCard.jsx';
import imgDigitalTwin from '../../assets/DigitalTwinChongqing.png'; 
import { PROJECTS } from '../../config/theme.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const DigitalTwinChongqingCard = ({ onEjecutar, onClose }) => {
  const { idioma, t: fullT } = useLanguage();
  const t = fullT.digitaltwin;

  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.digitaltwin.color} 
      comment={idioma === 'es' ? "// Web scraping e inferencia espacial mediante modelado 2.5" : "// Web Scraping & 2.5D Spatial Inference"}
      image={imgDigitalTwin}
      onEjecutar={onEjecutar}
      onClose={onClose}
      customBgColor="var(--fondo-panel)"
      customBtnColor="var(--azul-electrico)"
      btnText={t.ejecutar}
    >
      <p className="project-text" style={{ color: 'var(--texto-secundario)' }}>
        {t.cardDescription1}
      </p>
      
      <p className="project-text" style={{ color: 'var(--texto-secundario)' }}>
        {t.cardDescription2}
      </p>
    </ProjectCard>
  );
};

export default DigitalTwinChongqingCard;