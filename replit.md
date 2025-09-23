# QBIDS.KG - Penny Auction Platform

## Project Overview
QBIDS.KG is a live penny auction platform built for the Kyrgyzstan market. Users can participate in real-time auctions to win premium products like iPhones, MacBooks, and other electronics at significantly reduced prices.

## Architecture
- **Frontend**: React + TypeScript with Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: Socket.io for live bidding
- **Authentication**: Express sessions with Passport.js
- **UI**: Tailwind CSS + Radix UI components

## Key Features
- Live penny auctions with real-time bidding
- Pre-bidding system for upcoming auctions
- User registration and authentication
- Admin panel for auction management
- Bot system for enhanced auction dynamics
- Multi-language support (Russian, English, Georgian)
- Responsive design optimized for mobile and desktop

## Development Setup
1. Database: PostgreSQL (automatically configured)
2. Environment: All required environment variables are set
3. Dependencies: Node.js packages installed via npm
4. Development server runs on port 5000
5. Database migrations handled via `npm run db:push`

## Recent Changes (Sept 23, 2025)
- ✅ Imported GitHub repository successfully
- ✅ Configured PostgreSQL database with all required tables
- ✅ Updated Vite configuration for Replit proxy compatibility
- ✅ Set up development workflow on port 5000
- ✅ Verified all API endpoints and real-time features working
- ✅ Configured deployment settings for production

## Current Status
- ✅ Development environment fully functional
- ✅ Frontend and backend integrated and working
- ✅ Database schema deployed and operational
- ✅ Socket.io real-time features working
- ✅ Ready for production deployment

## Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and i18n
├── server/          # Express backend
│   ├── services/    # Business logic services
│   └── routes.ts    # API routes
├── shared/          # Shared types and schema
└── migrations/      # Database migrations
```

## User Preferences
- Build system: Vite (React + TypeScript)
- Package manager: npm
- Database: PostgreSQL with Drizzle ORM
- Deployment: Autoscale (stateless web app)