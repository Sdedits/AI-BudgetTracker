# Quick Start Guide - AI Budget Tracker

## Prerequisites Check
- ✅ Java 21 installed
- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ running
- ✅ Maven installed

## Step-by-Step Setup

### 1. Database Setup (2 minutes)

Open MySQL command line or workbench and run:
```sql
CREATE DATABASE user_auth_db;
```

**Important**: Update your MySQL password in `src/main/resources/application.properties` if it's different from the current one.

### 2. Start Backend (3 minutes)

Open a terminal in the project root directory and run:

```bash
# Build the project
mvnw clean install

# Run the application
mvnw spring-boot:run
```

Wait for the message: "Started AibudgettrackerApplication in X seconds"

Backend will be available at: **http://localhost:8083**

### 3. Start Frontend (3 minutes)

Open a NEW terminal and navigate to frontend directory:

```bash
cd AIBudgetTrackerFrontend

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4. Test the Application

1. Open browser and go to **http://localhost:5173**
2. Click **"Sign Up"** and create an account
3. Login with your credentials
4. You'll be redirected to the **Dashboard**
5. Click **"Update Profile"** to set your financial goals
6. Click **"Transactions"** and add your first transaction

## Quick Test Credentials

After signing up, you can use these steps to test:

1. **Sign Up**:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`

2. **Set Profile**:
   - Monthly Income: `50000`
   - Savings Goal: `15000`
   - Target Expenses: `35000`

3. **Add Transaction**:
   - Type: Income
   - Amount: `50000`
   - Category: Salary
   - Description: Monthly salary

## Common Issues & Solutions

### Issue: Backend won't start
**Solution**: Check if MySQL is running and database exists
```bash
# Check MySQL status
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Frontend shows network error
**Solution**: Ensure backend is running on port 8083
```bash
# Check if backend is running
curl http://localhost:8083/api/auth/login
```

### Issue: Cannot connect to database
**Solution**: Update credentials in `application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### Issue: npm install fails
**Solution**: Use legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

### Issue: Port already in use
**Solution**: 
- Backend: Change port in `application.properties`
- Frontend: Change port in `vite.config.ts`

## Application Flow

```
1. User Sign Up → Creates account in database
2. User Login → Receives JWT token
3. Token stored in localStorage
4. Token sent with all API requests
5. Backend validates token
6. User can access protected routes
```

## API Testing (Optional)

You can test APIs using tools like Postman or curl:

### Sign Up
```bash
curl -X POST http://localhost:8083/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'
```

### Login
```bash
curl -X POST http://localhost:8083/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

This will return a JWT token. Use this token for authenticated requests:

### Get Profile
```bash
curl -X GET http://localhost:8083/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Features to Explore

### Dashboard
- View financial overview
- See total income, expenses, and balance
- Check savings progress
- View recent transactions

### Transactions
- Add income/expense transactions
- Filter by type (Income/Expense/All)
- Edit existing transactions
- Delete transactions
- View transaction history

### Profile
- View account information
- Update monthly income
- Set savings goals
- Define target expenses

## Next Steps

1. ✅ Complete user registration
2. ✅ Set up your financial profile
3. ✅ Add your first few transactions
4. ✅ Explore the dashboard
5. ✅ Try filtering and editing transactions

## Need Help?

Check the main **README.md** file for detailed documentation.

## Stopping the Application

### Stop Backend
- Press `Ctrl + C` in the backend terminal

### Stop Frontend
- Press `Ctrl + C` in the frontend terminal

### Stop MySQL (if needed)
- Windows: Services → MySQL → Stop
- Mac/Linux: `sudo systemctl stop mysql`

---

**Happy Budgeting! 💰**
