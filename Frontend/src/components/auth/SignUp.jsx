
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:1814/api/v2/Quizdb/signin', formData);
      
      // Set success message
      setMessage(res.data.message || 'Registration successful!');
      
      if (res.data.success) {
        // Check if the response contains a user ID
        if (res.data.userId) {
          // Store the user ID in localStorage
          localStorage.setItem('userId', res.data.userId);
          console.log('User ID stored:', res.data.userId);
        } else if (res.data.user && res.data.user._id) {
          // Alternative - if the ID is in a user object
          localStorage.setItem('userId', res.data.user._id);
          console.log('User ID stored:', res.data.user._id);
        } else {
          console.warn('No user ID found in the response');
        }
        
        // Set authentication flag
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/quiz');
        }, 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl border rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      
      {message && (
        <p className={`mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full p-2 bg-gray-900 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;