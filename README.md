# 🚼 DevPulse

> Internal Tech Issue & Feature Tracker - A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🛠️ Technology Stack

- **Runtime:** Node.js (LTS 24.x or higher)
- **Language:** TypeScript (latest stable version)
- **Framework:** Express.js
- **Database:** PostgreSQL with native `pg` driver
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Query Style:** Raw SQL only (no ORMs or query builders)

## 📋 Prerequisites

- Node.js 24.x or higher
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd DevPulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/devpulse
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
PORT=3000
```

### 4. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
createdb devpulse
```

Or using psql:

```sql
CREATE DATABASE devpulse;
```

### 5. Run the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

#### POST `/api/auth/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

### Issues Endpoints

#### POST `/api/issues`
Create a new issue (requires authentication).

**Headers:** `Authorization: <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

#### GET `/api/issues`
Get all issues with optional filtering.

**Query Parameters:**
- `sort`: `newest` (default) | `oldest`
- `type`: `bug` | `feature_request`
- `status`: `open` | `in_progress` | `resolved`

#### GET `/api/issues/:id`
Get a single issue by ID.

#### PATCH `/api/issues/:id`
Update an issue (requires authentication).

**Authorization:**
- Contributors: can only update their own issues when status is `open`
- Maintainers: can update any issue

**Headers:** `Authorization: <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description...",
  "type": "bug"
}
```

#### DELETE `/api/issues/:id`
Delete an issue (maintainer only).

**Headers:** `Authorization: <JWT_TOKEN>`

## 👥 User Roles

### Contributor
- Register and log in
- Create new issues
- View all issues
- Update own issues (only when status is `open`)

### Maintainer
- All contributor permissions
- Update any issue
- Delete any issue
- Change issue workflow status

## 🗄️ Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL)
- `role` (VARCHAR(20) DEFAULT 'contributor')
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

### Issues Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(150) NOT NULL)
- `description` (TEXT NOT NULL, min 20 characters)
- `type` ('bug' | 'feature_request')
- `status` ('open' | 'in_progress' | 'resolved')
- `reporter_id` (INT NOT NULL)
- `created_at` (TIMESTAMP DEFAULT NOW())
- `updated_at` (TIMESTAMP DEFAULT NOW())

## 🔐 Security Features

- Password hashing with bcrypt (8-12 salt rounds)
- JWT-based authentication
- Role-based access control
- Passwords never exposed in API responses
- Input validation on all endpoints

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

## 🧪 Testing

To test the API, you can use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- HTTPie

## 📂 Project Structure

```
DevPulse/
├── src/
│   ├── config/         # Configuration files
│   ├── db/             # Database connection and initialization
│   ├── middleware/     # Express middleware (auth, etc.)
│   ├── modules/        # Feature modules (auth, issues)
│   ├── types/          # TypeScript type definitions
│   ├── utility/        # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions, please create an issue in the repository.
