import React from 'react';
import ProjectCard from '../Shared/ProjectCard.jsx';
import imgAlgoritmo from '../../assets/algoritmoinmobiliario.png'; 
import { PROJECTS } from '../../config/theme.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const AlgoritmoInmobiliarioCard = ({ onEjecutar, onClose }) => {
  const { idioma, t: fullT } = useLanguage();
  const t = fullT.algoritmo;

  return (
    <ProjectCard
      title={t.fileName}
      defColor={PROJECTS.algoritmo.color} 
      comment={idioma === 'es' ? "// Inteligencia de Mercado & Big Data" : "// Market Intelligence & Big Data"}
      image={imgAlgoritmo}
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

export default AlgoritmoInmobiliarioCard;