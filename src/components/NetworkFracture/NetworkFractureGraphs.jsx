import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function RasterVisor({ t, waterLevel }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // System color palette definition (Sincronizada con el mapa)
  const COLORS = {
    safe: '#8C92AC',      // Gris: Normalidad Operativa
    temple: '#56E07A',    // Verde Neón: Rescate por Templo
    orphan: '#FF2A55',    // Rojo Peligro: Aislado / Colapso Total
    background: '#0d0f16' // Fondo oscuro de tus paneles
  };

  // Static matrix from spatial audit (0m a 30m)
  const DATA_MATRIX = [
    { level: 0, safe: 5932, temple: 0, orphan: 0 },
    { level: 10, safe: 4662, temple: 172, orphan: 1098 },
    { level: 20, safe: 2209, temple: 670, orphan: 3053 },
    { level: 30, safe: 958, temple: 776, orphan: 4198 }
  ];

  // Dynamic filtering for donut chart logic
  const currentData = useMemo(() => {
    const lvl = waterLevel !== undefined ? waterLevel : 0;
    return DATA_MATRIX.find(d => d.level === lvl) || DATA_MATRIX[0];
  }, [waterLevel]);

  const pieData = useMemo(() => {
    if (currentData.level === 0) {
      return [{ name: 'Normalidad Operativa', value: currentData.safe, color: COLORS.safe }];
    }
    return [
      { name: 'Aislamiento Critico', value: currentData.orphan, color: COLORS.orphan },
      { name: 'Rescate por Templo', value: currentData.temple, color: COLORS.temple }
    ];
  }, [currentData]);

  // Bar chart tooltip formatter (Look mas tecnico)
  const CustomTooltipBar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#12141E', padding: '12px', border: '1px solid #333', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '12px', fontWeight: 'bold', fontFamily: 'var(--fuente-ui)' }}>Inundacion: {label}m</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '0 0 4px 0', color: entry.color, fontSize: '12px', fontFamily: 'var(--fuente-datos)' }}>
              {entry.name}: <span style={{color: '#fff', fontWeight: 'bold'}}>{entry.value}</span>
            </p>
          ))}
          <p style={{ margin: '8px 0 0 0', borderTop: '1px solid #333', paddingTop: '8px', color: '#888', fontSize: '11px', fontFamily: 'var(--fuente-datos)' }}>Total Infraestructura: 5932</p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#12141E', padding: '10px', border: '1px solid #333', borderRadius: '4px' }}>
          <p style={{ margin: 0, color: data.color, fontSize: '12px', fontWeight: 'bold', fontFamily: 'var(--fuente-datos)' }}>
            {data.name}: {data.value} calles
          </p>
        </div>
      );
    }
    return null;
  };

  const totalVulnerable = currentData.orphan + currentData.temple;
  const rescueEfficiency = totalVulnerable > 0 
    ? ((currentData.temple / totalVulnerable) * 100).toFixed(1) 
    : 0;

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        width: '100%', 
        height: '100%', 
        gap: '15px', 
        padding: '10px',
        overflow: 'hidden' 
    }}>
      
      {/* NUEVA GRAFICA: BARRAS APILADAS HORIZONTALES (TECNICA Y LIMPIA) */}
      <div style={{
          flex: 1, 
          minHeight: '250px', 
          backgroundColor: 'var(--fondo-panel, #0d0f16)',
          borderRadius: '8px', 
          border: '1px solid #333',
          display: 'flex', 
          flexDirection: 'column', 
          padding: '15px'
      }}>
        <h2 style={{ fontSize: '14px', color: '#fff', margin: '0 0 15px 0', letterSpacing: '0.5px', fontFamily: 'var(--fuente-ui)' }}>
          Evolucion de la Fractura Territorial
        </h2>
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {/* BarChart con layout="vertical". Usamos DATA_MATRIX (0m a 30m) para que 0m quede abajo. */}
            <BarChart layout="vertical" data={DATA_MATRIX} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
              
              {/* Eje X numérico */}
              <XAxis type="number" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} />
              
              {/* Eje Y categórico (Elevación). Recharts por defecto pone el primer indice abajo. */}
              <YAxis dataKey="level" type="category" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} tickFormatter={(val) => `${val}m`} axisLine={false} tickLine={false} />
              
              {/* Cursor personalizado para resaltar la barra al hacer hover */}
              <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              
              {/* Barras Apiladas (stackId="a"). Sin animacion para maxima fluidez al mover slider. */}
              <Bar dataKey="safe" name="Normalidad" stackId="a" fill={COLORS.safe} isAnimationActive={false} barSize={25} />
              <Bar dataKey="temple" name="Rescate" stackId="a" fill={COLORS.temple} isAnimationActive={false} barSize={25} />
              {/* La última barra tiene radio en las esquinas derechas para un acabado mas pulido */}
              <Bar dataKey="orphan" name="Colapso" stackId="a" fill={COLORS.orphan} isAnimationActive={false} barSize={25} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ANILLO DINÁMICO (Se mantiene igual, solo pulimos estilos) */}
      <div style={{
          flex: 1, 
          minHeight: '250px', 
          backgroundColor: 'var(--fondo-panel, #0d0f16)',
          borderRadius: '8px', 
          border: '1px solid #333',
          display: 'flex', 
          flexDirection: 'column', 
          padding: '15px',
          position: 'relative'
      }}>
        <h2 style={{ fontSize: '14px', color: '#fff', margin: '0 0 5px 0', letterSpacing: '0.5px', fontFamily: 'var(--fuente-ui)' }}>
          Absorcion del Impacto de Red
        </h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#888', fontFamily: 'var(--fuente-datos)' }}>Escenario actual: {waterLevel || 0}m de inundacion</p>
        
        <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
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
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontFamily: 'var(--fuente-datos)'
          }}>
            {currentData.level === 0 ? (
              <span style={{ color: COLORS.safe, fontSize: '20px', fontWeight: 'bold' }}>100%</span>
            ) : (
              <>
                <span style={{ color: COLORS.temple, fontSize: '26px', fontWeight: 'bold', textShadow: `0 0 10px ${COLORS.temple}44` }}>{rescueEfficiency}%</span>
                <br/>
                <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mitigacion</span>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}