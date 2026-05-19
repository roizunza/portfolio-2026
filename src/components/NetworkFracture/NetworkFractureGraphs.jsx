import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { PROJECTS } from '../../config/theme';
import { useLanguage } from '../../context/LanguageContext.jsx'; 

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function ChartsContainer({ t: propT, waterLevel }) {
  const { t: contextT } = useLanguage();
  
  const fullT = contextT || propT;
  const t = fullT?.networkfracture?.graphs;

  // Detector de pantalla móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const RAMP = PROJECTS.networkfracture.ramp;
  
  const panelBg = getCssVar('--fondo-panel') || '#12141E';
  const borderColor = getCssVar('--borde-sutil') || 'rgba(255,255,255,0.1)';
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';
  const textPrimary = getCssVar('--texto-principal') || '#ffffff';
  const textSecondary = getCssVar('--texto-secundario') || '#b0b3b8';

  /* Matriz espacial de simulacion topografica (0m a 30m) */
  const DATA_MATRIX = [
    { level: 0, safe: 5932, temple: 0, orphan: 0 },
    { level: 10, safe: 4662, temple: 172, orphan: 1098 },
    { level: 20, safe: 2209, temple: 670, orphan: 3053 },
    { level: 30, safe: 958, temple: 776, orphan: 4198 }
  ];

  /* Filtro dinamico vinculado al slider del dashboard */
  const currentData = useMemo(() => {
    const lvl = waterLevel !== undefined ? waterLevel : 0;
    return DATA_MATRIX.find(d => d.level === lvl) || DATA_MATRIX[0];
  }, [waterLevel]);

  const pieData = useMemo(() => {
    if (!t) return [];
    if (currentData.level === 0) {
      return [{ name: t.normalidad, value: currentData.safe, color: RAMP.templeCore }];
    }
    return [
      { name: t.colapso, value: currentData.orphan, color: RAMP.orphan },
      { name: t.rescate, value: currentData.temple, color: RAMP.temple }
    ];
  }, [currentData, t, RAMP]);

  if (!t) {
    return (
      <div style={{ padding: '20px', color: '#00e5ff', border: '1px dashed #ff5a60', width: '100%', fontFamily: 'var(--fuente-datos)', fontSize: '12px' }}>
        &gt; ERROR_DE_DATOS: Faltan las traducciones de 'graphs' en el JSON.
      </div>
    );
  }

  const CustomTooltipBar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: panelBg, border: `1px solid ${borderColor}`, padding: '12px', fontFamily: fontBody, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', minWidth: '180px' }}>
          <p style={{ margin: '0 0 10px 0', color: textSecondary, fontSize: '12px', fontWeight: 'bold' }}>{t.inundacion}: {label}m</p>
          
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 6px 0', fontSize: '12px', fontFamily: 'var(--fuente-datos)' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: textSecondary }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: entry.color, borderRadius: '50%', marginRight: '8px' }}></span>
                {entry.name}
              </div>
              <span style={{ color: textSecondary, fontWeight: 'bold', marginLeft: '15px' }}>{entry.value}</span>
            </div>
          ))}
          
          <p style={{ margin: '10px 0 0 0', borderTop: `1px solid ${borderColor}`, paddingTop: '8px', color: textSecondary, fontSize: '11px', fontFamily: 'var(--fuente-datos)' }}>{t.totalInfra}: 5932</p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: panelBg, border: `1px solid ${borderColor}`, padding: '10px', fontFamily: fontBody, zIndex: 1000, minWidth: '150px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontFamily: 'var(--fuente-datos)' }}>
             <div style={{ display: 'flex', alignItems: 'center', color: textSecondary }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: data.color, borderRadius: '50%', marginRight: '8px' }}></span>
                {data.name}
              </div>
              <span style={{ color: textSecondary, fontWeight: 'bold', marginLeft: '15px' }}>{data.value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalVulnerable = currentData.orphan + currentData.temple;
  const rescueEfficiency = totalVulnerable > 0 ? ((currentData.temple / totalVulnerable) * 100).toFixed(1) : 0;

  /* Estructura CSS estandarizada y responsiva */
  const styles = {
    mainContainer: { 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      width: '100%', 
      height: '100%', 
      padding: '10px 15px', 
      overflowY: isMobile ? 'auto' : 'hidden',
      overflowX: 'hidden'
    },
    leftSection: { 
      flex: isMobile ? 'none' : '1 1 50%', 
      display: 'flex', 
      flexDirection: 'column', 
      paddingRight: isMobile ? '0' : '15px', 
      paddingBottom: isMobile ? '15px' : '0',
      borderBottom: isMobile ? `1px solid ${borderColor}` : 'none',
      minHeight: isMobile ? '240px' : '0' 
    },
    rightSection: { 
      flex: isMobile ? 'none' : '1 1 50%', 
      display: 'flex', 
      flexDirection: 'column', 
      paddingLeft: isMobile ? '0' : '15px', 
      paddingTop: isMobile ? '15px' : '0', 
      borderLeft: isMobile ? 'none' : `1px solid ${borderColor}`,
      minHeight: isMobile ? '240px' : '0' 
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
    <div style={styles.mainContainer} className="custom-scrollbar">
      
      {/* SECCION IZQUIERDA: Impacto Macro */}
      <div style={styles.leftSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.fracturaTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.safe)}></span> {t.normalidad}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.temple)}></span> {t.rescate}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.orphan)}></span> {t.colapso}</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={DATA_MATRIX} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={borderColor} horizontal={false} />
              <XAxis type="number" stroke={textSecondary} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} />
              <YAxis dataKey="level" type="category" stroke={textSecondary} tick={{ fill: textSecondary, fontSize: 10 }} tickFormatter={(val) => `${val}m`} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              
              <Bar dataKey="safe" name={t.normalidad} stackId="a" fill={RAMP.safe} isAnimationActive={false} barSize={25} />
              <Bar dataKey="temple" name={t.rescate} stackId="a" fill={RAMP.temple} isAnimationActive={false} barSize={25} />
              <Bar dataKey="orphan" name={t.colapso} stackId="a" fill={RAMP.orphan} isAnimationActive={false} barSize={25} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECCION DERECHA: Eficiencia de Rescate */}
      <div style={styles.rightSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.absorcionTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center', color: textSecondary }}>
              {t.escenario} <span style={{color: RAMP.templeCore, marginLeft: '4px', fontWeight: 'bold'}}>{waterLevel || 0}m</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>

          {/* KPI central */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontFamily: 'var(--fuente-datos)' }}>
            {currentData.level === 0 ? (
              <span style={{ color: RAMP.safe, fontSize: '20px', fontWeight: 'bold' }}>100%</span>
            ) : (
              <>
                <span style={{ color: RAMP.templeCore, fontSize: '26px', fontWeight: 'bold', textShadow: `0 0 10px ${RAMP.temple}44` }}>{rescueEfficiency}%</span>
                <br/>
                <span style={{ color: textSecondary, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.mitigacion}</span>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}