import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PROJECTS } from '../../config/theme.js';

import roadsUrl from '../../data/NetworkFracture/kamakura_edges_3d_wgs84.geojson?url';
import templesUrl from '../../data/NetworkFracture/kamakura_temples_wgs84.geojson?url';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Función para generar una base geométrica a los templos que solo son puntos
const createHexagonPolygon = (center, radius) => {
  const coordinates = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    coordinates.push([
      center[0] + radius * Math.cos(angle) * 1.2, 
      center[1] + radius * Math.sin(angle)
    ]);
  }
  coordinates.push(coordinates[0]); 
  return [coordinates];
};

export default function NetworkFractureMap({ t: propT, waterLevel, setWaterLevel }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const RAMP = PROJECTS.networkfracture.ramp;
  
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
      style: 'mapbox://styles/mapbox/dark-v11',
      center: CAMERA.center, 
      zoom: CAMERA.zoom, 
      pitch: CAMERA.pitch3D, 
      bearing: CAMERA.bearing3D, 
      antialias: true
    });

    map.current.on('style.load', () => {
      map.current.setFog({ 'range': [0.5, 3], 'color': RAMP.background, 'high-color': '#12141E', 'horizon-blend': 0.2 });

      map.current.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512 });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer', 'type': 'hillshade', 'source': 'mapbox-dem',
        'paint': { 'hillshade-exaggeration': 0.8, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(255, 255, 255, 0.05)' }
      });

      // CAPA DE AGUA
      map.current.addLayer({
        'id': 'water-layer', 'type': 'fill', 'source': 'composite', 'source-layer': 'water',
        'paint': { 'fill-color': RAMP.water, 'fill-opacity': 0.80 }
      });

      // 1. CARGA DE CALLES
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

      // 2. CARGA DE NODOS
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
            ['==', ['get', 'saved_by_temple_0m'], true], RAMP.temple,
            ['==', ['get', 'orphan_off_0m'], true], RAMP.orphan,
            RAMP.safe
          ],
          'circle-opacity': 1.0
        }
      });

      // 3. CARGA DE TEMPLOS (Extrusión Volumétrica 3D)
      fetch(templesUrl)
        .then(response => response.json())
        .then(data => {
          const extrudedFeatures = data.features.map(feature => {
            if (feature.geometry.type === 'Point') {
              return {
                ...feature,
                geometry: {
                  type: 'Polygon',
                  coordinates: createHexagonPolygon(feature.geometry.coordinates, 0.00015) 
                },
                properties: { ...feature.properties, height: 18 } 
              };
            }
            return {
              ...feature,
              properties: { ...feature.properties, height: 18 }
            };
          });

          map.current.addSource('temples-extrusion-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: extrudedFeatures }
          });

          map.current.addLayer({
            'id': 'temples-extrusion-layer',
            'type': 'fill-extrusion',
            'source': 'temples-extrusion-source',
            'paint': {
              'fill-extrusion-color': RAMP.templeCore, 
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.95
            }
          });

          setMapLoaded(true);
        });
    });
  }, []);

  // Hook dinamico: Reacciona al slider
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const currentFloodLevel = waterLevel === 0 ? -999 : waterLevel;

    map.current.setPaintProperty('roads-layer', 'line-color', [
      'case',
      ['<=', ['get', 'min_elevation'], currentFloodLevel], RAMP.water, 
      RAMP.road 
    ]);

    const orphanField = `orphan_off_${waterLevel}m`;
    const templeField = `saved_by_temple_${waterLevel}m`;

    map.current.setPaintProperty('nodes-layer', 'circle-color', [
      'case',
      ['==', ['get', templeField], true], RAMP.temple,
      ['==', ['get', orphanField], true], RAMP.orphan,
      RAMP.safe
    ]);

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

  // Prevenir crasheo si las traducciones no han cargado
  if (!tMap) return null;

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

      <div className="dtc-legend">
        
        <h3 className="dtc-legend-title">{tMap.simbologia}</h3>

        {/* Sección de Simulación (Slider) */}
        <div>
          <div className="dtc-section-header">
            <h4 className="dtc-section-title">{tMap.simulacion}</h4>
          </div>
          <div className="dtc-section-content" style={{ padding: '10px 0' }}>
            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#fff' }}>
               <span style={{ color: RAMP.templeCore, fontWeight: 'bold' }}>{waterLevel}m</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              step="10" 
              value={waterLevel}
              onChange={(e) => setWaterLevel(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: RAMP.templeCore }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginTop: '5px' }}>
              <span>0m</span><span>10m</span><span>20m</span><span>30m</span>
            </div>
          </div>
        </div>

        {/* Sección de Mapa Base */}
        <div style={{ marginTop: '15px' }}>
          <div className="dtc-section-header">
            <h4 className="dtc-section-title">{tMap.mapaBase}</h4>
          </div>
          <div className="dtc-section-content">
            
            {/* 1. Volumetría de Templo */}
            <div className="dtc-legend-item">
              <div style={{ width: '12px', height: '12px', backgroundColor: RAMP.templeCore, border: '1px solid #666', transform: 'rotateX(45deg) rotateZ(45deg)', marginRight: '10px', boxShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}></div>
              {tMap.volumetria}
            </div>
            
            {/* 2. Normalidad */}
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.safe, boxShadow: `0 0 5px ${RAMP.safe}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              {tMap.normalidad}
            </div>
            
            {/* 3. Aislamiento Crítico */}
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.orphan, boxShadow: `0 0 5px ${RAMP.orphan}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              {tMap.aislado}
            </div>

            {/* 4. Rescate por Templo */}
            <div className="dtc-legend-item">
              <div className="dtc-swatch" style={{ background: RAMP.temple, boxShadow: `0 0 5px ${RAMP.temple}`, width: '10px', height: '10px', borderRadius: '50%' }}></div> 
              {tMap.resiliente}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}