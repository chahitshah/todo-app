# Todo App

A full-stack task management application built with React, Vite, Express, and MongoDB. It includes user authentication, task tracking, completion history, and AI-generated daily summaries powered by Groq.

## Features

- User registration and login with hashed passwords
- Personal dashboard for creating, editing, completing, and deleting tasks
- Task organization by today, upcoming, and completed items
- Due date and priority support
- **Task Reminders:** Real-time browser notifications for upcoming deadlines with a smart Enable/Disable toggle
- **Pagination:** Efficient "Load More" system to handle large sets of tasks
- **Advanced Sorting:** Filter and sort by priority, due date, and completion status
- **Overdue Highlighting:** Immediate visual feedback with red highlighting for tasks past their deadline
- **Modern Security:** JWT-based user authentication with protected backend routes
- **Premium UI:** Glassmorphism-inspired design with a responsive, no-cutoff sidebar layout
- AI-generated daily achievement summaries from completed tasks
- Summary history page to review past productivity insights
- Light and dark theme toggle


## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- Groq SDK

## Project Structure

```text
todo-app/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- models/
|   |-- routes/
|   |-- server.js
|   `-- package.json
`-- README.md
``` AI_USAGE.md

## Main User Flow

1. Register a new account.
2. Log in with your email and password.
3. Add tasks with title, description, due date, and priority.
4. Mark tasks as completed as you finish them.
5. Generate an AI summary based on completed tasks.
6. Review older summaries in the history page.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd todo-app
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

## Running the Project

### Start the backend

From the `server` folder:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

From the `client` folder:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## API Overview

### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive user data with JWT

### Task Routes

- `POST /api/task/add` - Create a task
- `GET /api/task/:userId?page=1&limit=20` - Fetch tasks for a user with pagination support
- `PUT /api/task/:id` - Update a task or completion status
- `DELETE /api/task/:id` - Delete a task

### Summary Routes

- `POST /api/summary/generate` - Generate and save an AI summary for completed tasks
- `GET /api/summary/history/:userId` - Get summary history for a user

## Important Notes

- The frontend currently uses `http://localhost:5000` directly for API calls.
- The backend must be running before using the frontend.
- A valid MongoDB connection is required.
- If the Groq API is unavailable, the app falls back to a demo-style summary message.

## Available Scripts

### Client

- `npm run dev` - Start the Vite development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Server

- `node server.js` - Start the Express server

## Possible Improvements

- Add input validation and better error messages
- Add task categories to the backend schema
- Add testing for frontend and backend
- Add Docker support for easy deployment (Future Scope)
- Add deployment configuration for production


## Author

Created as a full-stack Todo App project using React, Express, MongoDB, and Groq AI integration.

