# 🚀 Complete Deployment Guide - Render & Netlify

This guide will walk you through deploying the **Bellcorp Event Management App** to production.

---

## 📋 What You'll Learn

1. Deploy Backend to **Render** (free tier)
2. Deploy Frontend to **Netlify** (free tier)
3. Connect them together
4. Test live application

---

## 🔧 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account (create one if needed at github.com)
- ✅ Your code pushed to GitHub
- ✅ Render account (free)
- ✅ Netlify account (free)

---

# PART 1: Push Code to GitHub

## Step 1: Create GitHub Repository

1. Go to **github.com** and login
2. Click **"+"** icon → **"New repository"**
3. Repository name: `event-management-bellcorp`
4. Add description: `Full-stack event management platform`
5. Make it **Public** (so we can deploy)
6. Click **"Create repository"**

## Step 2: Push Code to GitHub

Open PowerShell in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/event-management-bellcorp.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Bellcorp Event Management App"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Done!** Your code is now on GitHub.

---

# PART 2: Deploy Backend to Render

## What is Render?

Render is a cloud hosting platform where you can deploy:
- Node.js/Express servers
- Databases
- Static sites

**Cost**: Free tier available (limited resources, good for learning/small projects)

---

## Step 1: Create Render Account

1. Go to **render.com**
2. Click **"Sign Up"**
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your GitHub

---

## Step 2: Create Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**

2. **Connect GitHub Repository**:
   - Click **"Connect account"**
   - Select your `event-management-bellcorp` repository
   - Click **"Connect"**

3. **Configure Web Service**:

   | Setting | Value |
   |---------|-------|
   | **Name** | `event-management-bellcorp-server` |
   | **Environment** | `Node` |
   | **Region** | `Oregon` (closest to US) |
   | **Branch** | `main` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |

4. **Scroll Down - Environment Variables**:
   
   Add these environment variables (IMPORTANT):
   
   ```
   PORT=10000
   MONGO_URI=mongodb+srv://sasikumar:Subbu191319@cluster0.swkehmi.mongodb.net/?appName=Cluster0
   JWT_SECRET=supersecretkey191199
   NODE_ENV=production
   ```

   **Note**: Replace `MONGO_URI` with your actual MongoDB connection string

5. Click **"Create Web Service"**

6. **Wait for deployment** (takes 2-3 minutes)

7. **Once deployed, you'll get a URL** like:
   ```
   https://event-management-bellcorp-server.onrender.com
   ```

✅ **Backend is now live!** Copy this URL - you'll need it for the frontend.

---

## Step 3: Fix Backend Routes (Important!)

Your backend needs to allow requests from Netlify frontend. Update `server.js`:

```javascript
// In server.js, update CORS
const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:3000", "*"], // Allow all origins during development
  credentials: true,
}));
```

Push this change to GitHub:
```bash
git add .
git commit -m "Update CORS for frontend deployment"
git push
```

Render will **auto-redeploy** when it detects the change.

---

# PART 3: Deploy Frontend to Netlify

## What is Netlify?

Netlify is a platform for deploying static sites and React apps.

**Cost**: Free tier with unlimited deployments

---

## Step 1: Connect GitHub to Netlify

1. Go to **netlify.com**
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Netlify to access your GitHub repos

---

## Step 2: Create New Site from Git

1. Click **"Add new site"** → **"Import an existing project"**

2. **Choose GitHub**:
   - Click **"GitHub"**
   - Select your `event-management-bellcorp` repository
   - Click **"Open"**

3. **Configure Build Settings**:

   | Setting | Value |
   |---------|-------|
   | **Owner** | Your GitHub account |
   | **Repo** | `event-management-bellcorp` |
   | **Branch** | `main` |
   | **Base directory** | `client/bellcorp-client` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `build` |

4. Click **"Show Advanced"**

5. **Add Environment Variable**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://event-management-bellcorp-server.onrender.com` (your Render backend URL)

6. Click **"Deploy site"**

7. **Wait for deployment** (takes 1-2 minutes)

8. **Once deployed, you'll get a URL** like:
   ```
   https://effervescent-tiramisu-a1b2c3.netlify.app
   ```

✅ **Frontend is now live!**

---

## Step 3: Update Frontend API URL

Now update the frontend to use the live Render backend:

**File**: `client/bellcorp-client/src/api.js`

Replace:
```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

With:
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api" || "http://localhost:5000/api",
});
```

