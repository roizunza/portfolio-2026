import React, { useState } from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout.jsx';
import Sidebar from './NetworkFractureSidebar.jsx';
import MapComponent from './NetworkFractureMap.jsx';
import Scorecards from './NetworkFractureScorecards.jsx';
import RasterVisor from './NetworkFractureRasterVisor.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const NetworkFractureView = () => {
  const { t: fullT } = useLanguage();
  const t = fullT.networkfracture;

  // ESTADO CENTRAL: Controla el tsunami en todo el dashboard
  const [waterLevel, setWaterLevel] = useState(0);

  if (!t) return null;

  return (
    <ProjectDashboardLayout
      sidebarContent={<Sidebar t={t} />}
      
      // El Mapa recibe el nivel y la capacidad de cambiarlo
      mapContent={
        <MapComponent 
          t={t} 
          waterLevel={waterLevel} 
          setWaterLevel={setWaterLevel} 
        />
      }
      
      // Las Scorecards reciben el nivel para recalcular
      scorecardsContent={
        <Scorecards 
          t={t} 
          waterLevel={waterLevel} 
        />
      }
      
      chartsContent={<RasterVisor t={t} />}
    />
  );
};

export default NetworkFractureView;