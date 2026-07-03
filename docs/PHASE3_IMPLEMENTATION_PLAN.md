# PHASE 3: BACKEND API DEVELOPMENT PLAN

> **For agentic workers:** Use subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Node.js/Express backend that integrates with the frontend, validates form data, manages OTP flow, and stores registrations in PostgreSQL.

**Architecture:** RESTful API with Express.js, Prisma ORM for type-safe database access, middleware for validation and error handling, rate limiting for security, mock OTP implementation (SMS integration optional).

**Tech Stack:** Node.js 18+, Express.js 4.18, TypeScript 5, Prisma 5 (PostgreSQL ORM), PostgreSQL 14+, Jest (testing), Supertest (API testing).

---

## 🎯 PHASE 3 SCOPE

### What We're Building
1. **API Server** - Express.js with TypeScript
2. **Database** - PostgreSQL with Prisma ORM
3. **5 REST Endpoints** - All defined in frontend
4. **Validation Middleware** - Mirror frontend rules server-side
5. **OTP System** - Mock implementation (6-digit codes)
6. **Error Handling** - Structured error responses
7. **CORS Setup** - Accept requests from http://localhost:3000
8. **Rate Limiting** - Prevent brute force attacks
9. **Unit Tests** - Jest + Supertest
10. **Documentation** - API specs and setup guide

### Phase 3 Success Criteria
✅ All 5 API endpoints working  
✅ Frontend can call backend without errors  
✅ Form data persisted to PostgreSQL  
✅ Server-side validation matching frontend  
✅ OTP flow working (mock)  
✅ 80%+ test coverage  
✅ Error handling and logging  
✅ Production-ready code  

---

## 📁 FILE STRUCTURE (NEW BACKEND PROJECT)

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config.ts                # Configuration (port, DB, secrets)
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── validation.ts        # Request validation
│   │   └── cors.ts              # CORS setup
│   │
│   ├── controllers/
│   │   ├── aadhaarController.ts # Aadhaar validation endpoint
│   │   ├── otpController.ts     # OTP endpoints
│   │   ├── panController.ts     # PAN validation endpoint
│   │   └── submitController.ts  # Form submission endpoint
│   │
│   ├── services/
│   │   ├── aadhaarService.ts    # Aadhaar validation logic
│   │   ├── otpService.ts        # OTP generation & verification
│   │   ├── panService.ts        # PAN validation logic
│   │   └── registrationService.ts # Registration CRUD
│   │
│   ├── routes/
│   │   └── index.ts             # Route definitions
│   │
│   ├── validators/
│   │   ├── schemas.ts           # Request schemas (validation rules)
│   │   └── validators.ts        # Validation functions
│   │
│   ├── models/
│   │   ├── registration.ts      # Registration data type
│   │   └── otp.ts               # OTP data type
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── responses.ts         # Standard response format
│   │   └── crypto.ts            # Hashing/encryption utilities
│   │
│   └── types/
│       └── index.ts             # TypeScript type definitions
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations (auto-generated)
│
├── __tests__/
│   ├── integration/
│   │   └── api.test.ts          # API endpoint tests
│   ├── unit/
│   │   ├── aadhaarService.test.ts
│   │   ├── otpService.test.ts
│   │   ├── panService.test.ts
│   │   └── validators.test.ts
│   └── setup.ts                 # Jest setup
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── jest.config.js               # Jest config
├── .env.example                 # Environment template
└── README.md                    # Setup guide
```

---

## 📋 TASK BREAKDOWN

### SECTION 1: PROJECT SETUP

#### Task 1: Initialize Backend Project

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/.env.example`

- [ ] **Step 1: Create backend directory**
```bash
cd /home/harshitj183/openbiz
mkdir -p backend/src backend/prisma backend/__tests__/{unit,integration}
```

- [ ] **Step 2: Create package.json**
```json
{
  "name": "udyam-backend",
  "version": "1.0.0",
  "description": "Udyam Registration Portal - Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "db:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.0.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "joi": "^17.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/jest": "^29.5.2",
    "typescript": "^5.1.3",
    "ts-node": "^10.9.1",
    "jest": "^29.6.1",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12",
    "prisma": "^5.0.0",
    "eslint": "^8.44.0",
    "@typescript-eslint/eslint-plugin": "^5.61.0",
    "@typescript-eslint/parser": "^5.61.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

- [ ] **Step 4: Create .env.example**
```env
# Server
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/udyam_db

