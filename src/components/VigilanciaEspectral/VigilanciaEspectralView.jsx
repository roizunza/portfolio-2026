import React from 'react';
import '../Shared/ProjectDashboardLayout.css';

import Sidebar from './VigilanciaEspectralSidebar';
import Scorecards from './VigilanciaEspectralScorecards';
import MapComponent from './VigilanciaEspectralMap';
import RasterVisor from './VigilanciaEspectralRasterVisor';

const VigilanciaEspectralView = ({ t, idioma }) => {
  if (!t) return null;

  return (
    <div className="dashboard-grid">
      <div className="panel area-sidebar">
        <Sidebar t={t} />
      </div>
      <div className="area-scorecards">
        <Scorecards t={t} />
      </div>
      <div className="panel area-top">
        <MapComponent />
      </div>
      <div className="panel area-bottom">
        <RasterVisor t={t} />
      </div>
    </div>
  );
};

export default VigilanciaEspectralView;