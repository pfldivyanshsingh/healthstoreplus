import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Sign In Form Data
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  // Sign Up Form Data
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    address: ''
  });

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(signInData.email, signInData.password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const role = user?.role;
      
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'store_manager':
          navigate('/store');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = signUpData;
    const result = await register(userData);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      const role = user?.role;
      
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'store_manager':
          navigate('/store');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    }
    
    setLoading(false);
  };

  const navigateToDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const role = user.role;
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'store_manager':
          navigate('/store');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-600">HealthStore+</h1>
            <p className="text-gray-600 hidden md:block">Health Store Management System</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to HealthStore+
          </h2>
          <p className="text-xl text-gray-600">
            Your comprehensive health store and patient monitoring solution
          </p>
        </div>

        {/* Auth Forms Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'signin'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'signup'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="p-8">
            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={handleSignInChange}
                  />
                </div>
                <div>
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="signin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input-field"
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-base"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                      value={signUpData.name}
                      onChange={handleSignUpChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="input-field"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={handleSignUpChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-role" className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      id="signup-role"
                      name="role"
                      className="input-field"
                      value={signUpData.role}
                      onChange={handleSignUpChange}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="store_manager">Store Manager</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      className="input-field"
                      placeholder="Enter your phone"
                      value={signUpData.phone}
                      onChange={handleSignUpChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      id="signup-address"
                      name="address"
                      type="text"
                      className="input-field"
                      placeholder="Enter your address"
                      value={signUpData.address}
                      onChange={handleSignUpChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      className="input-field"
                      placeholder="Minimum 6 characters"
                      value={signUpData.password}
                      onChange={handleSignUpChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      className="input-field"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={handleSignUpChange}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-base mt-4"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-bold mb-2">Health Store</h3>
            <p className="text-gray-600">Manage medicines, inventory, and orders efficiently</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-bold mb-2">Patient Monitoring</h3>
            <p className="text-gray-600">Track patient health records and vital signs</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-gray-600">Comprehensive dashboards and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