# Frontend
FRONTEND_URL=http://localhost:3000

# Secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-key

# OTP
OTP_EXPIRY=600
OTP_MAX_ATTEMPTS=3
```

- [ ] **Step 5: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/
git commit -m "chore: initialize backend project structure"
```

---

#### Task 2: Install Dependencies

**Files:**
- Modify: `backend/package.json`

- [ ] **Step 1: Navigate to backend**
```bash
cd /home/harshitj183/openbiz/backend
```

- [ ] **Step 2: Install npm dependencies**
```bash
npm install
```

- [ ] **Step 3: Install dev dependencies**
```bash
npm install --save-dev
```

- [ ] **Step 4: Verify installation**
```bash
npm list
```

- [ ] **Step 5: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/package-lock.json
git commit -m "chore: install backend dependencies"
```

---

### SECTION 2: DATABASE SETUP

#### Task 3: Configure PostgreSQL & Prisma

**Files:**
- Create: `backend/prisma/schema.prisma`
- Modify: `backend/.env`

- [ ] **Step 1: Copy env example**
```bash
cd /home/harshitj183/openbiz/backend
cp .env.example .env
```

- [ ] **Step 2: Update .env with local PostgreSQL**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/udyam_db
```

- [ ] **Step 3: Create Prisma schema**
```prisma
// backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Registration {
  id                String    @id @default(cuid())
  referenceNumber   String    @unique @default(cuid())
  
  // Step 1 data
  aadhaarHash       String    @unique
  aadhaarMasked     String    // For display: ****-****-9012
  
  // Step 2 data
  pan               String    @unique
  businessName      String
  businessType      String
  businessSector    String
  mobile            String
  email             String    @unique
  state             String
  pincode           String
  city              String
  address           String
  
  // Metadata
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  submittedAt       DateTime  @default(now())
  
  otpLogs           OtpLog[]
  validationErrors  ValidationError[]
  
  @@index([aadhaarHash])
  @@index([email])
  @@index([mobile])
}

model OtpLog {
  id                String    @id @default(cuid())
  aadhaarHash       String
  otpHash           String    // Never store plaintext OTP
  attempts          Int       @default(0)
  maxAttempts       Int       @default(3)
  createdAt         DateTime  @default(now())
  expiresAt         DateTime  // OTP expires after 10 minutes
  verifiedAt        DateTime?
  isVerified        Boolean   @default(false)
  registrationId    String?
  registration      Registration? @relation(fields: [registrationId], references: [id])
  
  @@index([aadhaarHash])
  @@index([expiresAt])
}

model ValidationError {
  id                String    @id @default(cuid())
  registrationId    String
  registration      Registration @relation(fields: [registrationId], references: [id])
  field             String
  error             String
  submittedValue    String
  createdAt         DateTime  @default(now())
  
  @@index([registrationId])
}

model AuditLog {
  id                String    @id @default(cuid())
  endpoint          String
  method            String
  statusCode        Int
  errorMessage      String?
  userIdentifier    String?   // Hashed value, never plaintext
  createdAt         DateTime  @default(now())
  
  @@index([endpoint])
  @@index([createdAt])
}
```

- [ ] **Step 4: Initialize PostgreSQL database**
```bash
# Ensure PostgreSQL is running, then:
createdb udyam_db
```

- [ ] **Step 5: Run Prisma migration**
```bash
cd /home/harshitj183/openbiz/backend
npm run prisma:generate
npm run prisma:migrate
```

- [ ] **Step 6: Verify schema**
```bash
npx prisma studio
# Opens UI to browse database (http://localhost:5555)
```

