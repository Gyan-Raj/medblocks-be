# medblocks-be

Backend for the OAuth 2.0 demo app. Built with Express, Passport.js, MongoDB, and JWT.

## Live URL

https://medblocks-be.onrender.com

## Tech Stack

- Express 5
- Passport.js (Google OAuth2, GitHub OAuth2 strategies)
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- Cookie-based auth (httpOnly cookies)

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local or MongoDB Atlas)
- Google OAuth credentials
- GitHub OAuth credentials

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Gyan-Raj/medblocks-be.git
cd medblocks-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
PORT=5000
FRONTEND_ALLOWED_ORIGINS=http://localhost:3000
DB_CONNECTION_STRING=mongodb://localhost:27017/medblocks

# Google OAuth — https://console.cloud.google.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth — https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### 4. Set up OAuth credentials

**Google:**

1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `http://localhost:5000/auth/google/callback`
4. Copy Client ID and Client Secret into `.env`

**GitHub:**

1. Go to https://github.com/settings/developers → OAuth Apps → New OAuth App
2. Set Authorization callback URL: `http://localhost:5000/auth/github/callback`
3. Copy Client ID and Client Secret into `.env`

### 5. Run the development server

```bash
npm run dev
```

Server will start at http://localhost:5000.

## Project Structure

```
├── config/
│   └── passport.js        # Google and GitHub Passport strategies
├── db/
│   └── config.js          # MongoDB connection
├── models/
│   └── User.js            # User schema (provider, providerId, name, email, avatar)
├── routes/
│   └── auth.js            # OAuth routes + /me + /logout
├── env.constants.js       # Centralised env var access
└── server.js              # Express app entry point
```

## API Routes

| Method | Route                   | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| GET    | `/`                     | Health check                         |
| GET    | `/auth/google`          | Initiate Google OAuth flow           |
| GET    | `/auth/google/callback` | Google OAuth callback                |
| GET    | `/auth/github`          | Initiate GitHub OAuth flow           |
| GET    | `/auth/github/callback` | GitHub OAuth callback                |
| POST   | `/auth/signup`          | Create a local account               |
| POST   | `/auth/login `          | Login with email + password          |
| GET    | `/auth/me`              | Returns current user from JWT cookie |
| POST   | `/auth/logout`          | Clears the auth cookie               |

## Available Scripts

| Command       | Description                                   |
| ------------- | --------------------------------------------- |
| `npm run dev` | Start with nodemon (auto-restarts on changes) |

## How It Works

1. User hits `/auth/google` or `/auth/github`
2. Passport redirects to the provider's consent screen
3. Provider redirects back to the callback URL with an authorization code
4. Passport exchanges the code for an access token and fetches the user's profile
5. User is upserted in MongoDB (created if new, updated if returning)
6. A JWT is signed and set as an `httpOnly; Secure; SameSite=None` cookie
7. Browser is redirected to the frontend `/dashboard`

## Production Notes

- The cookie uses `SameSite: None; Secure` to support cross-origin requests (Vercel frontend + Render backend)
- Chrome 120+ blocks cross-site cookies by default. For a production deployment, host both frontend and backend on subdomains of the same domain (e.g. `app.yourdomain.com` + `api.yourdomain.com`) and switch to `SameSite: Lax`
- `JWT_SECRET` must be a strong random string (minimum 32 characters)
