import React from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout.jsx';
import Sidebar from './NetworkFractureSidebar.jsx';
import MapComponent from './NetworkFractureMap.jsx';
import Scorecards from './NetworkFractureScorecards.jsx';
import RasterVisor from './NetworkFractureRasterVisor.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const NetworkFractureView = () => {
  const { t: fullT } = useLanguage();
  const t = fullT.networkfracture;

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

export default NetworkFractureView;