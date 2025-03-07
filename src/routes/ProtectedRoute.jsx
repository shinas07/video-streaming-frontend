import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');

  if (!user) {
    toast.info('Place sign in to continue.')
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;