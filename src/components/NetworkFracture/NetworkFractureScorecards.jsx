import React, { useMemo, useState, useEffect } from 'react';
import { PROJECTS } from '../../config/theme';

/* Standardized subcomponent for unified dashboard layout */
const ScorecardItem = ({ number, title, subtitle, titleColor, styles }) => (
  <div style={styles.card}>
    <div style={styles.number}>{number}</div>
    <div style={{ ...styles.title, color: titleColor }}>{title}</div>
    <div style={styles.subtitle}>{subtitle}</div>
  </div>
);

export default function Scorecards({ t, waterLevel }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const RAMP = PROJECTS.networkfracture.ramp;
  const MAIN_COLOR = PROJECTS.networkfracture.color;

  const DATA_MATRIX = [
    { level: 0, safe: 5932, temple: 0, orphan: 0 },
    { level: 10, safe: 4662, temple: 172, orphan: 1098 },
    { level: 20, safe: 2209, temple: 670, orphan: 3053 },
    { level: 30, safe: 958, temple: 776, orphan: 4198 }
  ];

  const TOTAL_INFRASTRUCTURE = 5932;

  /* Dinámica KPI vinculada al slider */
  const kpis = useMemo(() => {
    const lvl = waterLevel !== undefined ? waterLevel : 0;
    const currentData = DATA_MATRIX.find(d => d.level === lvl) || DATA_MATRIX[0];

    const totalVulnerables = currentData.orphan + currentData.temple;
    const deficitGubernamental = ((totalVulnerables / TOTAL_INFRASTRUCTURE) * 100).toFixed(1);
    const eficienciaRescate = totalVulnerables > 0 
      ? ((currentData.temple / totalVulnerables) * 100).toFixed(1) 
      : 0;

    return {
      impactoTotal: totalVulnerables,
      deficit: deficitGubernamental,
      cargaPatrimonial: currentData.temple,
      eficiencia: eficienciaRescate
    };
  }, [waterLevel]);

  const s = {
    card: {
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
      width: '100%', height: '100%', minHeight: '80px', boxSizing: 'border-box',
      backgroundColor: 'var(--fondo-panel)', 
      borderRadius: '8px', padding: '5px',
      border: '1px solid var(--borde-sutil)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    number: {
      color: MAIN_COLOR,
      fontFamily: 'var(--fuente-datos)', fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1'
    },
    title: {
      fontFamily: 'var(--fuente-ui)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px'
    },
    subtitle: {
      color: 'var(--texto-secundario)', fontFamily: 'var(--fuente-ui)', fontSize: '8px', fontWeight: '500', lineHeight: '1.2', opacity: 0.8
    }
  };

  if (!isMounted || !t || !t.scorecards) return null;

  return (
    <React.Fragment>
      
      {/* TARJETA 1 */}
      <ScorecardItem 
        number={kpis.impactoTotal}
        title={t.scorecards.impacto}
        subtitle={t.scorecards.impacto_sub}
        titleColor={RAMP.templeCore}
        styles={s}
      />

      {/* TARJETA 2 */}
      <ScorecardItem 
        number={`${kpis.deficit}%`}
        title={t.scorecards.deficit}
        subtitle={t.scorecards.deficit_sub}
        titleColor={RAMP.safe}
        styles={s}
      />

      {/* TARJETA 3 */}
      <ScorecardItem 
        number={kpis.cargaPatrimonial}
        title={t.scorecards.carga}
        subtitle={t.scorecards.carga_sub}
        titleColor={RAMP.temple}
        styles={s}
      />

      {/* TARJETA 4 */}
      <ScorecardItem 
        number={kpis.impactoTotal === 0 ? "100%" : `${kpis.eficiencia}%`}
        title={t.scorecards.eficiencia}
        subtitle={t.scorecards.eficiencia_sub}
        titleColor="#FFFFFF"
        styles={s}
      />

    </React.Fragment>
  );
}