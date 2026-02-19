import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    const baseLinks = [
      { path: '/medicines', label: 'Medicines' },
      { path: '/orders', label: 'Orders' },
      { path: '/health-vitals', label: 'Health Vitals' }
    ];

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard' },
          { path: '/users', label: 'Users' },
          ...baseLinks
        ];
      case 'store_manager':
        return [
          { path: '/store', label: 'Dashboard' },
          ...baseLinks
        ];
      case 'doctor':
        return [
          { path: '/doctor', label: 'Dashboard' },
          { path: '/patients', label: 'Patients' },
          ...baseLinks
        ];
      case 'patient':
        return [
          { path: '/patient', label: 'Dashboard' },
          ...baseLinks
        ];
      default:
        return baseLinks;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  HealthStore+
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {getNavLinks().map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  {user?.name} ({user?.role?.replace('_', ' ')})
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {title && (
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
