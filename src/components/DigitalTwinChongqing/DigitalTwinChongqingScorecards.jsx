import React, { useMemo, useState, useEffect } from 'react';

const ScorecardItem = ({ number, title, subtitle, titleColor, styles, numberColor }) => (
  <div style={styles.card}>
    <div style={{ ...styles.number, color: numberColor || styles.number.color }}>{number}</div>
    <div style={{ ...styles.title, color: titleColor || styles.title.color }}>{title}</div>
    <div style={styles.subtitle}>{subtitle}</div>
  </div>
);

const DigitalTwinScorecards = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Paleta de colores del indice VIIRS (Luminiscencia)
    const PALETTE_VIIRS = {
      baja: '#052785',
      media: '#1930b1',
      alta: '#185fc9',
      maxima: '#05b7c4',
      blanco: '#ffffff'
    };

    const kpis = useMemo(() => {
        // Se utilizan los valores estaticos de la evaluacion final 
        // para evitar un query pesado de 16,606 geometrias en el render inicial.
        return {
            volumen: "16,606",
            promedio: "6",
            pico: "110",
            radiancia: "36.39"
        };
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
        color: PALETTE_VIIRS.maxima, 
        fontFamily: 'var(--fuente-datos)', fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1'
      },
      title: {
        fontFamily: 'var(--fuente-ui)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px',
        color: PALETTE_VIIRS.blanco
      },
      subtitle: {
        color: 'var(--texto-secundario)', fontFamily: 'var(--fuente-ui)', fontSize: '8px', fontWeight: '500', lineHeight: '1.2', opacity: 0.8
      }
    };

    if (!isMounted) return null;

    return (
      <React.Fragment>
          <ScorecardItem 
            number={kpis.volumen}
            title="Volumen Modelado"
            subtitle="Polígonos codificados"
            titleColor={PALETTE_VIIRS.blanco}
            numberColor={PALETTE_VIIRS.maxima}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.promedio}
            title="Escala Promedio"
            subtitle="Niveles inferidos"
            titleColor={PALETTE_VIIRS.blanco}
            numberColor={PALETTE_VIIRS.alta}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.pico}
            title="Pico de Densidad"
            subtitle="Niveles (Supertall)"
            titleColor={PALETTE_VIIRS.blanco}
            numberColor={PALETTE_VIIRS.media}
            styles={s}
          />
          <ScorecardItem 
            number={kpis.radiancia}
            title="Validación VIIRS"
            subtitle="Promedio Radiancia Top 10%"
            titleColor={PALETTE_VIIRS.blanco}
            numberColor={PALETTE_VIIRS.baja}
            styles={s}
          />
      </React.Fragment>
    );
}

export default React.memo(DigitalTwinScorecards);