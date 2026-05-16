import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '../../context/LanguageContext.jsx';

import roadsUrl from '../../data/NetworkFracture/kamakura_edges_3d_wgs84.geojson?url';
import templesUrl from '../../data/NetworkFracture/kamakura_temples_wgs84.geojson?url';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function NetworkFractureMap({ t: propT, waterLevel, setWaterLevel }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Paleta con la nueva psicología de resiliencia
  const RAMP = {
    safe: '#8C92AC',     // Gris: Normalidad / A salvo por gobierno
    orphan: '#FF2A55',   // Rojo: Colapso total / Aislado
    temple: '#56E07A',   // Verde Neón: Esperanza / Rescate por templo
    road: '#4C566A'      // Gris Nord visible para red base
  };
  
  const { t: fullT } = useLanguage();
  const tMap = fullT?.networkfracture?.map || propT?.map; 
  
  const [mapLoaded, setMapLoaded] = useState(false); 
  const [is3DView, setIs3DView] = useState(true);

  const CAMERA = {
    center: [139.5475, 35.3150], 
    zoom: 13.5,
    pitch3D: 65,
    bearing3D: -25
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Fondo oscuro
      center: CAMERA.center, 
      zoom: CAMERA.zoom, 
      pitch: CAMERA.pitch3D, 
      bearing: CAMERA.bearing3D, 
      antialias: true
    });

    map.current.on('style.load', () => {
      // Niebla dramática cyberpunk
      map.current.setFog({ 'range': [0.5, 3], 'color': '#0d0f16', 'high-color': '#12141E', 'horizon-blend': 0.2 });

      map.current.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512 });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer', 'type': 'hillshade', 'source': 'mapbox-dem',
        'paint': { 'hillshade-exaggeration': 0.8, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(255, 255, 255, 0.05)' }
      });

      // 1. CARGA DE CALLES 3D
      map.current.addSource('roads-source', { 
        type: 'geojson', 
        data: roadsUrl 
      });
      
      map.current.addLayer({
        'id': 'roads-layer',
        'type': 'line',
        'source': 'roads-source',
        'paint': {
          'line-color': RAMP.road,
          'line-width': 1.2,
          'line-opacity': 0.8 
        }
      });

      // 2. CARGA DE NODOS SIMULADOS (Tileset Mapbox)
      map.current.addSource('kamakura-nodes', {
        type: 'vector',
        url: 'mapbox://rocoellar.88lvpgyw' 
      });

      map.current.addLayer({
        'id': 'nodes-layer',
        'type': 'circle',
        'source': 'kamakura-nodes',
        'source-layer': 'kamakura_mapbox_ready-5nts2a', 
        'paint': {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 16, 4],
          'circle-stroke-width': 0,
          'circle-color': [
            'case',
            // Matriz corregida: Verde para rescates, Rojo para colapso, Gris para base
            ['==', ['get', 'saved_by_temple_0m'], true], RAMP.temple,
            ['==', ['get', 'orphan_off_0m'], true], RAMP.orphan,
            RAMP.safe
          ],
          'circle-opacity': 1.0
        }
      });

      // 3. CARGA DE TEMPLOS CON SVG VECTORIAL LIMPIO Y BLANCO
      const svgIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6C8 4.2 16 4.2 22 6V8C16 7 8 7 2 8V6Z" fill="#FFFFFF"/>
        <rect x="4" y="10" width="16" height="2" fill="#FFFFFF"/>
        <path d="M7 10L6 22H8L9 10H7Z" fill="#FFFFFF"/>
        <path d="M15 10L16 22H18L17 10H15Z" fill="#FFFFFF"/>
      </svg>`;

      const img = new Image();
      img.onload = () => {
        if (!map.current.hasImage('clean-torii')) {
          map.current.addImage('clean-torii', img);
        }
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgIcon);

      map.current.addSource('temples-source', { 
        type: 'geojson', 
        data: templesUrl 
      });
      
      map.current.addLayer({
        'id': 'temples-layer',
        'type': 'symbol',
        'source': 'temples-source',
        'layout': {
          'icon-image': 'clean-torii',
          'icon-size': 1.0,
          'icon-allow-overlap': true,
          'icon-pitch-alignment': 'viewport', // Mantiene el ícono alzado frente a la cámara
          'icon-anchor': 'bottom'
        }
      });

      setMapLoaded(true);
    });
  }, []);

  // Hook dinamico: Reacciona al slider aplicando el "Manto Negro" e invirtiendo la jerarquía
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const currentFloodLevel = waterLevel === 0 ? -999 : waterLevel;

    // APAGAR CALLES SUMERGIDAS
    map.current.setPaintProperty('roads-layer', 'line-opacity', [
      'case',
      ['<=', ['get', 'min_elevation'], currentFloodLevel], 0.0, 
      0.8 
    ]);

    const orphanField = `orphan_off_${waterLevel}m`;
    const templeField = `saved_by_temple_${waterLevel}m`;

    // ACTUALIZAR COLORES DE NODOS CON PRIORIDAD AL VERDE DE RESCATE
    map.current.setPaintProperty('nodes-layer', 'circle-color', [
      'case',
      ['==', ['get', templeField], true], RAMP.temple,
      ['==', ['get', orphanField], true], RAMP.orphan,
      RAMP.safe
    ]);

    // ACTUALIZAR OPACIDAD DE NODOS
    map.current.setPaintProperty('nodes-layer', 'circle-opacity', [
      'case',
      ['all', ['==', ['get', orphanField], true], ['==', ['get', templeField], false]], 0.1, 
      1.0 
    ]);

  }, [waterLevel, mapLoaded]);

  const handleZoomIn = () => map.current?.zoomIn({ duration: 400 });
  const handleZoomOut = () => map.current?.zoomOut({ duration: 400 });
  const handleCameraToggle = () => {
    if (is3DView) {
      map.current?.easeTo({ pitch: 0, bearing: 0, center: CAMERA.center, zoom: CAMERA.zoom, duration: 1200 });
    } else {
      map.current?.easeTo({ pitch: CAMERA.pitch3D, bearing: CAMERA.bearing3D, center: CAMERA.center, zoom: CAMERA.zoom, duration: 1200 });
    }
    setIs3DView(!is3DView);
  };

  return (
    <div className="dtc-wrapper">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <div className="dtc-nav-controls">
        <button onClick={handleZoomIn} className="dtc-nav-btn">+</button>
        <button onClick={handleZoomOut} className="dtc-nav-btn">-</button>
        <button onClick={handleCameraToggle} className="dtc-nav-btn text">
          {is3DView ? '2D' : '3D'}
        </button>
      </div>

      <div className="dtc-legend" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div className="tsunami-slider-container" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="dtc-legend-title" style={{ marginBottom: '10px', fontSize: '14px', color: '#fff' }}>
            Nivel de Tsunami: <span style={{ color: RAMP.temple }}>{waterLevel}m</span>
          </h3>
          <input 
            type="range" 
            min="0" 
            max="30" 
            step="10" 
            value={waterLevel}
            onChange={(e) => setWaterLevel(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: RAMP.temple }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginTop: '5px' }}>
            <span>0m</span><span>10m</span><span>20m</span><span>30m</span>
          </div>
        </div>

        <div>
          <h3 className="dtc-legend-title">Fractura de Red</h3>
          <div className="dtc-section-content" style={{ marginTop: '10px' }}>
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.safe, boxShadow: `0 0 5px ${RAMP.safe}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              Normalidad Operativa (Gris)
            </div>
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.temple, boxShadow: `0 0 5px ${RAMP.temple}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              Rescate por Templo (Verde)
            </div>
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.orphan, boxShadow: `0 0 5px ${RAMP.orphan}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              Aislamiento Crítico (Rojo)
            </div>
            <div className="dtc-legend-item" style={{display: 'flex', alignItems: 'center', marginTop: '8px', color: '#fff'}}>
               <span style={{fontSize: '16px', marginRight: '8px'}}>⛩</span>
              Templo Histórico (Blanco)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}