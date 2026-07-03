# Udyam Registration Portal Clone

> A full-stack web application replicating the Indian Government's Udyam Registration Portal for MSME (Micro, Small, and Medium Enterprises) registration.

## Overview

This project is a complete implementation of the Udyam Registration Portal, featuring a multi-step form system with Aadhaar verification, OTP authentication, PAN validation, and business registration. Built with modern web technologies and best practices for production deployment.

**Live Demo:** [Coming Soon]  
**Tech Stack:** Next.js 14, Express.js, PostgreSQL, TypeScript, Tailwind CSS

---

## Features

### Core Functionality
- **Multi-step Registration Flow**: Step 1 (Aadhaar/OTP) → Step 2 (Business Details) → Success
- **Real-time Validation**: Client-side and server-side validation with instant feedback
- **Secure Authentication**: Aadhaar verification with OTP authentication
- **PAN Verification**: Business PAN card validation
- **Responsive Design**: Mobile-first UI using Tailwind CSS
- **Mock API Support**: Demo mode with fallback responses (OTP: `123456`)

### Technical Features
- **Type-safe Development**: Full TypeScript implementation
- **Form Schema**: JSON-based form configuration extracted from official portal
- **Database Integration**: PostgreSQL with Prisma ORM
- **Testing Suite**: Jest + React Testing Library (80%+ coverage)
- **Docker Support**: Containerized deployment
- **CI/CD Pipeline**: GitHub Actions for automated testing

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Testing:** Jest, React Testing Library

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Jest, Supertest

### DevOps
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Project Structure

```
openbiz/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and schemas
│   └── types/              # TypeScript types
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── validators/     # Input validation
│   ├── prisma/             # Database schema
│   └── __tests__/          # Test suites
│
├── scraper/                 # Web scraping scripts
│   └── udyam_scraper.py    # Form schema extractor
│
├── schema/                  # JSON form configuration
│   └── schema_udyam.json   # Extracted form structure
│
├── docs/                    # Documentation
└── docker-compose.yml       # Multi-container setup
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Python 3.9+ (for scraper)
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/harshitj183/openbiz.git
cd openbiz
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Frontend runs on `http://localhost:3000`

3. **Backend Setup** (Optional - frontend has mock API)
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npx prisma migrate dev
npm run dev
```
Backend runs on `http://localhost:3001`

### Quick Start with Docker
```bash
docker-compose up
```

---

## Usage

### Demo Mode (No Backend Required)
The frontend includes mock API responses for testing:
1. Navigate to `http://localhost:3000`
2. Enter any 12-digit Aadhaar number
3. Check consent and click "Send OTP"
4. Enter OTP: `123456`
5. Complete Step 2 with any valid data
6. View success page

### With Backend
Set `NEXT_PUBLIC_API_URL=http://localhost:3001/api` in `frontend/.env.local`

---

## Form Validation

| Field | Pattern | Example |
|-------|---------|---------|
| Aadhaar | 12 digits | `123456789012` |
| OTP | 6 digits | `123456` |
| PAN | 5 letters + 4 digits + 1 letter | `ABCDE1234F` |
| Mobile | 10 digits (starts with 6-9) | `9876543210` |
| Email | Standard email format | `user@example.com` |
| PIN Code | 6 digits | `110001` |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/validate-aadhaar` | POST | Initiate Aadhaar verification |
| `/api/verify-otp` | POST | Verify OTP code |
| `/api/validate-pan` | POST | Validate PAN number |
| `/api/submit` | POST | Submit registration |
| `/api/submission/:id` | GET | Retrieve submission |

---

## Testing

### Run All Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: API endpoint testing
- **Validation Tests**: Form validation logic

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render/Railway)
```bash
cd backend
# Push to GitHub and connect to Render
# Set environment variables in dashboard
```

### Docker Deployment
```bash
docker-compose up -d --build
```

---

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_MOCK_API=true
```

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/udyam
NODE_ENV=development
JWT_SECRET=your-secret-key
```

---

## Development Phases

- [x] **Phase 1**: Web scraping and schema extraction
- [x] **Phase 2**: Frontend implementation with Next.js
- [x] **Phase 3**: Backend API with Express and Prisma
- [x] **Phase 4**: Testing suite setup
- [x] **Phase 5**: Docker and CI/CD configuration

---

## Security Features

- Input sanitization on client and server
- Rate limiting on API endpoints
- Aadhaar/PAN data hashing
- Environment-based secrets management
- CSRF protection middleware
- Secure HTTP headers (Helmet.js)

---

## Contributing

This is an educational project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Submit a pull request

---

## License

This project is for educational purposes. Please respect the Udyam Registration Portal's terms of service and follow ethical web scraping guidelines.

---

## Acknowledgments

- **Udyam Registration Portal**: Official Government of India portal for MSME registration
- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Modern database toolkit

---

## Contact

**Developer**: Harshit Jaiswal  
**GitHub**: [@harshitj183](https://github.com/harshitj183)  
**Project**: [github.com/harshitj183/openbiz](https://github.com/harshitj183/openbiz)

---

*Last Updated: July 2026*
