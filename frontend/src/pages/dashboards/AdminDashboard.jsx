import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { dashboardService } from '../../services/dashboardService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardService.getAdmin();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalUsers || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Medicines</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalMedicines || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalOrders || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Alerts</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{data?.overview?.lowStockCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Users by Role</h2>
            <div className="space-y-2">
              {data?.usersByRole && Object.entries(data.usersByRole).map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-2">
              {data?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.patient?.name}</p>
                  </div>
                  <span className={`badge ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
