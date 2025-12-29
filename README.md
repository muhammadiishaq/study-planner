# 🎓 AlNafi Study Planner - Complete Project

## بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

**Alhamdulillah! Complete Study Management System for AlNafi Students** 🤲

---

## 📦 What's Inside This Package:

This is the **COMPLETE AlNafi Study Planner** with:
- ✅ **Frontend** - React application with backend integration
- ✅ **Backend** - 3 Microservices (Auth, Reports, Scheduler)
- ✅ **Dual Storage** - localStorage + MongoDB
- ✅ **All .env files** - Ready to configure

---

## 🗂️ Project Structure:

```
alnafi-complete-project/
├── 📁 frontend/                          ← React Application
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js                   - Backend URLs
│   │   ├── services/
│   │   │   ├── authService.js           - Authentication
│   │   │   ├── reportService.js         - Report uploads
│   │   │   └── scheduleService.js       - Scheduler (Dual Storage)
│   │   ├── pages/
│   │   │   ├── Login.jsx                - Login page
│   │   │   ├── Signup.jsx               - Signup page
│   │   │   ├── DiplomaSelection.jsx     - Select diploma
│   │   │   └── Dashboard.jsx            - Main dashboard
│   │   ├── components/
│   │   │   └── UploadReportModal.jsx    - PDF upload
│   │   ├── data/
│   │   │   └── diplomaData.js           - All courses data
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── 📁 backend/                           ← 3 Microservices
    ├── 📁 auth-service/                  (Port 5001)
    │   ├── models/
    │   │   └── User.js
    │   ├── controllers/
    │   │   └── authController.js
    │   ├── routes/
    │   │   └── authRoutes.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── server.js
    │   ├── package.json
    │   └── .env                          ✅ Included!
    │
    ├── 📁 report-service/                (Port 5003)
    │   ├── models/
    │   │   └── DailyReport.js
    │   ├── controllers/
    │   │   └── reportController.js
    │   ├── routes/
    │   │   └── reportRoutes.js
    │   ├── config/
    │   │   └── multer.js
    │   ├── server.js
    │   ├── package.json
    │   └── .env                          ✅ Included!
    │
    └── 📁 schedule-service/              (Port 5004) ⭐ NEW!
        ├── models/
        │   ├── StudySession.js
        │   └── StudyGoal.js
        ├── controllers/
        │   └── scheduleController.js
        ├── routes/
        │   └── scheduleRoutes.js
        ├── server.js
        ├── package.json
        ├── .env                          ✅ Included!
        └── BUILD_PROGRESS.md
```

---

## ✨ Complete Features:

### **Frontend Features:**
- ✅ User Authentication (Signup/Login)
- ✅ JWT Token Management
- ✅ Diploma Selection (4 Levels)
- ✅ Progress Dashboard
- ✅ Course Management
- ✅ Diploma Breakdown
- ✅ PDF Report Upload
- ✅ **Scheduler Service Integration** (Dual Storage)

### **Backend Services:**

#### **1. Auth Service (Port 5001)**
- ✅ User registration
- ✅ User login
- ✅ JWT authentication
- ✅ Password encryption (bcrypt)
- ✅ Diploma level management

#### **2. Report Service (Port 5003)**
- ✅ PDF upload
- ✅ Text extraction
- ✅ Diploma progress parsing
- ✅ Report history
- ✅ **No PDF storage** (saves money!)

#### **3. Schedule Service (Port 5004)** ⭐ NEW!
- ✅ Study session scheduling
- ✅ Study timer (real-time tracking)
- ✅ Weekly statistics
- ✅ Study goals management
- ✅ **Dual storage** (localStorage + MongoDB)
- ✅ Offline support with auto-sync
- ✅ Bulk sync endpoint

---

## 🚀 Quick Start Guide:

### **Prerequisites:**
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm installed

---

### **Step 1: Setup Backend Services**

#### **Configure MongoDB Connection:**

**All 3 services need the same MongoDB connection string!**

1. Open `backend/auth-service/.env`
2. Open `backend/report-service/.env`
3. Open `backend/schedule-service/.env`