Or simply use:
```javascript
const API = axios.create({
  baseURL: "https://event-management-bellcorp-server.onrender.com/api",
});
```

Push to GitHub:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Netlify will **auto-redeploy** automatically.

---

# PART 4: Test Live Application

## Test Backend

Open browser and go to:
```
https://event-management-bellcorp-server.onrender.com/api/events
```

You should see JSON with all 15 events.

---

## Test Frontend

1. Go to your Netlify URL:
   ```
   https://your-netlify-url.netlify.app
   ```

2. **Test User Flow**:
   - Click "Signup" → Create an account
   - Enter valid email and password
   - Login with those credentials
   - Should redirect to /events page
   - See all events loading
   - Try searching, filtering, registering for event
   - Go to Dashboard → see registered events

✅ **Everything working?** Deployment is complete!

---

# 📱 Live URLs Reference

**Backend (Render)**:
```
https://event-management-bellcorp-server.onrender.com
API: https://event-management-bellcorp-server.onrender.com/api
```

**Frontend (Netlify)**:
```
https://your-netlify-url.netlify.app
```

---

# ❌ Troubleshooting

## Backend not responding

**Problem**: Getting 502 or 503 errors

**Solution**:
1. Go to Render dashboard
2. Click your service
3. Check **"Logs"** tab for errors
4. Common issues:
   - MongoDB connection string is wrong
   - Missing environment variables
   - Port not correct (should be in .env)

---

## Frontend can't connect to backend

**Problem**: Frontend works but can't register/login

**Solution**:
1. Open browser **DevTools** (F12)
2. Go to **Network** tab
3. Try to login
4. Look at the API request - it should go to Render URL
5. If error, check:
   - `api.js` has correct baseURL
   - CORS is enabled on backend
   - Backend is actually running

---

## Render keeps restarting

**Problem**: Free tier "spins down" after inactivity

**Solution**: This is normal on free tier. It takes ~30 seconds to wake up. For production, upgrade to paid tier.

---

## Can't find my Netlify URL

**Problem**: Where is my deployed site URL?

**Solution**:
1. Go to **Netlify dashboard**
2. Click your site
3. Look for **"Site overview"**
4. URL is displayed at the top

---

# 🔄 Making Updates (After Deployment)

To update your live app:

```bash
# Make your code changes locally
# Test locally first

# Commit and push to GitHub
git add .
git commit -m "Your changes"
git push

# Both Render and Netlify will automatically redeploy!
# Takes 1-3 minutes
```

---

# 📊 Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Render URL obtained
- [ ] Frontend api.js updated with Render URL
- [ ] Netlify account created
- [ ] Frontend deployed to Netlify
- [ ] Netlify URL obtained
- [ ] Backend tested via browser
- [ ] Frontend tested via browser
- [ ] User signup/login tested
- [ ] Events display tested
- [ ] Registration tested

---

# 🎯 Next Steps (After Deployment)

1. **Share your app**: Send your Netlify URL to friends
2. **Add documentation**: Create README in repo
3. **Monitor**: Check Render/Netlify dashboards occasionally
4. **Collect feedback**: Get user feedback on live app
5. **Improvements**:
   - Add event image uploads
   - Email notifications
   - Admin dashboard
   - Payment integration

---

# 💡 Tips

✅ **Free tier limitations**:
- Render: 750 free tier compute hours/month
- Netlify: 300 build minutes/month
- Both regenerate monthly

✅ **Keep MongoDB running**: 
- MongoDB Atlas free tier is separate
- Stays running 24/7
- Make sure IP whitelist includes Render's IP

✅ **Environment variables**:
- Never commit secrets to GitHub
- Always use .env files locally
- Add variables in Render/Netlify dashboards

✅ **Performance**:
- Render free tier is slow (first request takes 30s)
- Netlify CDN is fast (global distribution)
- Consider upgrading Render for better performance

---

# 🆘 Getting Help

If something goes wrong:

1. **Check Render logs**:
   - Dashboard → Your service → Logs

2. **Check Netlify logs**:
   - Dashboard → Your site → Deploys → View logs

3. **Check browser console**:
   - F12 → Console tab → Look for errors

4. **Check Network requests**:
   - F12 → Network tab → See which API calls fail

---

## Congratulations! 🎉

Your **Bellcorp Event Management App** is now **LIVE** and accessible to the world!

Share your app URL with friends and family to test it out!

---

**Last Updated**: February 16, 2026
**Version**: 1.0.0
