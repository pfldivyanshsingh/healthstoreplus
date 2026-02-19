import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { dashboardService } from '../../services/dashboardService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardService.getDoctor();
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
      <DashboardLayout title="Doctor Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalPatients || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data?.overview?.totalRecords || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Critical Vitals</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{data?.overview?.criticalVitalsCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Patient Records</h2>
            <div className="space-y-2">
              {data?.recentRecords?.slice(0, 5).map((record) => (
                <div key={record._id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{record.patient?.name}</p>
                      <p className="text-sm text-gray-500">{record.diagnosis}</p>
                      <p className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Critical Health Vitals</h2>
              <Link to="/health-vitals?isCritical=true" className="text-primary-600 hover:text-primary-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data?.criticalVitals?.slice(0, 5).map((vital) => (
                <div key={vital._id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{vital.patient?.name}</p>
                      <p className="text-sm text-gray-500">
                        {vital.heartRate?.value && `HR: ${vital.heartRate.value} bpm`}
                        {vital.bloodPressure?.systolic && ` | BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`}
                        {vital.oxygenLevel?.value && ` | O2: ${vital.oxygenLevel.value}%`}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(vital.date).toLocaleDateString()}</p>
                    </div>
                    <span className="badge bg-red-100 text-red-800">Critical</span>
                  </div>
                </div>
              ))}
              {(!data?.criticalVitals || data.criticalVitals.length === 0) && (
                <p className="text-gray-500 text-center py-4">No critical vitals</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
