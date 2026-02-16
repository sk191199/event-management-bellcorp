# 🚀 Quick Deployment Checklist & Commands

Quick reference for deploying your app without reading the full guide.

---

## 📍 5 Steps to Deploy

### **Step 1: GitHub (2 minutes)**

```bash
# Open powershell in your project folder
cd d:\INV\event-management-bellcorp

# Initialize git
git init

# Add your repository (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/event-management-bellcorp.git

# Push code
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

✅ **Code is now on GitHub**

---

### **Step 2: Render Backend (5 minutes)**

1. Go to **render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Fill in:
   ```
   Name: event-management-bellcorp-server
   Environment: Node
   Branch: main
   Build Command: npm install
   Start Command: node server.js
   Region: Oregon
   ```
5. **Add Environment Variables**:
   ```
   PORT=10000
   MONGO_URI=mongodb+srv://sasikumar:Subbu191319@cluster0.swkehmi.mongodb.net/?appName=Cluster0
   JWT_SECRET=supersecretkey191199
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. ⏳ Wait 2-3 minutes for deployment
8. **Copy your URL** (looks like `https://event-management-bellcorp-server.onrender.com`)

✅ **Backend is live!**

---

### **Step 3: Update Frontend API URL (2 minutes)**

Edit **`client/bellcorp-client/src/api.js`**:

Replace line 8:
```javascript
// OLD
baseURL: "http://localhost:5000/api",

// NEW (use your Render URL)
baseURL: "https://event-management-bellcorp-server.onrender.com/api",
```

Push change:
```bash
git add .
git commit -m "Update API URL for Render"
git push
```

✅ **Frontend updated!**

---

### **Step 4: Netlify Frontend (5 minutes)**

1. Go to **netlify.com** → Sign up with GitHub
2. Click **"Add new site"** → **"Import from Git"**
3. Choose **GitHub** and select your repo
4. Fill in:
   ```
   Base directory: client/bellcorp-client
   Build command: npm run build
   Publish directory: build
   ```
5. Click **"Show Advanced"**
6. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://event-management-bellcorp-server.onrender.com
   ```
7. Click **"Deploy site"**
8. ⏳ Wait 1-2 minutes
9. **Get your Netlify URL** from the dashboard

✅ **Frontend is live!**

---

### **Step 5: Test (2 minutes)**

1. **Test Backend** - Open in browser:
   ```
   https://event-management-bellcorp-server.onrender.com/api/events
   ```
   Should see JSON with events ✅

2. **Test Frontend** - Open your Netlify URL
   - Signup with email/password
   - Try Login
   - View Events
   - Register for event
   - Check Dashboard

✅ **Everything works!**

---

## 🔗 Your Live URLs

```
Backend API: https://event-management-bellcorp-server.onrender.com/api
Frontend: https://YOUR-NETLIFY-URL.netlify.app
```

---

## 📱 Share Your App!

Send your **Netlify URL** to friends and family to test!

---

## ⚡ Quick Fixes

### Backend not starting?
- Check Render **Logs** tab
- Verify MONGO_URI is correct
- Ensure PORT is in environment variables

### Frontend can't connect?
- Open DevTools (F12) → Network tab
- Check if API request URL is correct
- Look for CORS errors

### Render keeps restarting?
- Free tier limitation
- Takes 30 seconds to wake up
- This is normal!

---

## 🔄 Updates After Deployment

After you deploy, making changes is easy:

```bash
# Make your code changes
git add .
git commit -m "Your changes"
git push
```

**That's it!** Both Render and Netlify auto-redeploy (takes 1-3 minutes)

---

## ✅ Deployment Complete!

Your app is now **LIVE** on the internet! 🎉

People can access it from anywhere in the world.
