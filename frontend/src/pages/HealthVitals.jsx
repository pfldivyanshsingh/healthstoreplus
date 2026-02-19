import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { healthVitalService } from '../services/healthVitalService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HealthVitals = () => {
  const { user } = useAuth();
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    heartRate: { value: '', unit: 'bpm' },
    bloodPressure: { systolic: '', diastolic: '', unit: 'mmHg' },
    temperature: { value: '', unit: '°F' },
    oxygenLevel: { value: '', unit: '%' },
    weight: { value: '', unit: 'kg' },
    height: { value: '', unit: 'cm' },
    notes: ''
  });

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const response = await healthVitalService.getAll();
      if (response.success) {
        setVitals(response.data);
      }
    } catch (error) {
      toast.error('Failed to load health vitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      // Remove empty values
      if (!data.heartRate.value) delete data.heartRate;
      if (!data.bloodPressure.systolic || !data.bloodPressure.diastolic) delete data.bloodPressure;
      if (!data.temperature.value) delete data.temperature;
      if (!data.oxygenLevel.value) delete data.oxygenLevel;
      if (!data.weight.value) delete data.weight;
      if (!data.height.value) delete data.height;
      if (!data.patient && user.role === 'patient') data.patient = user.id;

      await healthVitalService.create(data);
      toast.success('Health vital recorded successfully');
      setShowModal(false);
      resetForm();
      fetchVitals();
    } catch (error) {
      toast.error('Failed to save health vital');
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      heartRate: { value: '', unit: 'bpm' },
      bloodPressure: { systolic: '', diastolic: '', unit: 'mmHg' },
      temperature: { value: '', unit: '°F' },
      oxygenLevel: { value: '', unit: '%' },
      weight: { value: '', unit: 'kg' },
      height: { value: '', unit: 'cm' },
      notes: ''
    });
  };

  return (
    <DashboardLayout title="Health Vitals">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Record Health Vitals
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitals.map((vital) => (
              <div key={vital._id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{vital.patient?.name || 'N/A'}</h3>
                  {vital.isCritical && (
                    <span className="badge bg-red-100 text-red-800">Critical</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">{new Date(vital.date).toLocaleString()}</p>
                <div className="space-y-2 text-sm">
                  {vital.heartRate?.value && (
                    <p><span className="font-medium">Heart Rate:</span> {vital.heartRate.value} {vital.heartRate.unit} 
                      <span className={`ml-2 badge ${
                        vital.heartRate.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vital.heartRate.status === 'high' || vital.heartRate.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vital.heartRate.status}
                      </span>
                    </p>
                  )}
                  {vital.bloodPressure?.systolic && (
                    <p><span className="font-medium">Blood Pressure:</span> {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} {vital.bloodPressure.unit}
                      <span className={`ml-2 badge ${
                        vital.bloodPressure.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vital.bloodPressure.status === 'high' || vital.bloodPressure.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vital.bloodPressure.status}
                      </span>
                    </p>
                  )}
                  {vital.temperature?.value && (
                    <p><span className="font-medium">Temperature:</span> {vital.temperature.value} {vital.temperature.unit}
                      <span className={`ml-2 badge ${
                        vital.temperature.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vital.temperature.status === 'high' || vital.temperature.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vital.temperature.status}
                      </span>
                    </p>
                  )}
                  {vital.oxygenLevel?.value && (
                    <p><span className="font-medium">Oxygen Level:</span> {vital.oxygenLevel.value} {vital.oxygenLevel.unit}
                      <span className={`ml-2 badge ${
                        vital.oxygenLevel.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vital.oxygenLevel.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vital.oxygenLevel.status}
                      </span>
                    </p>
                  )}
                  {vital.weight?.value && <p><span className="font-medium">Weight:</span> {vital.weight.value} {vital.weight.unit}</p>}
                  {vital.height?.value && <p><span className="font-medium">Height:</span> {vital.height.value} {vital.height.unit}</p>}
                  {vital.notes && <p className="text-gray-600"><span className="font-medium">Notes:</span> {vital.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Record Health Vitals</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                    <input type="number" className="input-field" value={formData.heartRate.value} onChange={(e) => setFormData({...formData, heartRate: {...formData.heartRate, value: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Systolic BP</label>
                    <input type="number" className="input-field" value={formData.bloodPressure.systolic} onChange={(e) => setFormData({...formData, bloodPressure: {...formData.bloodPressure, systolic: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Diastolic BP</label>
                    <input type="number" className="input-field" value={formData.bloodPressure.diastolic} onChange={(e) => setFormData({...formData, bloodPressure: {...formData.bloodPressure, diastolic: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperature (°F)</label>
                    <input type="number" step="0.1" className="input-field" value={formData.temperature.value} onChange={(e) => setFormData({...formData, temperature: {...formData.temperature, value: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Oxygen Level (%)</label>
                    <input type="number" step="0.1" min="0" max="100" className="input-field" value={formData.oxygenLevel.value} onChange={(e) => setFormData({...formData, oxygenLevel: {...formData.oxygenLevel, value: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <input type="number" step="0.1" className="input-field" value={formData.weight.value} onChange={(e) => setFormData({...formData, weight: {...formData.weight, value: e.target.value}})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height (cm)</label>
                    <input type="number" step="0.1" className="input-field" value={formData.height.value} onChange={(e) => setFormData({...formData, height: {...formData.height, value: e.target.value}})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea className="input-field" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Record Vitals
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HealthVitals;
