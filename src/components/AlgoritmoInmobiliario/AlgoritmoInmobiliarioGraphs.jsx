import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Cell 
} from 'recharts';
import { PROJECTS } from '../../config/theme';
import cuellosData from '../../data/cuellos_de_botella.json';

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function GraphsPanel({ t }) {
  const THEME = PROJECTS.algoritmo;
  const RAMP = THEME.ramp;
  const features = cuellosData.features || [];

  const borderColor = getCssVar('--borde-sutil') || 'rgba(255,255,255,0.1)';
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';
  const textSecondary = getCssVar('--texto-secundario') || '#b0b3b8';

  if (!t || !t.graphs) return null;

  const scatterData = useMemo(() => {
    return features.map(f => ({
      x: f.properties.cluster_id,      
      y: f.properties.distancia_a_cargador_m,     
      z: 50,             
      name: `Clúster ${f.properties.cluster_id}`,
      riesgo: f.properties.nivel_riesgo,
      fill: f.properties.nivel_riesgo === 'Riesgo Crítico' ? RAMP.step4 : RAMP.step1
    }));
  }, [features, RAMP]);

  const barData = useMemo(() => {
    return [...features]
      .sort((a, b) => b.properties.distancia_a_cargador_m - a.properties.distancia_a_cargador_m)
      .slice(0, 7)
      .map(f => ({
        name: `Clúster ${f.properties.cluster_id}`,
        Distancia: Math.round(f.properties.distancia_a_cargador_m),
        fill: f.properties.nivel_riesgo === 'Riesgo Crítico' ? RAMP.step4 : RAMP.step1
      }));
  }, [features, THEME, RAMP]);

  const CustomTooltipScatter = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '8px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'4px', margin: 0}}>{data.name}</p>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.graphs.precio}: <span style={{color:'#fff'}}>{data.x}</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.graphs.rotacion}: <span style={{color:'#fff'}}>{data.y.toFixed(0)}m</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>{t.graphs.stockTooltip}: <span style={{color: data.fill}}>{data.riesgo}</span></div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '6px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'3px', margin: 0}}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: payload[0].fill }}></span>
            <span style={{ color: 'var(--texto-secundario)' }}>{t.graphs.unidadesTooltip} <span style={{ color: '#fff', fontWeight: 'bold' }}>{payload[0].value}m</span></span>
          </div>
        </div>
      );
    }
    return null;
  };

  const styles = {
    mainContainer: { display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', padding: '10px 15px', overflow: 'hidden' },
    leftSection: { flex: '2 1 500px', display: 'flex', flexDirection: 'column', paddingRight: '15px', minHeight: '0' },
    rightSection: { flex: '1 1 250px', display: 'flex', flexDirection: 'column', paddingLeft: '15px', minHeight: '0', borderLeft: '1px solid var(--borde-sutil)' },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid var(--borde-sutil)', marginBottom: '8px', paddingBottom: '5px', gap: '4px' },
    title: { fontFamily: 'var(--fuente-ui)', fontSize: '14px', fontWeight: '700', color: 'var(--texto-principal)', margin: 0, letterSpacing: '0.3px', width:'100%' },
    legend: { display: 'flex', gap: '10px', fontSize: '11px', fontFamily: 'var(--fuente-ui)', color: 'var(--texto-principal)', flexWrap: 'wrap' },
    dot: (color) => ({ width: '6px', height: '6px', backgroundColor: color, borderRadius: '50%', display: 'inline-block', marginRight: '4px' })
  };

  return (
    <div style={styles.mainContainer}>
      
      <div style={styles.leftSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.graphs.scatterTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.step4)}></span> {t.graphs.altaPresion}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(RAMP.step1)}></span> {t.graphs.estandar}</div>
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{top: 10, right: 10, bottom: 10, left: -10}}>
              <XAxis 
                type="category" 
                dataKey="x" 
                name={t.graphs.precio} 
                tick={{fontSize: 10, fill: textSecondary}} 
                tickLine={false} 
                axisLine={{stroke: borderColor}}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={t.graphs.rotacion} 
                unit="m" 
                tick={{fontSize: 10, fill: textSecondary}} 
                tickLine={false} 
                axisLine={{stroke: borderColor}} 
              />
              <ZAxis type="number" dataKey="z" range={[50, 50]} /> 
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipScatter />} />
              <Scatter name="Clústeres" data={scatterData} fill={THEME.color}>
                {
                  scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))
                }
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.header}>
          <div style={styles.title}>{t.graphs.barTitle}</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(THEME.color)}></span> {t.graphs.unidadesAirbnb}</div>
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barData} 
              layout="vertical" 
              margin={{top: 5, right: 10, left: 0, bottom: 5}} 
              barSize={12}
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{fontSize: 9, fill: '#fff', fontFamily: fontBody}} 
                width={70} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltipBar />} />
              <Bar dataKey="Distancia" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.05)' }}>
                {
                  barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}