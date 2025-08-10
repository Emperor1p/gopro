# 🚀 GoPro React App Deployment Guide

## **Quick Deploy Options**

### **Option 1: Vercel (Frontend Only) - Easiest**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import repository: `Emperor1p/gopro`
4. Deploy automatically

### **Option 2: Railway (Full-Stack) - Recommended**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy both frontend and backend

### **Option 3: Render (Full-Stack) - Fixed**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo: `Emperor1p/gopro`
4. **Build Command:** `npm install`
5. **Start Command:** `npm run server`
6. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=10000`
   - `JWT_SECRET=your-secret-key`

## **Render Deployment (Fixed)**

### **Step 1: Backend Deployment**
1. **Service Type:** Web Service
2. **Build Command:** `npm install`
3. **Start Command:** `npm run server`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-secret-key-here
   ```

### **Step 2: Frontend Deployment**
1. **Service Type:** Static Site
2. **Build Command:** `npm install && npm run build`
3. **Publish Directory:** `build`
4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

## **Manual Deployment Steps**

### **Frontend Deployment (Vercel/Netlify)**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`
   - Follow prompts

3. **Deploy to Netlify:**
   - Drag `build` folder to Netlify dashboard
   - Or use Netlify CLI

### **Full-Stack Deployment (Railway/Render)**

1. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secret-key
   ```

2. **Build Commands:**
   ```bash
   npm install
   npm run build
   ```

3. **Start Command:**
   ```bash
   npm run server
   ```

## **Database Considerations**

### **For Production:**
- Replace SQLite with PostgreSQL or MongoDB
- Use cloud database services:
  - Railway PostgreSQL
  - Render PostgreSQL
  - MongoDB Atlas

### **Environment Setup:**
```javascript
// Update server/database.js for production
const dbUrl = process.env.DATABASE_URL || './database.sqlite';
```

## **Domain & SSL**

### **Custom Domain:**
1. Add custom domain in deployment platform
2. Configure DNS settings
3. SSL certificate (automatic with most platforms)

## **Monitoring & Analytics**

### **Add to package.json:**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "server": "node server/index.js"
  }
}
```

## **Troubleshooting**

### **Common Issues:**
1. **Build fails:** Check Node.js version (>=16)
2. **API errors:** Verify environment variables
3. **Database issues:** Check database connection string
4. **react-scripts not found:** Ensure it's in dependencies

### **Logs:**
- Check deployment platform logs
- Monitor server console output
- Verify API endpoints

## **Performance Optimization**

### **Frontend:**
- Enable gzip compression
- Use CDN for static assets
- Optimize images

### **Backend:**
- Enable caching
- Optimize database queries
- Use connection pooling

## **Security**

### **Production Checklist:**
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure headers
- [ ] Validate input data
- [ ] Rate limiting

## **Support**

For deployment issues:
1. Check platform documentation
2. Review error logs
3. Verify environment variables
4. Test locally first
