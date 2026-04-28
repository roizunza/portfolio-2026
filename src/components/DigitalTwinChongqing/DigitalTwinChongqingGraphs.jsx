import React, { useState, useEffect, useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function DigitalTwinGraphs() {
  const [data, setData] = useState([]);
  
  // Paleta de colores extraida del mapa
  const PALETTE = {
    base: '#051447',
    media: '#024b45',
    alta: '#0db4ac',
    rascacielos: '#04da88',
    viirsBaja: '#052785',
    viirsAlta: '#05b7c4'
  };

  const borderColor = getCssVar('--borde-sutil') || 'rgba(255,255,255,0.1)';
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';
  const textSecondary = getCssVar('--texto-secundario') || '#b0b3b8';

  // Consumo directo desde Supabase
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        // Limitamos a 3000 registros ordenados para no saturar el DOM con SVG, pero representando los extremos
        const url = `${baseUrl}/rest/v1/chongqingZ_inferred_buildings?select=dist_transit_eq,inferred_levels,inferred_height_m,poi_count_200m,road_weight,val_viirs&order=inferred_height_m.desc.nullslast&limit=3000`;
        const response = await fetch(url, {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' }
        });
        const result = await response.json();
        setData(result);
      } catch (error) { 
        console.error("Error al obtener datos para graficas:", error); 
      }
    };
    fetchGraphData();
  }, []);

  // Procesamiento para Grafica de Dispersion
  const scatterData = useMemo(() => {
    return data.map((d, index) => {
      let color = PALETTE.base;
      if (d.inferred_height_m > 150) color = PALETTE.rascacielos;
      else if (d.inferred_height_m > 90) color = PALETTE.alta;
      else if (d.inferred_height_m > 30) color = PALETTE.media;

      return {
        id: index,
        x: Math.round(d.dist_transit_eq || 0),
        y: d.inferred_levels || 0,
        z: 50,
        height: Math.round(d.inferred_height_m || 0),
        fill: color
      };
    });
  }, [data]);

  // Procesamiento para Grafica de Radar (Calculando promedios por decil/estrato)
  const radarData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const topTier = data.filter(d => d.inferred_levels >= 40);
    const baseTier = data.filter(d => d.inferred_levels <= 6);

    const getAvg = (arr, key) => arr.reduce((sum, item) => sum + (item[key] || 0), 0) / (arr.length || 1);

    const maxPoi = Math.max(...data.map(d => d.poi_count_200m || 0)) || 1;
    const maxDist = Math.max(...data.map(d => d.dist_transit_eq || 0)) || 1;
    const maxViirs = Math.max(...data.map(d => d.val_viirs || 0)) || 1;

    // Normalizacion 0-100 para comparar en el mismo eje del radar
    const calcMetrics = (subset) => ({
      poi: (getAvg(subset, 'poi_count_200m') / maxPoi) * 100,
      road: getAvg(subset, 'road_weight'), 
      access: 100 - ((getAvg(subset, 'dist_transit_eq') / maxDist) * 100), // Invertido: Menor distancia = Mayor puntaje
      viirs: (getAvg(subset, 'val_viirs') / maxViirs) * 100
    });

    const topMetrics = calcMetrics(topTier);
    const baseMetrics = calcMetrics(baseTier);

    return [
      { subject: 'Densidad Comercial', Rascacielos: topMetrics.poi, TejidoBase: baseMetrics.poi },
      { subject: 'Capacidad Vial', Rascacielos: topMetrics.road, TejidoBase: baseMetrics.road },
      { subject: 'Acceso Topográfico', Rascacielos: topMetrics.access, TejidoBase: baseMetrics.access },
      { subject: 'Radiancia (VIIRS)', Rascacielos: topMetrics.viirs, TejidoBase: baseMetrics.viirs }
    ];
  }, [data]);

  const CustomTooltipScatter = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '8px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'4px', margin: 0}}>Parcela Evaluada</p>
          <div style={{ color: 'var(--texto-secundario)' }}>Fricción Topográfica: <span style={{color:'#fff'}}>{pData.x} m</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>Niveles Inferidos: <span style={{color:'#fff'}}>{pData.y}</span></div>
          <div style={{ color: 'var(--texto-secundario)' }}>Altura Constructiva: <span style={{color: pData.fill, fontWeight: 'bold'}}>{pData.height} m</span></div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipRadar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--fondo-panel)', border: '1px solid var(--borde-sutil)', padding: '6px', fontFamily: 'var(--fuente-ui)', fontSize: '10px' }}>
          <p style={{color: 'white', fontWeight: 'bold', marginBottom:'3px', margin: 0}}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: entry.color }}></span>
              <span style={{ color: 'var(--texto-secundario)' }}>{entry.name}: <span style={{ color: '#fff', fontWeight: 'bold' }}>{Math.round(entry.value)}%</span></span>
            </div>
          ))}
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
          <div style={styles.title}>Fricción Espacial vs. Escala Constructiva</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(PALETTE.rascacielos)}></span> Rascacielos (Top 5%)</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(PALETTE.media)}></span> Densidad Media</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(PALETTE.base)}></span> Tejido Base</div>
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{top: 10, right: 10, bottom: 10, left: -10}}>
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Distancia Equivalente" 
                unit="m"
                tick={{fontSize: 10, fill: textSecondary}} 
                tickLine={false} 
                axisLine={{stroke: borderColor}}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Niveles Inferidos" 
                tick={{fontSize: 10, fill: textSecondary}} 
                tickLine={false} 
                axisLine={{stroke: borderColor}} 
              />
              <ZAxis type="number" dataKey="z" range={[20, 20]} /> 
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltipScatter />} />
              <Scatter name="Parcelas" data={scatterData}>
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
          <div style={styles.title}>El ADN de un Rascacielos</div>
          <div style={styles.legend}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(PALETTE.rascacielos)}></span> Rascacielos</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={styles.dot(PALETTE.base)}></span> Tejido Base</div>
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
              <PolarGrid stroke={borderColor} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: textSecondary, fontSize: 9, fontFamily: fontBody }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={<CustomTooltipRadar />} />
              <Radar name="Rascacielos" dataKey="Rascacielos" stroke={PALETTE.rascacielos} fill={PALETTE.rascacielos} fillOpacity={0.5} />
              <Radar name="Tejido Base" dataKey="TejidoBase" stroke={PALETTE.base} fill={PALETTE.base} fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}