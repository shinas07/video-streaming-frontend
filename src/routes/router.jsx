import { createBrowserRouter, Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LoginForm from '../components/auth/Login';
import Home from '../pages/Home';
import Register from '../components/auth/Register';
// videos 
import VideoUpload from '../pages/VideoUpload';
import VideoPlayer from '../pages/VideoPlayer';
import VideoList from '../pages/VideoList';
import VideoEdit from '../pages/VideoEdit';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
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
        path:"/",
        element:<Home/>
    },
    {
        path:"/signin",
        element: (
            <AuthRoute>
                <LoginForm />
            </AuthRoute>
        ),
    },
    {
        path:"/signup",
        element: (
            <AuthRoute>
                <Register />
            </AuthRoute>
        ),
    },
    {
        path:"/video/upload/",
        element:
        <ProtectedRoute>
        <VideoUpload/>
        </ProtectedRoute>
    },
    {
        path:"/videos/",
        element:
        <ProtectedRoute>
        <VideoList/>,
        </ProtectedRoute>
    },
    {
        path:"/watch-video/:videoId",
        element:
        <ProtectedRoute>
        <VideoPlayer/>
        </ProtectedRoute>
    },
    {
        path:'/edit-video/:videoId',
        element:
        <ProtectedRoute>
        <VideoEdit/>,
        </ProtectedRoute>
    },
      {
        path: '*',
        element: <NotFound />,
      },
])

export default router