**Replace this line in ALL 3 files:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/alnafi-planner?retryWrites=true&w=majority
```

**With your actual MongoDB Atlas connection string!**

**Example:**
```env
MONGODB_URI=mongodb+srv://alnafi:MyPassword123@cluster0.abc.mongodb.net/alnafi-planner?retryWrites=true&w=majority
```

---

#### **Start Auth Service:**

```bash
cd backend/auth-service
npm install
npm run dev
```

**You should see:**
```
✅ Auth Service: MongoDB connected successfully
🚀 Auth Service running on port 5001
```

---

#### **Start Report Service:**

**Open NEW terminal:**
```bash
cd backend/report-service
npm install
npm run dev
```

**You should see:**
```
✅ Report Service: MongoDB connected successfully
🚀 Report Service running on port 5003
```

---

#### **Start Schedule Service:**

**Open NEW terminal:**
```bash
cd backend/schedule-service
npm install
npm run dev
```

**You should see:**
```
✅ Schedule Service: MongoDB connected successfully
🚀 Schedule Service running on port 5004
📅 Study Scheduler is ready! Alhamdulillah! 🤲
```

---

### **Step 2: Setup Frontend**

**Open NEW terminal:**
```bash
cd frontend
npm install
npm run dev
```

**You should see:**
```
VITE v5.4.21 ready in 644 ms
➜  Local:   http://localhost:5173/
```

---

### **Step 3: Test Everything!**

**Open browser:** `http://localhost:5173`

#### **Test 1: Signup**
1. Click "Sign Up"
2. Enter name, email, password
3. Should save to MongoDB ✅

#### **Test 2: Login**
1. Enter credentials
2. Should redirect to diploma selection ✅

#### **Test 3: Select Diploma**
1. Choose Level 6 (AIOps)
2. Should redirect to dashboard ✅

#### **Test 4: Upload Report**
1. Click "Upload Progress Report"
2. Select AlNafi PDF
3. Should extract diploma percentages ✅

#### **Test 5: Schedule Session (Dual Storage)**
1. Open browser console (F12)
2. Type: 
```javascript
localStorage.getItem('alnafi_schedule')
```
3. Should show schedule data ✅

---

## 🎯 Services Running Checklist:

Make sure ALL 4 services are running:

- [ ] **Frontend** - `http://localhost:5173` ✅
- [ ] **Auth Service** - Port 5001 ✅
- [ ] **Report Service** - Port 5003 ✅
- [ ] **Schedule Service** - Port 5004 ✅

**You need 4 terminals open!**

---

## 📊 How Dual Storage Works:

### **Schedule Service - Smart Storage:**

```
Student adds study session
         ↓
    ┌────┴────┐
    ↓         ↓
localStorage  MongoDB
(Instant!)   (Synced)
    ↓         ↓
  Fast       Permanent
 Offline    Multi-device
    ↓         ↓
    └────┬────┘
         ↓
  Best of Both! ✅
```

**Benefits:**
- ✅ Works instantly (no waiting)
- ✅ Works offline
- ✅ Auto-syncs when online
- ✅ Access from any device
- ✅ Never lose data

---

## 🔧 Configuration Files:

### **Backend .env Files:**

All 3 services have `.env` files with template values:

**You MUST update:**
1. `MONGODB_URI` - Your MongoDB connection string
2. `JWT_SECRET` - (auth-service only) Random string

**Default ports:**
- Auth: 5001
- Report: 5003
- Schedule: 5004

---

### **Frontend API Config:**

**File:** `frontend/src/config/api.js`

```javascript
const API_BASE_URL = {
  auth: 'http://localhost:5001/api/auth',
  reports: 'http://localhost:5003/api/reports',
  schedule: 'http://localhost:5004/api/schedule'
};
```

**For production:** Change to your deployed URLs.

---

## 📝 API Endpoints:

### **Auth Service (5001):**
```
POST   /api/auth/signup     - Register user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get user info
PUT    /api/auth/level      - Update diploma level
```

### **Report Service (5003):**
```
POST   /api/reports/upload       - Upload PDF
GET    /api/reports/history/:id  - Get reports
GET    /api/reports/latest/:id   - Latest report
```

### **Schedule Service (5004):** ⭐
```
POST   /api/schedule/sessions              - Create session
GET    /api/schedule/sessions/:userId      - Get sessions
GET    /api/schedule/sessions/:userId/today - Today's sessions
PUT    /api/schedule/sessions/:id          - Update session
PUT    /api/schedule/sessions/:id/start-timer - Start timer
PUT    /api/schedule/sessions/:id/stop-timer - Stop timer
DELETE /api/schedule/sessions/:id          - Delete session
POST   /api/schedule/sessions/bulk-sync    - Bulk sync
GET    /api/schedule/stats/:userId/weekly  - Weekly stats
POST   /api/schedule/goals                 - Set goals
GET    /api/schedule/goals/:userId         - Get goals
```

---

## 🗄️ Database Collections:

