
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:1814/api/v2/Quizdb/users');
        console.log('API Response:', response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();

    // Set up polling to refresh data every 60 seconds
    const intervalId = setInterval(fetchUsers, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:1814/api/v2/Quizdb/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to refresh users');
      setLoading(false);
    }
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted users
  const getSortedUsers = () => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle special case for score
        if (sortConfig.key === 'score') {
          aValue = isNaN(Number(aValue)) ? 0 : Number(aValue);
          bValue = isNaN(Number(bValue)) ? 0 : Number(bValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <div className="animate-pulse">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={handleRefresh}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg border rounded bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Registered Users and Scores</h3>
      
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  Username {sortConfig.key === 'name' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => requestSort('score')}
                >
                  Score {sortConfig.key === 'score' && (
                    <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="border px-4 py-2"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedUsers().map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {user.score !== undefined ? user.score : 'N/A'}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {user.role || 'User'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default AdminDashboard;