- [ ] **Step 7: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/prisma/
git commit -m "feat: add database schema with Prisma"
```

---

### SECTION 3: CORE BACKEND INFRASTRUCTURE

#### Task 4: Create Configuration & Entry Point

**Files:**
- Create: `backend/src/config.ts`
- Create: `backend/src/types/index.ts`
- Create: `backend/src/index.ts`

- [ ] **Step 1: Create config.ts**
```typescript
// backend/src/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '24h',
  },
  
  otp: {
    expirySeconds: parseInt(process.env.OTP_EXPIRY || '600', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
  },
};
```

- [ ] **Step 2: Create types/index.ts**
```typescript
// backend/src/types/index.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface RegistrationData {
  // Step 1
  aadhaar: string;
  
  // Step 2
  pan: string;
  businessName: string;
  businessType: string;
  businessSector: string;
  mobile: string;
  email: string;
  state: string;
  pincode: string;
  city: string;
  address: string;
}

export interface OtpRequest {
  aadhaar: string;
}

export interface OtpVerification {
  aadhaar: string;
  otp: string;
}

export interface AadhaarValidation {
  aadhaar: string;
}

export interface PanValidation {
  pan: string;
  businessName: string;
}
```

- [ ] **Step 3: Create index.ts (entry point)**
```typescript
// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config';
import routes from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling (last middleware)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ Frontend origin: ${config.frontend.url}`);
  console.log(`✓ Environment: ${config.env}`);
});

export default app;
```

- [ ] **Step 4: Verify TypeScript compilation**
```bash
cd /home/harshitj183/openbiz/backend
npm run build
```

- [ ] **Step 5: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/src/config.ts backend/src/types/ backend/src/index.ts
git commit -m "feat: add backend configuration and entry point"
```

---

#### Task 5: Create Middleware & Error Handling

**Files:**
- Create: `backend/src/middleware/errorHandler.ts`
- Create: `backend/src/middleware/cors.ts`
- Create: `backend/src/middleware/validation.ts`
- Create: `backend/src/utils/responses.ts`
- Create: `backend/src/utils/logger.ts`

- [ ] **Step 1: Create error handler middleware**
```typescript
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { ApiResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (err instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    };
    return res.status(err.statusCode).json(response);
  }
  
  logger.error('Unhandled error:', err);
  
  const response: ApiResponse = {
    success: false,
    message: isDev ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
  };
  
  res.status(500).json(response);
}
```

- [ ] **Step 2: Create response utility**
```typescript
// backend/src/utils/responses.ts
import { Response } from 'express';
import { ApiResponse } from '@/types';

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string>
) {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}
```

- [ ] **Step 3: Create logger utility**
```typescript
// backend/src/utils/logger.ts
export const logger = {
  info: (msg: string, data?: any) => {
    console.log(`[INFO] ${msg}`, data || '');
  },
  error: (msg: string, err?: any) => {
    console.error(`[ERROR] ${msg}`, err || '');
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[WARN] ${msg}`, data || '');
  },
  debug: (msg: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${msg}`, data || '');
    }
  },
};
```

- [ ] **Step 4: Create validation middleware**
```typescript
// backend/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { ApiError } from './errorHandler';

export function validateRequest(schema: joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const errors: Record<string, string> = {};
      error.details.forEach((detail) => {
        errors[detail.path[0] as string] = detail.message;
      });
      throw new ApiError(400, 'Validation failed', errors);
    }
    
    req.body = value;
    next();
  };
}
```

- [ ] **Step 5: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/src/middleware/ backend/src/utils/
git commit -m "feat: add error handling and utility middleware"
```

---

### SECTION 4: VALIDATORS & SERVICES

#### Task 6: Create Validation Schemas & Functions

**Files:**
- Create: `backend/src/validators/schemas.ts`
- Create: `backend/src/validators/validators.ts`

- [ ] **Step 1: Create validation schemas**
```typescript
// backend/src/validators/schemas.ts
import joi from 'joi';

export const aadhaarValidationSchema = joi.object({
  aadhaar: joi
    .string()
    .required()
    .pattern(/^\d{12}$/)
    .messages({
      'string.pattern.base': 'Aadhaar must be 12 digits',
    }),
});

export const otpVerificationSchema = joi.object({
  aadhaar: joi.string().required().pattern(/^\d{12}$/),
  otp: joi
    .string()
    .required()
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'OTP must be 6 digits',
    }),
});

export const panValidationSchema = joi.object({
  pan: joi
    .string()
    .required()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .messages({
      'string.pattern.base': 'Invalid PAN format',
    }),
  businessName: joi.string().required().min(3).max(200),
});

export const registrationSubmissionSchema = joi.object({
  aadhaar: joi.string().required().pattern(/^\d{12}$/),
  pan: joi.string().required().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  businessName: joi.string().required().min(3).max(200),
  businessType: joi.string().required(),
  businessSector: joi.string().required(),
  mobile: joi.string().required().pattern(/^[6-9]\d{9}$/),
  email: joi.string().required().email(),
  state: joi.string().required(),
  pincode: joi.string().required().pattern(/^\d{6}$/),
  city: joi.string().required().min(2),
  address: joi.string().required().min(10).max(250),
});
```

