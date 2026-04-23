import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PROJECTS, STYLES } from '../../config/theme';

import cuellosData from '../../data/cuellos_de_botella.json';
import boundariesData from '../../data/boundaries_shenzhen_hk.json';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function MapComponent({ t }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tRef = useRef(t);

  const RAMP = PROJECTS.algoritmo.ramp;
  const PROJECT_COLOR = PROJECTS.algoritmo.color; 
  const fontBody = getCssVar('--fuente-ui') || 'Inter, sans-serif';

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [114.05, 22.54],
      zoom: 10,
      pitch: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.current.on('load', () => {
      
      // 1. Cargamos las fronteras
      map.current.addSource('boundaries', { type: 'geojson', data: boundariesData });
      
      // Oscurecemos Hong Kong para centrar la atencion en Shenzhen
      map.current.addLayer({
        'id': 'hk-dim', 
        'type': 'fill', 
        'source': 'boundaries',
        'filter': ['==', 'nombre', 'Hong Kong'],
        'paint': {
          'fill-color': '#000000',
          'fill-opacity': 0.5
        }
      });

      // Dibujamos las divisiones distritales de Shenzhen (linea punteada)
      map.current.addLayer({
        'id': 'sz-districts', 
        'type': 'line', 
        'source': 'boundaries',
        'filter': ['==', 'tipo', 'Distrito'],
        'paint': {
          'line-color': 'rgba(255, 255, 255, 0.15)',
          'line-width': 1,
          'line-dasharray': [2, 3]
        }
      });

      // Dibujamos el limite exterior de la ciudad
      map.current.addLayer({
        'id': 'sz-boundary', 
        'type': 'line', 
        'source': 'boundaries',
        'filter': ['==', 'tipo', 'Ciudad'],
        'paint': {
          'line-color': PROJECT_COLOR,
          'line-width': 1.5,
          'line-opacity': 0.8
        }
      });

      // 2. Interceptamos las autopistas nativas de Mapbox para resaltarlas
      if (map.current.getLayer('road-motorway-trunk')) {
        map.current.setPaintProperty('road-motorway-trunk', 'line-color', 'rgba(255, 255, 255, 0.3)');
      }

      // 3. Cargamos los datos logisticos y de Machine Learning
      map.current.addSource('cuellos', { type: 'geojson', data: cuellosData });
      
      // Mapa de calor (intensidad del riesgo)
      map.current.addLayer({
        'id': 'cuellos-heat', 'type': 'circle', 'source': 'cuellos',
        'paint': {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            10, 15,
            15, 50
          ],
          'circle-blur': 0.5,
          'circle-opacity': 0.6,
          'circle-color': [
            'match', ['get', 'nivel_riesgo'],
            'Riesgo Crítico', RAMP.step4,
            'Riesgo Moderado', RAMP.step3,
            'Cobertura Adecuada', RAMP.step1,
            RAMP.step2
          ]
        }
      });
      
      // Puntos exactos de los centros logisticos
      map.current.addLayer({
        'id': 'cuellos-points', 'type': 'circle', 'source': 'cuellos',
        'paint': {
          'circle-radius': 4, 
          'circle-stroke-width': 0.5, 
          'circle-stroke-color': '#FFFFFF',
          'circle-color': [
            'match', ['get', 'nivel_riesgo'],
            'Riesgo Crítico', RAMP.step4,
            'Riesgo Moderado', RAMP.step3,
            'Cobertura Adecuada', RAMP.step1,
            RAMP.step2
          ]
        }
      });
      
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'dark-popup'
    });

    const showPopup = (e) => {
      map.current.getCanvas().style.cursor = 'pointer';
      const props = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();
      const currentT = tRef.current.map; 

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const riesgo = props.nivel_riesgo;
      const distancia = (props.distancia_a_cargador_m / 1000).toFixed(2);
      const titulo = `${currentT.popupUnidad} ${props.cluster_id}`;
      const colorTitulo = riesgo === 'Riesgo Crítico' ? RAMP.step4 : RAMP.step1;

      const containerStyle = `font-family:${fontBody}; font-size:11px; color:#e0e0e0; min-width:160px;`;
      const titleStyle = `font-weight:bold; text-transform:uppercase; font-size:12px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:3px; letter-spacing:0.5px; color:${colorTitulo};`;
      const rowStyle = `display:flex; justify-content:space-between; margin-bottom:3px;`;
      const labelStyle = `color:#aaa; margin-right:8px;`;
      const valStyle = `color:#fff; font-weight:500; text-align:right;`;

      const html = `
        <div style="${containerStyle}">
          <div style="${titleStyle}">
            ${titulo}
          </div>
          <div style="${rowStyle}">
            <span style="${labelStyle}">${currentT.popupDistrito}</span> 
            <span style="${valStyle}">${riesgo}</span>
          </div>
          <div style="${rowStyle}">
            <span style="${labelStyle}">${currentT.popupPrecioHKD}</span> 
            <span style="${valStyle}">${distancia} km</span>
          </div>
          <div style="${rowStyle}">
            <span style="${labelStyle}">${currentT.popupPrecioUSD}</span> 
            <span style="${valStyle}">${props.operador}</span>
          </div>
        </div>
      `;

      popup.setLngLat(coordinates).setHTML(html).addTo(map.current);
    };

    const hidePopup = () => {
      map.current.getCanvas().style.cursor = '';
      popup.remove();
    };

    map.current.on('mouseenter', 'cuellos-points', showPopup);
    map.current.on('mouseleave', 'cuellos-points', hidePopup);

  }, [RAMP, PROJECT_COLOR]);

  if (!t || !t.map) return null;

  const titleStyle = STYLES.legendTitle;
  const subTitleStyle = { fontSize: '9px', fontWeight: 'bold', color: '#aaa', margin: '6px 0 3px 0', textTransform: 'none' };
  const itemStyle = { display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '9px', fontWeight: '300', color: 'var(--texto-principal)' };
  const circleColor = { width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px' };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        .dark-popup .mapboxgl-popup-content {
          background-color: rgba(24, 29, 53, 0.8) !important;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
          border-radius: 4px;
          padding: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .dark-popup .mapboxgl-popup-tip { border-top-color: rgba(24, 29, 53, 0.8) !important; }
      `}</style>

      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      <div style={STYLES.legendBox}>
        <h4 style={titleStyle}>{t.map.simbologia}</h4>

        <div style={subTitleStyle}>{t.map.subPrecioDistrito}</div>
        <div style={itemStyle}><div style={{...circleColor, background: RAMP.step4}}></div> &gt; 1000m (Riesgo Crítico) </div>
        <div style={itemStyle}><div style={{...circleColor, background: RAMP.step3}}></div> 500m - 1000m (Riesgo Moderado) </div>
        <div style={itemStyle}><div style={{...circleColor, background: RAMP.step1}}></div> &lt; 500m (Cobertura Adecuada) </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
        <div style={itemStyle}><div style={{width: '12px', height: '2px', background: 'rgba(255, 255, 255, 0.3)', marginRight: '8px'}}></div> Red de Autopistas </div>
        <div style={itemStyle}><div style={{width: '12px', height: '2px', borderTop: '1px dashed rgba(255, 255, 255, 0.2)', marginRight: '8px'}}></div> Límites Distritales </div>

      </div>
    </div>
  );
}