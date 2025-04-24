import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactFlow, { Background } from 'reactflow'
import 'reactflow/dist/style.css'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!storedUser);
    setUser(storedUser);
    setLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/study')
    } else {
      navigate('/login')
    }
  }

  const features = [
    {
      title: 'Quiz Generator',
      description: 'Generate custom quizzes based on your subjects',
      icon: '🎯',
      path: isLoggedIn ? '/quiz-generator' : '/login',
      state: isLoggedIn ? {} : { from: { pathname: '/quiz-generator' } }
    },
    {
      title: 'PYQ Analyzer',
      description: 'Analyze previous year questions and patterns',
      icon: '📊',
      path: isLoggedIn ? '/study' : '/login',
      state: isLoggedIn ? {} : { from: { pathname: '/study' } }
    },
    {
      title: 'SQL Practice',
      description: 'Practice SQL queries with interactive exercises',
      icon: '💾',
      path: isLoggedIn ? '/sql-practice' : '/login',
      state: isLoggedIn ? {} : { from: { pathname: '/sql-practice' } }
    }
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen relative bg-[#293241]">
      {/* Login/Signup Buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        {isLoggedIn ? (
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              setIsLoggedIn(false);
              setUser(null);
              navigate('/');
            }}
            className="text-[#98C1D9] hover:text-[#EE6C4D] px-4 py-2"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-[#98C1D9] hover:text-[#EE6C4D] px-4 py-2">Login</Link>
            <Link 
              to="/register" 
              className="bg-[#EE6C4D] hover:bg-[#e85c3a] text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* ReactFlow Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow>
            <Background 
              color="#E0FBFC" 
              gap={30} 
              size={2}
              variant="dots" 
            />
          </ReactFlow>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative bg-[#3D5A80] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute h-full w-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0,800 C600,650 900,100 1200,0 L1200,800 Z" 
              fill="#98C1D9" 
              opacity="0.1" 
            />
            <path 
              d="M0,800 C400,700 800,200 1200,100 L1200,800 Z" 
              fill="#E0FBFC" 
              opacity="0.05" 
            />
          </svg>
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold text-[#E0FBFC] mb-6 leading-tight">
              Welcome back, <span className="text-[#EE6C4D]">{user?.name || 'Guest'}</span>
            </h1>
            <p className="text-xl text-[#98C1D9] mb-8">
              Master Your Tasks with <span className="text-[#EE6C4D]">Task Tracker</span>
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 bg-[#EE6C4D] hover:bg-[#e85c3a] text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#293241] z-0"></div>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E0FBFC" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-[#E0FBFC] mb-4 text-center">How It Works</h2>
          <div className="w-24 h-1 bg-[#EE6C4D] mx-auto mb-12 rounded-full"></div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  state={feature.state}
                  className="group bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl p-8 hover:bg-[#3D5A80]/30 transition-all duration-300 border border-[#3D5A80]/30 hover:border-[#EE6C4D]"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-[#98C1D9]/10 rounded-2xl mb-6 text-4xl group-hover:bg-[#EE6C4D]/10 transition-colors">
                    <span className="transform group-hover:scale-110 transition-transform">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#E0FBFC] mb-4 group-hover:text-[#EE6C4D] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#98C1D9]">{feature.description}</p>
                  <div className="mt-6 w-8 h-8 rounded-full bg-[#3D5A80]/30 flex items-center justify-center group-hover:bg-[#EE6C4D] transition-colors">
                    <svg className="w-4 h-4 text-[#E0FBFC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[#3D5A80] to-[#293241] rounded-3xl p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-30">
            <svg className="absolute right-0 top-0 h-full" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <g fill="#EE6C4D" opacity="0.3">
                <circle cx="450" cy="150" r="50" />
                <circle cx="400" cy="300" r="30" />
                <circle cx="500" cy="350" r="70" />
                <circle cx="350" cy="450" r="40" />
              </g>
            </svg>
          </div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-[#E0FBFC] mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-[#98C1D9] mb-8 max-w-2xl mx-auto">
              Join thousands of students who have improved their grades with our platform.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 bg-[#EE6C4D] hover:bg-[#e85c3a] text-[#E0FBFC] font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started Now'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#293241] py-8 border-t border-[#3D5A80]/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-[#E0FBFC]">Last Minute Study Helper</h3>
              <p className="text-[#98C1D9] mt-1">Your path to academic success</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-[#98C1D9] hover:text-[#EE6C4D]">About</Link>
              <Link to="/contact" className="text-[#98C1D9] hover:text-[#EE6C4D]">Contact</Link>
              <Link to="/faq" className="text-[#98C1D9] hover:text-[#EE6C4D]">FAQ</Link>
              <Link to="/privacy" className="text-[#98C1D9] hover:text-[#EE6C4D]">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard