import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Storage,
  Language,
  Palette,
  Wifi,
  CloudUpload,
  Delete,
  Save,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    recordingNotifications: true,
    streamNotifications: false,

    // Camera
    autoConnect: false,
    autoRecord: false,
    quality: '1080p',
    fps: 30,
    stabilization: true,

    // Storage
    autoBackup: true,
    cloudSync: false,
    maxStorage: 50,

    // Interface
    darkMode: true,
    language: 'en',
    autoSave: true,
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving settings:', settings);
  };

  const handleResetSettings = () => {
    // Reset to default settings
    setSettings({
      emailNotifications: true,
      pushNotifications: true,
      recordingNotifications: true,
      streamNotifications: false,
      autoConnect: false,
      autoRecord: false,
      quality: '1080p',
      fps: 30,
      stabilization: true,
      autoBackup: true,
      cloudSync: false,
      maxStorage: 50,
      darkMode: true,
      language: 'en',
      autoSave: true,
    });
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Settings
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive push notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Recording Notifications"
                    secondary="Notify when recording starts/stops"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.recordingNotifications}
                      onChange={(e) => handleSettingChange('recordingNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Stream Notifications"
                    secondary="Notify when streaming starts/stops"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.streamNotifications}
                      onChange={(e) => handleSettingChange('streamNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Camera Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Wifi sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Camera Settings</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Auto Connect"
                    secondary="Automatically connect to camera on startup"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoConnect}
                      onChange={(e) => handleSettingChange('autoConnect', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Auto Record"
                    secondary="Start recording when camera connects"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoRecord}
                      onChange={(e) => handleSettingChange('autoRecord', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Stabilization"
                    secondary="Enable camera stabilization"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.stabilization}
                      onChange={(e) => handleSettingChange('stabilization', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Default Quality</InputLabel>
                  <Select
                    value={settings.quality}
                    label="Default Quality"
                    onChange={(e) => handleSettingChange('quality', e.target.value)}
                  >
                    <MenuItem value="720p">720p</MenuItem>
                    <MenuItem value="1080p">1080p</MenuItem>
                    <MenuItem value="1440p">1440p</MenuItem>
                    <MenuItem value="4K">4K</MenuItem>
                  </Select>
                </FormControl>

                <Typography gutterBottom>Default FPS: {settings.fps}</Typography>
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
                  sx={{
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00d4ff',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00d4ff',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Storage sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Storage</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Auto Backup"
                    secondary="Automatically backup recordings"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Cloud Sync"
                    secondary="Sync recordings to cloud storage"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.cloudSync}
                      onChange={(e) => handleSettingChange('cloudSync', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>Max Storage Usage: {settings.maxStorage}%</Typography>
                <Slider
                  value={settings.maxStorage}
                  onChange={(e, value) => handleSettingChange('maxStorage', value)}
                  min={10}
                  max={100}
                  step={5}
                  sx={{
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00d4ff',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00d4ff',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Interface Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Palette sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Interface</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Dark Mode"
                    secondary="Use dark theme"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Auto Save"
                    secondary="Automatically save settings"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="it">Italian</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12}>
          <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security sx={{ mr: 1, color: '#00d4ff' }} />
                <Typography variant="h6">Account Information</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={user?.name || ''}
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{
                    background: 'linear-gradient(45deg, #00d4ff, #00b8e6)',
                  }}
                >
                  Save Settings
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleResetSettings}
                >
                  Reset to Default
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Alert */}
      <Alert severity="success" sx={{ mt: 3 }}>
        Settings saved successfully! Your preferences have been updated.
      </Alert>
    </Box>
  );
};

export default Settings;

