# AdShrtPro - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Features](#user-features)
4. [Admin Features](#admin-features)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Configuration](#configuration)
8. [Security](#security)

---

## Overview

**AdShrtPro** is a professional URL shortening and analytics platform designed for monetization. It combines link management with an earning system, allowing users to shorten URLs, track analytics, and earn rewards through various activities.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TailwindCSS, shadcn/ui |
| Backend | Express.js, Node.js |
| State Management | TanStack Query (React Query) |
| Routing | Wouter (client), Express Router (server) |
| Authentication | Session-based with bcrypt password hashing |
| Storage | In-memory (MemStorage) - easily swappable to PostgreSQL |
| Styling | TailwindCSS with dark/light theme support |

### Key Capabilities
- URL shortening with custom aliases and expiration
- Click analytics with geographic and device tracking
- QR code generation with customization
- Earning system with tasks, referrals, and offerwalls
- Blog system for content marketing/SEO
- Admin panel for complete platform management
- PWA support for mobile installation

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Running the Application
```bash
npm run dev
```
The application starts on **port 5000**.

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `DATABASE_URL` | PostgreSQL connection string (if using DB) | Optional |

---

## User Features

### 1. URL Shortening

**Location:** Homepage (`/`) and Dashboard (`/dashboard`)

**Features:**
- Shorten any valid URL
- Optional custom alias (3-20 characters)
- Expiration options: 1 hour, 24 hours, 7 days, 30 days, 90 days, or never
- Rate limiting: 250 links per IP per month

**Bulk Import:**
- Import up to 50 URLs at once
- Available in dashboard for logged-in users
- Shows success/failure status for each URL

### 2. Dashboard

**Location:** `/dashboard`

**Features:**
- View all shortened links
- Copy short URLs to clipboard
- Delete links
- See creation dates
- Bulk import functionality

### 3. Analytics

**Location:** `/analytics`

**Unlock Mechanism:**
- Analytics require "watching an ad" to unlock (simulated)
- Once unlocked, analytics are available for 1 hour
- Each link must be unlocked separately
- Admins bypass the unlock requirement

**Analytics Data:**
- Total click count
- Clicks by country (with flags)
- Clicks by device type
- Clicks by browser
- Clicks by referrer
- Click trend graph over time
- Recent click history

### 4. QR Codes

**Location:** `/qr-codes`

**Features:**
- Generate QR codes for any shortened link
- Customize foreground and background colors
- Download as PNG
- Same unlock mechanism as analytics

### 5. Earning System

**Location:** `/earn` and sub-pages

#### 5.1 Overview (`/earn`)
- Current balance display
- Total earned lifetime
- Pending withdrawals
- Quick access to all earning methods

#### 5.2 Tasks (`/earn/tasks`)
- Complete manual tasks for rewards
- Submit proof (URL or screenshot links)
- Task types: social media follows, reviews, etc.
- Social verification task for referral eligibility

#### 5.3 Offerwalls (`/earn/offerwalls`)
- CPAGrip integration
- AdBlueMedia integration
- Complete offers for cryptocurrency rewards
- Postback URLs for automatic crediting

#### 5.4 Referrals (`/earn/referrals`)
- Unique referral code per user
- Share referral link
- Both parties must be socially verified
- Referee must create 3+ links
- $0.10 reward for both when conditions met

#### 5.5 Withdrawals (`/earn/withdraw`)
- Minimum withdrawal: $1.00
- Maximum withdrawal: $100.00
- FaucetPay integration
- Supported cryptocurrencies:
  - Bitcoin (BTC)
  - Litecoin (LTC)
  - Dogecoin (DOGE)
  - TRON (TRX)
  - USDT (TRC20)
  - Solana (SOL)

### 6. User Profile

**Location:** `/profile`

**Features:**
- View account information
- Edit Telegram username
- See email verification status
- View referral code

### 7. Authentication

**Pages:**
- Login: `/login`
- Register: `/register`
- Forgot Password: `/forgot-password`
- Reset Password: `/reset-password`
- Email Verification: `/verify-email`

**Features:**
- Email/password authentication
- Optional Telegram username on registration
- Email verification system
- Password reset with secure tokens
- Session-based authentication

### 8. Blog

**Location:** `/blog` and `/blog/:slug`

- SEO-optimized blog posts
- Featured images
- Category/date display
- Full article view

### 9. Other Pages

| Page | Location | Description |
|------|----------|-------------|
| Privacy Policy | `/privacy` | Legal privacy information |
| Terms of Service | `/terms` | Terms and conditions |
| Contact | `/contact` | Contact form |
| Socials | `/socials` | Official social media links |

---

## Admin Features

**Location:** `/admin`

**Access:** Requires admin privileges (set via `isAdmin: true` on user)

### Admin Tabs

#### 1. Users Tab
- View all registered users
- Search by email or Telegram username
- See verification status
- Ban/unban users
- View admin status

#### 2. Links Tab
- View all shortened links on platform
- Search by short code or URL
- Disable/enable links
- See creation dates

#### 3. Blog Tab
- View all blog posts
- Create new posts
- Edit existing posts
- Publish/unpublish posts
- Delete posts

**Blog Editor:** `/admin/blog/new` or `/admin/blog/:id`
- Rich text content
- SEO slug configuration
- Featured image URL
- Excerpt for previews

#### 4. Sponsored Tab
- Create sponsored posts for carousel
- Fields: title, description, content, logo, banner, website URL
- Priority ordering
- Active/inactive toggle
- Approval status

#### 5. Ads Tab
- **AdSense Code:** Global AdSense script
- **Rewarded Ad Code:** Code shown before analytics unlock
- **Custom Ads Manager:**
  - Create multiple ad units
  - Placements: header, footer, sidebar, in-content
  - Device targeting: desktop, mobile, both
  - Ad sizes: 728x90, 970x90, 300x250, 336x280, 320x50, 320x100
  - Enable/disable individual ads

#### 6. Earning Tab
Quick access to earning management page.

**Earning Management:** `/admin/earning`

Sub-tabs:
- **Tasks:** Create/edit/delete manual tasks, set rewards
- **Submissions:** Review task proof submissions, approve/reject
- **Withdrawals:** Process withdrawal requests, add transaction hashes
- **Referrals:** Validate referral conditions
- **Social:** Review social verification submissions
- **Settings:** Configure earning system parameters

#### 7. Notifications Tab
- Create notifications for users
- Global (all users) or targeted (specific user)
- Types: info, success, warning, error
- View all sent notifications
- Delete notifications

#### 8. Announcements Tab
- Create rotating banner announcements
- Types: info (blue), success (green), promo (purple)
- Priority ordering (higher = shown first)
- Active/inactive toggle
- Announcements appear below navigation on all pages

#### 9. Security Tab
- View banned IP addresses
- Ban reason display
- Ban timestamp

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login to account | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | No (returns null if not logged in) |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| PATCH | `/api/auth/profile` | Update profile (Telegram) | Yes |
| POST | `/api/auth/verify-email` | Verify email with token | No |
| POST | `/api/auth/resend-verification` | Resend verification email | Yes |

### Link Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/links` | Get user's links | Yes |
| POST | `/api/links` | Create short link | No (but tracked) |
| POST | `/api/links/bulk` | Bulk create links (max 50) | Yes |
| DELETE | `/api/links/:id` | Delete a link | Yes |
| GET | `/:shortCode` | Redirect to original URL | No |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/:linkId` | Get link analytics | Yes (+ unlock or admin) |
| POST | `/api/analytics/unlock` | Unlock analytics for 1 hour | Yes |
| GET | `/api/analytics/:linkId/unlock-status` | Check unlock status | Yes |

### Blog Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blog` | Get all published posts | No |
| GET | `/api/blog/:slug` | Get single post by slug | No |

### Earning Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/earning/balance` | Get user balance | Yes |
| GET | `/api/earning/transactions` | Get transaction history | Yes |
| GET | `/api/earning/settings` | Get earning config | No |
| PATCH | `/api/earning/faucetpay-email` | Update FaucetPay email | Yes |
| GET | `/api/tasks` | Get available tasks | Yes |
| POST | `/api/tasks/:id/submit` | Submit task completion | Yes |
| GET | `/api/tasks/submissions` | Get user's submissions | Yes |
| GET | `/api/referrals` | Get referral info | Yes |
| POST | `/api/referrals/apply` | Apply referral code | Yes |
| GET | `/api/withdrawals` | Get withdrawal history | Yes |
| POST | `/api/withdrawals` | Request withdrawal | Yes |
| GET | `/api/offerwalls` | Get offerwall config | Yes |
| GET | `/api/offerwalls/:network/offers` | Get offers from network | Yes |
| GET | `/api/social-verification` | Get verification status | Yes |
| POST | `/api/social-verification/submit` | Submit verification proof | Yes |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/announcements` | Get active announcements |
| GET | `/api/sponsored-posts` | Get approved sponsored posts |
| GET | `/api/sponsored-posts/:id` | Get single sponsored post |
| POST | `/api/sponsored-posts/:id/click` | Track sponsor click |
| POST | `/api/sponsored-posts/:id/react` | React to sponsor post |
| GET | `/api/settings/ads` | Get ad settings (AdSense, rewarded) |
| GET | `/api/custom-ads` | Get enabled custom ads |
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/public/payment-proofs` | Get recent payment proofs |

### Admin Endpoints

All admin endpoints require admin authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user (ban/unban) |
| GET | `/api/admin/links` | Get all links |
| PATCH | `/api/admin/links/:id` | Update link (disable) |
| GET | `/api/admin/blog/:id` | Get blog post for editing |
| POST | `/api/admin/blog` | Create blog post |
| PATCH | `/api/admin/blog/:id` | Update blog post |
| DELETE | `/api/admin/blog/:id` | Delete blog post |
| GET | `/api/admin/settings` | Get all settings |
| PATCH | `/api/admin/settings` | Update settings |
| GET | `/api/admin/banned-ips` | Get banned IPs |
| POST | `/api/admin/banned-ips` | Ban an IP |
| DELETE | `/api/admin/banned-ips/:ip` | Unban an IP |
| GET | `/api/admin/custom-ads` | Get all custom ads |
| POST | `/api/admin/custom-ads` | Create custom ad |
| PATCH | `/api/admin/custom-ads/:id` | Update custom ad |
| DELETE | `/api/admin/custom-ads/:id` | Delete custom ad |
| GET | `/api/admin/sponsored-posts` | Get all sponsored posts |
| POST | `/api/admin/sponsored-posts` | Create sponsored post |
| PATCH | `/api/admin/sponsored-posts/:id` | Update sponsored post |
| DELETE | `/api/admin/sponsored-posts/:id` | Delete sponsored post |
| GET | `/api/admin/notifications` | Get all notifications |
| POST | `/api/admin/notifications` | Create notification |
| DELETE | `/api/admin/notifications/:id` | Delete notification |
| GET | `/api/admin/announcements` | Get all announcements |
| POST | `/api/admin/announcements` | Create announcement |
| PATCH | `/api/admin/announcements/:id` | Update announcement |
| DELETE | `/api/admin/announcements/:id` | Delete announcement |
| GET | `/api/admin/tasks` | Get all tasks |
| POST | `/api/admin/tasks` | Create task |
| PATCH | `/api/admin/tasks/:id` | Update task |
| DELETE | `/api/admin/tasks/:id` | Delete task |
| GET | `/api/admin/task-submissions` | Get all submissions |
| PATCH | `/api/admin/task-submissions/:id` | Approve/reject submission |
| GET | `/api/admin/withdrawals` | Get all withdrawals |
| PATCH | `/api/admin/withdrawals/:id` | Process withdrawal |
| GET | `/api/admin/referrals` | Get all referrals |
| PATCH | `/api/admin/referrals/:id` | Validate referral |
| GET | `/api/admin/social-verifications` | Get verification requests |
| PATCH | `/api/admin/social-verifications/:id` | Approve/reject verification |
| GET | `/api/admin/earning-settings` | Get earning config |
| PATCH | `/api/admin/earning-settings` | Update earning config |
| GET | `/api/admin/offerwall-settings` | Get offerwall settings |
| PATCH | `/api/admin/offerwall-settings/:network` | Update offerwall |

### Postback Endpoints (Offerwalls)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/postback/cpagrip` | CPAGrip postback handler |
| GET | `/api/postback/adbluemedia` | AdBlueMedia postback handler |

---

## Database Schema

### Core Tables

#### Users
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Primary key (UUID) |
| email | text | Unique email address |
| password | text | Bcrypt hashed password |
| emailVerified | boolean | Email verification status |
| verificationToken | text | Email verification token |
| isAdmin | boolean | Admin privileges |
| isBanned | boolean | Ban status |
| referralCode | varchar(10) | Unique referral code |
| referredBy | varchar(36) | Referrer's user ID |
| socialVerified | boolean | Social verification status |
| telegramUsername | text | Optional Telegram username |
| passwordResetToken | text | Hashed reset token |
| passwordResetExpiry | timestamp | Reset token expiry |
| createdAt | timestamp | Account creation date |

#### Links
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Primary key (UUID) |
| originalUrl | text | Full destination URL |
| shortCode | varchar(20) | Unique short identifier |
| userId | varchar(36) | Creator's user ID (optional) |
| creatorIp | text | Creator's IP address |
| isDisabled | boolean | Admin disabled status |
| isBanned | boolean | Ban status |
| expiresAt | timestamp | Link expiration time |
| createdAt | timestamp | Creation timestamp |

#### Clicks
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Primary key (UUID) |
| linkId | varchar(36) | Associated link ID |
| country | text | Visitor country |
| device | text | Device type |
| browser | text | Browser name |
| referrer | text | Referrer URL |
| clickedAt | timestamp | Click timestamp |

#### Blog Posts
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Primary key |
| title | text | Post title |
| slug | text | URL-friendly slug |
| content | text | Full content |
| excerpt | text | Short preview |
| featuredImage | text | Image URL |
| isPublished | boolean | Publication status |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update |

### Earning Tables

#### User Balances
| Field | Type | Description |
|-------|------|-------------|
| userId | varchar(36) | User ID |
| balanceUsd | decimal | Current balance |
| totalEarned | decimal | Lifetime earnings |
| pendingWithdrawal | decimal | Pending amount |
| faucetPayEmail | text | FaucetPay email |

#### Transactions
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Transaction ID |
| userId | varchar(36) | User ID |
| type | text | credit/debit |
| amountUsd | decimal | Amount |
| source | text | task/referral/offerwall/withdrawal |
| description | text | Details |
| createdAt | timestamp | Transaction time |

#### Tasks
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Task ID |
| title | text | Task name |
| description | text | Instructions |
| rewardUsd | decimal | Reward amount |
| type | text | Task category |
| url | text | Task URL |
| isActive | boolean | Availability |
| maxCompletions | integer | Total limit |
| completedCount | integer | Current completions |

#### Withdrawal Requests
| Field | Type | Description |
|-------|------|-------------|
| id | varchar(36) | Request ID |
| userId | varchar(36) | User ID |
| amountUsd | decimal | Withdrawal amount |
| coinType | text | Cryptocurrency type |
| faucetPayEmail | text | Destination email |
| status | text | pending/approved/rejected |
| txHash | text | Transaction hash |
| adminNotes | text | Admin comments |

### Other Tables
- **Announcements:** Rotating banner messages
- **Notifications:** User notifications
- **Sponsored Posts:** Carousel advertisements
- **Custom Ads:** Ad unit management
- **Rate Limits:** IP-based rate limiting
- **Banned IPs:** Blocked IP addresses
- **Referrals:** Referral relationships
- **Social Verifications:** Social proof submissions
- **Offerwall Completions:** Offer tracking

---

## Configuration

### Rate Limiting
- **Default limit:** 250 links per IP per month
- Configurable in admin settings
- Applies to both anonymous and authenticated users

### Earning Settings (Admin Configurable)
| Setting | Description |
|---------|-------------|
| Minimum Withdrawal | Minimum USD amount |
| Maximum Withdrawal | Maximum USD amount |
| Referral Reward | Amount per valid referral |
| Required Links | Links referee must create |

### Offerwall Configuration
| Network | Fields |
|---------|--------|
| CPAGrip | App ID, API Token, Postback Secret |
| AdBlueMedia | API Key, Publisher ID, Postback Secret |

---

## Security

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- Session-based authentication
- HTTP-only session cookies
- CSRF protection via same-origin policy

### Password Reset
- Secure random tokens
- Tokens hashed before storage
- 1-hour expiry
- One-time use

### Rate Limiting
- IP-based link creation limits
- Prevents abuse and spam

### Admin Protection
- Admin routes require `requireAdmin` middleware
- Admin status stored in database
- Session validation on each request

### Input Validation
- Zod schemas for all inputs
- URL validation for links
- Email validation
- Telegram username pattern validation

---

## Progressive Web App (PWA)

### Features
- Installable on mobile devices
- Offline support with service worker
- Cache-first strategy for assets
- Network-first for API calls

### Files
- `manifest.json` - App configuration
- `sw.js` - Service worker

---

## File Structure

```
AdShrtPro/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── navigation.tsx   # Main navbar
│   │   │   ├── footer.tsx       # Site footer
│   │   │   ├── url-shortener.tsx
│   │   │   ├── announcement-banner.tsx
│   │   │   ├── notification-bell.tsx
│   │   │   ├── sponsored-carousel.tsx
│   │   │   ├── ad-display.tsx
│   │   │   └── seo.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── index.tsx    # Admin dashboard
│   │   │   │   ├── earning.tsx  # Earning management
│   │   │   │   └── blog-editor.tsx
│   │   │   ├── earn/
│   │   │   │   ├── tasks.tsx
│   │   │   │   ├── referrals.tsx
│   │   │   │   ├── offerwalls.tsx
│   │   │   │   └── withdraw.tsx
│   │   │   └── [other pages]
│   │   ├── lib/
│   │   │   ├── auth-context.tsx
│   │   │   ├── theme-context.tsx
│   │   │   └── queryClient.ts
│   │   ├── hooks/
│   │   └── App.tsx
│   ├── public/
│   │   ├── manifest.json
│   │   └── sw.js
│   └── index.html
├── server/
│   ├── index.ts           # Express server entry
│   ├── routes.ts          # All API routes
│   ├── storage.ts         # MemStorage implementation
│   └── vite.ts            # Vite dev server integration
├── shared/
│   └── schema.ts          # Types and validation schemas
├── replit.md              # Project overview
└── DOCUMENTATION.md       # This file
```

---

## Support

For issues or questions:
1. Check the `/contact` page on the platform
2. Review this documentation
3. Check admin settings for configuration options

---

*Last Updated: January 2026*
