# PMD Backend - Interdisciplinary Project Management Platform

## Setup

1. Make sure MongoDB is running on `localhost:27017` with the `pmd` database
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/login` - Login (student with rollNumber, faculty with facultyId)

### Projects
- `GET /api/projects` - All projects (authenticated)
- `GET /api/projects/faculty/:facultyId` - Projects by faculty
- `GET /api/projects/student/:studentId` - Projects student is enrolled in
- `GET /api/projects/available` - Open projects for browsing
- `POST /api/projects/:id/apply` - Student applies to project
- `PUT /api/projects/:id/advance-phase` - Advance project phase

### Students
- `GET /api/students` - All students
- `GET /api/students/:id` - Student by ID

### Faculty
- `GET /api/faculties` - All faculty
- `GET /api/faculties/:id` - Faculty by ID

## Environment Variables
See `.env` file for configuration.
