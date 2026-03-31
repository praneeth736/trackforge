# 🚀 TrackForge Assignment

A full-stack task management system demonstrating secure, scalable backend architecture using Node.js, Express, MongoDB, and React.

---

## 🔥 Features

* User Authentication (JWT)
* Password Hashing (bcrypt)
* Role-Based Access Control (User/Admin)
* CRUD Operations for Tasks
* API Versioning (`/api/v1`)
* Protected Routes using Middleware
* Basic React Frontend Integration
* Error Handling & Validation

---

## 🧠 Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB (Mongoose)
* Frontend: React (Vite)
* Auth: JWT, bcrypt

---

## 📡 API Endpoints

### Auth

* POST `/api/v1/auth/signup`
* POST `/api/v1/auth/login`

### Tasks

* GET `/api/v1/tasks`
* POST `/api/v1/tasks`
* PUT `/api/v1/tasks/:id`
* DELETE `/api/v1/tasks/:id` (Admin only)

---

## 🔐 Authentication

Protected routes require:

```
Authorization: Bearer <token>
```

---

## ▶️ Setup

### Backend

```
cd backend
npm install
node server.js
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 📊 Scalability Note

This system can be extended using:

* Microservices architecture
* Redis caching
* Load balancing
* Docker deployment

---

## 📁 API Testing

Postman collection included:
`postman_collection.json`

---

## ✨ Author

Praneeth
