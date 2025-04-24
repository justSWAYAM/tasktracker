import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Database from './Database'
import PaperAnalysis from './pages/PaperAnalysis'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import SqlPractice from './pages/SqlPractice'

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/database" element={<Database />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/study" element={
          <ProtectedRoute>
            <PaperAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/sql-practice" element={
          <ProtectedRoute>
            <SqlPractice />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
