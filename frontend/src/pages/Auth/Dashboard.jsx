import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { API_PATHS } from "../../services/apiPaths";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  // Fetch Users (Only if Admin)
  const fetchUsers = async () => {
    try {
      const { data } = await axiosClient.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(data.data);
    } catch (error) {
      // If a regular user tries to hit this, they might get 403. 
      if (currentUser?.role === 'admin') {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // 2. Handle Status Toggle
  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // Optimistic Update
    setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));

    try {
      await axiosClient.patch(API_PATHS.USERS.UPDATE_USER_STATUS_BY_ID(userId), {
        status: newStatus,
      });
      toast.success(`User updated to ${newStatus}`);
    } catch (error) {
      toast.error("Update failed");
      fetchUsers(); // Revert
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading System Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome, <span className="font-semibold text-indigo-600">{currentUser?.fullName}</span>
          </p>
        </div>
        <div className="rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm border border-gray-200">
          Role: <span className="uppercase tracking-wide text-indigo-600">{currentUser?.role}</span>
        </div>
      </div>

      {/* ADMIN VIEW: User Table */}
      {currentUser?.role === 'admin' ? (
        <div className="overflow-hidden rounded-xl bg-white shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {currentUser._id !== user._id && (
                      <button
                        onClick={() => toggleStatus(user._id, user.status)}
                        className={`font-medium hover:underline ${
                          user.status === 'active' ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* USER VIEW */
        <div className="rounded-xl bg-white p-10 text-center shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
          <p className="mt-2 text-gray-500">You have standard access. Contact an admin to upgrade.</p>
        </div>
      )}
    </div>
  );
}