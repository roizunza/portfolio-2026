import React from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout';
import Sidebar from './VigilanciaEspectralSidebar';
import MapComponent from './VigilanciaEspectralMap';
import Scorecards from './VigilanciaEspectralScorecards';
import RasterVisor from './VigilanciaEspectralRasterVisor';

const VigilanciaEspectralView = ({ t }) => {
  if (!t) return null;

  return (
    <ProjectDashboardLayout
      sidebarContent={<Sidebar t={t} />}
      mapContent={<MapComponent t={t} />}
      scorecardsContent={<Scorecards t={t} />}
      chartsContent={<RasterVisor t={t} />}
    />
  );
};

export default VigilanciaEspectralView;