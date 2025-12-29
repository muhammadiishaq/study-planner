# AlNafi Study Planner - Quick Start Guide

## 📋 Super Quick Setup (5 Minutes!)

### Step 1: Update MongoDB Connection (IMPORTANT!)

**You need to update 3 files:**

1. `backend/auth-service/.env`
2. `backend/report-service/.env`
3. `backend/schedule-service/.env`

**In each file, replace this line:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/alnafi-planner?retryWrites=true&w=majority
```

**With your actual MongoDB Atlas connection string!**

---

### Step 2: Start All Services

**Open 4 terminals and run these commands:**

**Terminal 1 (Auth Service):**
```bash
cd backend/auth-service
npm install
npm run dev
```

**Terminal 2 (Report Service):**
```bash
cd backend/report-service
npm install
npm run dev
```

**Terminal 3 (Schedule Service):**
```bash
cd backend/schedule-service
npm install
npm run dev
```

**Terminal 4 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

---

### Step 3: Open Browser

Go to: `http://localhost:5173`

---

## ✅ That's It!

All services should now be running:
- ✅ Frontend: http://localhost:5173
- ✅ Auth: http://localhost:5001
- ✅ Reports: http://localhost:5003
- ✅ Scheduler: http://localhost:5004

**Alhamdulillah! You're ready to go!** 🚀

---

## 🚨 If Something Goes Wrong:

1. Check MongoDB connection string in all 3 .env files
2. Make sure all 4 terminals are running
3. Check for error messages in terminals
4. Verify ports 5001, 5003, 5004, 5173 are free

---

**Need help? Read the main README.md for detailed troubleshooting!**
