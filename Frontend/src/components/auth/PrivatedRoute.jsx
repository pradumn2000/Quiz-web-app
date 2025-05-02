import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
 
    return <Navigate to="/signin" />;
  }


  return element;
};

export default PrivateRoute;
