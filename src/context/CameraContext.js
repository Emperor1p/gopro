import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const CameraContext = createContext();

const initialState = {
  camera: {
    connected: false,
    battery: 0,
    storage: 0,
    mode: 'video',
    resolution: '1080p',
    fps: 30,
    recording: false,
    streaming: false,
  },
  streamUrl: null,
  recordings: [],
  loading: false,
  error: null,
};

const cameraReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_CAMERA_STATUS':
      return {
        ...state,
        camera: { ...state.camera, ...action.payload },
      };
    case 'SET_STREAM_URL':
      return { ...state, streamUrl: action.payload };
    case 'SET_RECORDINGS':
      return { ...state, recordings: action.payload };
    case 'ADD_RECORDING':
      return {
        ...state,
        recordings: [action.payload, ...state.recordings],
      };
    case 'REMOVE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.filter(
          (recording) => recording.id !== action.payload
        ),
      };
    case 'UPDATE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.map((recording) =>
          recording.id === action.payload.id
            ? { ...recording, ...action.payload.updates }
            : recording
        ),
      };
    default:
      return state;
  }
};

export const CameraProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cameraReducer, initialState);
  const [socket, setSocket] = React.useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to camera server');
      toast.success('Connected to camera server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from camera server');
      toast.error('Disconnected from camera server');
      dispatch({
        type: 'UPDATE_CAMERA_STATUS',
        payload: { connected: false },
      });
    });

    newSocket.on('camera_status', (status) => {
      dispatch({
        type: 'UPDATE_CAMERA_STATUS',
        payload: status,
      });
    });

    newSocket.on('stream_url', (url) => {
      dispatch({ type: 'SET_STREAM_URL', payload: url });
    });

    newSocket.on('recording_started', (recording) => {
      dispatch({ type: 'ADD_RECORDING', payload: recording });
      toast.success('Recording started');
    });

    newSocket.on('recording_stopped', (recordingId) => {
      dispatch({
        type: 'UPDATE_RECORDING',
        payload: { id: recordingId, updates: { status: 'completed' } },
      });
      toast.success('Recording stopped');
    });

    newSocket.on('error', (error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
      toast.error(error.message || 'Camera error occurred');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const connectCamera = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/camera/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: { connected: true },
        });
        toast.success('Camera connected successfully');
      } else {
        throw new Error(data.message || 'Failed to connect camera');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error(error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const disconnectCamera = async () => {
    try {
      await fetch('/api/camera/disconnect', { method: 'POST' });
      dispatch({
        type: 'UPDATE_CAMERA_STATUS',
        payload: { connected: false },
      });
      toast.success('Camera disconnected');
    } catch (error) {
      toast.error('Failed to disconnect camera');
    }
  };

  const startRecording = async () => {
    if (!state.camera.connected) {
      toast.error('Camera not connected');
      return;
    }

    try {
      const response = await fetch('/api/camera/record/start', {
        method: 'POST',
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: { recording: true },
        });
        toast.success('Recording started');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start recording');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stopRecording = async () => {
    try {
      const response = await fetch('/api/camera/record/stop', {
        method: 'POST',
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: { recording: false },
        });
        toast.success('Recording stopped');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to stop recording');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startStreaming = async () => {
    if (!state.camera.connected) {
      toast.error('Camera not connected');
      return;
    }

    try {
      const response = await fetch('/api/camera/stream/start', {
        method: 'POST',
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: { streaming: true },
        });
        toast.success('Streaming started');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start streaming');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stopStreaming = async () => {
    try {
      const response = await fetch('/api/camera/stream/stop', {
        method: 'POST',
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: { streaming: false },
        });
        dispatch({ type: 'SET_STREAM_URL', payload: null });
        toast.success('Streaming stopped');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to stop streaming');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateCameraSettings = async (settings) => {
    try {
      const response = await fetch('/api/camera/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        dispatch({
          type: 'UPDATE_CAMERA_STATUS',
          payload: settings,
        });
        toast.success('Camera settings updated');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchRecordings = async () => {
    try {
      const response = await fetch('/api/recordings');
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_RECORDINGS', payload: data.recordings });
      } else {
        throw new Error(data.message || 'Failed to fetch recordings');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteRecording = async (recordingId) => {
    try {
      const response = await fetch(`/api/recordings/${recordingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch({ type: 'REMOVE_RECORDING', payload: recordingId });
        toast.success('Recording deleted');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete recording');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    ...state,
    socket,
    connectCamera,
    disconnectCamera,
    startRecording,
    stopRecording,
    startStreaming,
    stopStreaming,
    updateCameraSettings,
    fetchRecordings,
    deleteRecording,
  };

  return (
    <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};


