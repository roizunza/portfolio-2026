import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';
import { PROJECTS, STYLES } from '../../config/theme';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function AlgoritmoInmobiliarioMap({ t }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const overlay = useRef(null);
  
  const [buildingData, setBuildingData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  // 1. Fetch de datos forzando salida en GeoJSON nativo
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        // Extraccion de variables de entorno para evitar errores de sintaxis en Babel
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/buildings_3d?select=*;`
        
        const response = await fetch(url, {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Accept: 'application/geo+json' 
          }
        });
        
        const data = await response.json();
        console.log("Datos que llegaron de Supabase:", data);
        setBuildingData(data);
      } catch (error) {
        console.error("Error al cargar gemelo digital:", error);
      }
    };
    
    fetchBuildings();
  }, []);

  // 2. Inicializacion de Mapbox
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [106.5516, 29.5630], 
      zoom: 14,
      pitch: 55,
      bearing: -20,
      antialias: true
    });

    overlay.current = new MapboxOverlay({
      interleaved: true,
      layers: []
    });

    map.current.addControl(overlay.current);
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  }, []);

  // 3. Renderizado de la capa 3D Cyberpunk
  useEffect(() => {
    if (!overlay.current || !buildingData) return;

    const buildingLayer = new GeoJsonLayer({
      id: 'digital-twin-buildings',
      data: buildingData,
      extruded: true,
      stroked: true,
      filled: true,
      wireframe: true,
      getElevation: f => f.properties.elevation || 15,
      getFillColor: f => {
        const alt = f.properties.elevation || 0;
        if (alt > 150) return [255, 0, 128, 255];   
        if (alt > 80) return [0, 255, 255, 220];    
        if (alt > 30) return [40, 100, 255, 180];   
        return [24, 29, 53, 150];                   
      },
      getLineColor: [255, 255, 255, 20],
      pickable: true,
      onHover: info => setHoverInfo(info)
    });

    overlay.current.setProps({
      layers: [buildingLayer]
    });
  }, [buildingData]);

  if (!t || !t.map) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Tooltip Dinamico Deck.gl */}
      {hoverInfo && hoverInfo.object && (
        <div style={{
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'none',
          left: hoverInfo.x,
          top: hoverInfo.y,
          backgroundColor: 'rgba(24, 29, 53, 0.85)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          color: '#e0e0e0',
          borderRadius: '4px',
          padding: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          fontFamily: fontBody,
          fontSize: '11px',
          minWidth: '150px',
          transform: 'translate(-50%, -110%)'
        }}>
          <div style={{ color: '#00ffff', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px', marginBottom: '4px' }}>
            ID: {hoverInfo.object.properties.id || 'N/A'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ color: '#aaa' }}>Altura Inferida:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{Math.round(hoverInfo.object.properties.elevation || 0)} m</span>
          </div>
        </div>
      )}

      {/* Leyenda Cybercore */}
      <div style={{...STYLES.legendBox, backgroundColor: 'rgba(10, 10, 15, 0.8)', border: '1px solid #333'}}>
        <h4 style={{...STYLES.legendTitle, color: '#fff'}}>Morfología Urbana Inyectada</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgb(255, 0, 128)', marginRight: '8px' }}></div>
          &gt; 150m (Rascacielos)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgb(0, 255, 255)', marginRight: '8px' }}></div>
          80m - 150m (Alta Densidad)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgb(24, 29, 53)', border: '1px solid #555', marginRight: '8px' }}></div>
          &lt; 30m (Tejido Base)
        </div>
      </div>
    </div>
  );
}