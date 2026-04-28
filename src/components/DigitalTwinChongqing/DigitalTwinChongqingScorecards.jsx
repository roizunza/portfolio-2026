import React, { useMemo, useState, useEffect } from 'react';
import { PROJECTS } from '../../config/theme';

const ScorecardItem = ({ number, title, subtitle, titleColor, styles, numberColor }) => (
  <div style={styles.card}>
    <div style={{ ...styles.number, color: numberColor || styles.number.color }}>{number}</div>
    <div style={{ ...styles.title, color: titleColor || styles.title.color }}>{title}</div>
    <div style={styles.subtitle}>{subtitle}</div>
  </div>
);

const DigitalTwinScorecards = ({ t }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Inyección de variables globales de color
    const RAMP = PROJECTS.digitaltwin.ramp;

    const kpis = useMemo(() => {
        return {
            volumen: "16,606",
            moda: "3",
            supertalls: "14",
            viirs: "92%"
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
        fontFamily: 'var(--fuente-datos)', fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1'
      },
      title: {
        fontFamily: 'var(--fuente-ui)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px',
        color: '#ffffff'
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
            numberColor={RAMP.height.top} // Amarillo
            styles={s}
          />
          <ScorecardItem 
            number={kpis.moda}
            title={t.scorecards.moda}
            subtitle={t.scorecards.moda_sub}
            numberColor={RAMP.height.alta} // Cian
            styles={s}
          />
          <ScorecardItem 
            number={kpis.supertalls}
            title={t.scorecards.supertalls}
            subtitle={t.scorecards.supertalls_sub}
            numberColor={RAMP.viirs.alta} // Magenta
            styles={s}
          />
          <ScorecardItem 
            number={kpis.viirs}
            title={t.scorecards.viirs}
            subtitle={t.scorecards.viirs_sub}
            numberColor={RAMP.viirs.maxima} // Verde tóxico
            styles={s}
          />
      </React.Fragment>
    );
}

export default React.memo(DigitalTwinScorecards);