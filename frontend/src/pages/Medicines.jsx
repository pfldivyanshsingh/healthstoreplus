import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { medicineService } from '../services/medicineService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Medicines = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'over-the-counter',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    price: '',
    stock: '',
    minStockLevel: '',
    unit: 'units',
    prescriptionRequired: false
  });

  useEffect(() => {
    fetchMedicines();
  }, [search, category]);

  const fetchMedicines = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await medicineService.getAll(params);
      if (response.success) {
        setMedicines(response.data);
      }
    } catch (error) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await medicineService.update(editingMedicine._id, formData);
        toast.success('Medicine updated successfully');
      } else {
        await medicineService.create(formData);
        toast.success('Medicine added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchMedicines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save medicine');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      category: medicine.category,
      manufacturer: medicine.manufacturer || '',
      batchNumber: medicine.batchNumber || '',
      expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
      price: medicine.price,
      stock: medicine.stock,
      minStockLevel: medicine.minStockLevel,
      unit: medicine.unit,
      prescriptionRequired: medicine.prescriptionRequired || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await medicineService.delete(id);
      toast.success('Medicine deleted successfully');
      fetchMedicines();
    } catch (error) {
      toast.error('Failed to delete medicine');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'over-the-counter',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      price: '',
      stock: '',
      minStockLevel: '',
      unit: 'units',
      prescriptionRequired: false
    });
    setEditingMedicine(null);
  };

  const canManage = user?.role === 'admin' || user?.role === 'store_manager';

  return (
    <DashboardLayout title="Medicines">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <input
              type="text"
              placeholder="Search medicines..."
              className="input-field flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input-field w-48"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="prescription">Prescription</option>
              <option value="over-the-counter">Over-the-Counter</option>
              <option value="supplements">Supplements</option>
              <option value="medical-equipment">Medical Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>
          {canManage && (
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">
              Add Medicine
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <div key={medicine._id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{medicine.name}</h3>
                  {medicine.stock <= medicine.minStockLevel && (
                    <span className="badge bg-red-100 text-red-800">Low Stock</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{medicine.description}</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Category:</span> {medicine.category}</p>
                  <p><span className="font-medium">Price:</span> ${medicine.price}</p>
                  <p><span className="font-medium">Stock:</span> {medicine.stock} {medicine.unit}</p>
                  <p><span className="font-medium">Expiry:</span> {new Date(medicine.expiryDate).toLocaleDateString()}</p>
                </div>
                {canManage && (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEdit(medicine)} className="btn-secondary text-sm flex-1">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(medicine._id)} className="btn-danger text-sm flex-1">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{editingMedicine ? 'Edit' : 'Add'} Medicine</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input type="text" className="input-field" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select className="input-field" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="prescription">Prescription</option>
                      <option value="over-the-counter">Over-the-Counter</option>
                      <option value="supplements">Supplements</option>
                      <option value="medical-equipment">Medical Equipment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input type="number" step="0.01" className="input-field" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input type="number" className="input-field" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Stock Level *</label>
                    <input type="number" className="input-field" required value={formData.minStockLevel} onChange={(e) => setFormData({...formData, minStockLevel: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit</label>
                    <input type="text" className="input-field" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Manufacturer</label>
                    <input type="text" className="input-field" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                    <input type="date" className="input-field" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea className="input-field" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="prescriptionRequired" className="mr-2" checked={formData.prescriptionRequired} onChange={(e) => setFormData({...formData, prescriptionRequired: e.target.checked})} />
                  <label htmlFor="prescriptionRequired">Prescription Required</label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMedicine ? 'Update' : 'Create'}
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

export default Medicines;
