# PrimeTrade.ai - Backend Developer Intern Assignment

This repository contains the complete full-stack solution for the Backend Developer (Intern) assignment at Primetrade.ai. The project focuses on a scalable REST API with role-based access control, supported by a basic frontend UI to interact with the endpoints.

## Tech Stack

## Backend:

* Node.js & Express.js
* PostgreSQL (Database schema design & management)
* JSON Web Tokens (JWT) for secure authentication
* bcrypt for password hashing
* Swagger for API Documentation

## Frontend:
* React.js / Vite[cite: 1]
* CSS / Tailwind (for simple UI)[cite: 1]

##  Core Features Implemented

### Backend API Design
* Authentication: User registration and login APIs utilizing password hashing and JWT authentication[cite: 1].
* Authorization: Role-based access control distinguishing between regular users and admins[cite: 1].
* CRUD Operations: Complete Create, Read, Update, and Delete APIs for a secondary entity (e.g., tasks/products)[cite: 1].
* Robustness: Implemented API versioning, standard status codes, structured error handling, and input validation/sanitization[cite: 1].

### Frontend Integration
* User Flows: Interfaces to register and log in users seamlessly[cite: 1].
* Protected Dashboard: Restricted access to the dashboard requiring a valid JWT[cite: 1].
* Entity Management: UI forms and tables to perform CRUD actions on the database entity[cite: 1].
* Feedback: Displays clear error and success messages based on API responses[cite: 1].

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* Node.js (v16 or higher)
* PostgreSQL running locally

## Installation & Setup

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rsakshya0930/primetrade-assignment.git
cd primetrade-assignment
```

### 2. Database Setup
Create a new PostgreSQL database for the application.
```bash
createdb primetrade_db
```

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and set up environment variables.
```bash
cd backend
npm install
cp .env.example .env
```
*Note: Update `DB_PASSWORD` in the `.env` file to match your local PostgreSQL credentials.*

Start the backend server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal tab, navigate to the frontend directory, and start the Vite development server.
```bash
cd frontend
npm install
npm run dev
```