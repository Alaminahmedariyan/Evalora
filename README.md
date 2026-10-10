# Evalora Backend

AI-powered assessment platform backend built with Express, Prisma, and Better Auth. Enables recruiters to create coding/MCQ/written assessments, invite candidates, and evaluate submissions with automated and manual grading.

## 🔗 Live Links
- Live Frontend: https://evalora-client.vercel.app
- Live Backend: https://evalora-server.vercel.app
- API Documentation: https://evalora-server.vercel.app/api-docs

## 🔑 Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | alaminahmedariyan2022@gmail.com | ChangeMe123! |
| Candidate | candidate1@demo.com | Candidate@123 |
| Recruiter | candidate2@demo.com | Candidate@123 |

## ✨ Features
- **Multi-role authentication** — Admin, Recruiter, Candidate with role-based access control
- **Assessment builder** — Create assessments with MCQ, Coding, and Written problem types
- **Version control** — Assessment versioning with restore capability
- **Candidate invitations** — Email-based invitation flow with accept/decline
- **Real-time attempts** — Timed assessment attempts with auto-submit
- **Proctoring events** — Tab-switch detection and logging
- **Hybrid evaluation** — Auto-graded MCQ + manual grading for coding/written
- **Results & rankings** — Score computation, leaderboards, rank calculation
- **Subscription billing** — Stripe integration for PRO plan upgrades
- **Company verification** — Admin-verified company profiles
- **GDPR consents** — Marketing/analytics consent management
- **Notifications** — In-app notifications with read/unread tracking
- **File uploads** — Avatars, logos, resumes via Cloudinary
- **Email OTP** — Password reset and email verification via Resend/SMTP
- **OAuth login** — Google and GitHub authentication

## 🛠️ Tech Stack
- **Backend:** Node.js, Express 5, TypeScript, PostgreSQL, Prisma ORM
- **Authentication:** Better Auth (email/password + Google/GitHub OAuth)
- **Payments:** Stripe (checkout sessions, webhooks)
- **Email:** Resend (primary), Nodemailer/SMTP (fallback)
- **File Storage:** Cloudinary (avatars, logos, resumes)
- **Caching/Rate Limiting:** Redis (Upstash)
- **Validation:** Zod schemas
- **Security:** Helmet, CORS, Rate Limiting, Body Sanitization
- **Captcha:** hCaptcha (optional)
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm

## 📁 Project Structure
```
src/
├── app/
│   ├── config/           # Environment config (Zod validated)
│   ├── middlewares/      # Auth, upload, rate-limit, validation
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication (Better Auth)
│   │   ├── user/         # User management
│   │   ├── company/      # Company & subscriptions
│   │   ├── problem/      # Problem bank (MCQ, Coding, Written)
│   │   ├── assessment/   # Assessments & versions
│   │   ├── candidate/    # Candidate profiles
│   │   ├── attempt/      # Assessment attempts
│   │   ├── evaluation/   # Submission evaluation
│   │   ├── result/       # Results & rankings
│   │   ├── invitation/   # Candidate invitations
│   │   ├── payment/      # Stripe payments
│   │   ├── notification/ # In-app notifications
│   │   ├── consent/      # GDPR/privacy consents
│   │   ├── admin/        # Admin dashboard
│   │   └── webhook/      # Stripe webhooks
│   └── routes/           # Route aggregation
├── lib/                  # Prisma, Cloudinary, Stripe, Redis clients
├── app.ts                # Express app setup
└── server.ts             # Server entry point
```

## 🚀 Local Setup
```bash
# backend
git clone <backend-repo>
cd <backend>
pnpm install

# create .env with required keys (see .env.example)
cp .env.example .env
# edit .env with your credentials

pnpm generate      # Generate Prisma client
pnpm migrate       # Run migrations
pnpm seed          # Seed demo accounts
pnpm dev           # Start dev server on http://localhost:5000

# frontend (separate repo)
git clone <frontend-repo>
cd <frontend>
pnpm install
pnpm dev           # Start on http://localhost:3000
```

