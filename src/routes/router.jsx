import { createBrowserRouter, Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LoginForm from '../components/auth/Login';
import Home from '../pages/Home';
import Register from '../components/auth/Register';
// videos 
import VideoUpload from '../pages/VideoUpload';

// Simple Protected Route Component
const AuthRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/signin',
        element: (
            <AuthRoute>
                <LoginForm />
            </AuthRoute>
        ),
    },
    {
        path:'/signup',
        element: (
            <AuthRoute>
                <Register />
            </AuthRoute>
        ),
    },
    {
        path:'video/upload/',
        element:<VideoUpload/>
    },
])

export default router