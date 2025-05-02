import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;