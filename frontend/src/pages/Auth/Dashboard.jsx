import { useEffect, useState } from "react";
import axiosClient from "../../../services/axiosClient";
import { API_PATHS } from "../../../services/apiPaths";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Destructure logout from AuthContext
  const { user: currentUser, logout } = useAuth(); 
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await axiosClient.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(data.data);
    } catch (error) {
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

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    if (!window.confirm(`Are you sure you want to make this user ${newStatus}?`)) return;

    setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));

    try {
      await axiosClient.patch(API_PATHS.USERS.UPDATE_USER_STATUS_BY_ID(userId), {
        status: newStatus,
      });
      toast.success(`User updated to ${newStatus}`);
    } catch (error) {
      toast.error("Update failed");
      fetchUsers();
    }
  };

  // 2. Handle Logout Action
  const handleLogout = async () => {
    await logout(); // Context clears user & calls API
    navigate("/login"); // Force redirect just in case
    toast.info("Logged out successfully");
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading System Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with Logout Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome, <span className="font-semibold text-indigo-600">{currentUser?.fullName}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm border border-gray-200">
            Role: <span className="uppercase tracking-wide text-indigo-600">{currentUser?.role}</span>
          </div>

          {/* 3. The Logout Button */}
          <button
            onClick={handleLogout}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
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
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.fullName?.charAt(0).toUpperCase()}
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
                        className={`font-medium transition-colors ${
                          user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
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