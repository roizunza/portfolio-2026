import React, { useState } from 'react';
import { COLORS, FONTS, PROJECTS } from '../../config/theme';
import { FaGithub } from 'react-icons/fa';

const THEME = PROJECTS.algoritmo;

const AccordionSection = ({ title, tag, isOpen, onClick, children }) => {
  const s = {
    container: { marginBottom: '15px', borderBottom: `1px solid ${COLORS.ui.border}`, paddingBottom: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' },
    titleText: {
      fontFamily: FONTS.body, fontSize: '14px', fontWeight: '700',
      color: isOpen ? COLORS.text.primary : COLORS.text.secondary, margin: 0,
      letterSpacing: '0.3px', transition: 'color 0.3s'
    },
    arrow: {
      color: COLORS.ui.accent, 
      fontSize: '10px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s'
    },
    metaContainer: { display: 'flex', alignItems: 'center', marginTop: '2px' },
    line: { height: '1px', backgroundColor: 'rgba(188, 186, 192, 0.43)', flexGrow: 1, marginRight: '8px' },
    tagText: { fontFamily: FONTS.main, fontSize: '9px', color: '#7c7889ff', whiteSpace: 'nowrap' },
    content: { display: isOpen ? 'block' : 'none', marginTop: '10px', animation: 'fadeIn 0.3s ease-in-out' }
  };

  return (
    <div style={s.container}>
      <div onClick={onClick}>
        <div style={s.header}><h3 style={s.titleText}>{title}</h3><span style={s.arrow}>▼</span></div>
        <div style={s.metaContainer}><div style={s.line} /><span style={s.tagText}>{tag}</span></div>
      </div>
      <div style={s.content}>{children}</div>
    </div>
  );
};

export default function Sidebar() {
  const [sectionsState, setSectionsState] = useState({ proposito: true, metodologia: false, insights: false, stack: false });

  const toggle = (section) => {
    setSectionsState(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  const s = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', color: COLORS.text.secondary },
    headerBox: { backgroundColor: COLORS.background.sidebarHeader, padding: '15px 15px', borderBottom: `1px solid ${COLORS.ui.border}`, flexShrink: 0 },
    subHeader: { fontFamily: FONTS.data, fontSize: '13px', fontWeight: '700', color: COLORS.text.secondary, margin: '0 0 4px 0', letterSpacing: '1px', textTransform: 'uppercase' },
    mainTitle: { fontFamily: FONTS.main, fontSize: '26px', fontWeight: '700', color: THEME.color, margin: '0 0 15px 0', lineHeight: '1' },
    authorBox: { borderLeft: `2px solid ${THEME.color}`, paddingLeft: '10px', marginTop: '5px' },
    authorName: { fontFamily: FONTS.body, fontSize: '14px', fontWeight: '700', color: COLORS.text.primary, margin: 0 },
    authorRole: { fontFamily: FONTS.body, fontSize: '11px', color: COLORS.text.secondary, margin: '2px 0 0 0' },
    contentBody: { flex: 1, padding: '15px 15px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' },
    bodyText: { fontFamily: FONTS.body, fontSize: '12px', fontWeight: '400', lineHeight: '1.4', color: '#E0E0E0', marginBottom: '8px' },
    listItem: { marginBottom: '8px' },
    listKey: { color: '#FFFFFF', fontWeight: '500' },
    btnContainer: { padding: '15px', borderTop: `1px solid ${COLORS.ui.border}`, backgroundColor: COLORS.background.panel, flexShrink: 0, marginTop: 'auto' },
    btnGithub: { 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#333', color: '#FFF', fontFamily: FONTS.main, fontSize: '14px', fontWeight: '700', textAlign: 'center', padding: '10px', 
      textDecoration: 'none', borderRadius: '4px', opacity: 0.7, cursor: 'not-allowed' 
    }
  };

  return (
    <div style={s.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
      `}</style>

      <div style={s.headerBox}>
        <h2 style={s.subHeader}>INTELIGENCIA DE MERCADO</h2>
        <h1 style={s.mainTitle}>ALGORITMO INMOBILIARIO</h1>
        <div style={s.authorBox}>
          <p style={s.authorName}></p>
          <p style={s.authorRole}>Análisis cuantitativo de la dinámica de plataforma de hospedaje en entornos de hiperdensidad.</p>
        </div>
      </div>

      <div style={s.contentBody} className="custom-scrollbar">
        
        <AccordionSection title="01. El Propósito" tag="#BigDataAnalysis" isOpen={sectionsState.proposito} onClick={() => toggle('proposito')}>
          <p style={s.bodyText}>
            El proyecto analiza la operación de la plataforma airbnb en su apartado de renta a corto plazo en Hong Kong, territorio definido por su hiperdensidad y su rol central en las finanzas globales. El objetivo es tangibilizar cómo la dinámica de la plataforma contribuye a la financiarización de la vivienda, reconfigurando las reglas de acceso urbano y transformando el stock habitacional en activos financieros líquidos mediante el análisis de datos masivos.
          </p>
        </AccordionSection>

        <AccordionSection title="02. Estructura y metodología" tag="#DataEngineering" isOpen={sectionsState.metodologia} onClick={() => toggle('metodologia')}>
          <p style={s.bodyText}>Se implementa un flujo de trabajo de ingeniería de datos para procesar y modelar información unificada proveniente de Inside Airbnb:</p>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Limpieza y Gestión de Datos (SQL):</span> Se utiliza PostgreSQL para la ingesta y depuración de los datasets unificados. Se ejecutan consultas para el filtrado de outliers, normalización de tipos de datos y eliminación de registros inconsistentes.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Procesamiento Geoespacial (Python):</span> Mediante el empleo de Python (GeoPandas) y la librería SQLAlchemy, se extraen los datos limpios para ejecutar agregaciones espaciales por distrito y calcular métricas críticas de rotación.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Normalización de Métricas:</span> Desarrollo de algoritmos para estandarizar indicadores de presión habitacional, permitiendo una comparativa consistente.
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title="03. Insights y Visualización" tag="#MarketInsights" isOpen={sectionsState.insights} onClick={() => toggle('insights')}>
          <p style={s.bodyText}>El análisis permite identificar una fractura estructural en el mercado de vivienda mediante métricas de alta precisión:</p>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Stock Mercantilizado:</span> Cuantificación de unidades extraídas del mercado tradicional que superan la capacidad local.</p>
          </div>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Clústeres de Especulación:</span> Revelación de zonas de alta intensidad en Yau Tsim Mong y Central & Western.</p>
          </div>
          <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Visualización de Datos:</span> Cartografía temática que correlaciona precio con disponibilidad.</p>
          </div>
        </AccordionSection>

        <AccordionSection title="Stack Tecnológico" tag="#TechSpecs" isOpen={sectionsState.stack} onClick={() => toggle('stack')}>
          <p style={s.bodyText}>Python (GeoPandas, SQLAlchemy), SQL (PostgreSQL), QGIS, Figma.</p>
        </AccordionSection>
      </div> {/* <-- AQUÍ FALTABA ESTE CIERRE PARA CONTENTBODY */}

      {/* <div style={s.btnContainer}>
        <a href="#" style={s.btnGithub}>
          <FaGithub style={{ marginRight: '8px', fontSize: '1.1em' }}/> 
          VER ANÁLISIS TÉCNICO
        </a>
      </div> 
      */}
    </div>
  );
}