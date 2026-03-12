# Railway Full Stack Deployment Guide

## 🚀 Quick Deploy

### Prerequisites
- Railway account (free at [railway.app](https://railway.app))
- GitHub account
- MongoDB Atlas cluster (already configured)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy Your Project
```bash
# From project root directory
railway deploy
```

## ⚙️ Environment Variables

Set these in Railway Dashboard → Settings → Variables:

### Required Variables
```
MONGODB_URI=mongodb+srv://rahmanhafizur31928_db_user:lTPURXd7jL6AluXp@cluster0.jsyxibm.mongodb.net/portfolio
JWT_SECRET=your-super-secure-jwt-secret-key-for-production
NODE_ENV=production
PORT=5000
```

### Optional Variables (Email)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📁 Project Structure
```
hafizur-s-digital-canvas-main/
├── railway.toml              # Railway configuration
├── server/
│   ├── Dockerfile           # Backend container
│   ├── index.js             # Express server
│   └── package.json         # Backend dependencies
├── src/                     # React frontend
├── package.json             # Frontend dependencies
└── DEPLOYMENT.md            # This file
```

## 🔧 Configuration Files

### railway.toml
- Configures build and deployment settings
- Sets up health checks
- Defines environment variables

### Dockerfile (server/)
- Creates container for Node.js backend
- Sets up production environment
- Includes health checks

## 🌐 MongoDB Atlas Setup

1. **Whitelist Railway IPs**: In MongoDB Atlas → Network Access → Add IP Address → `0.0.0.0/0`
2. **Database User**: Ensure `rahmanhafizur31928_db_user` has read/write permissions
3. **Collection**: The `portfolio` database will be created automatically

## 🚀 Deployment Process

1. **Initial Deploy**
   ```bash
   railway deploy
   ```

2. **Railway will:**
   - Detect your project type (Node.js)
   - Build frontend and backend
   - Set up environment variables
   - Deploy to Railway infrastructure

3. **Monitor Deployment**
   - Check Railway dashboard for build logs
   - Verify health checks pass
   - Test your live application

## 📊 Post-Deployment

### Verify Your App
1. **Frontend**: Visit your Railway app URL
2. **Backend API**: Test `https://your-app.railway.app/api/health`
3. **Database**: Check if data persists across restarts

### Test Features
- ✅ Contact form submissions
- ✅ Project display
- ✅ Admin panel (if implemented)
- ✅ Database operations

## 🔍 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify MongoDB URI is correct
- Check IP whitelist in Atlas
- Ensure database user permissions

**Build Failures**
- Check package.json scripts
- Verify all dependencies are installable
- Review build logs in Railway dashboard

**Health Check Failures**
- Ensure `/api/health` endpoint works
- Check port configuration (should be 5000)
- Verify server starts correctly

### Debug Commands
```bash
# View logs
railway logs

# View environment variables
railway variables

# Restart service
railway up
```

## 💰 Cost Estimate

**Railway Free Tier**:
- $5/month credit
- 500 hours of execution time
- 100GB bandwidth
- Perfect for portfolio sites

**MongoDB Atlas Free Tier**:
- 512MB storage
- Unlimited reads/writes
- Perfect for portfolio database

## 🎯 Next Steps

1. **Deploy**: Run `railway deploy`
2. **Configure**: Set environment variables in Railway dashboard
3. **Test**: Verify all features work
4. **Monitor**: Check logs and performance
5. **Custom Domain**: Add custom domain in Railway settings (optional)

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas
- **Project Issues**: Check Railway dashboard logs

---

**🎉 Your portfolio will be live with a real database!**