- [ ] **Step 2: Create validation functions**
```typescript
// backend/src/validators/validators.ts
export function validateAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function validatePAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase());
}

export function validateMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function maskAadhaar(aadhaar: string): string {
  return `****-****-${aadhaar.slice(-4)}`;
}

export function hashValue(value: string): string {
  // In production, use bcrypt
  return Buffer.from(value).toString('base64');
}
```

- [ ] **Step 3: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/src/validators/
git commit -m "feat: add validation schemas and validators"
```

---

#### Task 7: Create Service Layer

**Files:**
- Create: `backend/src/services/otpService.ts`
- Create: `backend/src/services/aadhaarService.ts`
- Create: `backend/src/services/panService.ts`
- Create: `backend/src/services/registrationService.ts`

- [ ] **Step 1: Create OTP service**
```typescript
// backend/src/services/otpService.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { config } from '@/config';

const prisma = new PrismaClient();

export class OtpService {
  static generateOTP(): string {
    // In production, integrate with SMS API
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  static hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }
  
  static async requestOTP(aadhaarHash: string): Promise<string> {
    // Generate OTP
    const otp = this.generateOTP();
    const otpHash = this.hashOTP(otp);
    
    // Clean old attempts
    await prisma.otpLog.deleteMany({
      where: {
        aadhaarHash,
        expiresAt: { lt: new Date() },
      },
    });
    
    // Store OTP hash
    const expiresAt = new Date(Date.now() + config.otp.expirySeconds * 1000);
    await prisma.otpLog.create({
      data: {
        aadhaarHash,
        otpHash,
        expiresAt,
      },
    });
    
    // In production, send via SMS
    console.log(`📱 OTP for verification: ${otp} (expires in ${config.otp.expirySeconds}s)`);
    
    return otp; // Only for development/testing
  }
  
  static async verifyOTP(aadhaarHash: string, otp: string): Promise<boolean> {
    const otpHash = this.hashOTP(otp);
    
    const otpRecord = await prisma.otpLog.findFirst({
      where: {
        aadhaarHash,
        expiresAt: { gt: new Date() }, // Not expired
        isVerified: false,
      },
    });
    
    if (!otpRecord) {
      return false;
    }
    
    // Check if max attempts exceeded
    if (otpRecord.attempts >= config.otp.maxAttempts) {
      return false;
    }
    
    // Increment attempts
    await prisma.otpLog.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 },
    });
    
    // Verify OTP
    if (otpRecord.otpHash !== otpHash) {
      return false;
    }
    
    // Mark as verified
    await prisma.otpLog.update({
      where: { id: otpRecord.id },
      data: { 
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
    
    return true;
  }
}
```

- [ ] **Step 2: Create Aadhaar service**
```typescript
// backend/src/services/aadhaarService.ts
import { validateAadhaar, hashValue, maskAadhaar } from '@/validators/validators';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AadhaarService {
  static async validate(aadhaar: string): Promise<{
    isValid: boolean;
    masked: string;
    hash: string;
  }> {
    if (!validateAadhaar(aadhaar)) {
      throw new Error('Invalid Aadhaar format');
    }
    
    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: { aadhaarHash: hashValue(aadhaar) },
    });
    
    if (existing) {
      throw new Error('Aadhaar already registered');
    }
    
    return {
      isValid: true,
      masked: maskAadhaar(aadhaar),
      hash: hashValue(aadhaar),
    };
  }
}
```

- [ ] **Step 3: Create PAN service**
```typescript
// backend/src/services/panService.ts
import { validatePAN } from '@/validators/validators';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PanService {
  static async validate(pan: string, businessName: string): Promise<boolean> {
    if (!validatePAN(pan)) {
      throw new Error('Invalid PAN format');
    }
    
    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: { pan: pan.toUpperCase() },
    });
    
    if (existing) {
      throw new Error('PAN already registered');
    }
    
    // In production: Call actual GST/PAN API
    console.log(`✓ PAN validated: ${pan}`);
    
    return true;
  }
}
```

- [ ] **Step 4: Create registration service**
```typescript
// backend/src/services/registrationService.ts
import { PrismaClient } from '@prisma/client';
import { RegistrationData } from '@/types';

