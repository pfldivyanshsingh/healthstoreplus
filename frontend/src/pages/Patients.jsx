import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      const response = await patientService.getAll(params);
      if (response.success) {
        setPatients(response.data);
      }
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (patientId) => {
    try {
      const response = await patientService.getRecords(patientId);
      if (response.success) {
        setRecords(response.data);
      }
    } catch (error) {
      toast.error('Failed to load records');
    }
  };

  const handleViewRecords = (patient) => {
    setSelectedPatient(patient);
    fetchRecords(patient._id);
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await patientService.createRecord(selectedPatient._id, recordForm);
      toast.success('Record created successfully');
      setShowRecordModal(false);
      setRecordForm({
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: ''
      });
      fetchRecords(selectedPatient._id);
    } catch (error) {
      toast.error('Failed to create record');
    }
  };

  return (
    <DashboardLayout title="Patients">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients..."
            className="input-field max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient._id} className="card">
                <h3 className="text-lg font-bold mb-2">{patient.name}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Email: {patient.email}</p>
                  {patient.phone && <p>Phone: {patient.phone}</p>}
                  {patient.address && <p>Address: {patient.address}</p>}
                </div>
                {user?.role === 'doctor' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewRecords(patient)}
                      className="btn-primary text-sm flex-1"
                    >
                      View Records
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Records for {selectedPatient.name}</h2>
                <div className="flex gap-2">
                  {user?.role === 'doctor' && (
                    <button onClick={() => setShowRecordModal(true)} className="btn-primary">
                      Add Record
                    </button>
                  )}
                  <button onClick={() => setSelectedPatient(null)} className="btn-secondary">
                    Close
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{record.diagnosis || 'No diagnosis'}</p>
                        <p className="text-sm text-gray-600">Dr. {record.doctor?.name}</p>
                        <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {record.symptoms && <p className="text-sm mb-1"><strong>Symptoms:</strong> {record.symptoms}</p>}
                    {record.treatment && <p className="text-sm mb-1"><strong>Treatment:</strong> {record.treatment}</p>}
                    {record.notes && <p className="text-sm"><strong>Notes:</strong> {record.notes}</p>}
                  </div>
                ))}
                {records.length === 0 && <p className="text-center text-gray-500 py-8">No records found</p>}
              </div>
            </div>
          </div>
        )}

        {showRecordModal && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create Patient Record</h2>
              <form onSubmit={handleCreateRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="input-field" required value={recordForm.date} onChange={(e) => setRecordForm({...recordForm, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnosis</label>
                  <input type="text" className="input-field" value={recordForm.diagnosis} onChange={(e) => setRecordForm({...recordForm, diagnosis: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Symptoms</label>
                  <textarea className="input-field" rows="3" value={recordForm.symptoms} onChange={(e) => setRecordForm({...recordForm, symptoms: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Treatment</label>
                  <textarea className="input-field" rows="3" value={recordForm.treatment} onChange={(e) => setRecordForm({...recordForm, treatment: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea className="input-field" rows="3" value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Record
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

export default Patients;
