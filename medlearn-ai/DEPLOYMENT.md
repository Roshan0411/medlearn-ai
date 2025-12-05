# MedLearn AI - Render Deployment Guide

## 🚀 Backend Deployment on Render

### Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- HuggingFace API key (get from https://huggingface.co/settings/tokens)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Make sure these files exist in your backend folder:**
   - `requirements.txt` - Python dependencies
   - `render.yaml` - Render configuration
   - `.env` - Environment variables (DO NOT commit this)

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Your Repository**
   - Select "Connect a repository"
   - Authorize GitHub and select your repository
   - Render will detect it's a Python project

3. **Configure Web Service**
   - **Name**: `medlearn-api` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Click "Environment" tab and add:
   
   | Key | Value |
   |-----|-------|
   | `HUGGINGFACE_API_KEY` | Your HuggingFace API key |
   | `ENVIRONMENT` | `production` |
   | `FRONTEND_URL` | Your frontend URL (add after frontend deployment) |
   | `PYTHON_VERSION` | `3.11.0` |

5. **Choose Instance Type**
   - **Free Tier**: 512 MB RAM, spins down after 15 min inactivity
   - **Starter**: $7/month, 512 MB RAM, always on
   - **Standard**: $25/month, 2 GB RAM, better performance

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - Wait 5-10 minutes for first deployment

### Step 3: Verify Deployment

Once deployed, you'll get a URL like: `https://medlearn-api.onrender.com`

Test the endpoints:
- Health Check: `https://medlearn-api.onrender.com/health`
- API Docs: `https://medlearn-api.onrender.com/docs`
- Root: `https://medlearn-api.onrender.com/`

### Step 4: Update Frontend Configuration

Update your frontend's API URL to point to your Render backend:
```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'https://medlearn-api.onrender.com/api';
```

### Step 5: Configure CORS

Your backend is already configured for CORS. Just update the `.env` or Render environment variable:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## 🔧 Using render.yaml (Alternative Method)

If you want automated deployment using `render.yaml`:

1. **Update render.yaml** with your configuration
2. In Render Dashboard:
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will detect `render.yaml` and configure automatically

## 📊 Monitoring

- **Logs**: View in Render Dashboard → Your Service → Logs
- **Metrics**: Dashboard shows CPU, memory, bandwidth usage
- **Health Checks**: Render automatically monitors `/health` endpoint

## 🐛 Troubleshooting

### Build Fails
- Check Python version compatibility
- Verify all dependencies in `requirements.txt`
- Check build logs for specific errors

### App Crashes on Startup
- Verify environment variables are set
- Check logs for import errors
- Ensure `PORT` environment variable is used (Render provides this)

### API Not Responding
- Free tier apps spin down - first request takes 30-60 seconds
- Check if app is running in Dashboard
- Verify firewall/CORS settings

### Database Issues
- SQLite database is ephemeral on free tier (resets on restart)
- For persistent data, upgrade to paid tier with disk storage
- Or migrate to external database (PostgreSQL, MongoDB)

## 💰 Cost Optimization

**Free Tier Limitations:**
- Spins down after 15 min inactivity
- 750 hours/month free compute
- Database storage not persistent

**Upgrade Options:**
- Starter ($7/mo): Always on, persistent disk
- Standard ($25/mo): Better performance, more resources

## 🔐 Security Checklist

- ✅ Never commit `.env` file
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS (automatic on Render)
- ✅ Configure CORS properly
- ✅ Rate limit API endpoints (add middleware)
- ✅ Validate all inputs

## 📈 Performance Tips

1. **Use caching** for repeated API calls
2. **Optimize image sizes** before serving
3. **Enable compression** in FastAPI
4. **Monitor response times** in Render dashboard
5. **Upgrade instance** if CPU/memory maxed out

## 🔄 CI/CD

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update backend"
git push
# Render automatically rebuilds and deploys
```

## 📞 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- FastAPI Docs: https://fastapi.tiangolo.com

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service configured
- [ ] Environment variables set
- [ ] App builds successfully
- [ ] Health endpoint responds
- [ ] API docs accessible
- [ ] Frontend connected
- [ ] CORS configured
- [ ] Testing complete

**Your backend is now live! 🎉**
