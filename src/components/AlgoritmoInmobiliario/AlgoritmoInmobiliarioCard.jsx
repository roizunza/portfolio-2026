import React from 'react';
import ProjectCard from '../Shared/ProjectCard';
import imgAlgoritmo from '../../assets/algoritmoinmobiliario.png'; 
import { PROJECTS, COLORS } from '../../config/theme';

const AlgoritmoInmobiliarioCard = ({ onEjecutar, onClose, idioma, t }) => {
  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.algoritmo.color} 
      comment={idioma === 'es' ? "// Inteligencia de Mercado & Big Data" : "// Market Intelligence & Big Data"}
      image={imgAlgoritmo}
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

export default AlgoritmoInmobiliarioCard;