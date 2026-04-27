import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { PROJECTS, STYLES } from '../../config/theme';

import roadsUrl from '../../data/roads.geojson?url';
import poisUrl from '../../data/pois.geojson?url';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function AlgoritmoInmobiliarioMap({ t }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const overlay = useRef(null);
  
  const [buildingData, setBuildingData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); 

  const [showBuildings, setShowBuildings] = useState(true);
  const [showNetworks, setShowNetworks] = useState(true);

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  // 1. Fetch de datos desde Supabase (Fase 1)
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

  // 2. Inicializacion de Mapbox 
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

      // --- FASE 2: VIALIDADES LOCALES ---
      map.current.addSource('roads-source', {
        type: 'geojson',
        data: roadsUrl
      });

      map.current.addLayer({
        'id': 'roads-layer',
        'type': 'line',
        'source': 'roads-source',
        'paint': {
          'line-color': '#ffffff',
          'line-width': [
            'match', ['get', 'highway'],
            'primary', 1.5,
            'trunk', 1.5,
            'secondary', 1.0,
            0.5 
          ],
          'line-opacity': [
            'match', ['get', 'highway'],
            'primary', 0.9,
            'trunk', 0.9,
            'secondary', 0.6,
            0.3 
          ]
        }
      });

      // --- FASE 2: PUNTOS DE INTERÉS LOCALES ---
      map.current.addSource('pois-source', {
        type: 'geojson',
        data: poisUrl
      });

      map.current.addLayer({
        'id': 'pois-glow',
        'type': 'circle',
        'source': 'pois-source',
        'paint': {
          'circle-color': [
            'case',
            ['all', ['has', 'tourism'], ['!=', ['get', 'tourism'], null], ['!=', ['get', 'tourism'], 'nan']], '#00e5ff',
            ['all', ['has', 'shop'], ['!=', ['get', 'shop'], null], ['!=', ['get', 'shop'], 'nan']], '#ffeb3b',
            ['all', ['has', 'office'], ['!=', ['get', 'office'], null], ['!=', ['get', 'office'], 'nan']], '#ff007f',
            '#a2d2ff'
          ],
          'circle-radius': 8,
          'circle-blur': 1,
          'circle-opacity': 0.6
        }
      });

      map.current.addLayer({
        'id': 'pois-core',
        'type': 'circle',
        'source': 'pois-source',
        'paint': {
          'circle-color': '#ffffff',
          'circle-radius': 2
        }
      });

      setMapLoaded(true);
    });
  }, []);

  // 3. Renderizado de Edificios 3D
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
            '#2a065c',     
            25, '#4c72ea', 
            65, '#f24c3b'  
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

  // 4. Lógica de interactividad
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (map.current.getLayer('digital-twin-buildings')) {
      map.current.setLayoutProperty('digital-twin-buildings', 'visibility', showBuildings ? 'visible' : 'none');
    }

    const networkLayers = ['roads-layer', 'pois-glow', 'pois-core'];
    networkLayers.forEach(layer => {
      if (map.current.getLayer(layer)) {
        map.current.setLayoutProperty(layer, 'visibility', showNetworks ? 'visible' : 'none');
      }
    });
  }, [showBuildings, showNetworks, mapLoaded]);


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

      <div style={{ position: 'absolute', bottom: '25px', right: '25px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 2 }}>
        
        <div 
          onClick={() => setShowBuildings(!showBuildings)}
          style={{...STYLES.legendBox, backgroundColor: showBuildings ? 'rgba(13, 15, 22, 0.85)' : 'rgba(13, 15, 22, 0.3)', border: showBuildings ? '1px solid #555' : '1px solid #222', width: '160px', cursor: 'pointer', transition: 'all 0.3s ease'}}
        >
          <h4 style={{...STYLES.legendTitle, color: showBuildings ? '#fff' : '#666', marginBottom: '8px'}}>1. Intensidad Constructiva</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc', opacity: showBuildings ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f24c3b', marginRight: '8px' }}></div>
            &gt; 65m (Alta Densidad)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc', opacity: showBuildings ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4c72ea', marginRight: '8px' }}></div>
            25m - 65m (Media Dens)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', color: '#ccc', opacity: showBuildings ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2a065c', marginRight: '8px' }}></div>
            &lt; 25m (Tejido Base)
          </div>
        </div>

        <div 
          onClick={() => setShowNetworks(!showNetworks)}
          style={{...STYLES.legendBox, backgroundColor: showNetworks ? 'rgba(13, 15, 22, 0.85)' : 'rgba(13, 15, 22, 0.3)', border: showNetworks ? '1px solid #555' : '1px solid #222', width: '160px', cursor: 'pointer', transition: 'all 0.3s ease'}}
        >
          <h4 style={{...STYLES.legendTitle, color: showNetworks ? '#fff' : '#666', marginBottom: '8px'}}>2. Nodos y Flujos</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e5ff', marginRight: '8px', boxShadow: '0 0 5px #00e5ff' }}></div>
            Turismo y Cultura
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffeb3b', marginRight: '8px', boxShadow: '0 0 5px #ffeb3b' }}></div>
            Comercio
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '9px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff007f', marginRight: '8px', boxShadow: '0 0 5px #ff007f' }}></div>
            Oficinas / Corporativos
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '9px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '10px', height: '2px', background: '#ffffff', marginRight: '8px' }}></div>
            Red Vial Activa
          </div>
        </div>

      </div>
    </div>
  );
}