import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Videocam,
  PlayArrow,
  Stop,
  Settings,
  PhotoCamera,
  VideoLibrary,
  LiveTv,
  Battery90,
  Storage,
  Wifi,
  WifiOff,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCamera } from '../../context/CameraContext';

const CameraControl = () => {
  const {
    camera,
    connectCamera,
    disconnectCamera,
    startRecording,
    stopRecording,
    startStreaming,
    stopStreaming,
    updateCameraSettings,
    loading,
  } = useCamera();

  const [settings, setSettings] = useState({
    mode: camera.mode || 'video',
    resolution: camera.resolution || '1080p',
    fps: camera.fps || 30,
    stabilization: true,
    protune: false,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Simulate camera preview
    if (camera.connected) {
      setPreviewUrl('https://via.placeholder.com/640x480/00d4ff/ffffff?text=GoPro+Preview');
    } else {
      setPreviewUrl(null);
    }
  }, [camera.connected]);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    updateCameraSettings(newSettings);
  };

  const handleConnect = () => {
    if (camera.connected) {
      disconnectCamera();
    } else {
      connectCamera();
    }
  };

  const handleRecord = () => {
    if (camera.recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleStream = () => {
    if (camera.streaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  const takePhoto = () => {
    // Simulate taking a photo
    console.log('Taking photo...');
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Camera Control
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Camera Preview */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Videocam sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Live Preview</Typography>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    icon={camera.connected ? <Wifi /> : <WifiOff />}
                    label={camera.connected ? 'Connected' : 'Disconnected'}
                    color={camera.connected ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  backgroundColor: '#000',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Camera Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Videocam sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Camera not connected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connect your GoPro to start preview
                    </Typography>
                  </Box>
                )}

                {/* Recording indicator */}
                {camera.recording && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(255, 0, 0, 0.8)',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      animation: 'pulse 1s infinite',
                    }}
                  />
                )}

                {/* Camera status overlay */}
                {camera.connected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<Battery90 />}
                      label={`${camera.battery}%`}
                      size="small"
                      color={camera.battery > 20 ? 'success' : 'warning'}
                    />
                    <Chip
                      icon={<Storage />}
                      label={`${camera.storage}%`}
                      size="small"
                      color={camera.storage < 80 ? 'success' : 'warning'}
                    />
                  </Box>
                )}
              </Box>

              {/* Camera Controls */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleConnect}
                  disabled={loading}
                  startIcon={camera.connected ? <WifiOff /> : <Wifi />}
                  sx={{
                    background: camera.connected
                      ? 'linear-gradient(45deg, #ff6b35, #f7931e)'
                      : 'linear-gradient(45deg, #00d4ff, #00b8e6)',
                  }}
                >
                  {camera.connected ? 'Disconnect' : 'Connect'}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleRecord}
                  disabled={!camera.connected || loading}
                  startIcon={camera.recording ? <Stop /> : <PlayArrow />}
                  sx={{
                    background: camera.recording
                      ? 'linear-gradient(45deg, #ff4444, #cc0000)'
                      : 'linear-gradient(45deg, #00d4ff, #00b8e6)',
                  }}
                >
                  {camera.recording ? 'Stop Recording' : 'Start Recording'}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleStream}
                  disabled={!camera.connected || loading}
                  startIcon={<LiveTv />}
                  sx={{
                    background: camera.streaming
                      ? 'linear-gradient(45deg, #ff4444, #cc0000)'
                      : 'linear-gradient(45deg, #00d4ff, #00b8e6)',
                  }}
                >
                  {camera.streaming ? 'Stop Stream' : 'Start Stream'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={takePhoto}
                  disabled={!camera.connected || loading}
                  startIcon={<PhotoCamera />}
                >
                  Take Photo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Camera Settings */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Camera Settings</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Mode Selection */}
                <FormControl fullWidth>
                  <InputLabel>Mode</InputLabel>
                  <Select
                    value={settings.mode}
                    label="Mode"
                    onChange={(e) => handleSettingChange('mode', e.target.value)}
                    disabled={!camera.connected}
                  >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="photo">Photo</MenuItem>
                    <MenuItem value="timelapse">Time Lapse</MenuItem>
                    <MenuItem value="burst">Burst</MenuItem>
                  </Select>
                </FormControl>

                {/* Resolution Selection */}
                <FormControl fullWidth>
                  <InputLabel>Resolution</InputLabel>
                  <Select
                    value={settings.resolution}
                    label="Resolution"
                    onChange={(e) => handleSettingChange('resolution', e.target.value)}
                    disabled={!camera.connected}
                  >
                    <MenuItem value="4K">4K</MenuItem>
                    <MenuItem value="2.7K">2.7K</MenuItem>
                    <MenuItem value="1080p">1080p</MenuItem>
                    <MenuItem value="720p">720p</MenuItem>
                  </Select>
                </FormControl>

                {/* FPS Slider */}
                <Box>
                  <Typography gutterBottom>Frame Rate (FPS)</Typography>
                  <Slider
                    value={settings.fps}
                    onChange={(e, value) => handleSettingChange('fps', value)}
                    min={24}
                    max={240}
                    step={1}
                    marks={[
                      { value: 24, label: '24' },
                      { value: 30, label: '30' },
                      { value: 60, label: '60' },
                      { value: 120, label: '120' },
                      { value: 240, label: '240' },
                    ]}
                    disabled={!camera.connected}
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#00d4ff',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#00d4ff',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {settings.fps} FPS
                  </Typography>
                </Box>

                {/* Stabilization Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.stabilization}
                      onChange={(e) => handleSettingChange('stabilization', e.target.checked)}
                      disabled={!camera.connected}
                    />
                  }
                  label="Stabilization"
                />

                {/* ProTune Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.protune}
                      onChange={(e) => handleSettingChange('protune', e.target.checked)}
                      disabled={!camera.connected}
                    />
                  }
                  label="ProTune"
                />
              </Box>

              {/* Current Settings Display */}
              {camera.connected && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Settings:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2">
                      Mode: {camera.mode} | Resolution: {camera.resolution} | FPS: {camera.fps}
                    </Typography>
                    <Typography variant="body2">
                      Stabilization: {settings.stabilization ? 'On' : 'Off'} | ProTune: {settings.protune ? 'On' : 'Off'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  disabled={!camera.connected}
                  onClick={() => window.location.reload()}
                >
                  Refresh Connection
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<VideoLibrary />}
                  onClick={() => window.location.href = '/library'}
                >
                  View Library
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Alerts */}
      {!camera.connected && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Camera is not connected. Please connect your GoPro to start controlling it.
        </Alert>
      )}

      {camera.connected && camera.battery < 20 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Camera battery is low ({camera.battery}%). Please charge your camera.
        </Alert>
      )}

      {camera.connected && camera.storage > 80 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Camera storage is almost full ({camera.storage}%). Please free up space.
        </Alert>
      )}
    </Box>
  );
};

export default CameraControl;


