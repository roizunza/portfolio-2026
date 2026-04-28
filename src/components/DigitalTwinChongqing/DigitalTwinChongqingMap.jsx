import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PROJECTS } from '../../config/theme';

import roadsUrl from '../../data/roads.geojson?url';
import poisUrl from '../../data/pois.geojson?url';
import transitUrl from '../../data/transit.geojson?url';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function DigitalTwinChongqingMap({ t: propT }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const RAMP = PROJECTS.digitaltwin.ramp;
  
  const { t: fullT } = useLanguage();
  const tMap = fullT?.digitaltwin?.map || propT?.map; 
  
  const [buildingData, setBuildingData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); 

  const [showBaseMap, setShowBaseMap] = useState(true);
  const [showMCA, setShowMCA] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [buildingMetric, setBuildingMetric] = useState('height'); 
  
  const [is3DView, setIs3DView] = useState(true);

  const CAMERA = {
    center: [106.5520, 29.5520],
    zoom: 12.8,
    pitch3D: 65,
    bearing3D: -35
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const url = `${baseUrl}/rest/v1/chongqingZ_inferred_buildings?select=*&order=inferred_height_m.desc.nullslast&limit=20000`;
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
      center: CAMERA.center, 
      zoom: CAMERA.zoom, 
      pitch: CAMERA.pitch3D, 
      bearing: CAMERA.bearing3D, 
      antialias: true
    });

    map.current.on('style.load', () => {
      map.current.setFog({ 'range': [0.5, 3], 'color': '#0d0f16', 'high-color': '#12141E', 'horizon-blend': 0.2 });

      map.current.addSource('mapbox-dem', { 'type': 'raster-dem', 'url': 'mapbox://mapbox.mapbox-terrain-dem-v1', 'tileSize': 512 });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      map.current.addLayer({
        'id': 'hillshade-layer', 'type': 'hillshade', 'source': 'mapbox-dem',
        'paint': { 'hillshade-exaggeration': 1.0, 'hillshade-shadow-color': '#05060a', 'hillshade-highlight-color': 'rgba(86, 224, 122, 0.15)' }
      });

      map.current.addLayer({
        'id': 'water-layer', 'type': 'fill', 'source': 'composite', 'source-layer': 'water',
        'paint': { 'fill-color': '#090e17', 'fill-opacity': 0.80 }
      });

      map.current.addSource('mapbox-terrain-vector', { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' });
      map.current.addLayer({
        'id': 'contour-base', 'type': 'line', 'source': 'mapbox-terrain-vector', 'source-layer': 'contour',
        'filter': ['<', ['get', 'ele'], 220],
        'paint': { 'line-color': '#3b4252', 'line-width': 0.8, 'line-opacity': 0.2 }
      });
      map.current.addLayer({
        'id': 'contour-top', 'type': 'line', 'source': 'mapbox-terrain-vector', 'source-layer': 'contour',
        'filter': ['>=', ['get', 'ele'], 220],
        'paint': { 'line-color': '#3b4252', 'line-width': 0.6, 'line-dasharray': [2, 4], 'line-opacity': 0.2 }
      });

      map.current.addSource('roads-source', { type: 'geojson', data: roadsUrl });
      map.current.addLayer({
        'id': 'roads-layer', 'type': 'line', 'source': 'roads-source',
        'paint': {
          'line-color': RAMP.mca.vias,
          'line-width': ['match', ['get', 'highway'], 'primary', 1.8, 'trunk', 1.8, 'secondary', 1.0, 0.4],
          'line-opacity': ['match', ['get', 'highway'], 'primary', 0.4, 'trunk', 0.4, 'secondary', 0.2, 0.1]
        }
      });

      map.current.addSource('transit-source', { type: 'geojson', data: transitUrl });
      map.current.addLayer({
        'id': 'transit-layer', 'type': 'circle', 'source': 'transit-source',
        'paint': {
          'circle-color': 'transparent', 
          'circle-radius': 5,
          'circle-stroke-width': 2,
          'circle-stroke-color': RAMP.mca.nodos 
        }
      });

      map.current.addSource('pois-source', { type: 'geojson', data: poisUrl });
      map.current.addLayer({
        'id': 'pois-core', 'type': 'circle', 'source': 'pois-source',
        'paint': {
          'circle-color': RAMP.mca.pois,
          'circle-radius': 4.5, 
          'circle-stroke-width': 0,
          'circle-blur': 0.4
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
          'fill-extrusion-height': ['to-number', ['get', 'inferred_height_m'], 9],
          'fill-extrusion-color': [
            'step', ['to-number', ['get', 'inferred_height_m'], 0],
            RAMP.height.base, 30, RAMP.height.media, 90, RAMP.height.alta, 150, RAMP.height.top  
          ],
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

    if (buildingMetric === 'height') {
      buildingColor = [
        'step', ['to-number', ['get', 'inferred_height_m'], 0],
        RAMP.height.base, 30, RAMP.height.media, 90, RAMP.height.alta, 150, RAMP.height.top  
      ];
    } else if (buildingMetric === 'viirs') {
      buildingColor = [
        'step', ['to-number', ['get', 'val_viirs'], 0],
        RAMP.viirs.baja, 28, RAMP.viirs.media, 38, RAMP.viirs.alta, 55, RAMP.viirs.maxima
      ];
    }

    map.current.setPaintProperty('digital-twin-buildings', 'fill-extrusion-color', buildingColor);
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

  }, [showBaseMap, showMCA, showBuildings, buildingMetric, mapLoaded]);

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

  if (!tMap) return null;

  return (
    <div className="dtc-wrapper">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {hoverInfo && hoverInfo.object && (
        <div className="dtc-tooltip" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
          <div className="dtc-tooltip-header">
            ID: {hoverInfo.object.properties.id || hoverInfo.object.properties.fid || 'N/A'}
          </div>
          <div className="dtc-tooltip-row">
            <span className="dtc-tooltip-label">{tMap.niveles}:</span>
            <span className="dtc-tooltip-value">{hoverInfo.object.properties.inferred_levels || 0}</span>
          </div>
          <div className="dtc-tooltip-row">
            <span className="dtc-tooltip-label">{tMap.altura}:</span>
            <span className="dtc-tooltip-value">{Math.round(Number(hoverInfo.object.properties.inferred_height_m) || 0)} m</span>
          </div>
        </div>
      )}

      <div className="dtc-nav-controls">
        <button onClick={handleZoomIn} className="dtc-nav-btn">+</button>
        <button onClick={handleZoomOut} className="dtc-nav-btn">-</button>
        <button onClick={handleCameraToggle} className="dtc-nav-btn text">
          {is3DView ? '2D' : '2.5D'}
        </button>
      </div>

      <div className="dtc-legend">
        
        <h3 className="dtc-legend-title">{tMap.simbologia}</h3>

        <div>
          <div className="dtc-section-header" onClick={() => setShowBaseMap(!showBaseMap)}>
            <h4 className="dtc-section-title">{tMap.mapaBase}</h4>
            <span className={`dtc-status-label ${showBaseMap ? 'on' : 'off'}`}>{showBaseMap ? 'ON' : 'OFF'}</span>
          </div>
          {showBaseMap && (
            <div className="dtc-section-content">
              <div className="dtc-legend-item">• {tMap.rios}</div>
              <div className="dtc-legend-item">• {tMap.relieve}</div>
              <div className="dtc-legend-item">• {tMap.curvas}</div>
            </div>
          )}
        </div>

        <div>
          <div className="dtc-section-header" onClick={() => setShowMCA(!showMCA)}>
            <h4 className="dtc-section-title">{tMap.variablesMca}</h4>
            <span className={`dtc-status-label ${showMCA ? 'on' : 'off'}`}>{showMCA ? 'ON' : 'OFF'}</span>
          </div>
          {showMCA && (
            <div className="dtc-section-content">
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ width: '10px', height: '10px', borderRadius: '50%', border: `2px solid ${RAMP.mca.nodos}`, backgroundColor: 'transparent' }}></div> {tMap.nodosTransporte}
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: RAMP.mca.pois, boxShadow: `0 0 4px ${RAMP.mca.pois}` }}></div> {tMap.poisEstrategicos}
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ width: '16px', height: '2px', backgroundColor: RAMP.mca.vias, opacity: 0.4 }}></div> {tMap.jerarquiaVial}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="dtc-section-header" onClick={() => {
            if (buildingMetric === 'height') {
              setShowBuildings(!showBuildings);
            } else {
              setBuildingMetric('height');
              setShowBuildings(true);
            }
          }}>
            <h4 className="dtc-section-title">
              {tMap.escalaInferida}<br/><span style={{ fontWeight: '400', opacity: 0.7 }}>{tMap.escalaSub}</span>
            </h4>
            <span className={`dtc-status-label ${showBuildings && buildingMetric === 'height' ? 'on' : 'off'}`}>
              {showBuildings && buildingMetric === 'height' ? 'ON' : 'OFF'}
            </span>
          </div>
          {(showBuildings && buildingMetric === 'height') && (
            <div className="dtc-section-content">
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.height.top, boxShadow: `0 0 4px ${RAMP.height.top}` }}></div> &gt; 150m ({tMap.rascacielos})
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.height.alta }}></div> 90m - 150m ({tMap.altaDensidad})
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.height.media }}></div> 30m - 90m ({tMap.mediaDensidad})
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.height.base }}></div> &lt; 30m ({tMap.tejidoBase})
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="dtc-section-header" onClick={() => {
            if (buildingMetric === 'viirs') {
              setShowBuildings(!showBuildings);
            } else {
              setBuildingMetric('viirs');
              setShowBuildings(true);
            }
          }}>
            <h4 className="dtc-section-title">
              {tMap.validacionSatelital}<br/><span style={{ fontWeight: '400', opacity: 0.7 }}>{tMap.viirsSub}</span>
            </h4>
            <span className={`dtc-status-label ${showBuildings && buildingMetric === 'viirs' ? 'on' : 'off'}`}>
              {showBuildings && buildingMetric === 'viirs' ? 'ON' : 'OFF'}
            </span>
          </div>
          {(showBuildings && buildingMetric === 'viirs') && (
            <div className="dtc-section-content">
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.viirs.maxima, boxShadow: `0 0 5px ${RAMP.viirs.maxima}` }}></div> {tMap.radMaxima}
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.viirs.alta }}></div> {tMap.actividadAlta}
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.viirs.media }}></div> {tMap.actividadMedia}
              </div>
              <div className="dtc-legend-item">
                <div className="dtc-swatch" style={{ background: RAMP.viirs.baja }}></div> {tMap.actividadBaja}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}