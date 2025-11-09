#!/bin/bash

# ProofPals Deployment Script
echo "🚀 Starting ProofPals deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
POSTGRES_PASSWORD=proofpals_secure_password_$(openssl rand -hex 16)

# Backend Environment
ENVIRONMENT=production
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Redis
REDIS_URL=redis://redis:6379

# Database URL
DATABASE_URL=postgresql://proofpals:\${POSTGRES_PASSWORD}@postgres:5432/proofpals
EOF
    echo "✅ Created .env file with secure passwords"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend python init_db.py

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
