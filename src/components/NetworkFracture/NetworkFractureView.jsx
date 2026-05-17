import React, { useState } from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout.jsx';
import Sidebar from './NetworkFractureSidebar.jsx';
import MapComponent from './NetworkFractureMap.jsx';
import Scorecards from './NetworkFractureScorecards.jsx';
import ChartsContainer from './NetworkFractureGraphs.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const NetworkFractureView = () => {
  const { t: fullT } = useLanguage();
  const t = fullT.networkfracture;

  // Global state for water level simulation
  const [waterLevel, setWaterLevel] = useState(20);

  if (!t) return null;

  return (
    <ProjectDashboardLayout
      sidebarContent={<Sidebar t={t} />}
      
      mapContent={
        <MapComponent 
          t={t} 
          waterLevel={waterLevel} 
          setWaterLevel={setWaterLevel} 
        />
      }
      
      scorecardsContent={
        <Scorecards 
          t={t} 
          waterLevel={waterLevel} 
        />
      }
      
      chartsContent={
        <ChartsContainer
          t={t} 
          waterLevel={waterLevel} 
        />
      }
    />
  );
};

export default NetworkFractureView;