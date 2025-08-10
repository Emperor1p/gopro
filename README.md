# GoPro React Application

A comprehensive React application for controlling GoPro cameras, managing video recordings, and live streaming. Built with modern React, Material-UI, and real-time WebSocket communication.

## 🚀 Features

### 📹 Camera Control
- **Real-time Camera Connection**: Connect to GoPro cameras via WiFi
- **Live Preview**: View camera feed in real-time
- **Recording Control**: Start/stop video recording with one click
- **Photo Capture**: Take photos remotely
- **Camera Settings**: Adjust resolution, FPS, mode, and stabilization

### 🎥 Live Streaming
- **Multi-platform Streaming**: Stream to YouTube, Twitch, Facebook, Instagram
- **Stream Settings**: Configure quality, bitrate, and platform-specific settings
- **Live Chat Integration**: Enable/disable chat functionality
- **Stream Recording**: Record streams while broadcasting

### 📚 Video Library
- **Video Management**: Organize and browse recorded videos
- **Search & Filter**: Find videos by title, date, or duration
- **Video Playback**: Play videos directly in the application
- **Download & Share**: Download videos or share them online
- **Metadata Display**: View video details, file size, and duration

### 🔐 Authentication & Security
- **User Registration/Login**: Secure authentication system
- **JWT Tokens**: Stateless authentication with token-based security
- **Password Hashing**: Secure password storage with bcrypt
- **Session Management**: Automatic token refresh and validation

### ⚙️ Settings & Configuration
- **Notification Preferences**: Customize email and push notifications
- **Camera Auto-connect**: Automatic camera connection on startup
- **Storage Management**: Configure backup and cloud sync settings
- **Interface Customization**: Dark mode, language, and UI preferences

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Beautiful dark mode interface
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Material Design**: Google Material Design principles
- **Real-time Updates**: Live status indicators and notifications

## 🛠️ Technology Stack

### Frontend
- **React 18**: Latest React with hooks and modern features
- **Material-UI (MUI)**: Professional UI components
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Socket.io Client**: Real-time communication
- **React Hot Toast**: Beautiful notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional communication
- **SQLite**: Lightweight database
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- GoPro camera (for full functionality)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gopro-react-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm start          # Frontend (port 3000)
   npm run server     # Backend (port 5000)
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key

# Database Path
DB_PATH=./database.sqlite

# Server Port
PORT=5000

# CORS Origin
CORS_ORIGIN=http://localhost:3000
```

### GoPro Camera Setup
1. Enable WiFi on your GoPro camera
2. Connect your computer to the GoPro's WiFi network
3. The application will automatically detect and connect to the camera

## 📱 Usage

### Getting Started
1. **Register/Login**: Create an account or sign in with existing credentials
2. **Connect Camera**: Click "Connect Camera" to establish connection
3. **Start Recording**: Use the camera controls to start recording
4. **Manage Videos**: Browse and manage your recordings in the Video Library
5. **Live Stream**: Configure streaming settings and go live

### Default Credentials
- **Email**: admin@gopro.com
- **Password**: admin123

## 🏗️ Project Structure

```
gopro-react-app/
├── public/                 # Static files
├── server/                 # Backend server
│   └── index.js           # Express server with Socket.io
├── src/                   # React source code
│   ├── components/        # Reusable components
│   │   └── Layout/       # Main layout component
│   ├── context/          # React contexts
│   │   ├── AuthContext.js
│   │   └── CameraContext.js
│   ├── pages/            # Page components
│   │   ├── Auth/         # Authentication pages
│   │   ├── Dashboard/    # Main dashboard
│   │   ├── CameraControl/
│   │   ├── VideoLibrary/
│   │   ├── LiveStream/
│   │   └── Settings/
│   ├── App.js            # Main app component
│   ├── index.js          # React entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Camera Control
- `POST /api/camera/connect` - Connect to camera
- `POST /api/camera/disconnect` - Disconnect from camera
- `POST /api/camera/record/start` - Start recording
- `POST /api/camera/record/stop` - Stop recording
- `POST /api/camera/stream/start` - Start streaming
- `POST /api/camera/stream/stop` - Stop streaming
- `PUT /api/camera/settings` - Update camera settings

### Video Management
- `GET /api/recordings` - Get user recordings
- `POST /api/recordings` - Upload new recording
- `DELETE /api/recordings/:id` - Delete recording

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Configure database for production
3. Set up SSL certificates
4. Configure reverse proxy (nginx)

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000 5000
CMD ["npm", "run", "dev"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Cloud storage integration
- [ ] Advanced video editing
- [ ] AI-powered video analysis
- [ ] Multi-camera support
- [ ] Social media integration
- [ ] Advanced streaming features
- [ ] Video collaboration tools

## 🙏 Acknowledgments

- GoPro for camera APIs and documentation
- Material-UI team for the excellent component library
- React community for the amazing ecosystem
- All contributors and supporters

---

**Made with ❤️ for the GoPro community**


