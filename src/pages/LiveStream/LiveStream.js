import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  LiveTv,
  PlayArrow,
  Stop,
  Settings,
  Share,
  Chat,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCamera } from '../../context/CameraContext';

const LiveStream = () => {
  const { camera, streamUrl, startStreaming, stopStreaming } = useCamera();
  const [streamSettings, setStreamSettings] = useState({
    platform: 'youtube',
    quality: '1080p',
    enableChat: true,
    enableRecording: false,
    streamKey: '',
  });

  const handleSettingChange = (setting, value) => {
    setStreamSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleStartStream = () => {
    if (!streamSettings.streamKey) {
      alert('Please enter a stream key');
      return;
    }
    startStreaming();
  };

  const handleStopStream = () => {
    stopStreaming();
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Live Stream
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Stream Preview */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LiveTv sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Live Stream</Typography>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={camera.streaming ? 'LIVE' : 'OFFLINE'}
                    color={camera.streaming ? 'error' : 'default'}
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
                }}
              >
                {camera.streaming ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <LiveTv sx={{ fontSize: 64, color: '#ff4444', mb: 2 }} />
                    <Typography variant="h6" color="white">
                      Live Stream Active
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your stream is now live
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <LiveTv sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Stream not active
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start streaming to go live
                    </Typography>
                  </Box>
                )}

                {/* Live indicator */}
                {camera.streaming && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: '#ff4444',
                      borderRadius: '50%',
                      width: 12,
                      height: 12,
                      animation: 'pulse 1s infinite',
                    }}
                  />
                )}
              </Box>

              {/* Stream Controls */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleStartStream}
                  disabled={!camera.connected || camera.streaming}
                  startIcon={<PlayArrow />}
                  sx={{
                    background: 'linear-gradient(45deg, #00d4ff, #00b8e6)',
                  }}
                >
                  Start Stream
                </Button>

                <Button
                  variant="contained"
                  onClick={handleStopStream}
                  disabled={!camera.streaming}
                  startIcon={<Stop />}
                  sx={{
                    background: 'linear-gradient(45deg, #ff4444, #cc0000)',
                  }}
                >
                  Stop Stream
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  disabled={!camera.streaming}
                >
                  Share Stream
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stream Settings */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Settings sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Stream Settings</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={streamSettings.platform}
                    label="Platform"
                    onChange={(e) => handleSettingChange('platform', e.target.value)}
                  >
                    <MenuItem value="youtube">YouTube</MenuItem>
                    <MenuItem value="twitch">Twitch</MenuItem>
                    <MenuItem value="facebook">Facebook</MenuItem>
                    <MenuItem value="instagram">Instagram</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Quality</InputLabel>
                  <Select
                    value={streamSettings.quality}
                    label="Quality"
                    onChange={(e) => handleSettingChange('quality', e.target.value)}
                  >
                    <MenuItem value="720p">720p</MenuItem>
                    <MenuItem value="1080p">1080p</MenuItem>
                    <MenuItem value="1440p">1440p</MenuItem>
                    <MenuItem value="4K">4K</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Stream Key"
                  value={streamSettings.streamKey}
                  onChange={(e) => handleSettingChange('streamKey', e.target.value)}
                  type="password"
                  helperText="Enter your stream key from your platform"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={streamSettings.enableChat}
                      onChange={(e) => handleSettingChange('enableChat', e.target.checked)}
                    />
                  }
                  label="Enable Chat"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={streamSettings.enableRecording}
                      onChange={(e) => handleSettingChange('enableRecording', e.target.checked)}
                    />
                  }
                  label="Record Stream"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Stream Stats */}
          {camera.streaming && (
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stream Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Viewers:
                    </Typography>
                    <Typography variant="body2">1,234</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration:
                    </Typography>
                    <Typography variant="body2">00:15:30</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Bitrate:
                    </Typography>
                    <Typography variant="body2">5.2 Mbps</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Alerts */}
      {!camera.connected && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Camera is not connected. Please connect your GoPro to start streaming.
        </Alert>
      )}

      {camera.connected && !camera.streaming && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Configure your stream settings and enter a stream key to start broadcasting.
        </Alert>
      )}
    </Box>
  );
};

export default LiveStream;


