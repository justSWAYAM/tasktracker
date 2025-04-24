import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration response:', response.data);
      
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email
        }));
        navigate('/', { replace: true });
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 409) {
        setError('Email already exists');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#293241]">
      {/* ReactFlow Background */}
      <div className="absolute inset-0 z-0">
        <ReactFlow nodes={[]} edges={[]} fitView={true} panOnScroll={true} zoomOnScroll={false}>
          <Background 
            color="#EE6C4D" 
            gap={30} 
            size={3}
            variant="dots" 
            className="bg-gradient-to-br from-[#3D5A80] to-[#293241]"
          />
        </ReactFlow>
      </div>
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#3D5A80]/20 backdrop-blur-lg rounded-xl shadow-lg z-10 border border-[#3D5A80]/30">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-[#E0FBFC]">
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-[#98C1D9]">
              Join us to enhance your learning experience
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#EE6C4D]/20 border border-[#EE6C4D] text-[#EE6C4D] px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#3D5A80]/50 bg-[#293241]/50 placeholder-[#98C1D9]/70 text-[#E0FBFC] rounded-t-md focus:outline-none focus:ring-[#EE6C4D] focus:border-[#EE6C4D] focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#3D5A80]/50 bg-[#293241]/50 placeholder-[#98C1D9]/70 text-[#E0FBFC] focus:outline-none focus:ring-[#EE6C4D] focus:border-[#EE6C4D] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#3D5A80]/50 bg-[#293241]/50 placeholder-[#98C1D9]/70 text-[#E0FBFC] focus:outline-none focus:ring-[#EE6C4D] focus:border-[#EE6C4D] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#3D5A80]/50 bg-[#293241]/50 placeholder-[#98C1D9]/70 text-[#E0FBFC] rounded-b-md focus:outline-none focus:ring-[#EE6C4D] focus:border-[#EE6C4D] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-[#E0FBFC] bg-[#EE6C4D] hover:bg-[#e85c3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE6C4D] transition-all transform hover:scale-105"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-[#98C1D9]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#EE6C4D] hover:text-[#e85c3a]">
                Sign in here
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-[#98C1D9] hover:text-[#EE6C4D]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;