import React, { useMemo, useState, useEffect } from 'react';
import { PROJECTS } from '../../config/theme';
import cuellosData from '../../data/cuellos_de_botella.json';

const ScorecardItem = ({ number, title, subtitle, titleColor, styles }) => (
  <div style={styles.card}>
    <div style={styles.number}>{number}</div>
    <div style={{ ...styles.title, color: titleColor || styles.title.color }}>{title}</div>
    <div style={styles.subtitle}>{subtitle}</div>
  </div>
);

const Scorecards = ({ t }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const RAMP = PROJECTS.algoritmo.ramp;
    const THEME_COLOR = PROJECTS.algoritmo.color; 

    const kpis = useMemo(() => {
        try {
            const features = cuellosData.features || [];
            const len = features.length;
            
            const totalClusters = len;
            const criticalRiesgo = features.filter(f => f.properties.nivel_riesgo === 'Riesgo Crítico').length;
            const maxDistance = features.reduce((max, f) => Math.max(max, f.properties.distancia_a_cargador_m), 0);
            const avgDistance = len > 0 ? features.reduce((acc, curr) => acc + curr.properties.distancia_a_cargador_m, 0) / len : 0;

            return {
                clusters: totalClusters.toString(),
                criticos: `${criticalRiesgo}`,
                maxDist: `${(maxDistance / 1000).toFixed(1)} km`,
                avgDist: `${(avgDistance / 1000).toFixed(1)} km`
            };

        } catch (error) {
            console.error("Error KPI:", error);
            return { clusters: "0", criticos: "0", maxDist: "0 km", avgDist: "0 km" };
        }
    }, []);

    const s = {
      card: {
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        width: '100%', height: '100%', minHeight: '80px', boxSizing: 'border-box',
        backgroundColor: 'var(--fondo-panel)', 
        borderRadius: '8px', padding: '5px',
        border: '1px solid var(--borde-sutil)',
        backdropFilter: 'blur(10px)'
      },
      number: {
        color: THEME_COLOR, 
        fontFamily: 'var(--fuente-datos)', fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1'
      },
      title: {
        fontFamily: 'var(--fuente-ui)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px',
      },
      subtitle: {
        color: 'var(--texto-secundario)', fontFamily: 'var(--fuente-ui)', fontSize: '8px', fontWeight: '500', lineHeight: '1.2', opacity: 0.8
      }
    };

    if (!isMounted || !t || !t.scorecards) return null;

    return (
      <React.Fragment>
          <ScorecardItem 
            number={kpis.clusters}
            title={t.scorecards.stock}
            subtitle={t.scorecards.stock_sub}
            titleColor="#FFFFFF"
            styles={s}
          />
          <ScorecardItem 
            number={kpis.criticos}
            title={t.scorecards.barrera}
            subtitle={t.scorecards.barrera_sub}
            titleColor={RAMP.step4}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.maxDist}
            title={t.scorecards.subutilizacion}
            subtitle={t.scorecards.subutilizacion_sub}
            titleColor={RAMP.step3}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.avgDist}
            title={t.scorecards.rotacion}
            subtitle={t.scorecards.rotacion_sub}
            titleColor={RAMP.step2}
            styles={s}
          />
      </React.Fragment>
    );
}

export default React.memo(Scorecards);