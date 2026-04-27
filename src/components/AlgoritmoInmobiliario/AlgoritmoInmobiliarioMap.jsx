import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PROJECTS, STYLES } from '../../config/theme';

import roadsUrl from '../../data/roads.geojson?url';
import poisUrl from '../../data/pois.geojson?url';
import transitUrl from '../../data/transit.geojson?url';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function AlgoritmoInmobiliarioMap({ t }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  const [buildingData, setBuildingData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); 

  const [showBaseMap, setShowBaseMap] = useState(true);
  const [showMCA, setShowMCA] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [buildingMetric, setBuildingMetric] = useState('height'); 
  
  // Estado para el control de camara
  const [is3DView, setIs3DView] = useState(true);

  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

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

    map.current.on('style.load', () => {
      map.current.setPaintProperty('background', 'background-color', '#181b2b');
      map.current.setFog({ 'range': [0.5, 3], 'color': '#0d0f16', 'high-color': '#12141E', 'horizon-blend': 0.2 });

      map.current.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512 });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer', 'type': 'hillshade', 'source': 'mapbox-dem',
        'paint': { 'hillshade-exaggeration': 1.0, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(86, 224, 122, 0.15)' }
      });

      // Capa Raster de NDVI
      map.current.addSource('ndvi-raster-source', {
        type: 'raster',
        url: 'mapbox://rociop.TU_TILESET_ID_AQUI', // No olvides volver a pegar tu ID aqui
        tileSize: 256
      });

      map.current.addLayer({
        'id': 'ndvi-layer',
        'type': 'raster',
        'source': 'ndvi-raster-source',
        'paint': { 'raster-opacity': 0.65, 'raster-resampling': 'nearest' },
        'layout': { 'visibility': 'none' } 
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

      map.current.addSource('roads-source', { type: 'geojson', data: roadsUrl });
      map.current.addLayer({
        'id': 'roads-layer', 'type': 'line', 'source': 'roads-source',
        'paint': {
          'line-color': '#ffffff',
          'line-width': ['match', ['get', 'highway'], 'primary', 1.8, 'trunk', 1.8, 'secondary', 1.0, 0.4],
          'line-opacity': ['match', ['get', 'highway'], 'primary', 0.9, 'trunk', 0.9, 'secondary', 0.7, 0.3]
        }
      });

      map.current.addSource('transit-source', { type: 'geojson', data: transitUrl });
      map.current.addLayer({
        'id': 'transit-layer', 'type': 'circle', 'source': 'transit-source',
        'paint': {
          'circle-color': '#ff5e00',
          'circle-radius': 4.5,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff'
        }
      });

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

  useEffect(() => {
    if (!buildingData || !mapLoaded || !map.current) return;
    
    if (!map.current.getSource('digital-twin-source')) {
      map.current.addSource('digital-twin-source', { type: 'geojson', data: buildingData });
      map.current.addLayer({
        'id': 'digital-twin-buildings', 'type': 'fill-extrusion', 'source': 'digital-twin-source',
        'paint': {
          'fill-extrusion-height': ['coalesce', ['to-number', ['get', 'inferred_height_m']], 9],
          'fill-extrusion-color': '#2a065c', 
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
    } else {
      map.current.getSource('digital-twin-source').setData(buildingData);
    }
  }, [buildingData, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !map.current.getLayer('digital-twin-buildings')) return;

    let buildingColor;
    let buildingOpacity = 0.9;
    let showNdviRaster = false;

    if (buildingMetric === 'height') {
      buildingColor = [
        'step', ['coalesce', ['to-number', ['get', 'inferred_height_m']], 0],
        '#2a065c', 20, '#4c72ea', 50, '#f24c3b'  
      ];
    } else if (buildingMetric === 'ndvi') {
      buildingColor = '#181b2b';
      buildingOpacity = 0.3; 
      showNdviRaster = true;
    } else if (buildingMetric === 'viirs') {
      buildingColor = [
        'step', ['coalesce', ['to-number', ['get', 'val_viirs']], 0],
        '#0a0b10', 5, '#1e3264', 15, '#ff007f', 30, '#ffeb3b', 50, '#ffffff'
      ];
    }

    map.current.setPaintProperty('digital-twin-buildings', 'fill-extrusion-color', buildingColor);
    map.current.setPaintProperty('digital-twin-buildings', 'fill-extrusion-opacity', buildingOpacity);
    
    if (map.current.getLayer('ndvi-layer')) {
      map.current.setLayoutProperty('ndvi-layer', 'visibility', showNdviRaster ? 'visible' : 'none');
    }
  }, [buildingMetric, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    const toggleLayer = (layerId, isVisible) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
      }
    };

    ['hillshade-layer', 'water-layer', 'contour-base', 'contour-top'].forEach(l => toggleLayer(l, showBaseMap));
    ['roads-layer', 'transit-layer', 'pois-core'].forEach(l => toggleLayer(l, showMCA));
    
    toggleLayer('digital-twin-buildings', showBuildings);
    if (!showBuildings && map.current.getLayer('ndvi-layer')) {
      map.current.setLayoutProperty('ndvi-layer', 'visibility', 'none');
    } else if (showBuildings && buildingMetric === 'ndvi' && map.current.getLayer('ndvi-layer')) {
      map.current.setLayoutProperty('ndvi-layer', 'visibility', 'visible');
    }
  }, [showBaseMap, showMCA, showBuildings, buildingMetric, mapLoaded]);

  // Funciones de control de camara
  const handleZoomIn = () => map.current?.zoomIn({ duration: 400 });
  const handleZoomOut = () => map.current?.zoomOut({ duration: 400 });
  const handleCameraToggle = () => {
    if (is3DView) {
      map.current?.easeTo({ pitch: 0, bearing: 0, duration: 1200 });
    } else {
      map.current?.easeTo({ pitch: 60, bearing: -20, duration: 1200 });
    }
    setIs3DView(!is3DView);
  };

  if (!t || !t.map) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Tooltip */}
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

      {/* Panel de Controles de Navegacion (Cyberpunk Estilo) */}
      <div style={{
        ...STYLES.legendBox,
        position: 'absolute', top: 'auto', bottom: '25px', left: 'auto', right: '25px',
        width: '40px', padding: '6px',
        display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 9999
      }}>
        <button 
          onClick={handleZoomIn}
          style={{ width: '100%', height: '28px', background: '#111', color: '#00e5ff', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          style={{ width: '100%', height: '28px', background: '#111', color: '#00e5ff', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          -
        </button>
        <button 
          onClick={handleCameraToggle}
          style={{ width: '100%', height: '28px', background: is3DView ? '#00e5ff' : '#111', color: is3DView ? '#000' : '#00e5ff', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
        >
          {is3DView ? '2D' : '3D'}
        </button>
      </div>

      {/* Simbologia (Esquina Superior Izquierda) */}
      <div style={{
        ...STYLES.legendBox, 
        position: 'absolute', top: '25px', bottom: 'auto', left: '25px', right: 'auto', 
        width: '260px', maxHeight: '85vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 9999
      }}>
        
        <h3 style={{ margin: 0, fontSize: '12px', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '8px', textAlign: 'center' }}>
          Simbología y Control de Capas
        </h3>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }} onClick={() => setShowBaseMap(!showBaseMap)}>
            <h4 style={{ margin: 0, fontSize: '11px', color: showBaseMap ? '#fff' : '#666' }}>1. Mapa Base</h4>
            <span style={{ fontSize: '10px', color: showBaseMap ? '#56e07a' : '#555' }}>{showBaseMap ? 'ON' : 'OFF'}</span>
          </div>
          {showBaseMap && (
            <div style={{ paddingLeft: '8px', borderLeft: '1px solid #333' }}>
              <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '4px' }}>• Río Yangtze y Jialing</div>
              <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '4px' }}>• Relieve 3D (Hillshade)</div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>• Curvas de Nivel (Gris/Verde)</div>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }} onClick={() => setShowMCA(!showMCA)}>
            <h4 style={{ margin: 0, fontSize: '11px', color: showMCA ? '#fff' : '#666' }}>2. Variables del MCA</h4>
            <span style={{ fontSize: '10px', color: showMCA ? '#56e07a' : '#555' }}>{showMCA ? 'ON' : 'OFF'}</span>
          </div>
          {showMCA && (
            <div style={{ paddingLeft: '8px', borderLeft: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5e00', border: '1px solid #fff', marginRight: '6px' }}></div> Nodos de Transporte
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff007f', marginRight: '6px' }}></div> POIs (Comercio / Corporativos)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '12px', height: '2px', background: '#ffffff', marginRight: '6px' }}></div> Jerarquía Vial
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }} onClick={() => { setShowBuildings(!showBuildings); if(!showBuildings) setBuildingMetric('height'); }}>
            <h4 style={{ margin: 0, fontSize: '11px', color: (showBuildings && buildingMetric === 'height') ? '#fff' : '#666' }}>3. Escala de Construcción Inferida</h4>
            <span style={{ fontSize: '10px', color: showBuildings ? '#56e07a' : '#555' }}>{showBuildings ? 'ON' : 'OFF'}</span>
          </div>
          {(showBuildings && buildingMetric === 'height') && (
            <div style={{ paddingLeft: '8px', borderLeft: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f24c3b', marginRight: '6px' }}></div> &gt; 50m (Alta Densidad)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4c72ea', marginRight: '6px' }}></div> 20m - 50m (Media Densidad)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2a065c', marginRight: '6px' }}></div> &lt; 20m (Tejido Base)
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '11px', color: '#fff' }}>4. Análisis de Comprobación</h4>
          </div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            <button onClick={() => { setShowBuildings(true); setBuildingMetric('ndvi'); }} style={{ flex: 1, padding: '4px 0', fontSize: '9px', background: buildingMetric === 'ndvi' ? '#333' : '#111', color: buildingMetric === 'ndvi' ? '#fff' : '#888', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>NDVI (Suelo)</button>
            <button onClick={() => { setShowBuildings(true); setBuildingMetric('viirs'); }} style={{ flex: 1, padding: '4px 0', fontSize: '9px', background: buildingMetric === 'viirs' ? '#333' : '#111', color: buildingMetric === 'viirs' ? '#fff' : '#888', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>VIIRS (Luz Noc.)</button>
          </div>

          {(showBuildings && buildingMetric === 'ndvi') && (
            <div style={{ paddingLeft: '8px', borderLeft: '1px solid #333', fontSize: '10px', color: '#ccc', fontStyle: 'italic' }}>
              Densidad vegetal renderizada directamente sobre el modelo de elevación digital.
            </div>
          )}

          {(showBuildings && buildingMetric === 'viirs') && (
            <div style={{ paddingLeft: '8px', borderLeft: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ffffff', marginRight: '6px', boxShadow: '0 0 5px #fff' }}></div> Radiación Máxima</div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ffeb3b', marginRight: '6px' }}></div> Actividad Alta (Comercio)</div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '10px', color: '#ccc' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ff007f', marginRight: '6px' }}></div> Actividad Media (Oficinas)</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', color: '#ccc' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0a0b10', marginRight: '6px' }}></div> Baja Luminiscencia</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}