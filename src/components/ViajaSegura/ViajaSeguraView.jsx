import React from 'react';
import ProjectDashboardLayout from '../Shared/ProjectDashboardLayout';
import Sidebar from './ViajaSeguraSidebar';
import MapComponent from './ViajaSeguraMap';
import Scorecards from './ViajaSeguraScorecards';
import ChartsContainer from './ViajaSeguraGraphs';

const ViajaSeguraView = ({ t, idioma }) => {
  // Si t no ha cargado, no renderizamos para evitar el crash
  if (!t) return null;

  return (
    <ProjectDashboardLayout
      sidebarContent={<Sidebar t={t} />}
      mapContent={<MapComponent t={t} />} // Corregido: pasamos t al mapa
      scorecardsContent={<Scorecards t={t} />}
      chartsContent={<ChartsContainer t={t} />} // Corregido: pasamos t a las gráficas
    />
  );
};

export default ViajaSeguraView;