## API Base URL
```
/api/v1
```
All endpoints below are prefixed with `/api/v1`.

## API Endpoints

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API status |
| GET | `/health` | Health check (DB connectivity) |

### Authentication (`/auth`)
Better Auth handles these routes automatically under `/api/auth/*splat`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout (protected) |
| POST | `/auth/refresh-token` | Refresh session (protected) |
| POST | `/auth/send-otp` | Send email OTP |
| POST | `/auth/verify-email-otp` | Verify email OTP |
| POST | `/auth/reset-password-otp` | Reset password with OTP |
| POST | `/auth/change-password` | Change password (protected) |
| GET | `/auth/me` | Get current user (protected) |

**Supported OAuth:** Google, GitHub

### Users (`/users`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PATCH | `/users/me` | Any | Update own profile (supports image upload) |
| GET | `/users/` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| PATCH | `/users/:id/role` | Admin | Update user role |
| PATCH | `/users/:id/status` | Admin | Update user status |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/users/me/export` | Any | Export own data (GDPR) |
| POST | `/users/me/delete` | Any | Delete own account |

### Companies (`/companies`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/companies/register` | Any | Register company (promotes to RECRUITER) |
| GET | `/companies/` | Public | Get all verified companies |
| GET | `/companies/me` | Any | Get own company |
| PATCH | `/companies/me` | Recruiter | Update company (supports logo upload) |
| POST | `/companies/me/request-verification` | Recruiter | Request admin verification |
| GET | `/companies/:id` | Public | Get company by ID |
| PATCH | `/companies/:id/verify` | Admin | Verify company |
| DELETE | `/companies/:id` | Any | Delete company |
| GET | `/companies/me/subscription` | Recruiter | Get subscription |
| PATCH | `/companies/me/subscription` | Recruiter | Update subscription |
| POST | `/companies/me/subscription/cancel` | Recruiter | Cancel subscription |

### Problems (`/problems`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/problems/` | Recruiter | Create problem |
| GET | `/problems/` | Recruiter/Admin | List problems |
| GET | `/problems/:id` | Recruiter/Admin | Get problem |
| PATCH | `/problems/:id` | Recruiter | Update problem |
| DELETE | `/problems/:id` | Recruiter | Delete problem |

### Assessments (`/assessments`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/assessments/` | Recruiter | Create assessment |
| GET | `/assessments/` | Recruiter/Admin | List assessments |
| GET | `/assessments/:id` | Recruiter/Admin | Get assessment |
| PATCH | `/assessments/:id` | Recruiter | Update assessment (DRAFT only) |
| PATCH | `/assessments/:id/publish` | Recruiter | Publish assessment |
| PATCH | `/assessments/:id/close` | Recruiter | Close assessment |
| DELETE | `/assessments/:id` | Recruiter | Delete assessment |
| POST | `/assessments/:id/versions` | Recruiter | Create new version |
| GET | `/assessments/:id/versions` | Recruiter/Admin | List versions |
| PATCH | `/versions/:id/restore` | Recruiter | Restore old version |

### Candidates (`/candidates`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/candidates/me` | Candidate | Get own profile |
| PATCH | `/candidates/me` | Candidate | Update profile (supports resume upload) |
| GET | `/candidates/` | Recruiter/Admin | List candidates |
| GET | `/candidates/:id` | Recruiter/Admin | Get candidate profile |

### Attempts (`/attempts`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/attempts/start` | Candidate | Start assessment attempt |
| GET | `/attempts/me` | Candidate | List my attempts |
| GET | `/attempts/:id` | Any | Get attempt |
| PUT | `/attempts/:id/submissions/:problemId` | Candidate | Save submission |
| POST | `/attempts/:id/submit` | Candidate | Submit attempt |
| POST | `/attempts/:id/proctoring-events` | Candidate | Record proctoring event |
| GET | `/attempts/:id/proctoring-events` | Any | Get proctoring events |
| GET | `/attempts/:id/proctoring-events/:eventId` | Any | Get single proctoring event |

