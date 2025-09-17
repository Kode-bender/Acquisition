# Acquisition API

A Node.js Express application with Neon Database integration, supporting both development (Neon Local) and production (Neon Cloud) environments.

## 🏗️ Architecture

This application uses a dual-database approach:
- **Development**: Neon Local proxy for ephemeral database branches
- **Production**: Neon Cloud for scalable, production-ready database

## 📋 Prerequisites

- Docker and Docker Compose
- Neon account and API key
- Node.js 20+ (for local development without Docker)

## 🔧 Environment Setup

### 1. Neon Console Configuration

1. Visit [Neon Console](https://console.neon.tech)
2. Create or select your project
3. Generate an API key from **Settings → API Keys**
4. Note your Project ID from **Settings → General**
5. Note your branch IDs (main branch for parent, specific branches if needed)

### 2. Environment Files

Copy and configure the environment files:

```bash
# Copy development environment template
cp .env.development .env.development.local

# Copy production environment template
cp .env.production .env.production.local
```

Update the following values in `.env.development.local`:
```env
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here
```

Update the following values in `.env.production.local`:
```env
DATABASE_URL=your_production_neon_database_url
JWT_SECRET=your_secure_production_jwt_secret
ARCJET_KEY=your_production_arcjet_key
```

## 🚀 Development Setup

### Option 1: Docker Compose (Recommended)

Start the development environment with Neon Local:

```bash
# Start development environment
docker compose -f docker-compose.dev.yml --env-file .env.development.local up --build

# Or run in detached mode
docker compose -f docker-compose.dev.yml --env-file .env.development.local up -d --build
```

This will:
- Start the Neon Local proxy container
- Create an ephemeral database branch
- Start your application connected to the local proxy
- Enable hot reload for development

### Option 2: Local Development

If you prefer running the application locally:

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.development.local .env

# Start Neon Local separately
docker run --name neon-local -p 5432:5432 \
  -e NEON_API_KEY=your_api_key \
  -e NEON_PROJECT_ID=your_project_id \
  -e PARENT_BRANCH_ID=your_parent_branch_id \
  neondatabase/neon_local:latest

# Run the application
npm run dev
```

### Development Features

- **Hot Reload**: Code changes are automatically reflected
- **Ephemeral Branches**: Each container restart creates a fresh database branch
- **Git Integration**: Persistent branches per Git branch (when volume mounted)
- **Health Checks**: Both database and application health monitoring

## 🌐 Production Deployment

### Using Docker Compose

```bash
# Build and start production environment
docker compose -f docker-compose.prod.yml --env-file .env.production.local up --build -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Production Features

- **Neon Cloud**: Direct connection to production database
- **Security**: Read-only filesystem, resource limits, no new privileges
- **Monitoring**: Health checks and structured logging
- **Performance**: Optimized build with production dependencies only

### Environment Variables

The application automatically detects the environment and configures the database connection accordingly:

| Environment | Database | Configuration |
|-------------|----------|---------------|
| Development | Neon Local | `postgres://neon:npg@neon-local:5432/dbname` |
| Production | Neon Cloud | Your production DATABASE_URL |

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run start        # Start production server

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

## 🔍 Troubleshooting

### Common Issues

1. **Neon Local Connection Issues**
   ```bash
   # Check if Neon Local is healthy
   docker compose -f docker-compose.dev.yml ps
   
   # View Neon Local logs
   docker compose -f docker-compose.dev.yml logs neon-local
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify environment file is loaded
   docker compose -f docker-compose.dev.yml config
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connectivity
   docker compose -f docker-compose.dev.yml exec app npm run db:studio
   ```

### Docker Commands

```bash
# Stop all services
docker compose -f docker-compose.dev.yml down

# Remove volumes (fresh start)
docker compose -f docker-compose.dev.yml down -v

# Rebuild containers
docker compose -f docker-compose.dev.yml up --build --force-recreate

# View all logs
docker compose -f docker-compose.dev.yml logs -f

# Execute commands in running container
docker compose -f docker-compose.dev.yml exec app bash
```

## 📁 Project Structure

```
acquisition/
├── src/
│   ├── app.js              # Express application
│   ├── server.js           # Server startup
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   └── models/             # Database models
├── drizzle/                # Database migrations
├── docker-compose.dev.yml  # Development environment
├── docker-compose.prod.yml # Production environment
├── Dockerfile              # Multi-stage Docker build
├── .env.development        # Development environment template
├── .env.production         # Production environment template
└── package.json
```

## 🔒 Security Considerations

### Development
- Uses self-signed certificates for Neon Local
- Ephemeral branches are automatically cleaned up
- Development secrets should not be used in production

### Production
- Read-only filesystem for container security
- Resource limits to prevent resource exhaustion
- Structured logging for security monitoring
- No new privileges security option

## 📚 Additional Resources

- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Neon Cloud Documentation](https://neon.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.