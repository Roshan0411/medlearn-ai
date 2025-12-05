# Render Deployment - Quick Setup

## ⚡ IMPORTANT: Add API Key in Render Dashboard

Your code has been pushed to GitHub successfully! Now follow these steps:

### Step 1: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Roshan0411/medlearn-ai`
4. Render will detect the `render.yaml` file

### Step 2: Configure (Use Blueprint)

When using Blueprint (render.yaml):
- Click **"New +"** → **"Blueprint"**
- Select your repository
- Render will auto-configure from `render.yaml`

### Step 3: ADD THIS ENVIRONMENT VARIABLE (CRITICAL!)

In the Render dashboard, you **MUST** manually add:

**Environment Variable:**
```
Key: HUGGINGFACE_API_KEY
Value: <your-huggingface-api-key>
```

**How to add:**
- Go to your service → "Environment" tab
- Click "Add Environment Variable"
- Enter the key and value above
- Click "Save Changes"

### Step 4: Deploy

- Click "Create Web Service" or "Apply" if using Blueprint
- Wait 3-5 minutes for build to complete
- Your API will be live at: `https://medlearn-api-xxxx.onrender.com`

### Step 5: Test Your Deployment

Once deployed, test these URLs (replace with your actual URL):
- Health: `https://your-app.onrender.com/health`
- API Docs: `https://your-app.onrender.com/docs`
- Root: `https://your-app.onrender.com/`

---

## 🔧 Manual Configuration (Alternative)

If Blueprint doesn't work, configure manually:

**Settings:**
- **Name:** medlearn-api
- **Root Directory:** backend
- **Build Command:** pip install -r requirements.txt
- **Start Command:** uvicorn main:app --host 0.0.0.0 --port $PORT
- **Python Version:** 3.11.0

**Environment Variables:**
- HUGGINGFACE_API_KEY = `<your-huggingface-api-key>`
- ENVIRONMENT = production
- FRONTEND_URL = http://localhost:5173
- PYTHON_VERSION = 3.11.0

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] render.yaml configured at repository root
- [ ] Render service created
- [ ] **HUGGINGFACE_API_KEY environment variable added in Render dashboard**
- [ ] Service deployed successfully
- [ ] Health endpoint responding
- [ ] API docs accessible

**Note:** GitHub blocks pushing API keys directly in code files for security. That's why you must add the API key manually in Render's dashboard.
