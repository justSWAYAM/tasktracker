import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Database from './Database'

import PaperAnalysis from './pages/PaperAnalysis'

import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'

const App = () => {
  const isAuthenticated = localStorage.getItem('user')

  return (
    <Router>
      <Routes>
        {/* <Route path="/database" element={<Database />} /> */}
        <Route path="/" element=<Dashboard/> />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/study" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/study" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        {/* <Route path="/database" element={isAuthenticated ? <DatabaseViewer /> : <Navigate to="/login" />} /> */}
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
        <Route path="/study" element={<PaperAnalysis />} />
      </Routes>
    </Router>
  )
}

export default App
