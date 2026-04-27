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

  // Estados de interfaz
  const [showBuildings, setShowBuildings] = useState(true);
  const [showNetworks, setShowNetworks] = useState(true);
  const [buildingMode, setBuildingMode] = useState('height'); // Modos: 'height', 'ndvi', 'viirs'

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  // 1. Fetch de edificios
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const url = `${baseUrl}/rest/v1/buildings_3d?select=*&limit=20000`;
        const response = await fetch(url, {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/geo+json' }
        });
        const data = await response.json();
        setBuildingData(data);
      } catch (error) { console.error("Error Supabase:", error); }
    };
    fetchBuildings();
  }, []);

  // 2. Inicializacion del mapa y redes
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [106.5516, 29.5630], zoom: 13.5, pitch: 60, bearing: -20, antialias: true
    });

    map.current.on('style.load', () => {
      map.current.setPaintProperty('background', 'background-color', '#181b2b');
      map.current.setFog({ 'range': [0.5, 3], 'color': '#0d0f16', 'high-color': '#12141E', 'horizon-blend': 0.2 });

      map.current.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512 });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer', 'type': 'hillshade', 'source': 'mapbox-dem',
        'paint': { 'hillshade-exaggeration': 1.0, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(86, 224, 122, 0.15)' }
      });

      map.current.addLayer({
        'id': 'water-layer', 'type': 'fill', 'source': 'composite', 'source-layer': 'water',
        'paint': { 'fill-color': '#47d3f4', 'fill-opacity': 0.15 }
      });

      map.current.addSource('mapbox-terrain-vector', { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' });
      
      map.current.addLayer({
        'id': 'contour-base', 'type': 'line', 'source': 'mapbox-terrain-vector', 'source-layer': 'contour',
        'filter': ['<', ['get', 'ele'], 220],
        'paint': { 'line-color': '#464c59', 'line-width': 0.8, 'line-opacity': 0.5 }
      });

      map.current.addLayer({
        'id': 'contour-top', 'type': 'line', 'source': 'mapbox-terrain-vector', 'source-layer': 'contour',
        'filter': ['>=', ['get', 'ele'], 220],
        'paint': { 'line-color': '#8ca2ad', 'line-width': 0.6, 'line-dasharray': [2, 4], 'line-opacity': 0.7 }
      });

      // VIALIDADES
      map.current.addSource('roads-source', { type: 'geojson', data: roadsUrl });
      map.current.addLayer({
        'id': 'roads-layer', 'type': 'line', 'source': 'roads-source',
        'paint': {
          'line-color': '#ffffff',
          'line-width': ['match', ['get', 'highway'], 'primary', 1.8, 'trunk', 1.8, 'secondary', 1.0, 0.4],
          'line-opacity': ['match', ['get', 'highway'], 'primary', 0.9, 'trunk', 0.9, 'secondary', 0.7, 0.3]
        }
      });

      // POIS
      map.current.addSource('pois-source', { type: 'geojson', data: poisUrl });
      map.current.addLayer({
        'id': 'pois-core', 'type': 'circle', 'source': 'pois-source',
        'paint': {
          'circle-color': [
            'case',
            ['all', ['has', 'tourism'], ['!=', ['get', 'tourism'], 'nan']], '#00e5ff',
            ['all', ['has', 'shop'], ['!=', ['get', 'shop'], 'nan']], '#ffeb3b',
            ['all', ['has', 'office'], ['!=', ['get', 'office'], 'nan']], '#ff007f',
            '#a2d2ff'
          ],
          'circle-radius': 3.5, 
          'circle-stroke-width': 0.5,
          'circle-stroke-color': '#0d0f16'
        }
      });

      setMapLoaded(true);
    });
  }, []);

  // 3. Renderizado inicial de Edificios 3D
  useEffect(() => {
    if (!buildingData || !mapLoaded || !map.current) return;
    if (map.current.getSource('digital-twin-source')) {
      map.current.getSource('digital-twin-source').setData(buildingData);
    } else {
      map.current.addSource('digital-twin-source', { type: 'geojson', data: buildingData });
      map.current.addLayer({
        'id': 'digital-twin-buildings', 'type': 'fill-extrusion', 'source': 'digital-twin-source',
        'paint': {
          'fill-extrusion-height': ['coalesce', ['to-number', ['get', 'inferred_height_m']], 9],
          'fill-extrusion-color': '#2a065c', // Color base, se sobreescribe en el siguiente hook
          'fill-extrusion-opacity': 0.9
        }
      });

      map.current.on('mousemove', 'digital-twin-buildings', (e) => {
        if (e.features.length > 0) {
          map.current.getCanvas().style.cursor = 'pointer';
          setHoverInfo({ x: e.point.x, y: e.point.y, object: { properties: e.features[0].properties } });
        }
      });

      map.current.on('mouseleave', 'digital-twin-buildings', () => {
        map.current.getCanvas().style.cursor = '';
        setHoverInfo(null);
      });
    }
  }, [buildingData, mapLoaded]);

  // 4. Repintado Dinámico de Edificios (Selector de Lente)
  useEffect(() => {
    if (!map.current || !mapLoaded || !map.current.getLayer('digital-twin-buildings')) return;

    let colorExpression;
    if (buildingMode === 'height') {
      colorExpression = [
        'step', ['coalesce', ['to-number', ['get', 'inferred_height_m']], 0],
        '#2a065c', 20, '#4c72ea', 50, '#f24c3b'  
      ];
    } else if (buildingMode === 'ndvi') {
      colorExpression = [
        'step', ['coalesce', ['to-number', ['get', 'val_ndvi']], 0],
        '#1a1c23', 0.2, '#2b4d3a', 0.4, '#388a53', 0.6, '#56e07a', 0.8, '#00ffaa'
      ];
    } else if (buildingMode === 'viirs') {
      colorExpression = [
        'step', ['coalesce', ['to-number', ['get', 'val_viirs']], 0],
        '#0a0b10', 5, '#1e3264', 15, '#ff007f', 30, '#ffeb3b', 50, '#ffffff'
      ];
    }

    map.current.setPaintProperty('digital-twin-buildings', 'fill-extrusion-color', colorExpression);
  }, [buildingMode, mapLoaded]);

  // 5. Controles de visibilidad general
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const safeSetVisibility = (layer, state) => {
      if (map.current.getLayer(layer)) map.current.setLayoutProperty(layer, 'visibility', state ? 'visible' : 'none');
    };
    safeSetVisibility('digital-twin-buildings', showBuildings);
    ['roads-layer', 'pois-core'].forEach(l => safeSetVisibility(l, showNetworks));
  }, [showBuildings, showNetworks, mapLoaded]);

  if (!t || !t.map) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* TOOLTIP */}
      {hoverInfo && hoverInfo.object && (
        <div style={{
          position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y,
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

      {/* LEYENDAS INTERACTIVAS */}
      <div style={{ position: 'absolute', bottom: '25px', right: '25px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 9999 }}>
        
        {/* LEYENDA 1: LENTE ANALÍTICO (Edificios) */}
        <div style={{
          ...STYLES.legendBox, 
          position: 'relative', top: 'auto', left: 'auto', /* Sobreescritura de theme.js */
          backgroundColor: showBuildings ? 'rgba(13, 15, 22, 0.85)' : 'rgba(13, 15, 22, 0.3)', 
          border: showBuildings ? '1px solid #555' : '1px solid #222', 
          width: '220px', 
          transition: 'all 0.3s ease'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 onClick={() => setShowBuildings(!showBuildings)} style={{...STYLES.legendTitle, color: showBuildings ? '#fff' : '#666', margin: 0, fontSize: '11px', cursor: 'pointer'}}>
              1. Lente Analítico
            </h4>
          </div>

          {showBuildings && (
            <>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                <button onClick={() => setBuildingMode('height')} style={{ flex: 1, padding: '4px 0', fontSize: '9px', background: buildingMode === 'height' ? '#333' : '#111', color: buildingMode === 'height' ? '#fff' : '#888', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>Altura</button>
                <button onClick={() => setBuildingMode('ndvi')} style={{ flex: 1, padding: '4px 0', fontSize: '9px', background: buildingMode === 'ndvi' ? '#333' : '#111', color: buildingMode === 'ndvi' ? '#fff' : '#888', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>NDVI</button>
                <button onClick={() => setBuildingMode('viirs')} style={{ flex: 1, padding: '4px 0', fontSize: '9px', background: buildingMode === 'viirs' ? '#333' : '#111', color: buildingMode === 'viirs' ? '#fff' : '#888', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>VIIRS</button>
              </div>

              {buildingMode === 'height' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f24c3b', marginRight: '8px' }}></div>
                    &gt; 50m (Alta Densidad)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#4c72ea', marginRight: '8px' }}></div>
                    20m - 50m (Media Densidad)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#2a065c', marginRight: '8px' }}></div>
                    &lt; 20m (Tejido Base)
                  </div>
                </div>
              )}

              {buildingMode === 'ndvi' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#56e07a', marginRight: '8px' }}></div>
                    Alta Vegetación (Parques)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#2b4d3a', marginRight: '8px' }}></div>
                    Transición Ecológica
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#1a1c23', marginRight: '8px' }}></div>
                    Suelo Artificial (Asfalto)
                  </div>
                </div>
              )}

              {buildingMode === 'viirs' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ffffff', marginRight: '8px', boxShadow: '0 0 5px #fff' }}></div>
                    Radiación Máxima (Comercio)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ff007f', marginRight: '8px' }}></div>
                    Actividad Media (Oficinas)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#0a0b10', marginRight: '8px' }}></div>
                    Baja Luminiscencia (Residencial)
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* LEYENDA 2: REDES Y POIS */}
        <div 
          onClick={() => setShowNetworks(!showNetworks)}
          style={{
            ...STYLES.legendBox, 
            position: 'relative', top: 'auto', left: 'auto', /* Sobreescritura de theme.js */
            backgroundColor: showNetworks ? 'rgba(13, 15, 22, 0.85)' : 'rgba(13, 15, 22, 0.3)', 
            border: showNetworks ? '1px solid #555' : '1px solid #222', 
            width: '220px', 
            cursor: 'pointer', 
            transition: 'all 0.3s ease'
          }}
        >
          <h4 style={{...STYLES.legendTitle, color: showNetworks ? '#fff' : '#666', marginBottom: '8px', fontSize: '11px'}}>2. Nodos y Flujos</h4>
          
          <div style={{ marginBottom: '6px', fontSize: '10px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '4px', opacity: showNetworks ? 1 : 0.3}}>Puntos de Interés</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', marginRight: '8px' }}></div> Turismo y Cultura
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffeb3b', marginRight: '8px' }}></div> Comercio
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '10px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff007f', marginRight: '8px' }}></div> Oficinas / Corporativos
          </div>

          <div style={{ marginBottom: '6px', fontSize: '10px', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '4px', opacity: showNetworks ? 1 : 0.3}}>Jerarquía Vial</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '10px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '12px', height: '2px', background: '#ffffff', marginRight: '6px' }}></div> Primarias / Troncales
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc', opacity: showNetworks ? 1 : 0.3 }}>
            <div style={{ width: '12px', height: '1px', background: 'rgba(255,255,255,0.5)', marginRight: '6px' }}></div> Secundarias
          </div>
        </div>

      </div>
    </div>
  );
  }