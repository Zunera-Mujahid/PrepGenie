# PrepGenie

PrepGenie is an AI-powered interview preparation assistant that helps candidates prepare for job opportunities using their resume, a target job description, and a personal self-description.

The application analyzes the candidate's profile against the target role and generates a personalized interview report containing technical and behavioral questions, model answers, skill gaps, and a tailored preparation roadmap.

PrepGenie can also generate a customized resume in HTML and convert it into a downloadable PDF using Puppeteer.

---

## Features

- 🔐 **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Cookie-based authentication
  - Protected routes for authenticated users

- 📄 **Resume Parsing**
  - Upload a PDF resume
  - Extract resume text automatically using `pdf-parse`
  - Use the extracted information for AI analysis

- 🤖 **AI-Generated Interview Reports**
  - Powered by Google Gemini
  - Match score against the target job description
  - Technical interview questions with model answers
  - Behavioral interview questions with model answers
  - Skill gap analysis with severity levels
  - Personalized day-wise preparation roadmap

- 🧠 **Anti-Hallucination Guardrails**
  - AI is instructed not to invent skills, experience, projects, achievements, certifications, or responsibilities that are not supported by the candidate's information

- ✅ **Schema-Validated AI Output**
  - Gemini responses are returned as structured JSON
  - Responses are validated using Zod before being stored in MongoDB

- 📥 **AI Resume Generator**
  - Generates a tailored HTML resume using the candidate's existing resume, self-description, and target job description
  - Converts the generated HTML into an A4 PDF using Puppeteer
  - Allows the user to download the generated resume

- 🕘 **Report History**
  - View previously generated interview reports
  - Open individual reports
  - Delete reports

- 🎨 **Custom User Interface**
  - Dark-themed interface
  - Neon violet/pink visual design
  - React-based frontend

---

## Demo

🎥 **PrepGenie Demo**

## Demo Video

🎥 [Watch the PrepGenie Demo](https://youtu.be/nHFgrcr2BDE?si=1uV-fyGn0KT8fBBM)

The demo will showcase:

- User registration and login
- Resume upload
- Job description input
- Self-description input
- AI interview report generation
- Match score
- Technical questions
- Behavioral questions
- Skill gap analysis
- Preparation roadmap
- AI resume generation
- PDF resume download
- Interview report history

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Google Gemini API
- Axios
- Zod
- zod-to-json-schema
- pdf-parse
- Puppeteer
- Multer
- Cookie Parser
- CORS

### Frontend

- React
- Vite
- React Router
- Axios
- SCSS

---

## Project Structure

```text
PrepGenie/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   │
│   └── src/
│       ├── app.js
│       │
│       ├── config/
│       │   └── database.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── file.middleware.js
│       │
│       ├── models/
│       │   ├── blacklist.model.js
│       │   ├── interviewReport.model.js
│       │   └── user.model.js
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       │
│       └── services/
│           ├── ai.service.js
│           └── temp.js
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── App.jsx
│       ├── app.routes.jsx
│       │
│       ├── features/
│       │   ├── auth/
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── pages/
│       │   │   └── services/
│       │   │
│       │   └── interview/
│       │       ├── components/
│       │       ├── hooks/
│       │       ├── pages/
│       │       └── services/
│       │
│       └── styles/
│
├── .gitignore
└── README.md
```

---

## Application Flow

```text
User
 │
 ├── Register / Login
 │
 ▼
Authentication
 │
 ▼
Home
 │
 ├── Upload Resume PDF
 ├── Enter Job Description
 └── Enter Self Description
 │
 ▼
Backend
 │
 ├── Extract resume text
 ├── Send candidate information to Gemini
 └── Validate AI response with Zod
 │
 ▼
Interview Report
 │
 ├── Match Score
 ├── Technical Questions
 ├── Behavioral Questions
 ├── Skill Gaps
 └── Preparation Roadmap
 │
 ├── View / Delete Report
 │
 └── Generate Resume
        │
        ▼
   Gemini-generated HTML
        │
        ▼
     Puppeteer
        │
        ▼
     PDF Resume
```

---

## Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd PrepGenie
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Google_GENAI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on the Vite development server:

```text
http://localhost:5173
```

---

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `Google_GENAI_API_KEY` | Google Gemini API key |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/api/auth/logout` | Logout the current user |
| `GET` | `/api/auth/get-me` | Get the currently authenticated user |

### Interview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/` | Generate a new interview report |
| `GET` | `/api/interview/` | Get all interview reports for the authenticated user |
| `GET` | `/api/interview/report/:interviewId` | Get a specific interview report |
| `DELETE` | `/api/interview/report/:interviewId` | Delete an interview report |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate and download an AI-generated resume PDF |

---

## AI Interview Report

PrepGenie sends the following information to the AI:

- Extracted resume text
- Candidate self-description
- Target job description

The generated report contains:

### Match Score

A score representing how well the candidate's provided profile aligns with the target job description.

### Technical Questions

Technical interview questions are generated based on the candidate's demonstrated skills and the requirements of the target role.

Each question includes:

- Question
- Intention
- Model answer

### Behavioral Questions

Behavioral questions are generated to help the candidate prepare for role-relevant interview scenarios.

Each question includes:

- Question
- Intention
- Model answer

### Skill Gaps

Potential gaps are identified and assigned a severity:

- Low
- Medium
- High

### Preparation Roadmap

The AI generates a day-wise preparation plan based on the identified gaps and target role rather than relying on a fixed preparation template.

---

## AI Safety and Validation

PrepGenie includes explicit instructions in its AI prompts to reduce unsupported claims.

The AI is instructed not to invent:

- Employment history
- Internships
- Projects
- Responsibilities
- Achievements
- Certifications
- Technologies
- Professional experience
- Performance metrics

AI-generated interview reports are also validated using **Zod** before they are saved to MongoDB.

This provides an additional validation layer between the AI response and the application's database.

---

## AI Resume Generation

PrepGenie can generate a tailored resume using:

- Existing resume content
- Candidate self-description
- Target job description

The process is:

```text
Resume + Self Description + Job Description
                    │
                    ▼
               Google Gemini
                    │
                    ▼
             Generated HTML
                    │
                    ▼
                Puppeteer
                    │
                    ▼
               A4 PDF Resume
```

The generated PDF can then be downloaded directly from the application.

---

## Authentication Flow

```text
Register / Login
      │
      ▼
Backend validates credentials
      │
      ▼
JWT generated
      │
      ▼
Authentication cookie
      │
      ▼
Protected API requests
      │
      ▼
Authenticated user
```

The frontend uses protected routes for interview-related pages and user-specific reports.

---

## Database

PrepGenie uses **MongoDB with Mongoose**.

Main models include:

- `User`
- `InterviewReport`
- `Blacklist`

Interview reports are associated with the authenticated user, allowing users to retrieve and delete their own reports.

---

## Future Improvements

Potential future improvements include:

- Production deployment
- More detailed interview analytics
- Additional AI models/providers
- Resume templates
- Interview practice sessions
- Real-time AI interview simulation
- Automated feedback on user answers
- Improved error handling and user notifications

---

## Author

**Zunera Mujahid**  
BS Computer Science  
University of Central Punjab (UCP), Lahore
