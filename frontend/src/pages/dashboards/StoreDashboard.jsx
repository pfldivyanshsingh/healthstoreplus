import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { dashboardService } from '../../services/dashboardService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StoreDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardService.getStore();
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
      <DashboardLayout title="Store Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Store Dashboard">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Medicines</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalMedicines || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{data?.overview?.lowStockCount || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{data?.overview?.pendingOrders || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Today's Revenue</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">${data?.overview?.todayRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Low Stock Medicines</h2>
              <Link to="/medicines?minStock=true" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data?.lowStockMedicines?.slice(0, 5).map((medicine) => (
                <div key={medicine._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-500">Stock: {medicine.stock} {medicine.unit}</p>
                  </div>
                  <span className="badge bg-red-100 text-red-800">Low</span>
                </div>
              ))}
              {(!data?.lowStockMedicines || data.lowStockMedicines.length === 0) && (
                <p className="text-gray-500 text-center py-4">No low stock items</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Top Selling Medicines</h2>
            <div className="space-y-2">
              {data?.topMedicines?.slice(0, 5).map((medicine, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-500">Sold: {medicine.totalSold} units</p>
                  </div>
                  <span className="font-semibold text-green-600">${medicine.revenue?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
          <p className="text-3xl font-bold text-primary-600">${data?.overview?.monthlyRevenue?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;
