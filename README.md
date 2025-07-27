# Spa Booking Management System

A comprehensive spa booking management system built with Next.js, MySQL, and Docker.

## Features

- 📅 **Booking Management** - Create, view, and manage spa appointments
- 💆 **Treatment Management** - Manage spa services and pricing
- 👥 **Staff Management** - Handle staff schedules and assignments
- 🏢 **Room Management** - Track room availability and maintenance
- 📊 **Analytics Dashboard** - Business insights and reporting
- 🐳 **Docker Support** - Easy deployment with Docker containers

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Git

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd spa-booking-system
   \`\`\`

2. **Run the setup script**
   \`\`\`bash
   npm run docker:setup
   \`\`\`

3. **Access the application**
   - Spa Booking App: http://localhost:3000
   - phpMyAdmin: http://localhost:8080
   - MySQL: localhost:3306

### Docker Commands

\`\`\`bash

# Start all services

npm run docker:up

# Stop all services

npm run docker:down

# View logs

npm run docker:logs

# Reset everything (WARNING: Deletes all data)

npm run docker:reset

# Development mode with hot reload

npm run docker:dev
\`\`\`

## Manual Setup (Without Docker)

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Setup MySQL database**
   \`\`\`sql
   CREATE DATABASE spa_booking;
   CREATE USER 'spa_user'@'localhost' IDENTIFIED BY 'spa_password';
   GRANT ALL PRIVILEGES ON spa_booking.\* TO 'spa_user'@'localhost';
   \`\`\`

3. **Configure environment**
   \`\`\`bash
   cp .env.example .env.local

   # Edit .env.local with your database credentials

   \`\`\`

4. **Run database migrations**
   \`\`\`bash

   # Import the SQL files in order:

   # 1. docker/mysql/init/01-create-schema.sql

   # 2. docker/mysql/init/02-seed-data.sql

   \`\`\`

5. **Start the application**
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Schema

### Core Tables

- **treatments** - Spa services and pricing
- **personnel** - Staff members and roles
- **rooms** - Treatment rooms and facilities
- **bookings** - Client appointments
- **personnel_working_hours** - Staff schedules
- **booking_personnel** - Staff-booking assignments
- **personnel_treatments** - Staff-treatment capabilities

## Environment Variables

\`\`\`env

# Database Configuration

DB_HOST=localhost
DB_USER=spa_user
DB_PASSWORD=spa_password
DB_NAME=spa_booking
DB_PORT=3306

# Application Configuration

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## API Endpoints

### Treatments

- `GET /api/treatments` - List all treatments
- `POST /api/treatments` - Create new treatment
- `PUT /api/treatments/[id]` - Update treatment
- `DELETE /api/treatments/[id]` - Deactivate treatment

### Personnel

- `GET /api/personnel` - List all staff
- `POST /api/personnel` - Create new staff member
- `PUT /api/personnel/[id]` - Update staff member
- `DELETE /api/personnel/[id]` - Deactivate staff member

### Rooms

- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/[id]` - Update room
- `DELETE /api/rooms/[id]` - Set room to maintenance

### Bookings

- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Cancel booking

### Working Hours

- `GET /api/personnel/working-hours` - Get staff schedules
- `POST /api/personnel/working-hours` - Update staff schedule

## Docker Services

### MySQL Database

- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: spa_booking
- **User**: spa_user
- **Password**: spa_password

### phpMyAdmin

- **Image**: phpmyadmin/phpmyadmin:latest
- **Port**: 8080
- **Access**: http://localhost:8080

### Application (Development)

- **Port**: 3000
- **Hot Reload**: Enabled
- **Volume Mounting**: Source code mounted for development

## Troubleshooting

### MySQL Connection Issues

\`\`\`bash

# Check MySQL logs

docker-compose logs mysql

# Restart MySQL service

docker-compose restart mysql

# Reset database

npm run docker:reset
\`\`\`

### Application Issues

\`\`\`bash

# Check application logs

docker-compose logs app

# Rebuild application

docker-compose build app
docker-compose up -d app
\`\`\`

### Port Conflicts

If ports 3000, 3306, or 8080 are already in use, modify the ports in `docker-compose.yml`:

\`\`\`yaml
ports:

- "3001:3000" # Change external port
  \`\`\`

## Development

### Project Structure

\`\`\`
spa-booking-system/
├── app/ # Next.js app directory
│ ├── api/ # API routes
│ └── page.tsx # Main page
├── components/ # React components
├── lib/ # Utilities and types
├── docker/ # Docker configuration
│ └── mysql/init/ # Database initialization
├── scripts/ # Setup scripts
└── docker-compose.yml # Docker services
\`\`\`

### Adding New Features

1. Create API routes in `app/api/`
2. Add React components in `components/`
3. Update database schema in `docker/mysql/init/`
4. Test with Docker environment

## Production Deployment

### Using Docker

\`\`\`bash

# Build production image

docker build -t spa-booking-system .

# Run with production compose file

docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Environment Variables for Production

\`\`\`env
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-secure-password
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## License

MIT License - see LICENSE file for details.
