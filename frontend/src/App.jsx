import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeavePage from './pages/LeavePage';
import ShiftPage from './pages/ShiftPage';
import CalendarPage from './pages/CalendarPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const token = useAuthStore(state => state.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = useAuthStore(state => state.token);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {token ? (
          <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
              <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
              <main className="flex-1 overflow-auto p-6">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/leave" element={<ProtectedRoute><LeavePage /></ProtectedRoute>} />
                  <Route path="/shifts" element={<ProtectedRoute><ShiftPage /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                  <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
