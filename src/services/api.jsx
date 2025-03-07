import axios from "axios";
import { toast } from "sonner";
import { decryptToken, encryptToken } from "../components/utils/tokenUtils";
const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const encryptedToken = localStorage.getItem('access_token');
        if (encryptedToken) {
            const token = decryptToken(encryptedToken);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const encryptedRefreshToken = localStorage.getItem('refresh_token');
    
    if (!encryptedRefreshToken) {
        throw new Error('No refresh token available');
    }
    
    try {
        // Decrypt the refresh token before sending to the server
        const decryptedRefreshToken = decryptToken(encryptedRefreshToken);
        
        // Use a separate axios instance to avoid interceptors loop
        const response = await axios.post(`${BASE_URL}auth/refresh/`, {
            refresh: decryptedRefreshToken
        }, {
            withCredentials: true
        });
        
        if (response.data.access) {
            // Encrypt the new access token before storing
            const encryptedAccessToken = encryptToken(response.data.access);
            localStorage.setItem('access_token', encryptedAccessToken);
            
            // Encrypt the new refresh token if provided
            if (response.data.refresh) {
                const encryptedNewRefreshToken = encryptToken(response.data.refresh);
                localStorage.setItem('refresh_token', encryptedNewRefreshToken);
            }
            
            return response.data.access; // Return decrypted access token for immediate use
        }
        throw new Error('No access token received');
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.clear()
        throw error;
    }
};

// Simplified response interceptor
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                toast.error('Session expired. Please log in again.');
                
                // if (window.location.pathname !== '/') {
                //     window.location.href = '/';
                // }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
