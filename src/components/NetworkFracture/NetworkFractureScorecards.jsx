import React, { useMemo, useState, useEffect } from 'react';

export default function Scorecards({ t, waterLevel }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Paleta de resiliencia (sincronizada con mapa y gráficas)
  const COLORS = {
    safe: '#8C92AC',      // Gris normalidad
    temple: '#56E07A',    // Verde rescate
    orphan: '#FF2A55',    // Rojo colapso
    text: '#FFFFFF'       // Blanco puro para KPIs neutrales
  };

  // Matriz espacial estática
  const DATA_MATRIX = [
    { level: 0, safe: 5932, temple: 0, orphan: 0 },
    { level: 10, safe: 4662, temple: 172, orphan: 1098 },
    { level: 20, safe: 2209, temple: 670, orphan: 3053 },
    { level: 30, safe: 958, temple: 776, orphan: 4198 }
  ];

  const TOTAL_INFRASTRUCTURE = 5932;

  // Motor de cálculo de los insights
  const kpis = useMemo(() => {
    const lvl = waterLevel !== undefined ? waterLevel : 0;
    const currentData = DATA_MATRIX.find(d => d.level === lvl) || DATA_MATRIX[0];

    // Total de calles que ya no llegan al refugio del gobierno
    const totalVulnerables = currentData.orphan + currentData.temple;
    
    // Qué porcentaje de la ciudad ya se perdió
    const deficitGubernamental = ((totalVulnerables / TOTAL_INFRASTRUCTURE) * 100).toFixed(1);
    
    // Qué porcentaje logra rescatar la red de templos
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
      backgroundColor: 'var(--fondo-panel, #0d0f16)', 
      borderRadius: '8px', padding: '5px',
      border: '1px solid #333',
      backdropFilter: 'blur(10px)'
    },
    number: {
      fontFamily: 'var(--fuente-datos)', fontSize: '24px', fontWeight: '700', marginBottom: '4px', lineHeight: '1'
    },
    title: {
      fontFamily: 'var(--fuente-ui)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px',
    },
    subtitle: {
      color: 'var(--texto-secundario, #888)', fontFamily: 'var(--fuente-ui)', fontSize: '9px', fontWeight: '500', lineHeight: '1.2', opacity: 0.8
    }
  };

  if (!isMounted) return null;

  return (
    <React.Fragment>
      
      {/* TARJETA 1: El tamaño del problema */}
      <div style={s.card}>
        <div style={{ ...s.number, color: kpis.impactoTotal > 0 ? COLORS.orphan : COLORS.safe }}>
          {kpis.impactoTotal}
        </div>
        <div style={{ ...s.title, color: kpis.impactoTotal > 0 ? COLORS.orphan : COLORS.safe }}>
          Impacto Territorial
        </div>
        <div style={s.subtitle}>Calles vulnerables (Aisladas + Rescatadas)</div>
      </div>

      {/* TARJETA 2: La falla del gobierno */}
      <div style={s.card}>
        <div style={{ ...s.number, color: kpis.deficit > 0 ? COLORS.orphan : COLORS.safe }}>
          {kpis.deficit}%
        </div>
        <div style={{ ...s.title, color: kpis.deficit > 0 ? COLORS.orphan : COLORS.safe }}>
          Déficit Oficial
        </div>
        <div style={s.subtitle}>Red vial sin acceso a refugios de gobierno</div>
      </div>

      {/* TARJETA 3: El peso sobre el patrimonio */}
      <div style={s.card}>
        <div style={{ ...s.number, color: kpis.cargaPatrimonial > 0 ? COLORS.temple : COLORS.safe }}>
          {kpis.cargaPatrimonial}
        </div>
        <div style={{ ...s.title, color: kpis.cargaPatrimonial > 0 ? COLORS.temple : COLORS.safe }}>
          Carga Patrimonial
        </div>
        <div style={s.subtitle}>Nodos sostenidos por infraestructura histórica</div>
      </div>

      {/* TARJETA 4: El éxito del modelo (Tesis) */}
      <div style={s.card}>
        <div style={{ ...s.number, color: kpis.impactoTotal > 0 ? COLORS.temple : COLORS.safe }}>
          {kpis.impactoTotal === 0 ? "100%" : `${kpis.eficiencia}%`}
        </div>
        <div style={{ ...s.title, color: kpis.impactoTotal > 0 ? COLORS.temple : COLORS.safe }}>
          Eficiencia de Rescate
        </div>
        <div style={s.subtitle}>Absorción total de calles vulnerables</div>
      </div>

    </React.Fragment>
  );
}