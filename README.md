# Number Tree - Ellty Assignment

A collaborative calculation platform where users interact through mathematical operations to build number trees.

## Overview

This application allows users to:
- View calculation trees without authentication
- Sign up and log in with username/password
- Post starting numbers (authenticated users)
- Add mathematical operations (+, −, ×, ÷) to existing numbers
- Reply to calculation results, forming infinite tree structures
- Navigate through nested number conversations

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- TanStack Router for routing
- TanStack Query for data fetching
- Tailwind CSS for styling
- Shadcn/ui for components
- Zod for validation

**Backend:**
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite
- Passport.js for authentication
- Express Session for session management

**Testing:**
- Vitest for unit and integration tests

**Deployment:**
- Docker for containerization
- Fly.io for hosting

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** v20.x or higher ([Download](https://nodejs.org/))
- **npm** v10.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Optional (for Docker deployment):
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/))

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ifeora-emeka/ellty-assignment-2.git
cd ellty-assignment-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The project includes a `.env` file with development defaults:

```env
NODE_ENV=development
PORT=8080
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="change-this-secret-in-production"
VITE_API_URL=http://localhost:8080
```

For production, update `SESSION_SECRET` to a secure random string.

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Optional - Seed the database with sample data:

```bash
npm run prisma:seed
```

This creates sample users and posts:
- **alice** (password: `password123`)
- **bob** (password: `password123`)
- **charlie** (password: `password123`)

### 5. Run Development Servers

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```
Backend runs on `http://localhost:8080`

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

```bash
npm run dev              # Start Vite development server
npm run dev:server       # Start Express backend with hot reload
npm run build            # Build frontend for production
npm run build:server     # Build backend for production
npm run start            # Start production server
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database with sample data
```

## Running Tests

Execute the test suite:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

Access the application at `http://localhost:8080`

### Manual Docker Build

```bash
docker build -t ellty-assignment-2 .
docker run -p 8080:8080 -v ellty-data:/app/data ellty-assignment-2
```

## Production Deployment

The application is configured for deployment on Fly.io:

```bash
fly deploy
```

Configuration is in `fly.toml`. The application includes:
- Automatic HTTPS
- Persistent volume for SQLite database
- Auto-start/stop machines for cost efficiency

## Project Structure

```
├── server/              # Backend Express application
│   ├── apis/           # API routes and controllers
│   ├── configs/        # Configuration files
│   └── middlewares/    # Express middlewares
├── src/                # Frontend React application
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── lib/           # Utilities, API clients, services
│   └── routes/        # TanStack Router routes
├── prisma/            # Database schema and migrations
├── tests/             # Test files
└── docker-compose.yml # Docker configuration
```

## API Documentation

The API follows RESTful conventions:

**Authentication:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Posts:**
- `GET /api/posts` - List root posts (paginated)
- `POST /api/posts` - Create root post (authenticated)
- `GET /api/posts/:id` - Get post with nested replies
- `POST /api/posts/:id/reply` - Add operation reply (authenticated)

OpenAPI documentation available in `server/apis/api.openapi.yml`

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or kill process using the port
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8080 | xargs kill -9
```

**Database issues:**
```bash
# Reset database
rm -rf prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

