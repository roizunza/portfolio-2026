import React from 'react';
import ProjectCard from '../Shared/ProjectCard.jsx';
import imgNetworkFracture from '../../assets/NetworkFracture.png';
import { PROJECTS } from '../../config/theme.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const NetworkFractureCard = ({ onEjecutar, onClose }) => {
  const { idioma, t: fullT } = useLanguage();
  const t = fullT.networkfracture;

  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.networkfracture.color} 
      comment={t.cardComment}
      image={imgNetworkFracture}
      onEjecutar={onEjecutar}
      onClose={onClose}
      customBgColor="var(--fondo-panel)"
      customBtnColor="var(--azul-electrico)"
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

export default NetworkFractureCard;