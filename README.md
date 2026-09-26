# PrepGenie

An AI-powered interview preparation assistant. Upload your resume, paste a job description, and share a bit about yourself — PrepGenie analyzes your profile and generates a personalized interview report: technical and behavioral questions with model answers, a skill gap analysis, and a day-wise preparation roadmap. It can also generate and download a tailored, AI-written resume based on your existing report.

## Features

- 🔐 **Authentication** — Secure register/login with JWT + HTTP-only cookies
- 📄 **Resume Parsing** — Upload a PDF resume; text is extracted and analyzed automatically
- 🤖 **AI-Generated Interview Reports** — Powered by Google Gemini, returns structured data:
  - Match score against the job description
  - Technical interview questions with model answers
  - Behavioral interview questions with model answers
  - Skill gap analysis (severity: low / medium / high)
  - Day-wise preparation roadmap tailored to actual gaps (not a fixed template)
- 🧠 **Anti-hallucination guardrails** — The AI is explicitly instructed not to invent skills, experience, or achievements the candidate hasn't demonstrated
- ✅ **Schema-validated AI output** — Gemini's JSON response is validated with Zod before being saved, so malformed responses never reach the database
- 📥 **AI Resume Generator** — Generates a clean HTML resume from your report data, converted to a downloadable PDF via Puppeteer
- 🕘 **Report History** — Revisit or delete previously generated interview reports
- 🎨 **Custom UI** — Dark theme with a neon violet/pink accent design

## Tech Stack

**Backend**
- Node.js, Express
- MongoDB with Mongoose
- JWT authentication + bcrypt password hashing
- Google Gemini API (REST) for report and resume generation
- Zod for validating AI-generated JSON output
- pdf-parse for resume text extraction
- Puppeteer for HTML-to-PDF resume generation

**Frontend**
- React (Vite)
- React Router
- SCSS for styling
- Axios for API requests

## Project Structure

```
PrepGenie/
├── Backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Route handlers (auth, interview)
│       ├── middlewares/     # Auth middleware, file upload middleware
│       ├── models/          # Mongoose schemas (user, interviewReport, blacklist)
│       ├── routes/          # API routes
│       └── services/        # Gemini AI service (report + resume generation)
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/         # Login, Register, Protected routes, auth context
        │   └── interview/    # Home, Interview report pages, interview context
        └── app.routes.jsx
```

## Setup

### Backend
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Google_GENAI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `Google_GENAI_API_KEY` | Google Gemini API key |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get current logged-in user |
| POST | `/api/interview/generate` | Generate an interview report |
| GET | `/api/interview/report/:interviewId` | Get a report by ID |
| GET | `/api/interview/reports` | Get all reports for the logged-in user |
| DELETE | `/api/interview/report/:interviewId` | Delete a report |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generate & download an AI resume PDF |
