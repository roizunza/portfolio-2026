import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// Mantenemos Deck.gl listo por si lo necesitamos para los POIs (Fase 2)
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
  const [mapLoaded, setMapLoaded] = useState(false); // <-- Estado para saber cuando el mapa base esta listo

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  // 1. Fetch de datos desde Supabase
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

  // 2. Inicializacion de Mapbox: Topografia y Rios
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

    // Preparamos el canvas de Deck.gl vacio para la Fase 2 (Calles y POIs)
    overlay.current = new MapboxOverlay({
      interleaved: true,
      layers: []
    });
    map.current.addControl(overlay.current);
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.current.on('load', () => {
      // A. Topografia 3D Base
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // B. El Rio (Con mas transparencia)
      map.current.addLayer({
        'id': 'water-layer',
        'type': 'fill',
        'source': 'composite',
        'source-layer': 'water',
        'paint': {
          'fill-color': '#47d3f4', 
          'fill-opacity': 0.25 // <-- Ajuste de opacidad al azul
        }
      });

      // C. Curvas de Nivel Holográficas (Con mas transparencia)
      const holoColor = '#56e07a'; 
      map.current.addSource('mapbox-terrain-vector', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
      });
      
      // Resplandor (Blur)
      map.current.addLayer({
        'id': 'contour-glow',
        'type': 'line',
        'source': 'mapbox-terrain-vector',
        'source-layer': 'contour',
        'paint': {
          'line-color': holoColor,
          'line-width': 4,
          'line-blur': 6,
          'line-opacity': 0.15 // <-- Ajuste de opacidad al resplandor verde
        }
      });
      
      // Linea Central Solida
      map.current.addLayer({
        'id': 'contour-core',
        'type': 'line',
        'source': 'mapbox-terrain-vector',
        'source-layer': 'contour',
        'paint': {
          'line-color': holoColor,
          'line-width': 1,
          'line-opacity': 0.35 // <-- Ajuste de opacidad al verde solido
        }
      });

      // Avisamos a React que el relieve ya esta dibujado
      setMapLoaded(true);
    });
  }, []);

  // 3. Renderizado de Edificios 3D (Cambiado a motor NATIVO de Mapbox)
  useEffect(() => {
    if (!buildingData || !mapLoaded || !map.current) return;

    // Si la capa ya existe, solo actualizamos los datos (por si refrescas)
    if (map.current.getSource('digital-twin-source')) {
      map.current.getSource('digital-twin-source').setData(buildingData);
    } else {
      // Le pasamos el GeoJSON de Supabase directamente al mapa base
      map.current.addSource('digital-twin-source', {
        type: 'geojson',
        data: buildingData
      });

      // Dibujamos las extrusiones. Mapbox ancla esto al piso 3D automaticamente
      map.current.addLayer({
        'id': 'digital-twin-buildings',
        'type': 'fill-extrusion',
        'source': 'digital-twin-source',
        'paint': {
          // Obligamos a leer la altura como numero
          'fill-extrusion-height': ['coalesce', ['to-number', ['get', 'inferred_height_m']], 9],
          // Rampa de colores termica
          'fill-extrusion-color': [
            'step',
            ['coalesce', ['to-number', ['get', 'inferred_height_m']], 0],
            '#23057b',     // < 20m
            20, '#00e5ff', // 20m - 50m
            50, '#ffeb3b', // 50m - 100m
            100, '#ff8c00', // 100m - 200m
            200, '#f30a41'  // > 200m
          ],
          'fill-extrusion-opacity': 0.85
        }
      });

      // Reconstruccion del Tooltip para que funcione con Mapbox
      map.current.on('mousemove', 'digital-twin-buildings', (e) => {
        if (e.features.length > 0) {
          map.current.getCanvas().style.cursor = 'pointer';
          setHoverInfo({
            x: e.point.x,
            y: e.point.y,
            // Replicamos la estructura que esperaba tu UI anterior
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

      {/* Tooltip Dinamico */}
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

      {/* Leyenda 3D Heatmap */}
      <div style={{...STYLES.legendBox, backgroundColor: 'rgba(13, 15, 22, 0.85)', border: '1px solid #333', width: '160px'}}>
        <h4 style={{...STYLES.legendTitle, color: '#fff', marginBottom: '8px'}}>Intensidad Constructiva</h4>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgb(243, 10, 65)', marginRight: '8px' }}></div>
          &gt; 200m (Megatorres)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgb(255, 140, 0)', marginRight: '8px' }}></div>
          100m - 200m (Rascacielos)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgb(255, 235, 59)', marginRight: '8px' }}></div>
          50m - 100m (Alta Dens)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgb(0, 229, 255)', marginRight: '8px' }}></div>
          20m - 50m (Media Dens)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', color: '#ccc' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgb(35, 5, 123)', marginRight: '8px' }}></div>
          &lt; 20m (Tejido Base)
        </div>
      </div>
    </div>
  );
}