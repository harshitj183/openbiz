# PROJECT ARCHITECTURE & TECH STACK DECISIONS

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                   UDYAM REGISTRATION PORTAL CLONE               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PHASE 1: Web Scraping                                           │
│  ├─ Python + BeautifulSoup4 + Playwright                        │
│  ├─ Ethical scraping with fallback schema                       │
│  └─ Output: schema_udyam.json (single source of truth)          │
│                                                                   │
│  PHASE 2: Frontend (React/Next.js)                              │
│  ├─ Next.js 14 + React 18 + TypeScript                          │
│  ├─ Dynamic form rendering from schema                          │
│  ├─ Real-time client-side validation                            │
│  ├─ Tailwind CSS + Shadcn/ui components                         │
│  └─ Responsive mobile-first design                              │
│                                                                   │
│  PHASE 3: Backend (Node.js/Express)                             │
│  ├─ Express.js + TypeScript                                     │
│  ├─ Prisma ORM + PostgreSQL                                     │
│  ├─ REST API with server-side validation                        │
│  ├─ Input sanitization & security                               │
│  └─ Database persistence                                        │
│                                                                   │
│  PHASE 4: Testing                                               │
│  ├─ Frontend: Jest + React Testing Library                      │
│  ├─ Backend: Jest + Supertest                                   │
│  ├─ E2E: Playwright                                             │
│  └─ 80%+ code coverage                                          │
│                                                                   │
│  PHASE 5: Deployment                                            │
│  ├─ Docker containers (all services)                            │
│  ├─ Frontend: Vercel                                            │
│  ├─ Backend: Render/Railway                                     │
│  ├─ Database: Supabase (PostgreSQL)                             │
│  └─ CI/CD: GitHub Actions                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ TECH STACK RATIONALE

### PHASE 1: Web Scraping
**Choice: Python + BeautifulSoup4 + Playwright**

**Why Python?**
- Quick prototyping and powerful string manipulation
- Rich ecosystem for web scraping
- Easy to parse and transform data

**Why BeautifulSoup4?**
- Simple HTML parsing API
- Perfect for structured form extraction
- Lower overhead than Scrapy for small-scale projects

**Why Playwright?**
- Handles JavaScript-rendered content
- Headless browser for realistic page loading
- Better than Puppeteer for Python projects
- Automatic waiting for network idle

**Alternatives Considered:**
- ❌ Scrapy: Overkill for single-source scraping
- ❌ Selenium: Heavier, slower than Playwright
- ❌ Node.js Puppeteer: Already using Python for quick turnaround

---

### PHASE 2: Frontend
**Choice: Next.js 14 + React 18 + TypeScript**

**Why Next.js?**
- ✅ Full-stack framework (API routes, file-based routing)
- ✅ Built-in optimization (Image, Font, Script)
- ✅ SSR + Static generation options
- ✅ Perfect for take-home assignments
- ✅ Easy deployment to Vercel

**Why React 18?**
- ✅ Latest features (Suspense, transitions)
- ✅ Better performance out of the box
- ✅ Industry standard

**Why TypeScript?**
- ✅ Type safety for form validation
- ✅ Catches bugs at compile time
- ✅ Shows professional code quality

**Why Tailwind CSS?**
- ✅ Rapid responsive UI development
- ✅ Mobile-first approach
- ✅ Consistent design system

**Why Shadcn/ui?**
- ✅ Beautifully designed components
- ✅ Built on Radix UI (accessibility-first)
- ✅ Easy to customize
- ✅ Perfect for professional interviews

**Alternatives Considered:**
- ❌ Vanilla React: No SSR benefits
- ❌ Vue/Svelte: Less ecosystem support for production
- ❌ Bootstrap: Less modern styling approach

---

### PHASE 3: Backend
**Choice: Node.js + Express + TypeScript + Prisma**

**Why Node.js/Express?**
- ✅ Same team can write frontend + backend (JavaScript/TypeScript)
- ✅ Lightweight, minimal boilerplate
- ✅ Perfect for REST APIs
- ✅ Matches Next.js tech stack

**Why TypeScript?**
- ✅ Same type system as frontend
- ✅ Catches API contract mismatches early

**Why Prisma ORM?**
- ✅ Type-safe database queries
- ✅ Auto-generated schema migrations
- ✅ Excellent DX with VS Code integration
- ✅ Built-in validation

**Why PostgreSQL?**
- ✅ Relational data model (perfect for forms)
- ✅ ACID compliance for transactional safety
- ✅ JSON support for flexible schema
- ✅ Free tier on Supabase for production

**Alternatives Considered:**
- ❌ Python FastAPI: Extra language complexity
- ❌ MongoDB: Overkill for structured form data
- ❌ MySQL: PostgreSQL is more powerful

---

### PHASE 4: Testing
**Choice: Jest + React Testing Library + Supertest**

**Why Jest?**
- ✅ Zero config, works everywhere
- ✅ Fast parallel testing
- ✅ Great snapshot testing for UI
- ✅ Works for both frontend and backend

**Why React Testing Library?**
- ✅ Tests behavior, not implementation
- ✅ Best practices enforced
- ✅ Accessibility-first approach

**Why Supertest?**
- ✅ Easy HTTP assertion for Express APIs
- ✅ Minimal setup required

**Alternatives Considered:**
- ❌ Vitest: Emerging, less stable in 2026
- ❌ Mocha + Chai: More verbose setup

---

### PHASE 5: Deployment
**Choice: Docker + Vercel (FE) + Render (BE) + Supabase (DB)**

**Why Docker?**
- ✅ Consistent local/production environment
- ✅ Easy to replicate setup
- ✅ Shows DevOps understanding

