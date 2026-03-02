# Docker Compose Setup Guide for Civic Saathi

## Prerequisites

Make sure you have the following installed on your system:
- **Docker**: [Download Docker Desktop](https://www.docker.com/)
- **Docker Compose**: Usually comes bundled with Docker Desktop

## Quick Start

### Step 1: Prepare Environment Variables
The project already has an `.env.example` file. The environment variables are already configured in `docker-compose.yml`.

### Step 2: Build and Start the Services

Run the following command from the project directory:

```bash
docker-compose up -d
```

This will:
- Build the Next.js application image
- Start the app container on port `3000`
- Start the MongoDB container on port `27017`
- Create a network for both services to communicate

### Step 3: Access the Application

Once the containers are running, open your browser and navigate to:

```
http://localhost:3000
```

### Step 4: View Container Logs

To see what's happening in your containers:

```bash
# View all logs
docker-compose logs -f

# View only app logs
docker-compose logs -f app

# View only MongoDB logs
docker-compose logs -f mongo
```

## Common Docker Compose Commands

### Start Services
```bash
docker-compose up                    # Run in foreground
docker-compose up -d                 # Run in background (detached)
docker-compose up --build            # Rebuild images before starting
docker-compose up -d --build         # Rebuild and run in background
```

### Stop Services
```bash
docker-compose stop                  # Stop all services gracefully
docker-compose stop app              # Stop only the app
docker-compose stop mongo            # Stop only MongoDB
```

### Remove Services
```bash
docker-compose down                  # Stop and remove containers
docker-compose down -v               # Stop, remove containers, and volumes
docker-compose down --remove-orphans # Remove orphaned containers
```

### View Running Containers
```bash
docker-compose ps                    # List running containers
docker ps                            # List all Docker containers
```

### Execute Commands in Container
```bash
docker-compose exec app npm run build    # Build Next.js in container
docker-compose exec app npm test         # Run tests in container
docker-compose exec mongo mongosh        # Connect to MongoDB shell
```

### View Logs
```bash
docker-compose logs                  # View logs once
docker-compose logs -f               # Follow logs (like tail -f)
docker-compose logs app              # View only app logs
docker-compose logs mongo            # View only MongoDB logs
```

### Restart Services
```bash
docker-compose restart               # Restart all services
docker-compose restart app           # Restart only app
```

## Environment Variables

The Docker Compose is configured with the following environment variables:

### App Container
- `NODE_ENV=production` - Sets Node.js to production mode
- `MONGODB_URI=mongodb://mongo:27017` - MongoDB connection string
- `NEXT_PUBLIC_API_URL=http://localhost:3000` - API base URL

### MongoDB Container
- `MONGO_INITDB_ROOT_USERNAME=root` - MongoDB admin username
- `MONGO_INITDB_ROOT_PASSWORD=password123` - MongoDB admin password

**Note**: Change the MongoDB password in `docker-compose.yml` for production environments!

## Database Access

### MongoDB Connection String (from inside containers)
```
mongodb://root:password123@mongo:27017/?authSource=admin
```

### MongoDB Connection String (from your local machine)
```
mongodb://root:password123@localhost:27017/?authSource=admin
```

### Connect to MongoDB with mongosh
```bash
docker-compose exec mongo mongosh -u root -p password123
```

## Volumes

Data is persisted in the following volumes:
- `mongo_data` - MongoDB database files
- `mongo_config` - MongoDB configuration files

These volumes are stored in Docker's volume storage and persist between container restarts.

## Troubleshooting

### Port Already in Use
If port 3000 or 27017 is already in use, you can modify the ports in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "8000:3000"  # Change from 3000 to 8000

  mongo:
    ports:
      - "27018:27017"  # Change from 27017 to 27018
```

### Container Won't Start
```bash
# Check logs for errors
docker-compose logs app

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### MongoDB Connection Error
```bash
# Restart MongoDB
docker-compose restart mongo

# Wait a few seconds and try again
sleep 5
docker-compose restart app
```

### Clear Everything and Start Fresh
```bash
# Remove all containers, volumes, and networks
docker-compose down -v

# Remove the built image
docker rmi civic-issues-app

# Start fresh
docker-compose up -d --build
```

## Production Deployment

For production deployment:

1. **Change MongoDB password** in `docker-compose.yml`
2. **Update `NEXT_PUBLIC_API_URL`** to your domain
3. **Use environment variables** instead of hardcoding values:
   ```yaml
   environment:
     - MONGODB_URI=${MONGODB_URI}
     - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
   ```

4. Create a `.env` file with production values:
   ```
   MONGODB_URI=mongodb://user:securePassword@mongo:27017/?authSource=admin
   NEXT_PUBLIC_API_URL=https://yourdomain.com
   ```

5. Run with:
   ```bash
   docker-compose --env-file .env up -d
   ```

## Scale Services

To run multiple instances of the app:

```bash
docker-compose up -d --scale app=3
```

(Note: You may need to adjust port configurations for this)

## Health Checks

The containers are configured to restart automatically if they crash:
```yaml
restart: unless-stopped
```

This means:
- If a container crashes, Docker will automatically restart it
- If you explicitly stop a container, it won't auto-restart

## Stop All Services

```bash
docker-compose down
```

This will stop and remove all containers, but keep your data in volumes.

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
