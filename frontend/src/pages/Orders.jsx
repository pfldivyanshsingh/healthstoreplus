import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { orderService } from '../services/orderService';
import { medicineService } from '../services/medicineService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([{ medicine: '', quantity: 1 }]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
    if (user?.role === 'patient' || user?.role === 'store_manager') {
      fetchMedicines();
    }
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await orderService.getAll(params);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineService.getAll();
      if (response.success) {
        setMedicines(response.data);
      }
    } catch (error) {
      toast.error('Failed to load medicines');
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const items = orderItems.filter(item => item.medicine && item.quantity > 0);
      if (items.length === 0) {
        toast.error('Please add at least one item');
        return;
      }

      await orderService.create({ items });
      toast.success('Order created successfully');
      setShowModal(false);
      setOrderItems([{ medicine: '', quantity: 1 }]);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const handleStatusUpdate = async (orderId, status, paymentStatus) => {
    try {
      await orderService.updateStatus(orderId, status, paymentStatus);
      toast.success('Order updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const canManage = user?.role === 'admin' || user?.role === 'store_manager';

  return (
    <DashboardLayout title="Orders">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <select
            className="input-field w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {(user?.role === 'patient' || user?.role === 'store_manager') && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Create Order
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.patient?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`badge ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${item.total?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal: ${order.subtotal?.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Tax: ${order.tax?.toFixed(2)}</p>
                    <p className="text-lg font-bold">Total: ${order.total?.toFixed(2)}</p>
                  </div>
                  {canManage && order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <select
                        className="input-field text-sm"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value, order.paymentStatus)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                      <select
                        className="input-field text-sm"
                        value={order.paymentStatus}
                        onChange={(e) => handleStatusUpdate(order._id, order.status, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create Order</h2>
              <form onSubmit={handleCreateOrder}>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        className="input-field flex-1"
                        value={item.medicine}
                        onChange={(e) => {
                          const newItems = [...orderItems];
                          newItems[index].medicine = e.target.value;
                          setOrderItems(newItems);
                        }}
                        required
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map((med) => (
                          <option key={med._id} value={med._id}>{med.name} - ${med.price} (Stock: {med.stock})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        className="input-field w-24"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...orderItems];
                          newItems[index].quantity = parseInt(e.target.value);
                          setOrderItems(newItems);
                        }}
                        required
                      />
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                          className="btn-danger"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOrderItems([...orderItems, { medicine: '', quantity: 1 }])}
                    className="btn-secondary w-full"
                  >
                    Add Item
                  </button>
                </div>
                <div className="flex gap-2 justify-end mt-6">
                  <button type="button" onClick={() => { setShowModal(false); setOrderItems([{ medicine: '', quantity: 1 }]); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Order
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

export default Orders;
