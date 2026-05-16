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

  const RAMP = {
    safe: '#56E07A',     // Verde Neón
    orphan: '#8b273b',   // Rojo Peligro
    temple: '#ffffff',   // Morado Santuario
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
        'paint': { 'hillshade-exaggeration': 0.8, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(178, 102, 255, 0.1)' }
      });

      // 1. CARGA DE CALLES 3D (Local)
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
          'line-opacity': 0.8 // Visibles por defecto
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
            ['==', ['get', 'orphan_off_0m'], true], RAMP.orphan,
            ['==', ['get', 'saved_by_temple_0m'], true], RAMP.temple,
            RAMP.safe
          ],
          'circle-opacity': 1.0
        }
      });

      // --- INICIO CAMBIOS: SIMBOLOGÍA DE TEMPLOS ALZADA ---
      
      // Creamos un ícono vectorial flotante con anclaje al piso (en formato SVG directo)
      // %23 reemplaza al # para el código de color HEX
      const svgIcon = `<svg width="40" height="64" viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="36" x2="20" y2="64" stroke="%23B266FF" stroke-width="2" stroke-opacity="0.8" />
        <rect x="4" y="4" width="32" height="32" rx="4" fill="%230d0f16" stroke="%23B266FF" stroke-width="2" />
        <path d="M10 24L10 26L30 26L30 24L26 24L26 14L30 14L30 12L10 12L10 14L14 14L14 24L10 24Z" fill="%23B266FF" />
      </svg>`;

      const img = new Image(40, 64);
      img.onload = () => {
        if (!map.current.hasImage('floating-temple')) {
          map.current.addImage('floating-temple', img);
        }
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + svgIcon;

      // 3. CARGA DE TEMPLOS (Local)
      map.current.addSource('temples-source', { 
        type: 'geojson', 
        data: templesUrl 
      });
      
      map.current.addLayer({
        'id': 'temples-layer',
        'type': 'symbol', // Cambiamos de circle a symbol
        'source': 'temples-source',
        'layout': {
          'icon-image': 'floating-temple',
          'icon-anchor': 'bottom', // El punto inferior del SVG toca el suelo
          'icon-pitch-alignment': 'viewport', // Obliga al ícono a verse levantado (efecto "billboard")
          'icon-allow-overlap': true,
          'icon-size': 0.5
        }
      });
      // --- FIN CAMBIOS ---

      setMapLoaded(true);
    });
  }, []);

  // Hook dinamico: Reacciona al slider para aplicar el "Manto Negro"
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Evaluacion topografica: Si waterLevel es 0, fingimos negativo para que nada se apague
    const currentFloodLevel = waterLevel === 0 ? -999 : waterLevel;

    // APAGAR CALLES SUMERGIDAS (Manto Negro)
    map.current.setPaintProperty('roads-layer', 'line-opacity', [
      'case',
      ['<=', ['get', 'min_elevation'], currentFloodLevel], 0.0, // Apagada
      0.8 // Visible
    ]);

    // Campos de simulación dinamicos (vienen del Tileset)
    const orphanField = `orphan_off_${waterLevel}m`;
    const templeField = `saved_by_temple_${waterLevel}m`;

    // ACTUALIZAR COLORES DE NODOS
    map.current.setPaintProperty('nodes-layer', 'circle-color', [
      'case',
      ['==', ['get', orphanField], true], RAMP.orphan,
      ['==', ['get', templeField], true], RAMP.temple,
      RAMP.safe
    ]);

    // ACTUALIZAR OPACIDAD DE NODOS (Desvanecer sumergidos)
    map.current.setPaintProperty('nodes-layer', 'circle-opacity', [
      'case',
      ['all', ['==', ['get', orphanField], true], ['==', ['get', templeField], false]], 0.1, // Hundido -> Casi invisible
      1.0 // Seguro/Rescatado -> Brillante
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

      {/* Leyenda y Slider siguen igual */}
      <div className="dtc-legend" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div className="tsunami-slider-container" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className="dtc-legend-title" style={{ marginBottom: '10px', fontSize: '14px', color: '#fff' }}>
            Nivel de Tsunami: <span style={{ color: RAMP.safe }}>{waterLevel}m</span>
          </h3>
          <input 
            type="range" 
            min="0" 
            max="30" 
            step="10" 
            value={waterLevel}
            onChange={(e) => setWaterLevel(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: RAMP.safe }}
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
              Acceso a Refugio (Seguro)
            </div>
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.temple, boxShadow: `0 0 5px ${RAMP.temple}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              Rescate por Templo
            </div>
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.orphan, boxShadow: `0 0 5px ${RAMP.orphan}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              Nodo Aislado (Huérfano)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}