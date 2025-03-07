import { RouterProvider } from "react-router-dom";
import router from './routes/router'
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="min-h-screen">
      <AuthProvider>
      <Toaster position="top-right" expand={false} richColors />
      <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App
