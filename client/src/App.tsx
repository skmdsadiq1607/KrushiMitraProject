import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { Diagnose } from './pages/Diagnose';
import { DiagnosisHistory } from './pages/DiagnosisHistory';
import { DiseaseLibrary } from './pages/DiseaseLibrary';
import { WeatherRisk } from './pages/WeatherRisk';
import { FieldReports } from './pages/FieldReports';
import { AgricultureAssistant } from './pages/AgricultureAssistant';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/diagnose" element={<Diagnose />} />
                <Route path="/history" element={<DiagnosisHistory />} />
                <Route path="/disease-library" element={<DiseaseLibrary />} />
                <Route path="/weather-risk" element={<WeatherRisk />} />
                <Route path="/field-reports" element={<FieldReports />} />
                <Route path="/assistant" element={<AgricultureAssistant />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