### Evaluations (`/evaluations`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/evaluations/attempts/:attemptId/submissions` | Recruiter/Admin | Get submissions |
| GET | `/evaluations/assessments/:assessmentId/pending` | Recruiter/Admin | Get pending evaluations |
| GET | `/evaluations/submissions/:id` | Recruiter/Admin | Get submission |
| PATCH | `/evaluations/submissions/:id` | Recruiter/Admin | Evaluate submission |

### Results (`/results`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/results/attempts/:attemptId` | Any | Get result by attempt |
| GET | `/results/assessments/:assessmentId` | Recruiter/Admin | Get results for assessment |
| POST | `/results/assessments/:assessmentId/compute-ranks` | Recruiter | Compute ranks |
| PATCH | `/results/assessments/:assessmentId/release` | Recruiter | Release results to candidates |

### Invitations (`/invitations`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/invitations/assessments/:assessmentId` | Recruiter | Invite candidates |
| GET | `/invitations/assessments/:assessmentId` | Recruiter/Admin | List invitations |
| GET | `/invitations/me` | Candidate | My invitations |
| GET | `/invitations/:id` | Any | Get invitation |
| POST | `/invitations/:id/accept` | Candidate | Accept invitation |
| POST | `/invitations/:id/decline` | Candidate | Decline invitation |
| DELETE | `/invitations/:id` | Recruiter | Cancel invitation |

### Payments (`/payments`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/checkout` | Recruiter | Create Stripe checkout session |
| GET | `/payments/me` | Recruiter | My payments |
| GET | `/payments/` | Admin | All payments |
| GET | `/payments/:id` | Any | Get payment |
| POST | `/payments/:id/sync` | Recruiter/Admin | Sync payment status with Stripe |

### Notifications (`/notifications`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications/me` | Any | My notifications |
| GET | `/notifications/unread-count` | Any | Unread count |
| PATCH | `/notifications/read-all` | Any | Mark all as read |
| PATCH | `/notifications/:id/read` | Any | Mark as read |
| DELETE | `/notifications/:id` | Any | Delete notification |

### Admin (`/admin`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/dashboard-stats` | Admin | Dashboard statistics |
| GET | `/admin/audit-logs` | Admin | Audit logs |

### Consents (`/consents`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/consents/me` | Any | My consents |
| PATCH | `/consents/me` | Any | Update consent |
| DELETE | `/consents/me/:consentType` | Any | Revoke consent |

### Webhooks (`/webhooks`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/webhooks/stripe` | Stripe | Stripe webhook handler |

## Roles
| Role | Description |
|------|-------------|
| `CANDIDATE` | Can take assessments, manage profile |
| `RECRUITER` | Can create problems, assessments, invite candidates, manage company |
| `ADMIN` | Full access, user management, verification, dashboard |

## File Uploads
| Field | Route | Max Size | Destination |
|-------|-------|----------|-------------|
| `image` | `PATCH /users/me` | 5 MB | Cloudinary `avatars/` |
| `logo` | `PATCH /companies/me` | 5 MB | Cloudinary `company-logos/` |
| `resume` | `PATCH /candidates/me` | 20 MB | Cloudinary `resumes/` |

## Response Format
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error description.",
  "errors": [],
  "errorCode": "ERROR_CODE"
}
```

## Scripts
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm seed` | Seed database |
| `pnpm generate` | Generate Prisma client |
| `pnpm migrate` | Run migrations |
| `pnpm migrate:deploy` | Deploy migrations |
| `pnpm studio` | Open Prisma Studio |
| `pnpm reset` | Reset database |
| `pnpm db:setup` | Full DB setup (generate + migrate + seed) |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm format` | Format code |