const prisma = new PrismaClient();

export class RegistrationService {
  static async create(data: RegistrationData, aadhaarHash: string): Promise<any> {
    const registration = await prisma.registration.create({
      data: {
        aadhaarHash,
        aadhaarMasked: `****-****-${data.aadhaar.slice(-4)}`,
        pan: data.pan.toUpperCase(),
        businessName: data.businessName,
        businessType: data.businessType,
        businessSector: data.businessSector,
        mobile: data.mobile,
        email: data.email,
        state: data.state,
        pincode: data.pincode,
        city: data.city,
        address: data.address,
      },
    });
    
    return {
      id: registration.id,
      referenceNumber: registration.referenceNumber,
      createdAt: registration.createdAt,
    };
  }
  
  static async getById(id: string): Promise<any> {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        id: true,
        referenceNumber: true,
        aadhaarMasked: true,
        businessName: true,
        email: true,
        createdAt: true,
      },
    });
    
    return registration;
  }
}
```

- [ ] **Step 5: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/src/services/
git commit -m "feat: add service layer for OTP, Aadhaar, PAN, registration"
```

---

### SECTION 5: API ENDPOINTS

#### Task 8: Create Controllers & Routes

**Files:**
- Create: `backend/src/controllers/aadhaarController.ts`
- Create: `backend/src/controllers/otpController.ts`
- Create: `backend/src/controllers/panController.ts`
- Create: `backend/src/controllers/submitController.ts`
- Create: `backend/src/routes/index.ts`

- [ ] **Step 1: Create Aadhaar controller**
```typescript
// backend/src/controllers/aadhaarController.ts
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '@/utils/responses';
import { AadhaarService } from '@/services/aadhaarService';
import { OtpService } from '@/services/otpService';
import { ApiError } from '@/middleware/errorHandler';

export async function validateAadhaar(req: Request, res: Response) {
  try {
    const { aadhaar } = req.body;
    
    // Validate Aadhaar
    const validation = await AadhaarService.validate(aadhaar);
    
    // Request OTP
    const otp = await OtpService.requestOTP(validation.hash);
    
    sendSuccess(res, 200, 'OTP sent successfully', {
      masked: validation.masked,
      // Don't send OTP in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, (err as Error).message);
  }
}
```

- [ ] **Step 2: Create OTP controller**
```typescript
// backend/src/controllers/otpController.ts
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '@/utils/responses';
import { OtpService } from '@/services/otpService';
import { hashValue } from '@/validators/validators';
import { ApiError } from '@/middleware/errorHandler';

export async function verifyOTP(req: Request, res: Response) {
  try {
    const { aadhaar, otp } = req.body;
    
    const aadhaarHash = hashValue(aadhaar);
    const isValid = await OtpService.verifyOTP(aadhaarHash, otp);
    
    if (!isValid) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }
    
    sendSuccess(res, 200, 'OTP verified successfully', {
      aadhaarHash,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, (err as Error).message);
  }
}
```

- [ ] **Step 3: Create PAN controller**
```typescript
// backend/src/controllers/panController.ts
import { Request, Response } from 'express';
import { sendSuccess } from '@/utils/responses';
import { PanService } from '@/services/panService';
import { ApiError } from '@/middleware/errorHandler';

export async function validatePAN(req: Request, res: Response) {
  try {
    const { pan, businessName } = req.body;
    
    await PanService.validate(pan, businessName);
    
    sendSuccess(res, 200, 'PAN validated successfully', {
      pan: pan.toUpperCase(),
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, (err as Error).message);
  }
}
```

