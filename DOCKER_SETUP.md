# Docker Setup Guide - Civic Issues Project

This guide explains how to containerize and deploy the Civic Issues project using Docker so all team members can run it easily.

---

## **Prerequisites**

Before starting, ensure your team has:
- **Docker Desktop** installed ([download here](https://www.docker.com/products/docker-desktop))
- **Git** installed
- Clone the repository: `git clone <repository-url>`

---

## **Option 1: Using Docker Compose (Recommended for Teams)**

Docker Compose automatically sets up both the application and MongoDB database.

### **Step 1: Prepare Environment Variables**

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and update the values as needed:
   ```bash
   MONGODB_URI=mongodb://mongo:27017
   JWT_SECRET=your_secret_key_here
   # ... other environment variables
   ```

### **Step 2: Build and Run**

Run the application with a single command:

```bash
docker-compose up --build
```

This will:
- Build the Docker image
- Start the application on `http://localhost:3000`
- Start MongoDB on `localhost:27017`

**To run in background:**
```bash
docker-compose up -d --build
```

### **Step 3: Verify It's Running**

```bash
docker-compose ps
```

You should see two containers running:
- `civic-issues-app`
- `civic-issues-mongo`

### **Stopping the Application**

```bash
docker-compose down
```

**To also remove volumes (database data):**
```bash
docker-compose down -v
```

---

## **Option 2: Push to Docker Hub (For Sharing)**

If you want team members to pull a pre-built image instead of building locally:

### **Step 1: Create Docker Hub Account**
- Sign up at [hub.docker.com](https://hub.docker.com)

### **Step 2: Build and Tag Image**

```bash
docker build -t yourusername/civic-issues:latest .
```

### **Step 3: Login to Docker Hub**

```bash
docker login
```

### **Step 4: Push Image**

```bash
docker push yourusername/civic-issues:latest
```

### **Step 5: Share with Team**

Team members can now pull and run it with:

```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017 \
  --name civic-app \
  yourusername/civic-issues:latest
```

---

## **Option 3: Manual Docker Commands Only**

If not using docker-compose:

### **Step 1: Build Image**

```bash
docker build -t civic-issues .
```

### **Step 2: Run MongoDB Container**

```bash
docker run -d \
  --name civic-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7.0-alpine
```

### **Step 3: Run Application Container**

```bash
docker run -d \
  --name civic-app \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://civic-mongo:27017 \
  --link civic-mongo:mongo \
  civic-issues
```

Access the app at `http://localhost:3000`

---

## **Useful Docker Commands**

| Command | Purpose |
|---------|---------|
| `docker-compose logs` | View application logs |
| `docker-compose logs -f` | Follow logs in real-time |
| `docker-compose exec app npm run lint` | Run commands inside container |
| `docker ps` | List running containers |
| `docker images` | List available images |
| `docker rm <container-id>` | Remove a container |
| `docker rmi <image-id>` | Remove an image |

---

## **For Team Collaboration**

### **GitHub + Docker Approach:**

1. **Push to GitHub** (you likely already do this)

2. **Team members clone:**
   ```bash
   git clone <repository-url>
   cd sih
   ```

3. **Team members run with Docker Compose:**
   ```bash
   cp .env.example .env.local
   docker-compose up
   ```

4. **Access at:** `http://localhost:3000`

---

## **Troubleshooting**

### **Port already in use**
If port 3000 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Access on http://localhost:8080
```

### **MongoDB Connection Error**
Ensure MongoDB is running:
```bash
docker-compose ps
```

If MongoDB isn't running:
```bash
docker-compose up mongo
```

### **Permission Denied**
On Linux/Mac, you may need to:
```bash
sudo usermod -aG docker $USER
```

Then log out and log back in.

### **Clear Everything**
To start fresh:
```bash
docker-compose down -v
docker system prune -a
```

---

## **Environment Variables Reference**

Update these in `.env.local` based on your needs:

- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Set to 'production' in Docker
- `NEXT_PUBLIC_API_URL`: Your application's public URL
- `JWT_SECRET`: Secret key for authentication tokens
- Other API keys as needed (Cloudinary, Mailgun, etc.)

---

## **Next Steps**

1. ✅ Create a `.env.local` file from `.env.example`
2. ✅ Run `docker-compose up`
3. ✅ Share the Docker Hub link with team members (if pushing to registry)
4. ✅ Update your GitHub README with Docker setup instructions

**Happy deploying!** 🚀
