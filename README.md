# 🚀 TrackForge – Full Stack Task Management System

TrackForge is a secure and scalable full-stack task management application designed with real-world backend architecture principles. It enables users to manage tasks efficiently with authentication, authorization, and structured API design.

---

## 🌟 Key Features

* 🔐 **JWT Authentication** – Secure login & signup system
* 🛡️ **Protected Routes** – Middleware-based access control
* 👤 **User-Specific Tasks** – Each user can only access their own tasks
* 📝 **Task Management (CRUD)** – Create, read, update, delete tasks
* 📊 **Task Status Tracking** – Mark tasks as *pending* or *completed*
* ⚡ **Priority Levels** – Assign low, medium, or high priority to tasks
* 🔄 **Real-Time Updates** – UI updates after operations
* 🧩 **Modular Backend Architecture** – Controllers, routes, middleware separation

---

## 🧠 Project Architecture

```text
Frontend (React)
       ↓
REST API (Express.js)
       ↓
Authentication Middleware (JWT)
       ↓
Controllers (Business Logic)
       ↓
MongoDB (Database)
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (Authentication)
* bcrypt (Password hashing)

### Frontend

* React.js (Vite)
* Fetch API

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register user |
| POST   | `/api/v1/auth/login`  | Login user    |

---

### 📋 Tasks

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/v1/tasks`     | Get user tasks      |
| POST   | `/api/v1/tasks`     | Create task         |
| PUT    | `/api/v1/tasks/:id` | Update task status  |
| DELETE | `/api/v1/tasks/:id` | Delete task (Admin) |

---

## 🔐 Authentication Usage

All protected routes require:

```
Authorization: Bearer <token>
```

---

## ▶️ How to Run Locally

### Backend

```
cd backend
npm install
node server.js
```

---

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🧪 API Testing

You can test APIs using:

* Postman collection (included or shared)
* Or directly via frontend UI

---

## 🚀 Scalability & Design Considerations

* Modular architecture enables easy feature extension
* JWT-based stateless authentication improves scalability
* Can be extended with:

  * Redis caching
  * Microservices architecture
  * Docker deployment
  * Message queues (RabbitMQ)

---

## 💡 What Makes This Project Strong

* Implements **real-world backend patterns**
* Demonstrates **secure API design**
* Handles **user-level data isolation**
* Shows **full-stack integration**

---

## 👨‍💻 Author

**Praneeth**
🔗 GitHub: https://github.com/praneeth736

---

## ⭐ Future Enhancements

* Dashboard analytics (task stats)
* Filtering & sorting tasks
* UI improvements
* Notifications system
* Async task processing (RabbitMQ)