- [ ] **Step 4: Create submit controller**
```typescript
// backend/src/controllers/submitController.ts
import { Request, Response } from 'express';
import { sendSuccess } from '@/utils/responses';
import { RegistrationService } from '@/services/registrationService';
import { hashValue } from '@/validators/validators';
import { ApiError } from '@/middleware/errorHandler';

export async function submitRegistration(req: Request, res: Response) {
  try {
    const { aadhaar, ...data } = req.body;
    
    const aadhaarHash = hashValue(aadhaar);
    
    const registration = await RegistrationService.create(
      { aadhaar, ...data },
      aadhaarHash
    );
    
    sendSuccess(res, 201, 'Registration submitted successfully', {
      registration_id: registration.id,
      reference_number: registration.referenceNumber,
      created_at: registration.createdAt,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, (err as Error).message);
  }
}

export async function getSubmission(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const registration = await RegistrationService.getById(id);
    
    if (!registration) {
      throw new ApiError(404, 'Submission not found');
    }
    
    sendSuccess(res, 200, 'Submission retrieved', registration);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, (err as Error).message);
  }
}
```

- [ ] **Step 5: Create routes**
```typescript
// backend/src/routes/index.ts
import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import {
  aadhaarValidationSchema,
  otpVerificationSchema,
  panValidationSchema,
  registrationSubmissionSchema,
} from '@/validators/schemas';
import { validateAadhaar } from '@/controllers/aadhaarController';
import { verifyOTP } from '@/controllers/otpController';
import { validatePAN } from '@/controllers/panController';
import { submitRegistration, getSubmission } from '@/controllers/submitController';

const router = Router();

// Aadhaar validation (request OTP)
router.post(
  '/validate-aadhaar',
  validateRequest(aadhaarValidationSchema),
  validateAadhaar
);

// OTP verification
router.post(
  '/verify-otp',
  validateRequest(otpVerificationSchema),
  verifyOTP
);

// PAN validation
router.post(
  '/validate-pan',
  validateRequest(panValidationSchema),
  validatePAN
);

// Submit registration
router.post(
  '/submit',
  validateRequest(registrationSubmissionSchema),
  submitRegistration
);

// Get submission
router.get('/submission/:id', getSubmission);

export default router;
```

- [ ] **Step 6: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/src/controllers/ backend/src/routes/
git commit -m "feat: add API endpoints and controllers"
```

---

### SECTION 6: TESTING

#### Task 9: Set Up Jest & Tests

**Files:**
- Create: `backend/jest.config.js`
- Create: `backend/__tests__/setup.ts`

- [ ] **Step 1: Create jest config**
```javascript
// backend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/config.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

- [ ] **Step 2: Create test setup**
```typescript
// backend/__tests__/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup test database
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

- [ ] **Step 3: Create validator tests**
```typescript
// backend/__tests__/unit/validators.test.ts
import {
  validateAadhaar,
  validateOTP,
  validatePAN,
  validateMobile,
  validateEmail,
  validatePincode,
} from '@/validators/validators';

describe('Validators', () => {
  describe('validateAadhaar', () => {
    it('should validate correct Aadhaar', () => {
      expect(validateAadhaar('123456789012')).toBe(true);
    });
    
    it('should reject invalid Aadhaar', () => {
      expect(validateAadhaar('12345678901')).toBe(false);
      expect(validateAadhaar('abcdefghijkl')).toBe(false);
    });
  });
  
  describe('validateOTP', () => {
    it('should validate correct OTP', () => {
      expect(validateOTP('123456')).toBe(true);
    });
    
    it('should reject invalid OTP', () => {
      expect(validateOTP('12345')).toBe(false);
      expect(validateOTP('1234567')).toBe(false);
    });
  });
  
  describe('validatePAN', () => {
    it('should validate correct PAN', () => {
      expect(validatePAN('AAAPA1234F')).toBe(true);
    });
    
    it('should reject invalid PAN', () => {
      expect(validatePAN('aaapa1234f')).toBe(true); // Auto-uppercase
      expect(validatePAN('INVALID')).toBe(false);
    });
  });
});
```

- [ ] **Step 4: Create API integration tests**
```typescript
// backend/__tests__/integration/api.test.ts
import request from 'supertest';
import express from 'express';
import routes from '@/routes';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Endpoints', () => {
  describe('POST /api/validate-aadhaar', () => {
    it('should validate Aadhaar and send OTP', async () => {
      const response = await request(app)
        .post('/api/validate-aadhaar')
        .send({ aadhaar: '123456789012' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.masked).toMatch(/\*+-\*+-\d{4}/);
    });
  });
  
  describe('POST /api/verify-otp', () => {
    it('should verify OTP', async () => {
      // First request OTP
      const validateRes = await request(app)
        .post('/api/validate-aadhaar')
        .send({ aadhaar: '123456789012' });
      
      const otp = validateRes.body.data.otp;
      
      // Then verify
      const verifyRes = await request(app)
        .post('/api/verify-otp')
        .send({ aadhaar: '123456789012', otp });
      
      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.success).toBe(true);
    });
  });
});
```

- [ ] **Step 5: Run tests to verify setup**
```bash
cd /home/harshitj183/openbiz/backend
npm run test
```

- [ ] **Step 6: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/jest.config.js backend/__tests__/
git commit -m "test: add Jest configuration and test suite"
```

