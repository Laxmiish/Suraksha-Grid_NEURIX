import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import LandingPage from './frontend/LandingPage'
import LoginPage from './frontend/LoginPage'
import RegistrationPage from './frontend/registrationPage'
import WorkerDashboard from './frontend/workers'
import ContractorDashboard from './frontend/contractor'
import SupervisoryDashboard from './frontend/supervisory'
import WorkProviderDashboard from './frontend/WorkProviderDashboard'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/admin" element={<SupervisoryDashboard />} />
          <Route path="/contractor" element={<ContractorDashboard />} />
          <Route path="/work-provider" element={<WorkProviderDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App