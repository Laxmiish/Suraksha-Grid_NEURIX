import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './frontend/loginPage'
import RegistrationPage from './frontend/registrationPage'
import WorkerDashboard from './frontend/workers'
import ContractorDashboard from './frontend/contractor' 
import supervisoryDashboard from './frontend/supervisory'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<WorkerDashboard />} />
        <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        <Route path="/supervisory-dashboard" element={<supervisoryDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App