import React from 'react';
import { PROJECTS } from '../../config/theme';
import recorridosData from '../../data/recorridos.json';

export default function Scorecards({ t }) {
  // Lógica de datos intacta
  const features = recorridosData?.features || [];
  const totalRutas = features.length;
  const kmTotal = features.reduce((acc, f) => acc + (f.properties.Longitud_km || 0), 0);
  const demandaTotal = features.reduce((acc, f) => acc + (f.properties.Demanda_Diaria || 0), 0);
  const maxSaturacion = features.reduce((max, f) => {
    const cap = f.properties.Unidad_Capacidad || 1; 
    const sat = (f.properties.Maximo_Abordo / cap) * 100;
    return sat > max ? sat : max;
  }, 0);

  const RUTAS_COLORS = PROJECTS.viajaSegura.ramp.rutas;

  // Diseño, fuentes y colores intactos
  const s = {
    card: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', height: '100%', minHeight: '80px', backgroundColor: 'rgba(21, 24, 35, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '5px', boxSizing: 'border-box' },
    number: { color: '#A020F0', fontFamily: "'Source Code Pro', monospace", fontSize: '22px', fontWeight: '700', marginBottom: '4px', lineHeight: '1' },
    title: { fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', color: '#FFFFFF' },
    subtitle: { color: '#B4A7AF', fontFamily: "'Inter', sans-serif", fontSize: '8px', fontWeight: '500', lineHeight: '1.2', opacity: 0.8 }
  };

  return (
    <React.Fragment>
      <div style={s.card}>
        <div style={s.number}>{totalRutas}</div>
        <div style={s.title}>{t.scorecards.rutas}</div>
        <div style={s.subtitle}>{t.scorecards.rutas_sub}</div>
      </div>
      
      <div style={s.card}>
        <div style={s.number}>{Math.round(kmTotal)} km</div>
        <div style={{...s.title, color: RUTAS_COLORS.oyamel}}>{t.scorecards.conexion}</div>
        <div style={s.subtitle}>{t.scorecards.conexion_sub}</div>
      </div>
      
     <div style={s.card}>
       <div style={s.number}>+{demandaTotal.toLocaleString()}</div>
       <div style={{...s.title, color: RUTAS_COLORS.antigua}}>{t.scorecards.viajes}</div>
       <div style={s.subtitle}>{t.scorecards.viajes_sub}</div>
     </div>
      
      <div style={s.card}>
        <div style={s.number}>{Math.round(maxSaturacion)}%</div>
        <div style={{...s.title, color: RUTAS_COLORS.ocotal}}>{t.scorecards.sobrecarga}</div>
        <div style={s.subtitle}>{t.scorecards.sobrecarga_sub}</div>
      </div>
    </React.Fragment>
  );
}