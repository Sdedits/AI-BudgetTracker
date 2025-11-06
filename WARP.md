# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI Budget Tracker is a full-stack personal finance management application with JWT-based authentication, transaction tracking, budgeting, and analytics features. The backend is Spring Boot (Java 17) with MySQL, and the frontend is React 19 with TypeScript and Vite.

## Development Commands

### Backend (Spring Boot)
```bash
# Build the project
mvnw clean install

# Run the application (port 8083)
mvnw spring-boot:run

# Run tests
mvnw test

# Clean build artifacts
mvnw clean
```

### Frontend (React + Vite)
```bash
# Navigate to frontend directory
cd AIBudgetTrackerFrontend

# Install dependencies (use legacy-peer-deps flag)
npm install --legacy-peer-deps

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Database Setup
```sql
-- Create the database
CREATE DATABASE user_auth_db;
```

Update credentials in `src/main/resources/application.properties`:
- Default database: `user_auth_db`
- Default port: `3306`
- Update username/password as needed

## Architecture

### Backend Architecture (Spring Boot)

The backend follows a **layered modular architecture** with three primary domain modules:

#### 1. Authentication Service (`authservice/`)
Handles user authentication and authorization using JWT tokens.

**Key Components:**
- `config/SecurityConfig.java` - Configures Spring Security with stateless JWT authentication
- `filter/JwtRequestFilter.java` - Intercepts requests to validate JWT tokens before reaching controllers
- `util/JwtUtil.java` - JWT generation, parsing, and validation (1 hour expiration)
- `controller/AuthController.java` & `ProfileController.java` - Public auth endpoints and protected profile endpoints
- `service/AuthService.java` - Business logic for user registration/login
- `model/User.java` - User entity with profile fields (monthlyIncome, savingsGoal, targetExpenses)

**Authentication Flow:**
1. User registers via `/api/auth/signup` (password BCrypt-encrypted)
2. User logs in via `/api/auth/login` → receives JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer <token>` header
5. `JwtRequestFilter` validates token and sets `SecurityContext`
6. Controllers extract user via `Authentication.getName()`

#### 2. Transaction Module (`transaction/`)
Manages income and expense transactions with full CRUD operations.

**Key Components:**
- `controller/TransactionController.java` - REST endpoints for transactions
- `service/TransactionService.java` - Business logic and validation
- `model/Transaction.java` - Transaction entity (amount, type, category, date, description)
- `repository/TransactionRepository.java` - JPA repository with custom queries
- `dto/TransactionRequest.java` & `TransactionResponse.java` - API contracts

**Transaction Types:**
- **Expense categories:** Rent, Food, Travel, Entertainment, Shopping, Healthcare, Utilities, Other
- **Income categories:** Salary, Freelance, Investment, Business, Gift, Other

#### 3. Analytics Module (`analytics/`)
Provides financial insights and spending analysis.

**Key Components:**
- `controller/AnalyticsController.java` - Analytics endpoints
- `service/AnalyticsService.java` - Aggregates transaction data by category, month, etc.
- `dto/AnalyticsResponse.java` - Analytics data transfer object

### Frontend Architecture (React + TypeScript)

The frontend follows a **component-based architecture** with clear separation of concerns:

#### Directory Structure
- `components/` - Reusable UI components (Navbar, ProtectedRoute, etc.)
- `pages/` - Full page components (Dashboard, Transactions, Profile, Analytics, etc.)
- `hooks/` - Custom React hooks (useAuth for authentication context)
- `services/api.ts` - Centralized Axios API client with interceptors
- `types/` - TypeScript type definitions for API contracts

#### Key Patterns

**Authentication Pattern:**
- `useAuth` hook provides context with `token`, `isAuthenticated`, `login()`, `logout()`
- `ProtectedRoute` component wraps authenticated pages
- Axios interceptor automatically attaches token to all requests

**API Service Pattern:**
All API calls are centralized in `services/api.ts`:
- Base URL: `http://localhost:8083/api`
- Automatic JWT token injection via request interceptor
- Typed responses using TypeScript interfaces

**Routing:**
- Public routes: `/`, `/signup`, `/login`
- Protected routes: `/dashboard`, `/profile`, `/transactions`, `/budget`, `/analytics`, `/export`, `/forum`

### Security Configuration

**Backend Security (`SecurityConfig.java`):**
- CSRF disabled (stateless JWT authentication)
- `/api/auth/**` endpoints are public
- All other endpoints require authentication
- Stateless session management (no server-side sessions)
- `JwtRequestFilter` runs before `UsernamePasswordAuthenticationFilter`

**JWT Configuration:**
- Token expiration: 1 hour (3600000 ms)
- Secret stored in `JwtUtil.java` (base64 encoded)
- Algorithm: HS256

**CORS Configuration:**
- All controllers have `@CrossOrigin(origins = "http://localhost:5173")`
- If changing ports, update CORS origins in all controllers

