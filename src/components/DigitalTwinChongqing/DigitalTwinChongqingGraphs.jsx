import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

import { PROJECTS } from '../../config/theme';
import { useLanguage } from '../../context/LanguageContext.jsx'; 
import SCATTER_RAW from '../../data/digitaltwin_scatter.json';

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function DigitalTwinGraphs({ t: propT }) {
  const { t: contextT } = useLanguage();
  
  const fullT = contextT || propT;
  const t = fullT?.digitaltwin?.graphs;

  const RAMP = PROJECTS.digitaltwin.ramp;
  const MAIN_COLOR = PROJECTS.digitaltwin.color;
  
  const panelBg = getCssVar('--fondo-panel') || '#12141E';
  const borderColor = getCssVar('--borde-sutil') || 'rgba(255,255,255,0.1)';
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';
  const textPrimary = getCssVar('--texto-principal') || '#ffffff';
  const textSecondary = getCssVar('--texto-secundario') || '#b0b3b8';

  const radarData = useMemo(() => {
    if (!t) return [];
    return [
      { subject: t.radar.comercial, Rascacielos: 32, TejidoBase: 3 },
      { subject: t.radar.vial, Rascacielos: 58, TejidoBase: 54 },
      { subject: t.radar.topografico, Rascacielos: 95, TejidoBase: 65 }
    ];
  }, [t]);

  if (!t) {
    return (
      <div style={{ padding: '20px', color: '#07d98c', border: '1px dashed #ff5a60', width: '100%', fontFamily: 'var(--fuente-datos)', fontSize: '12px' }}>
        &gt; ERROR_DE_DATOS: Verifica la estructura de tus archivos JSON de idioma.
      </div>
    );
  }
  
  const CustomTooltipRadar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: panelBg, border: `1px solid ${borderColor}`, padding: '6px', fontFamily: fontBody, fontSize: '10px', zIndex: 1000 }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'3px', margin: 0}}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: entry.color }}></span>
              <span style={{ color: textSecondary }}>{entry.name}: <span style={{ color: '#fff', fontWeight: 'bold' }}>{entry.value}%</span></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipArea = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div style={{ backgroundColor: panelBg, border: `1px solid ${borderColor}`, padding: '8px', fontFamily: fontBody, fontSize: '10px', zIndex: 1000 }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'4px', margin: 0}}>{t.parcelaEval}</p>
          <div style={{ color: textSecondary }}>{t.friccionTop} <span style={{color:'#fff'}}>{pData.x} m</span></div>
          <div style={{ color: textSecondary }}>{t.nivelesInf}: <span style={{color:'#fff'}}>{pData.y}</span></div>
          <div style={{ color: textSecondary }}>{t.alturaConst} <span style={{color: MAIN_COLOR, fontWeight: 'bold'}}>{pData.height} m</span></div>
        </div>
      );
    }
    return null;
  };

  // ESTRUCTURA CSS CALCADA EXACTAMENTE DE VIAJA SEGURA
  const styles = {
    mainContainer: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      width: '100%', 
      height: '100%', 
      padding: '10px 15px', 
      overflow: 'hidden' 
    },
    // En Viaja Segura la gráfica ancha estaba a la izquierda. 
    // Para respetar tu petición de radar (chico) izquierda y área (ancha) derecha, invierto los valores flex.
    leftSection: { 
      flex: '1 1 250px', // Ocupa menos espacio (como la gráfica de infraestructura en Viaja Segura)
      display: 'flex', 
      flexDirection: 'column', 
      paddingRight: '15px', 
      minHeight: '0' 
    },
    rightSection: { 
      flex: '2 1 500px', // Ocupa más espacio (como las barras horizontales en Viaja Segura)
      display: 'flex', 
      flexDirection: 'column', 
      paddingLeft: '15px', 
      minHeight: '0', 
      borderLeft: `1px solid ${borderColor}` 
    },
    header: { 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start', 
      borderBottom: `1px solid ${borderColor}`, 
      marginBottom: '8px', 
      paddingBottom: '5px', 
      gap: '4px' 
    },
    title: { 
      fontFamily: fontBody, 
      fontSize: '14px', 
      fontWeight: '700', 
      color: textPrimary, 
      margin: 0, 
      letterSpacing: '0.3px', 
      width:'100%' 
    },
    legend: { 
      display: 'flex', 
      gap: '10px', 
      fontSize: '11px', 
      fontFamily: fontBody, 
      color: textPrimary, 
      flexWrap: 'wrap' 
    },
    dot: (color) => ({ 
      width: '6px', 
      height: '6px', 
      backgroundColor: color, 
      borderRadius: '2px', 
      display: 'inline-block', 
      marginRight: '4px' 
    })
  };

  return (
    <div style={styles.mainContainer}>
      
      {/* SECCIÓN IZQUIERDA: Radar (Ocupa 1/3 del espacio en desktop) */}
      <div style={styles.leftSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.radarTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.height.top)}></span> {t.rascacielos}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.height.base)}></span> {t.tejidoBase}</div>
          </div>
        </div>
        {/* Usamos exactamente el mismo div flex=1 minHeight=0 que en Viaja Segura */}
        <div style={{ flex: 1, minHeight: 0 }}> 
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData} margin={{top: 5, right: 25, left: 25, bottom: 5}}>
              <PolarGrid stroke={borderColor} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: textSecondary, fontSize: 9, fontFamily: fontBody }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={<CustomTooltipRadar />} />
              <Radar name={t.rascacielos} dataKey="Rascacielos" stroke={RAMP.height.top} fill={RAMP.height.top} fillOpacity={0.5} />
              <Radar name={t.tejidoBase} dataKey="TejidoBase" stroke={RAMP.height.base} fill={RAMP.height.base} fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Área (Ocupa 2/3 del espacio en desktop) */}
      <div style={styles.rightSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.scatterTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.dot(MAIN_COLOR)}></span> {t.decaimiento}
            </div>
          </div>
        </div>
        {/* Usamos exactamente el mismo div flex=1 minHeight=0 que en Viaja Segura */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SCATTER_RAW} margin={{top: 5, right: 10, bottom: 0, left: -25}}>
              <defs>
                <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MAIN_COLOR} stopOpacity={0.6}/>
                  <stop offset="95%" stopColor={MAIN_COLOR} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="x" tick={{fontSize: 9, fill: textSecondary}} tickLine={false} axisLine={{stroke: borderColor}} minTickGap={30} tickMargin={8} />
              <YAxis dataKey="height" tick={{fontSize: 9, fill: textSecondary}} tickLine={false} axisLine={{stroke: borderColor}} tickMargin={8} />
              <Tooltip content={<CustomTooltipArea />} />
              <Area type="monotone" dataKey="height" stroke={MAIN_COLOR} strokeWidth={2} fillOpacity={1} fill="url(#colorHeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}