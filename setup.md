# Local Development Setup

## Option 1: Docker Setup (Recommended)

### Prerequisites
1. Install Docker Desktop for Mac:
```bash
# Using Homebrew
brew install --cask docker

# Also install Docker Compose separately
brew install docker-compose

# Start Docker Desktop from Applications folder
# OR start from terminal:
open -a Docker
```

2. Verify installation:
```bash
# Make sure Docker daemon is running
docker ps  # If this fails, Docker daemon is not running

docker --version  # Should show version 28.0.0 or later
docker-compose --version  # Verify compose is installed
```

### Running the Application
```bash
# Build and start services in detached mode
docker-compose -f docker/docker-compose.yml up -d

# Build and start specific services
docker-compose -f docker/docker-compose.yml up -d app db redis

# Watch logs
docker-compose -f docker/docker-compose.yml logs -f app

# View logs for multiple services
docker-compose -f docker/docker-compose.yml logs -f app db redis

# Stop services
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker/docker-compose.yml down -v

# Rebuild specific service
docker-compose -f docker/docker-compose.yml up -d --build app

# View running containers
docker-compose -f docker/docker-compose.yml ps
```

Note: Since you're using an older version of Docker that doesn't have the integrated `docker compose` command, use `docker-compose` (with a hyphen) instead.

### Docker Troubleshooting
```bash
# If you see "Cannot connect to the Docker daemon" error:

# 1. First, quit Docker Desktop completely
# Click Docker icon in menu bar -> Quit Docker Desktop
# OR use command:
osascript -e 'quit app "Docker"'

# 2. Reset Docker Desktop state
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker

# 3. Restart your Mac

# 4. After restart, start Docker Desktop
open -a Docker

# 5. Wait for Docker to fully initialize (watch the whale icon in menu bar)
# When the whale icon stops animating, run:
docker ps

# 6. If still having issues, check system permissions:
ls -la /var/run/docker.sock
# Should show something like: srw-rw-rw-  1 root  daemon    0 Date Time /var/run/docker.sock

# 7. If permissions are wrong, fix them:
sudo chmod 666 /var/run/docker.sock

# 8. Now try running your docker-compose command:
docker-compose -f docker/docker-compose.yml up -d
```

Note: If you still can't connect to Docker daemon after these steps, try:
1. Uninstall Docker Desktop completely:
```bash
brew uninstall --cask docker
rm -rf ~/.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
rm -rf ~/Library/Group\ Containers/group.com.docker
```

2. Reinstall Docker Desktop:
```bash
brew install --cask docker
```

3. Start Docker Desktop and grant all necessary permissions when prompted

## Option 2: Manual Setup

### Installing Dependencies

1. Install Homebrew (if not installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Node.js:
```bash
brew install node@16
echo 'export PATH="/usr/local/opt/node@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

3. Install PostgreSQL:
```bash
brew install postgresql@13
brew services start postgresql@13
```

4. Install Redis:
```bash
brew install redis
brew services start redis
```

5. Verify installations:
```bash
node --version    # Should show v16.x.x
postgres --version # Should show 13.x
redis-cli ping    # Should return PONG
```

### Database Setup

1. Create database and user:
```bash
createdb -U postgres arcfit_db && \
psql -U postgres -c "CREATE USER arcfit WITH PASSWORD 'securepassword';" && \
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE arcfit_db TO arcfit;"
```

### Environment Setup
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your local settings:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=arcfit
DB_PASSWORD=securepassword
DB_NAME=arcfit_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
REFRESH_SECRET=your-refresh-secret
```

### Application Setup
```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Access
API documentation available at: http://localhost:3000/api-docs

### Development Scripts
- `npm run dev` - Start development server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with test data

### Troubleshooting

If PostgreSQL fails to start:
```bash
brew services restart postgresql@13
```

If Redis fails to start:
```bash
brew services restart redis
```

To check services status:
```bash
brew services list
```



# Create database and user in one go
createdb -U postgres arcfit_db && \
psql -U postgres -c "CREATE USER arcfit WITH PASSWORD 'securepassword';" && \
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE arcfit_db TO arcfit;"

# Login to PostgreSQL as superuser
psql postgres

# Create the database user
CREATE USER arcfit WITH PASSWORD 'securepassword';

# Create the database
CREATE DATABASE arcfit_db WITH OWNER arcfit;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE arcfit_db TO arcfit;

# Connect to the new database
\c arcfit_db

# Grant schema privileges
GRANT ALL ON SCHEMA public TO arcfit;