import React from 'react';
import '../Shared/ProjectDashboardLayout.css'; 

import Sidebar from './AlgoritmoInmobiliarioSidebar';
import Scorecards from './AlgoritmoInmobiliarioScorecards';
import MapComponent from './AlgoritmoInmobiliarioMap'; 
import GraphsPanel from './AlgoritmoInmobiliarioGraphs';

const AlgoritmoInmobiliarioView = ({ t, idioma }) => {
  if (!t) return null;

  return (
    <div className="dashboard-grid">
      
      {/* 1. SIDEBAR */}
      <div className="panel area-sidebar">
        <Sidebar t={t} />
      </div>

      {/* 2. SCORECARDS */}
      <div className="area-scorecards">
        <Scorecards t={t} />
      </div>

      {/* 3. MAP */}
      <div className="panel area-top" style={{ position: 'relative' }}>
         {/* AQUÍ FALTABA PASAR LA PROP t */}
         <MapComponent t={t} /> 
      </div>

      {/* 4. GRÁFICOS*/}
      <div className="panel area-bottom">
         <GraphsPanel t={t} />
      </div>

    </div>
  );
};

export default AlgoritmoInmobiliarioView;