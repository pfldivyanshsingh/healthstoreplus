import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { dashboardService } from '../../services/dashboardService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardService.getPatient();
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
      <DashboardLayout title="Patient Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Patient Dashboard">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalOrders || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Health Records</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalRecords || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Critical Alerts</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{data?.overview?.criticalVitalsCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">${order.total?.toFixed(2)}</p>
                    </div>
                    <span className={`badge ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Health Records</h2>
              <Link to="/patients/records" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data?.recentRecords?.slice(0, 5).map((record) => (
                <div key={record._id} className="border-b pb-2">
                  <p className="font-medium">{record.doctor?.name}</p>
                  <p className="text-sm text-gray-500">{record.diagnosis}</p>
                  <p className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Vitals</h2>
              <Link to="/health-vitals" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data?.recentVitals?.slice(0, 5).map((vital) => (
                <div key={vital._id} className="border-b pb-2">
                  <p className="text-sm">
                    {vital.heartRate?.value && `HR: ${vital.heartRate.value} bpm`}
                    {vital.bloodPressure?.systolic && ` | BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(vital.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
