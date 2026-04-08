# 🚀 TrackForge

A full-stack task management system designed to demonstrate **real-world backend engineering concepts** including authentication, API design, scalability, and containerized deployment.

---

## 🎯 Overview

TrackForge is not just a basic to-do app — it is a **backend-focused system** that showcases:

- Secure authentication
- Scalable API design
- Clean architecture (MVC)
- Efficient data handling (pagination, filtering)
- Full-stack integration
- Docker-based deployment

---

## 🔥 Features

### 🔐 Authentication
- User Signup & Login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware

---

### 📦 Task Management
- Create, update, delete tasks
- User-specific task isolation
- Task priority (low, medium, high)
- Task status (pending, completed)

---

### 📊 Analytics
- Total tasks
- Completed tasks
- Pending tasks

---

### 🔍 Advanced Backend Features
- Pagination (page & limit)
- Filtering (status-based)
- RESTful API design
- Centralized error handling
- Middleware-based architecture

---

### 🎨 Frontend
- Built with React (Vite)
- Authentication UI (Login/Signup)
- Task dashboard
- Dynamic updates (filtering, pagination)
- Clean and minimal UI

---

## 🧱 Tech Stack

| Layer       | Technology |
|------------|-----------|
| Frontend   | React (Vite) |
| Backend    | Node.js + Express |
| Database   | MongoDB |
| Auth       | JWT + bcrypt |
| DevOps     | Docker |

---

## 🐳 Docker Setup

Run the entire application using:

```bash
docker-compose up --build