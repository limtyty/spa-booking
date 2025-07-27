#!/bin/bash

# Spa Booking System - Docker Reset Script

echo "🔄 Resetting Spa Booking System Docker environment..."

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down

# Remove volumes (this will delete all data)
echo "🗑️  Removing volumes and data..."
docker-compose down -v
docker volume prune -f

# Remove images
echo "🖼️  Removing images..."
docker-compose down --rmi all

# Clean up
echo "🧹 Cleaning up..."
docker system prune -f

# Restart services
echo "🚀 Restarting services..."
docker-compose up -d

echo "✅ Reset complete! All data has been cleared and services restarted."
