
import { Navigate, Route, Routes } from 'react-router-dom';
 import Signup from './components/auth/SignUp';
 import Header from './components/Header';
 import Quiz from './components/Quiz';
 import PrivateRoute from './components/auth/PrivatedRoute';
 import Footer from './components/Footer';
 import AdminLogin from './components/auth/AdminLogIn';
 import ProtectedRoute from './components/auth/ProtectedRoute';
 import AdminDashboard from './components/AdminDashboard'; // Add this import


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/signin" element={<Signup />} />
        <Route path="/quiz" element={<PrivateRoute element={<Quiz />} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;