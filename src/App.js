import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import CameraControl from './pages/CameraControl/CameraControl';
import VideoLibrary from './pages/VideoLibrary/VideoLibrary';
import LiveStream from './pages/LiveStream/LiveStream';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Context
import { AuthProvider } from './context/AuthContext';
import { CameraProvider } from './context/CameraContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CameraProvider>
            <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="camera" element={<CameraControl />} />
                    <Route path="library" element={<VideoLibrary />} />
                    <Route path="stream" element={<LiveStream />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </motion.div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #00d4ff',
                  },
                }}
              />
            </Box>
          </CameraProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;