import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import UploadAnalysis from './pages/UploadAnalysis'
import FakeDetection from './pages/FakeDetection'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import './index.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-dark-bg' : 'bg-gray-50'} transition-colors duration-300`}>
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex">
          <Sidebar open={sidebarOpen} darkMode={darkMode} />

          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} mt-16 p-6`}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/analytics" element={<Analytics darkMode={darkMode} />} />
              <Route path="/upload" element={<UploadAnalysis darkMode={darkMode} />} />
              <Route path="/detection" element={<FakeDetection darkMode={darkMode} />} />
              <Route path="/reports" element={<Reports darkMode={darkMode} />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} />} />
            </Routes>
          </main>
        </div>

        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: darkMode ? '#1f2937' : '#ffffff',
              color: darkMode ? '#ffffff' : '#111827',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
