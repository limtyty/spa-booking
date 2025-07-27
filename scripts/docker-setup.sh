#!/bin/bash

# Spa Booking System - Docker Setup Script

echo "🏥 Setting up Spa Booking System with Docker..."

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

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p docker/mysql/init
mkdir -p docker/mysql/data

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
fi

# Start MySQL container
echo "🐳 Starting MySQL container..."
docker-compose up -d mysql

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 30

# Check MySQL connection
echo "🔍 Checking MySQL connection..."
docker-compose exec mysql mysql -u spa_user -pspa_password -e "SELECT 1;" spa_booking

if [ $? -eq 0 ]; then
    echo "✅ MySQL is ready!"
else
    echo "❌ MySQL connection failed. Please check the logs."
    docker-compose logs mysql
    exit 1
fi

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

echo "🎉 Setup complete!"
echo ""
echo "📊 Services available:"
echo "   - Spa Booking App: http://localhost:3000"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - MySQL: localhost:3306"
echo ""
echo "🔐 Database credentials:"
echo "   - Database: spa_booking"
echo "   - Username: spa_user"
echo "   - Password: spa_password"
echo ""
echo "📝 To stop services: docker-compose down"
echo "📝 To view logs: docker-compose logs -f"