**Why Vercel for Frontend?**
- ✅ Native Next.js support
- ✅ Zero-config deployment
- ✅ Free tier with great performance

**Why Render for Backend?**
- ✅ Simple deployment from GitHub
- ✅ Free tier sufficient for demo
- ✅ Environment variable management built-in

**Why Supabase for Database?**
- ✅ PostgreSQL managed service
- ✅ Free tier (500MB, 2 connections)
- ✅ Real-time subscriptions (bonus feature)

---

## 🔄 DATA FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  USER BROWSER (Frontend)                                     │
│  ├─ Loads Next.js App                                       │
│  ├─ Renders Form from schema_udyam.json                     │
│  └─ Displays Progress Tracker (Step 1/2)                    │
│                                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP/JSON
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  NEXT.JS FRONTEND + API ROUTES                              │
│  ├─ /pages/step1 → Step 1 form                              │
│  ├─ /pages/step2 → Step 2 form                              │
│  ├─ /api/submit-step1 → Calls backend                       │
│  └─ /api/submit-step2 → Calls backend                       │
│                                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ CORS-enabled HTTP
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  EXPRESS BACKEND (Node.js)                                   │
│  ├─ POST /api/validate-aadhaar                              │
│  ├─ POST /api/verify-otp                                   │
│  ├─ POST /api/validate-pan                                 │
│  ├─ POST /api/submit (validation + DB insert)              │
│  └─ GET /api/submission/:id                                │
│                                                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ Prisma ORM
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  POSTGRESQL DATABASE                                         │
│  ├─ submissions table (aadhaar, pan, business_name...)      │
│  ├─ otp_logs table (for audit trail)                        │
│  ├─ validation_errors table (for debugging)                 │
│  └─ indexes on (aadhaar, pan, email)                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 DATABASE SCHEMA (PostgreSQL)

```sql
-- Primary submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Step 1
  aadhaar_hash VARCHAR(64) NOT NULL,      -- Hash for security
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  otp_verified_at TIMESTAMP,
  
  -- Step 2
  pan VARCHAR(10) NOT NULL,
  pan_name VARCHAR(100) NOT NULL,
  business_name VARCHAR(200) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  business_sector VARCHAR(50) NOT NULL,
  
  -- Contact
  mobile VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Address
  state VARCHAR(50) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  
  CONSTRAINT unique_pan_email UNIQUE(pan, email)
);

-- OTP audit trail
CREATE TABLE otp_logs (
  id SERIAL PRIMARY KEY,
  aadhaar_hash VARCHAR(64) NOT NULL,
  otp_hash VARCHAR(64) NOT NULL,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (aadhaar_hash) REFERENCES submissions(aadhaar_hash)
);

-- Validation errors for debugging
CREATE TABLE validation_errors (
  id SERIAL PRIMARY KEY,
  submission_id UUID,
  field_name VARCHAR(100),
  error_message TEXT,
  user_input VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);
```

---

## 🔐 SECURITY CONSIDERATIONS

### Phase 2 (Frontend)
- ✅ Client-side validation (UX enhancement)
- ✅ Never send sensitive data in logs
- ✅ HTTPS only (automatic on Vercel)
- ✅ CSRF tokens for form submissions
- ✅ Content Security Policy headers

### Phase 3 (Backend)
- ✅ Server-side validation (always!)
- ✅ Hash Aadhaar/PAN (never store plaintext)
- ✅ Rate limiting on API endpoints
- ✅ Input sanitization (SQL injection prevention)
- ✅ Environment variables for secrets
- ✅ CORS configured properly
- ✅ Authentication for future phases

### Phase 5 (Deployment)
- ✅ Docker image scanning for vulnerabilities
- ✅ Secrets in environment variables (not in code)
- ✅ Database backup strategy
- ✅ SSL/TLS certificates (automatic on Vercel/Render)

---

## ✅ CHECKLIST: ARCHITECTURE REVIEW

- [x] Phase 1: Python scraper (isolated, single responsibility)
- [x] Phase 2: React frontend (dynamic rendering from schema)
- [x] Phase 3: Express backend (REST API, database)
- [x] Phase 4: Jest testing (unit + integration)
- [x] Phase 5: Docker + deployment
- [x] Security: Input validation everywhere
- [x] Database: Proper schema with constraints
- [x] Error handling: Graceful fallbacks

---

## 📊 TECHNOLOGY MATRIX

| Area | Technology | Version | Reason |
|------|-----------|---------|--------|
| **Scraping** | Python + BeautifulSoup4 | 3.11 | Fast iteration |
| **Frontend** | Next.js | 14 | Full-stack benefits |
| **Frontend** | React | 18 | Industry standard |
| **Frontend** | TypeScript | 5.x | Type safety |
| **Frontend** | Tailwind CSS | 3.x | Rapid UI dev |
| **Frontend** | Shadcn/ui | Latest | Professional components |
| **Backend** | Express | 4.x | Lightweight |
| **Backend** | TypeScript | 5.x | Type safety |
| **Backend** | Prisma | 5.x | Type-safe ORM |
| **Database** | PostgreSQL | 14+ | Relational data |
| **Testing** | Jest | 29.x | Zero config |
| **Testing** | React Testing Library | Latest | Behavior testing |
| **Testing** | Supertest | 6.x | HTTP assertions |
| **Deployment** | Docker | Latest | Containerization |
| **Frontend Deploy** | Vercel | Managed | Next.js native |
| **Backend Deploy** | Render | Managed | Easy setup |
| **Database** | Supabase | PostgreSQL | Managed DB |

---

**Next Step:** Ready to proceed with **PHASE 2: Responsive UI Development**? 🚀