## Key Implementation Patterns

### Backend Patterns

**Controller Pattern:**
All controllers follow this structure:
1. Inject `UserRepository` and domain service
2. Extract username from `Authentication` object
3. Look up user from database
4. Delegate to service layer with user ID
5. Return `ResponseEntity<?>` with appropriate HTTP status

**User Context Extraction:**
```java
String username = authentication.getName();
User user = userRepository.findByUsername(username)
    .orElseThrow(() -> new RuntimeException("User not found"));
// Use user.getId() for service calls
```

**DTO Pattern:**
- Request DTOs for incoming data (e.g., `TransactionRequest`)
- Response DTOs for outgoing data (e.g., `TransactionResponse`)
- Entities (`User`, `Transaction`) never exposed directly in API

**Repository Pattern:**
- Extends `JpaRepository<Entity, ID>`
- Custom query methods use Spring Data JPA naming conventions
- Example: `findByUsername(String username)`

### Frontend Patterns

**React Component Structure:**
- Functional components with hooks (no class components)
- TypeScript for type safety
- TailwindCSS for styling
- Lucide React for icons

**Error Handling:**
- Try-catch blocks in async functions
- Alert dialogs for user-facing errors
- Console logging for debugging

**State Management:**
- Local component state with `useState`
- Global auth state via `useAuth` context
- No external state management library (Redux, Zustand, etc.)

## Port Configuration

- **Backend:** `8083` (configured in `application.properties`)
- **Frontend:** `5173` (Vite default, configured in `vite.config.ts`)
- **Database:** `3306` (MySQL default)

If changing ports:
1. Update `application.properties` (backend port)
2. Update `vite.config.ts` (frontend port)
3. Update CORS origins in all backend controllers
4. Update `api.ts` baseURL in frontend

## Important Files

### Configuration
- `src/main/resources/application.properties` - Database and server config
- `AIBudgetTrackerFrontend/vite.config.ts` - Frontend build config
- `AIBudgetTrackerFrontend/tailwind.config.js` - Tailwind CSS config
- `pom.xml` - Maven dependencies (Spring Boot 3.5.6, Java 17)
- `AIBudgetTrackerFrontend/package.json` - npm dependencies

### Security
- `authservice/config/SecurityConfig.java` - Spring Security configuration
- `authservice/filter/JwtRequestFilter.java` - JWT validation filter
- `authservice/util/JwtUtil.java` - JWT utility (contains secret key)

### Database
- `authservice/model/User.java` - User entity
- `transaction/model/Transaction.java` - Transaction entity
- Hibernate DDL auto mode: `update` (creates/updates tables automatically)

## Testing

The project uses Spring Boot Test framework. Test files are located in `src/test/java/`. Run tests with `mvnw test`.

**Note:** Frontend does not currently have test configuration beyond ESLint.

## Common Development Tasks

### Adding a New API Endpoint
1. Create/update DTOs in appropriate `dto/` package
2. Add method to service interface and implementation
3. Add controller endpoint with `@GetMapping/@PostMapping/@PutMapping/@DeleteMapping`
4. Add CORS annotation if needed
5. Update frontend `services/api.ts` with typed API function
6. Use the API function in React components

### Modifying Authentication
- JWT secret and expiration are in `JwtUtil.java`
- Security rules are in `SecurityConfig.java`
- Token validation logic is in `JwtRequestFilter.java`

### Adding New Entity/Model
1. Create entity class with `@Entity` annotation in appropriate `model/` package
2. Create repository interface extending `JpaRepository`
3. Create DTOs for request/response
4. Create service layer with business logic
5. Create controller with REST endpoints
6. Hibernate will auto-create table on next run (ddl-auto=update)

### Frontend Component Development
- All pages go in `pages/`
- Reusable components go in `components/`
- Add route in `App.tsx`
- Use `ProtectedRoute` wrapper for authenticated pages
- Import types from `types/index.ts`

## Troubleshooting

### Backend won't start
- Verify MySQL is running and `user_auth_db` exists
- Check database credentials in `application.properties`
- Ensure port 8083 is not in use

### Frontend network errors
- Verify backend is running on port 8083
- Check CORS configuration in controllers
- Verify token exists in localStorage (check browser DevTools)

### JWT token issues
- Token expires after 1 hour - user must re-login
- Token is validated on every request by `JwtRequestFilter`
- Check browser console for 401/403 errors

### Build issues
- Frontend: Delete `node_modules` and reinstall with `npm install --legacy-peer-deps`
- Backend: Run `mvnw clean install` to rebuild

## Windows-Specific Notes

This project uses Windows paths and PowerShell commands. When running Maven wrapper:
- Use `mvnw.cmd` on Windows Command Prompt
- Use `./mvnw` on PowerShell/Git Bash
- Or simply use `mvnw` (Windows will find the correct wrapper)
