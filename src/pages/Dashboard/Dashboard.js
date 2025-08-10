import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import {
  Videocam,
  Battery90,
  Storage,
  PlayArrow,
  Stop,
  LiveTv,
  Settings,
  TrendingUp,
  AccessTime,
  CloudDownload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCamera } from '../../context/CameraContext';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ height: '100%', background: 'rgba(255, 255, 255, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon, onClick, color = 'primary' }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card
      sx={{
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.05)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const { camera, connectCamera, startRecording, stopRecording, startStreaming, stopStreaming } = useCamera();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch initial data
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'connect':
        connectCamera();
        break;
      case 'record':
        if (camera.recording) {
          stopRecording();
        } else {
          startRecording();
        }
        break;
      case 'stream':
        if (camera.streaming) {
          stopStreaming();
        } else {
          startStreaming();
        }
        break;
      default:
        break;
    }
  };

  const recentRecordings = [
    { id: 1, title: 'Mountain Adventure', duration: '5:23', date: '2024-01-15', size: '2.3 GB' },
    { id: 2, title: 'Beach Sunset', duration: '3:45', date: '2024-01-14', size: '1.8 GB' },
    { id: 3, title: 'City Tour', duration: '8:12', date: '2024-01-13', size: '4.1 GB' },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Welcome back, {user?.name || 'User'}! 👋
        </Typography>
      </motion.div>

      {/* Camera Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Camera Status"
            value={camera.connected ? 'Connected' : 'Disconnected'}
            icon={<Videocam />}
            color={camera.connected ? 'success.main' : 'error.main'}
            subtitle="GoPro Hero 11"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Battery"
            value={`${camera.battery}%`}
            icon={<Battery90 />}
            color={camera.battery > 20 ? 'success.main' : 'warning.main'}
            subtitle="Remaining"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Storage"
            value={`${camera.storage}%`}
            icon={<Storage />}
            color={camera.storage < 80 ? 'success.main' : 'warning.main'}
            subtitle="Used"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Recordings"
            value={recentRecordings.length}
            icon={<TrendingUp />}
            color="info.main"
            subtitle="This week"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Connect Camera"
            description="Establish connection with your GoPro"
            icon={<Videocam />}
            onClick={() => handleQuickAction('connect')}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title={camera.recording ? 'Stop Recording' : 'Start Recording'}
            description={camera.recording ? 'Stop current recording' : 'Start new recording'}
            icon={camera.recording ? <Stop /> : <PlayArrow />}
            onClick={() => handleQuickAction('record')}
            color={camera.recording ? 'error' : 'success'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title={camera.streaming ? 'Stop Stream' : 'Start Stream'}
            description={camera.streaming ? 'Stop live streaming' : 'Start live streaming'}
            icon={<LiveTv />}
            onClick={() => handleQuickAction('stream')}
            color={camera.streaming ? 'error' : 'primary'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Camera Settings"
            description="Configure camera parameters"
            icon={<Settings />}
            onClick={() => window.location.href = '/settings'}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Camera Status Details */}
      {camera.connected && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Camera Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Mode: {camera.mode}
                    </Typography>
                    <Chip label={camera.mode} size="small" sx={{ mt: 0.5 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Resolution: {camera.resolution}
                    </Typography>
                    <Chip label={camera.resolution} size="small" sx={{ mt: 0.5 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      FPS: {camera.fps}
                    </Typography>
                    <Chip label={`${camera.fps} FPS`} size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Battery Level
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={camera.battery}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={camera.battery > 20 ? 'success' : 'warning'}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Storage Usage
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={camera.storage}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={camera.storage < 80 ? 'success' : 'warning'}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Recordings */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Recent Recordings
      </Typography>
      <Card sx={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <CardContent>
          <List>
            {recentRecordings.map((recording, index) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="download">
                      <CloudDownload />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={recording.title}
                    secondary={`${recording.duration} • ${recording.size} • ${recording.date}`}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;


