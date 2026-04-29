import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

import { PROJECTS } from '../../config/theme';
import { useLanguage } from '../../context/LanguageContext.jsx'; 
// Importación crucial: los datos locales
import SCATTER_RAW from '../../data/digitaltwin_scatter.json';

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function DigitalTwinGraphs({ t: propT }) {
  const { t: contextT } = useLanguage();
  
  // Priorizamos los textos del contexto, si no, usamos la prop
  const fullT = contextT || propT;
  const t = fullT?.digitaltwin?.graphs;

  const RAMP = PROJECTS.digitaltwin.ramp;
  const MAIN_COLOR = PROJECTS.digitaltwin.color;
  
  const borderColor = getCssVar('--borde-sutil') || 'rgba(255,255,255,0.1)';
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';
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

  const CustomTooltipArea = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '8px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'4px', margin: 0}}>{t.parcelaEval}</p>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.friccionTop} <span style={{color:'#fff'}}>{pData.x} m</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.nivelesInf}: <span style={{color:'#fff'}}>{pData.y}</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.alturaConst} <span style={{color: MAIN_COLOR, fontWeight: 'bold'}}>{pData.height} m</span></div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipRadar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '6px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'3px', margin: 0}}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: entry.color }}></span>
              <span style={{ color: 'var(--texto-secundario)' }}>{entry.name}: <span style={{ color: '#fff', fontWeight: 'bold' }}>{entry.value}%</span></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const styles = {
    mainGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '30px', 
      width: '100%', 
      padding: '10px 10px' 
    },
    section: { 
      display: 'flex', 
      flexDirection: 'column', 
      height: '260px', 
      width: '100%' 
    },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid var(--borde-sutil)', marginBottom: '15px', paddingBottom: '5px', gap: '4px' },
    title: { fontFamily: 'var(--fuente-ui)', fontSize: '14px', fontWeight: '700', color: 'var(--texto-principal)', margin: 0, letterSpacing: '0.3px', width:'100%' },
    legend: { display: 'flex', gap: '10px', fontSize: '11px', fontFamily: 'var(--fuente-ui)', color: 'var(--texto-principal)', flexWrap: 'wrap' },
    dot: (color) => ({ width: '6px', height: '6px', backgroundColor: color, borderRadius: '50%', display: 'inline-block', marginRight: '4px' })
  };

  return (
    <div style={styles.mainGrid}>
      <div style={styles.section}>
        <div style={styles.header}>
          <div style={styles.title}>{t.scatterTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.dot(MAIN_COLOR)}></span> {t.decaimiento}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SCATTER_RAW} margin={{top: 10, right: 20, bottom: 10, left: 0}}>
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

      <div style={styles.section}>
        <div style={styles.header}>
          <div style={styles.title}>{t.radarTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.height.top)}></span> {t.rascacielos}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.height.base)}></span> {t.tejidoBase}</div>
          </div>
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
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
    </div>
  );
}