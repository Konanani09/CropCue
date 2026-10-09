import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import SoilInsights from './pages/SoilInsights';
import CropRecommendations from './pages/CropRecommendations';
import PlantingPlan from './pages/PlantingPlan';
import FarmRecords from './pages/FarmRecords';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="soil" element={<SoilInsights />} />
        <Route path="crops" element={<CropRecommendations />} />
        <Route path="plan" element={<PlantingPlan />} />
        <Route path="records" element={<FarmRecords />} />
      </Route>
    </Routes>
  );
}
