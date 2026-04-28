import React from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout.jsx';
import Sidebar from './DigitalTwinChongqingSidebar.jsx';
import MapComponent from './DigitalTwinChongqingMap.jsx';
import Scorecards from './DigitalTwinChongqingScorecards.jsx';
import ChartsContainer from './DigitalTwinChongqingGraphs.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const DigitalTwinChongqingView = () => {
  const { t: fullT } = useLanguage();
  const t = fullT.digitaltwin;

  if (!t) return null;

  return (
    <ProjectDashboardLayout
      sidebarContent={<Sidebar t={t} />}
      mapContent={<MapComponent t={t} />}
      scorecardsContent={<Scorecards t={t} />}
      chartsContent={<ChartsContainer t={t} />}
    />
  );
};

export default DigitalTwinChongqingView;