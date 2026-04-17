import React from 'react';
import '../Shared/ProjectDashboardLayout.css'; 
import Sidebar from './FactorEsfuerzoSidebar';
import Scorecards from './FactorEsfuerzoScorecards';
import MapComponent from './FactorEsfuerzoMap'; 
import GraphsPanel from './FactorEsfuerzoGraphs';   

const FactorEsfuerzoView = ({ t, idioma }) => {
  if (!t) return null;

  return (
    <div className="dashboard-grid">
      
      {/* 1. SIDEBAR (Izquierda - Narrativa) */}
      <div className="panel area-sidebar">
        <Sidebar t={t} />
      </div>

      {/* 2. SCORECARDS (Centro Arriba - KPIs) */}
      <div className="area-scorecards">
        <Scorecards t={t} />
      </div>

      {/* 3. MAPA PRINCIPAL (Derecha Arriba - Geoespacial) */}
      <div className="panel area-top" style={{ position: 'relative' }}>
         <MapComponent t={t} />
      </div>

      {/* 4. GRÁFICOS (Derecha Abajo - Análisis) */}
      <div className="panel area-bottom">
         <GraphsPanel t={t} />
      </div>

    </div>
  );
};

export default FactorEsfuerzoView;