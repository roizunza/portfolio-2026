import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { PROJECTS, STYLES } from '../../config/theme';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function AlgoritmoInmobiliarioMap({ t }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const overlay = useRef(null);
  
  const [buildingData, setBuildingData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); 

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  // Fetch de datos desde Supabase
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const url = `${baseUrl}/rest/v1/buildings_3d?select=*&limit=20000`;
        
        const response = await fetch(url, {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            Accept: 'application/geo+json' 
          }
        });
        
        const data = await response.json();
        setBuildingData(data);
      } catch (error) {
        console.error("Error al cargar gemelo digital:", error);
      }
    };
    fetchBuildings();
  }, []);

  // Inicializacion de Mapbox y Topografia Segmentada
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [106.5516, 29.5630], 
      zoom: 13.5,
      pitch: 60,
      bearing: -20,
      antialias: true
    });

    overlay.current = new MapboxOverlay({
      interleaved: true,
      layers: []
    });
    map.current.addControl(overlay.current);
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.current.on('style.load', () => {
      map.current.setPaintProperty('background', 'background-color', '#181b2b');

      map.current.setFog({
        'range': [0.5, 3],
        'color': '#0d0f16', 
        'high-color': '#12141E',
        'horizon-blend': 0.2
      });

      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer',
        'type': 'hillshade',
        'source': 'mapbox-dem',
        'paint': {
          'hillshade-exaggeration': 1.0,
          'hillshade-shadow-color': '#05060a', 
          'hillshade-highlight-color': 'rgba(86, 224, 122, 0.15)', 
          'hillshade-accent-color': '#12141E'
        }
      });

      map.current.addLayer({
        'id': 'water-layer',
        'type': 'fill',
        'source': 'composite',
        'source-layer': 'water',
        'paint': {
          'fill-color': '#47d3f4', 
          'fill-opacity': 0.25 
        }
      });

      const holoColor = '#56e07a'; 
      map.current.addSource('mapbox-terrain-vector', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
      });
      
      // Curvas de Nivel Inferiores (< 220m)
      map.current.addLayer({
        'id': 'contour-glow-base',
        'type': 'line',
        'source': 'mapbox-terrain-vector',
        'source-layer': 'contour',
        'filter': ['<', ['get', 'ele'], 220],
        'paint': {
          'line-color': holoColor,
          'line-width': 4,
          'line-blur': 4,
          'line-opacity': 0.15
        }
      });
      
      map.current.addLayer({
        'id': 'contour-core-base',
        'type': 'line',
        'source': 'mapbox-terrain-vector',
        'source-layer': 'contour',
        'filter': ['<', ['get', 'ele'], 220],
        'paint': {
          'line-color': holoColor,
          'line-width': 1.0,
          'line-opacity': 0.25
        }
      });

      // Curvas de Nivel Superiores (>= 220m)
      map.current.addLayer({
        'id': 'contour-core-top',
        'type': 'line',
        'source': 'mapbox-terrain-vector',
        'source-layer': 'contour',
        'filter': ['>=', ['get', 'ele'], 220],
        'paint': {
          'line-color': '#7a8b99',
          'line-width': 0.8, 
          'line-dasharray': [4, 3],
          'line-opacity': 0.8 
        }
      });

      setMapLoaded(true);
    });
  }, []);

  // Renderizado de Edificios 3D ajustado a brincos estadisticos
  useEffect(() => {
    if (!buildingData || !mapLoaded || !map.current) return;

    if (map.current.getSource('digital-twin-source')) {
      map.current.getSource('digital-twin-source').setData(buildingData);
    } else {
      map.current.addSource('digital-twin-source', {
        type: 'geojson',
        data: buildingData
      });

      map.current.addLayer({
        'id': 'digital-twin-buildings',
        'type': 'fill-extrusion',
        'source': 'digital-twin-source',
        'paint': {
          'fill-extrusion-height': ['coalesce', ['to-number', ['get', 'inferred_height_m']], 9],
          'fill-extrusion-color': [
            'step',
            ['coalesce', ['to-number', ['get', 'inferred_height_m']], 0],
            '#2a065c',     // Tejido Base (< 25m)
            25, '#4c72ea', // Media Densidad (25m - 65m)
            65, '#f24c3b'  // Alta Densidad (> 65m)
          ],
          'fill-extrusion-opacity': 0.85
        }
      });

      map.current.on('mousemove', 'digital-twin-buildings', (e) => {
        if (e.features.length > 0) {
          map.current.getCanvas().style.cursor = 'pointer';
          setHoverInfo({
            x: e.point.x,
            y: e.point.y,
            object: { properties: e.features[0].properties }
          });
        }
      });

      map.current.on('mouseleave', 'digital-twin-buildings', () => {
        map.current.getCanvas().style.cursor = '';
        setHoverInfo(null);
      });
    }
  }, [buildingData, mapLoaded]);

  if (!t || !t.map) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {hoverInfo && hoverInfo.object && (
        <div style={{
          position: 'absolute', zIndex: 1, pointerEvents: 'none',
          left: hoverInfo.x, top: hoverInfo.y,
          backgroundColor: 'rgba(18, 20, 30, 0.9)', backdropFilter: 'blur(5px)',
          border: '1px solid rgba(0, 229, 255, 0.3)', color: '#e0e0e0',
          borderRadius: '4px', padding: '8px', fontFamily: fontBody, fontSize: '11px',
          minWidth: '150px', transform: 'translate(-50%, -110%)'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px', marginBottom: '4px' }}>
            ID: {hoverInfo.object.properties.id || hoverInfo.object.properties.fid || 'N/A'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ color: '#aaa' }}>Niveles:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{hoverInfo.object.properties.inferred_levels || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Altura:</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{Math.round(Number(hoverInfo.object.properties.inferred_height_m) || 0)} m</span>
          </div>
        </div>
      )}

      <div style={{...STYLES.legendBox, backgroundColor: 'rgba(13, 15, 22, 0.85)', border: '1px solid #333', width: '160px'}}>
        <h4 style={{...STYLES.legendTitle, color: '#fff', marginBottom: '8px'}}>Intensidad Constructiva</h4>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f24c3b', marginRight: '8px' }}></div>
          &gt; 65m (Alta Densidad)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4c72ea', marginRight: '8px' }}></div>
          25m - 65m (Media Dens)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2a065c', marginRight: '8px' }}></div>
          &lt; 25m (Tejido Base)
        </div>
      </div>
    </div>
  );
}