Your MongoDB will have these collections:

1. **users** - User accounts
2. **dailyreports** - Uploaded report data
3. **studysessions** - Scheduled study sessions ⭐
4. **studygoals** - Study targets ⭐

---

## 🧪 Testing with Postman:

### **Test Schedule Service:**

**Health Check:**
```
GET http://localhost:5004/health
```

**Create Session:**
```
POST http://localhost:5004/api/schedule/sessions

Body (JSON):
{
  "userId": "your_user_id",
  "date": "2025-12-30",
  "startTime": "14:00",
  "endTime": "16:00",
  "courseId": 5,
  "courseName": "Python Deep Dive",
  "diploma": "Cyber Security",
  "plannedHours": 2,
  "notes": "Complete videos 5-8"
}
```

**Get Today's Sessions:**
```
GET http://localhost:5004/api/schedule/sessions/your_user_id/today
```

---

## 📦 What's Included:

### **Files Count:**

**Frontend:** ~30 files
- React components
- Services (auth, reports, schedule)
- Data files
- Config files

**Backend:** ~30 files
- 3 microservices
- Models, controllers, routes
- .env files for all services

**Total:** ~60 files
**Total Size:** ~500 KB (very lightweight!)

---

## 🎓 For Developers:

### **Tech Stack:**

**Frontend:**
- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Multer (file uploads)
- pdf-parse (PDF extraction)

---

## 🚨 Common Issues:

### **Issue 1: MongoDB Connection Error**
**Solution:**
- Check connection string in all `.env` files
- Replace `<password>` with actual password
- Whitelist IP: 0.0.0.0/0 in MongoDB Atlas

### **Issue 2: Port Already in Use**
**Solution:**
- Change PORT in `.env` files
- Or stop other services using those ports

### **Issue 3: "Cannot find module"**
**Solution:**
- Run `npm install` in that service folder

### **Issue 4: Frontend can't connect to backend**
**Solution:**
- Make sure all 3 backend services are running
- Check URLs in `frontend/src/config/api.js`

---

## 💡 Important Notes:

### **Scheduler Service:**
- ✅ Service layer complete (scheduleService.js)
- ⚠️ UI components not yet built (Scheduler page, Timer, Calendar)
- ✅ Backend API fully functional
- ✅ Dual storage working

**To use scheduler:** You'll need to build UI components or use API directly.

### **.env Files:**
- ✅ Included with template values
- ⚠️ You MUST update MongoDB URI
- ⚠️ Never commit real .env to Git

### **MongoDB Atlas:**
- ✅ Free tier supports 1000+ users
- ✅ Only data stored (no PDFs)
- ✅ Cost: $0/month

---

## 📚 Documentation:

Each service has detailed documentation:
- `backend/auth-service/` - See main backend README
- `backend/report-service/` - See main backend README
- `backend/schedule-service/BUILD_PROGRESS.md` - Scheduler docs
- `frontend/README.md` - Frontend setup guide

---

## 🎯 Next Steps:

### **To Complete Scheduler UI:**

Need to create:
1. `frontend/src/pages/Scheduler.jsx` - Calendar page
2. `frontend/src/components/AddSessionModal.jsx` - Add form
3. `frontend/src/components/StudyTimer.jsx` - Timer component
4. Update `frontend/src/pages/Dashboard.jsx` - Add today's widget

**But backend is 100% ready to use!** ✅

---

## 🌐 Deployment:

### **Frontend → Vercel (Free)**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### **Backend → Render (Free)**
- Deploy each service separately
- Update frontend API URLs

---

## ✅ Final Checklist:

Before starting:
- [ ] Node.js installed
- [ ] MongoDB Atlas account created
- [ ] Connection string ready
- [ ] 4 terminal windows ready

After setup:
- [ ] All 3 backend services running
- [ ] Frontend running
- [ ] Tested signup/login
- [ ] Tested PDF upload
- [ ] Checked MongoDB collections

---

## 🤲 Alhamdulillah!

**Complete AlNafi Study Planner Project**

**Version:** 1.0 - Complete Edition
**Date:** December 29, 2025
**Built with:** ❤️ and Bismillah

**May Allah make this project beneficial for all AlNafi students!** ✨

---

## 📞 Support:

**If you need help:**
1. Check the error message
2. Read the troubleshooting section
3. Make sure all services are running
4. Check MongoDB connection
5. Verify .env files are configured

**Everything you need is in this package!** 🎉

---

**JazakAllahu Khairan for using AlNafi Study Planner!** 🚀
