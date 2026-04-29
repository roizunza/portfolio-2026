import React, { useMemo, useState, useEffect } from 'react';
import { PROJECTS } from '../../config/theme';

const ScorecardItem = ({ number, title, subtitle, titleColor, styles }) => (
  <div style={styles.card}>
    <div style={styles.number}>{number}</div>
    <div style={{ ...styles.title, color: titleColor }}>{title}</div>
    <div style={styles.subtitle}>{subtitle}</div>
  </div>
);

const DigitalTwinScorecards = ({ t }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const RAMP = PROJECTS.digitaltwin.ramp;
    const MAIN_COLOR = PROJECTS.digitaltwin.color;

    const kpis = useMemo(() => {
        return {
            volumen: "16,606",
            moda: "3",
            supertalls: "32",
            viirs: "29.4%"
        };
    }, []);

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
          <ScorecardItem 
            number={kpis.volumen}
            title={t.scorecards.volumen}
            subtitle={t.scorecards.volumen_sub}
            titleColor={RAMP.mca.pois}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.moda}
            title={t.scorecards.moda}
            subtitle={t.scorecards.moda_sub}
            titleColor={RAMP.viirs.media}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.supertalls}
            title={t.scorecards.supertalls}
            subtitle={t.scorecards.supertalls_sub}
            titleColor={RAMP.viirs.alta}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.viirs}
            title={t.scorecards.viirs}
            subtitle={t.scorecards.viirs_sub}
            titleColor={RAMP.mca.vias}
            styles={s}
          />
      </React.Fragment>
    );
}

export default React.memo(DigitalTwinScorecards);