# Quick Setup Guide - AI Budget Tracker

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Frontend Dependencies

```powershell
# Navigate to frontend directory
cd "d:\Infosys Internship\aibudgettracker\AIBudgetTrackerFrontend"

# Install all dependencies
npm install
npm install react-hook-form @tanstack/react-query recharts date-fns
```

### Step 2: Start Frontend

```powershell
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Step 3: Configure Backend

1. Open `src/main/resources/application.properties`
2. Update database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/aibudgettracker?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD_HERE
   ```

### Step 4: Start Backend

```powershell
# From project root
cd "d:\Infosys Internship\aibudgettracker"
./mvnw spring-boot:run
```

The backend API will be available at: **http://localhost:8083**

## 🎯 Navigation Guide

Once both servers are running:

1. **Home Page**: http://localhost:5173
2. **Sign Up**: http://localhost:5173/signup
3. **Login**: http://localhost:5173/login

After logging in, you'll have access to:

- 📊 **Dashboard** - `/dashboard` - Overview of your finances
- 💳 **Transactions** - `/transactions` - Manage your transactions
- 💰 **Budget** - `/budget` - Set budgets and savings goals
- 📈 **Analytics** - `/analytics` - View financial trends
- 📥 **Export** - `/export` - Export your data
- 💬 **Forum** - `/forum` - Community discussions
- 👤 **Profile** - `/profile` - Manage your account

## 🔧 Common Issues & Solutions

### Issue: PowerShell Script Execution Error

**Error**: `running scripts is disabled on this system`

**Solution**: Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port Already in Use

**Frontend (5173)**:
```powershell
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

**Backend (8083)**:
```powershell
# Kill process using port 8083
netstat -ano | findstr :8083
taskkill /PID <PID_NUMBER> /F
```

### Issue: Module Not Found

```powershell
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Connection Failed

1. Ensure MySQL is running
2. Check database credentials in `application.properties`
3. Create database manually if needed:
   ```sql
   CREATE DATABASE aibudgettracker;
   ```

## 📦 Dependencies Installed

### Frontend
- `react-hook-form` - Form validation and management
- `@tanstack/react-query` - Data fetching and caching
- `recharts` - Chart and data visualization
- `date-fns` - Date manipulation

### Already Included
- React, React Router, Axios, TailwindCSS, Lucide Icons

## ✅ Verification Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API responds at http://localhost:8083/api
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can create transactions
- [ ] Can set budgets
- [ ] Can create savings goals
- [ ] Analytics page displays charts
- [ ] Forum loads properly
- [ ] Export functionality works

## 🎨 Default Test Credentials

If you've set up seed data:
```
Username: testuser
Password: password123
```

## 🚀 Ready to Use!

Your AI Budget Tracker is now fully set up and ready to use!

**Need help?** Check PROJECT_COMPLETE.md for detailed documentation.

---

**Setup Time**: ~5 minutes  
**Last Updated**: October 15, 2025
