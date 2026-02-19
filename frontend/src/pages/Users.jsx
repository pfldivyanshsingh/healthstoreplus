import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const response = await userService.getAll(params);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await userService.delete(id);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="input-field flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field w-48"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="store_manager">Store Manager</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">{user.name}</h3>
                    <span className="badge bg-blue-100 text-blue-800 capitalize">
                      {user.role?.replace('_', ' ')}
                    </span>
                  </div>
                  {!user.isActive && (
                    <span className="badge bg-red-100 text-red-800">Inactive</span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Email: {user.email}</p>
                  {user.phone && <p>Phone: {user.phone}</p>}
                  {user.specialization && <p>Specialization: {user.specialization}</p>}
                  {user.licenseNumber && <p>License: {user.licenseNumber}</p>}
                </div>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn-danger text-sm w-full"
                  disabled={!user.isActive}
                >
                  {user.isActive ? 'Deactivate' : 'Deactivated'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;
