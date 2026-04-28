import React, { useState } from 'react';
import { PROJECTS } from '../../config/theme';

const THEME = PROJECTS.digitaltwin; 

const AccordionSection = ({ title, tag, isOpen, onClick, children }) => {
  const s = {
    container: { marginBottom: '15px', borderBottom: '1px solid var(--borde-sutil)', paddingBottom: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' },
    titleText: {
      fontFamily: 'var(--fuente-ui)', fontSize: '14px', fontWeight: '700',
      color: isOpen ? 'var(--texto-principal)' : 'var(--texto-secundario)', margin: 0,
      letterSpacing: '0.3px', transition: 'color 0.3s'
    },
    arrow: {
      color: THEME.color, 
      fontSize: '10px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s'
    },
    metaContainer: { display: 'flex', alignItems: 'center', marginTop: '2px' },
    line: { height: '1px', backgroundColor: 'rgba(188, 186, 192, 0.43)', flexGrow: 1, marginRight: '8px' },
    tagText: { fontFamily: 'var(--fuente-datos)', fontSize: '9px', color: '#7c7889ff', whiteSpace: 'nowrap' },
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

export default function DigitalTwinSidebar() {
  const [sectionsState, setSectionsState] = useState({ purpose: true, methodology: false, insights: false, stack: false });

  const toggle = (section) => {
    setSectionsState(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  const s = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--texto-secundario)' },
    headerBox: { backgroundColor: 'var(--fondo-app)', padding: '15px 15px', borderBottom: '1px solid var(--borde-sutil)', flexShrink: 0 },
    subHeader: { fontFamily: 'var(--fuente-datos)', fontSize: '13px', fontWeight: '700', color: 'var(--texto-secundario)', margin: '0 0 4px 0', letterSpacing: '1px', textTransform: 'uppercase' },
    mainTitle: { fontFamily: 'var(--fuente-datos)', fontSize: '24px', fontWeight: '700', color: THEME.color, margin: '0 0 15px 0', lineHeight: '1.1' },
    authorBox: { borderLeft: `2px solid ${THEME.color}`, paddingLeft: '10px', marginTop: '5px' },
    authorRole: { fontFamily: 'var(--fuente-ui)', fontSize: '11px', color: 'var(--texto-secundario)', margin: '2px 0 0 0', fontStyle: 'normal' },
    contentBody: { flex: 1, padding: '15px 15px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' },
    bodyText: { fontFamily: 'var(--fuente-ui)', fontSize: '12px', fontWeight: '400', lineHeight: '1.4', color: '#E0E0E0', marginBottom: '8px' },
    listItem: { marginBottom: '8px' },
    listKey: { color: '#FFFFFF', fontWeight: '500' }
  };

  return (
    <div style={s.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
      `}</style>

      <div style={s.headerBox}>
        <h2 style={s.subHeader}>INFERENCIA ESPACIAL</h2>
        <h1 style={s.mainTitle}>DIGITAL TWIN</h1>
        <div style={s.authorBox}>
          <p style={s.authorRole}>Desarrollo de Geointeligencia</p>
        </div>
      </div>

      <div style={s.contentBody} className="custom-scrollbar">
        
        <AccordionSection title="El Propósito" tag="CONTEXTO" isOpen={sectionsState.purpose} onClick={() => toggle('purpose')}>
          <p style={s.bodyText}>
            El presente proyecto expone el primer acercamiento al desarrollo de una herramienta de geointeligencia basada en Gemelos Digitales (Digital Twins). Su objetivo es modelar la escala constructiva de una ciudad calculando la altura de los edificios por inferencia, utilizando estrictamente las variables urbanas de su entorno.
          </p>
          <p style={s.bodyText}>
            Para su desarrollo y prueba se eligió la ciudad de Chongqing; sus características morfológicas y topográficas extremas funcionan como el entorno ideal, ya que estos desafíos se absorben directamente a través de las variables espaciales que alimentan el algoritmo. Como resultado de esta simulación, se logró codificar y extruir un modelo 2.5D con más de 16,000 polígonos.
          </p>
        </AccordionSection>

        <AccordionSection title="Metodología" tag="PIPELINE ANALÍTICO" isOpen={sectionsState.methodology} onClick={() => toggle('methodology')}>
          <p style={s.bodyText}>El motor de inferencia ejecuta el siguiente flujo lógico:</p>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>1. Extracción de Datos:</span> Web scraping de infraestructuras urbanas base (nodos de transporte, huellas de edificación, vialidades y POIs).
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>2. Procesamiento Espacial:</span> Ejecución de cálculos topológicos, midiendo la distancia real a vías principales y la fricción topográfica hacia el transporte.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>3. Análisis Multicriterio (MCDA):</span> Asignación de puntuaciones geométricas y normalización paramétrica de las variables.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>4. Motor de Inferencia:</span> Extrusión de los volúmenes arquitectónicos dictados por la presión inmobiliaria teórica.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>5. Comprobación:</span> Descarga de espectrometría satelital VIIRS (luces nocturnas) desde Google Earth Engine para tomar como referencia empírica.
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title="Insights" tag="HALLAZGOS" isOpen={sectionsState.insights} onClick={() => toggle('insights')}>
          <div style={{ marginBottom: '12px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '8px' }}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Efectividad comprobada desde el espacio:</span> El cruce con la radiancia satelital VIIRS demuestra que el modelo funciona. Las zonas donde la herramienta predijo matemáticamente la mayor densidad vertical coinciden con los picos reales de actividad económica y emisiones lumínicas de la ciudad.
            </p>
          </div>
          <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '8px' }}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Calibración a la realidad local:</span> El modelo se ajustó a métricas características del relieve de Chongqing, una ciudad montaña. Por lo que, en vez de usar radios llanos, se absorbió la topografía para calcular la fricción espacial mediante percentiles, infiriendo la densidad vertical de forma contextual.
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title="Stack" tag="TECNOLOGÍAS" isOpen={sectionsState.stack} onClick={() => toggle('stack')}>
          <p style={s.bodyText}>
            Python (GeoPandas, OSMnx, Rasterio, Earth Engine API), Evaluaciones Multicriterio Espaciales (MCDA), QGIS, React, Mapbox GL JS / Deck.gl, Recharts, Supabase.
          </p>
        </AccordionSection>
        
      </div>
    </div>
  );
}