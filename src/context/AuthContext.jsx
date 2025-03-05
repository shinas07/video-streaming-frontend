import { createContext, useContext, useState, useEffect, use } from 'react';
import { encryptToken ,decryptToken} from '../components/utils/tokenUtils';
import { toast } from 'sonner';
import api from '../services/api';


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    setLoading(false);
  }, []);

// Login handler
const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', { email, password });
      
      if (response.data.tokens) {
        const { access, refresh } = response.data.tokens;
        const user = response.data.user;

        // Encrypt tokens
        const encryptedAccess = encryptToken(access);
        const encryptedRefresh = encryptToken(refresh);

        // Store tokens and user data
        localStorage.setItem('access_token', encryptedAccess);
        localStorage.setItem('refresh_token', encryptedRefresh);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      
      throw new Error(response.data.error || 'Login failed');
    } catch (error) {
    //   const errorMessage = error.response?.data?.error || 'Login failed';
    //   toast.error(errorMessage);
    console.log(error)
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

    // Register handler
    const register = async (userData) => {
        setLoading(true);
        try {
          const response = await api.post('auth/register/', userData);
          
          if (response.status === 201) {
            toast.success('Registration successful! Please login.');
            return { success: true };
          }
          return { success: false, error: response.data.message };
        } catch (error) {
            console.error('Registration error:', error.response?.data); // Log the full error response
            
            // Handle validation errors
            if (error.response?.data?.errors) {
              const errors = error.response.data.errors;
              
              // Convert validation errors to readable messages
              if (errors.email) {
                return { success: false, error: `Email: ${errors.email[0]}` };
              }
              if (errors.username) {
                return { success: false, error: `Username: ${errors.username[0]}` };
              }
              if (errors.password) {
                return { success: false, error: `Password: ${errors.password[0]}` };
              }
              if (errors.password2) {
                return { success: false, error: `Confirm Password: ${errors.password2[0]}` };
              }
            }
            
            // Handle other types of errors
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            return { success: false, error: errorMessage };
        } finally {
          setLoading(false);
        }
      };

      const logout = async () => {
        setLoading(true);
        try {
          const encryptedRefreshToken = localStorage.getItem('refresh_token');
          if (encryptedRefreshToken) {
            const refreshToken = decryptToken(encryptedRefreshToken);
            const response = await api.post('auth/logout/', { refresh_token: refreshToken });
            console.log('api call working',response.status)
          }
         
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
        localStorage.clear()
          setUser(null);
          setLoading(false);
          toast.success('Logged out successfully');
          return { success: true };
        }
      };


  return (
    <AuthContext.Provider value={{ user, loginUser, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