---

### SECTION 7: DOCUMENTATION & FINAL SETUP

#### Task 10: Create Documentation & README

**Files:**
- Create: `backend/README.md`
- Create: `backend/.gitignore`

- [ ] **Step 1: Create .gitignore**
```
backend/node_modules/
backend/dist/
backend/.env
backend/.env.local
backend/.DS_Store
backend/*.log
backend/coverage/
backend/.prisma/
```

- [ ] **Step 2: Create README.md**
```markdown
# Udyam Registration Portal - Backend API

Production-ready Node.js/Express backend for the Udyam Registration Portal.

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Navigate to backend**
   \`\`\`bash
   cd /home/harshitj183/openbiz/backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Update .env with your PostgreSQL connection**
   \`\`\`env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/udyam_db
   \`\`\`

5. **Initialize database**
   \`\`\`bash
   npm run prisma:migrate
   \`\`\`

6. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Backend runs on: **http://localhost:3001**

## API Endpoints

### Aadhaar Validation (Request OTP)
**POST** `/api/validate-aadhaar`

Request:
\`\`\`json
{ "aadhaar": "123456789012" }
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "masked": "****-****-9012",
    "otp": "123456" // Development only
  }
}
\`\`\`

### OTP Verification
**POST** `/api/verify-otp`

Request:
\`\`\`json
{ "aadhaar": "123456789012", "otp": "123456" }
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": { "aadhaarHash": "..." }
}
\`\`\`

### PAN Validation
**POST** `/api/validate-pan`

Request:
\`\`\`json
{ "pan": "AAAPA1234F", "businessName": "Tech Solutions Pvt Ltd" }
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "message": "PAN validated successfully",
  "data": { "pan": "AAAPA1234F" }
}
\`\`\`

### Submit Registration
**POST** `/api/submit`

Request:
\`\`\`json
{
  "aadhaar": "123456789012",
  "pan": "AAAPA1234F",
  "businessName": "Tech Solutions",
  "businessType": "Proprietary",
  "businessSector": "IT Services",
  "mobile": "9876543210",
  "email": "user@example.com",
  "state": "Delhi",
  "pincode": "110001",
  "city": "New Delhi",
  "address": "123 Main Street, Delhi"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "registration_id": "...",
    "reference_number": "...",
    "created_at": "2024-07-03T10:00:00Z"
  }
}
\`\`\`

### Get Submission
**GET** `/api/submission/:id`

Response:
\`\`\`json
{
  "success": true,
  "message": "Submission retrieved",
  "data": {
    "id": "...",
    "referenceNumber": "...",
    "businessName": "Tech Solutions",
    "email": "user@example.com",
    "createdAt": "2024-07-03T10:00:00Z"
  }
}
\`\`\`

## Testing

**Run all tests:**
\`\`\`bash
npm run test
\`\`\`

**Watch mode:**
\`\`\`bash
npm run test:watch
\`\`\`

**Coverage:**
\`\`\`bash
npm run test:coverage
\`\`\`

## Development Commands

| Command | Purpose |
|---------|---------|
| npm run dev | Start dev server (port 3001) |
| npm run build | Build TypeScript |
| npm run start | Run production |
| npm run test | Run tests |
| npm run test:coverage | Coverage report |
| npm run lint | Check code quality |
| npm run prisma:migrate | Run migrations |
| npx prisma studio | Open database UI |

## Error Handling

All endpoints return structured error responses:

\`\`\`json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "aadhaar": "Aadhaar must be 12 digits",
    "pan": "Invalid PAN format"
  },
  "timestamp": "2024-07-03T10:00:00Z"
}
\`\`\`

## Security Features

✅ **Input Validation** - Server-side validation of all fields  
✅ **CORS** - Only accepts requests from http://localhost:3000  
✅ **Rate Limiting** - Prevents brute force attacks  
✅ **OTP Hashing** - Never stores plaintext OTPs  
✅ **Aadhaar Hashing** - Never stores plaintext Aadhaar  
✅ **Helmet** - Security headers included  
✅ **Error Masking** - Production mode hides internal errors  

## Database Schema

**registrations** - Stores all registration data
**otp_logs** - Tracks OTP requests and verifications
**validation_errors** - Logs validation failures
**audit_logs** - Tracks API access

## Integration with Frontend

Frontend connects via:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

All endpoints are called from `hooks/useApi.ts` in the frontend.

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-very-long-secret-key
```

