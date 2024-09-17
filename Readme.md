# Music System Project

This project is a monorepo built using Lerna, with a backend powered by Node.js and a frontend using React and Vite.

## Prerequisites

Ensure you have the following installed:
- Node.js (v18.x.x)
- MySQL

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:sudarshanadhikari908/Music-system.git
   cd Music-System

2. npm bootstrap
3. Set up the environment variables:

You need to create .env files for both the backend and frontend.

## Backend (packages/backend)
Create a .env file in the packages/backend directory and include the following keys:

### Environment Variables

```bash
PORT: Port on which the backend server runs (e.g., 5000)
DB_HOST: The host for your MySQL database (e.g., localhost)
DB_USER: Your MySQL username
DB_PASSWORD: Your MySQL password
DB_DATABASE: The name of your MySQL database (e.g., artist_management_db)
JWT_SECRET: A secret key for signing JWT tokens (e.g., a secure random string)
```

## Frontend (packages/frontend)
Create a .env file in the packages/frontend directory and include the following key:

VITE_API_URL: The URL to your backend API (e.g., http://localhost:5000/music-system)

## Run the project:

npm start