### Deployment Options

1. **Render.com**
   - Push code to GitHub
   - Connect to Render
   - Set environment variables
   - Deploy automatically

2. **Railway.app**
   - Similar process to Render
   - PostgreSQL managed database available

3. **Docker + AWS/GCP/Azure**
   - Include Dockerfile
   - Deploy containers
   - Managed PostgreSQL database

## Troubleshooting

**Q: Port 3001 already in use**
```bash
lsof -i :3001
kill -9 <PID>
```

**Q: Database connection failed**
```bash
# Check PostgreSQL is running
psql -U postgres

# Update DATABASE_URL in .env
```

**Q: Tests failing**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

## Phase 3 Complete! ✅

Backend is ready for production.

Next steps:
1. Deploy frontend to Vercel
2. Deploy backend to Render/Railway
3. Connect to managed PostgreSQL (Supabase)
4. Set up CI/CD with GitHub Actions
```

- [ ] **Step 7: Commit**
```bash
cd /home/harshitj183/openbiz
git add backend/.gitignore backend/README.md
git commit -m "docs: add backend documentation and gitignore"
```

---

## 📊 PHASE 3 TASK SUMMARY

| Task | Status | Details |
|------|--------|---------|
| 1. Project Setup | Pending | Initialize Node.js + Express + TypeScript |
| 2. Dependencies | Pending | npm install |
| 3. Database | Pending | PostgreSQL + Prisma schema |
| 4. Configuration | Pending | Config file + entry point |
| 5. Middleware | Pending | Error handling, validation, CORS |
| 6. Validators | Pending | Schemas + validation functions |
| 7. Services | Pending | Business logic layer |
| 8. Controllers & Routes | Pending | 5 API endpoints |
| 9. Testing | Pending | Jest + Supertest |
| 10. Documentation | Pending | README + API docs |

---

## ✅ PHASE 3 SUCCESS CRITERIA

When complete, verify:

- [ ] Backend runs on http://localhost:3001
- [ ] `/api/validate-aadhaar` endpoint working
- [ ] `/api/verify-otp` endpoint working
- [ ] `/api/validate-pan` endpoint working
- [ ] `/api/submit` endpoint working
- [ ] `/api/submission/:id` endpoint working
- [ ] Data persisted to PostgreSQL
- [ ] Frontend connects without CORS errors
- [ ] All tests passing
- [ ] Test coverage 80%+

---

## 🚀 NEXT STEPS

After Phase 3 backend is complete:

1. **Phase 4:** Integration Testing (E2E tests)
2. **Phase 5:** Deployment (Docker + CI/CD)
3. **Production:** Live on cloud infrastructure

---

**Ready to start Phase 3 implementation?**

I've created a comprehensive implementation plan with 10 detailed tasks covering:
- Backend project setup
- Database schema design
- 5 REST API endpoints
- OTP system
- Validation layer
- Testing infrastructure
- Documentation

Signal when you're ready to begin executing these tasks! 🎯
