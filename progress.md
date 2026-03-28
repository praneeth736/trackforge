"# Progress Log" 
# TrackForge Progress

## Day 1
- Created project structure
- Initialized Git and GitHub repo
- Setup backend with Node.js and Express
- Created basic server

## Next
- Setup routing structure

## Day 2
- Created backend architecture (routes, controllers, models)
- Implemented basic task APIs (GET, POST)
- Tested APIs successfully

## Next
- Setup MongoDB and models

## Day 3
- Connected MongoDB using Mongoose
- Created Task model (schema)
- Implemented real data storage (POST, GET)

## Next
- Add update/delete APIs + error handling


## Day 4

### ✅ Work Done

* Implemented **PUT API** to update tasks using `findByIdAndUpdate`
* Implemented **DELETE API** to remove tasks using `findByIdAndDelete`
* Updated routes to support dynamic parameters (`/tasks/:id`)
* Added **validation** in createTask (title required)
* Implemented **try-catch error handling** in controllers
* Added **global error handler middleware** in server.js

---

### 🧠 What I Learned

#### 🔹 1. HTTP Methods (Core Backend Concept)

* GET → Fetch data
* POST → Create data
* PUT → Update data
* DELETE → Remove data

---

#### 🔹 2. Dynamic Routing

* Used `/:id` in routes to pass parameters
* Accessed using `req.params.id`

---

#### 🔹 3. MongoDB Operations

* `findByIdAndUpdate()` → Update document
* `findByIdAndDelete()` → Delete document

---

#### 🔹 4. Error Handling (Very Important)

* Used `try-catch` to prevent server crashes
* Sent proper responses using `res.status().json()`

---

#### 🔹 5. Validation Logic

* Checked required fields before DB operations
* Learned difference between:

  * ❌ Invalid JSON (middleware error)
  * ✔ Valid JSON but wrong data (controller validation)

---

#### 🔹 6. Global Error Handling Middleware

* Learned how Express catches middleware errors
* Understood placement order (after routes)
* Handled JSON parsing errors cleanly

---

#### 🔹 7. Request Flow Understanding

Client → Server → Routes → Controller → Model → Database → Response

---

#### 🔹 8. Debugging Concepts

* `console.log()` → terminal output
* `res.json()` → client response
* Learned how to trace errors properly

---

### 🚀 Next

* Implement authentication (JWT)
* Add user system (signup/login)
* Protect routes (only logged-in users can access tasks)


## Day 5

### ✅ Work Done

* Implemented **User Authentication system**
* Created **User model** (email + password)
* Built **Signup API** (create user)
* Built **Login API** (verify user)
* Implemented **password hashing using bcrypt**
* Generated **JWT token for authenticated users**
* Created **auth routes (/auth/signup, /auth/login)**
* Added logging to understand request flow

---

### 🧠 What I Learned

---

## 🔐 1. Authentication System (Core Concept)

* Users must **prove identity** using login
* Backend does not store sessions → uses **JWT tokens**
* Token acts like a **secure identity proof**

---

## 🔑 2. Password Security (bcrypt)

* Passwords are **never stored directly**
* They are **hashed (encrypted form)**

Example:

```
123456 → $2a$10$sdhfsdfhksjdf...
```

* During login → password is **compared**, not decoded

---

## 🎟️ 3. JWT (JSON Web Token)

* Token is generated after login:

```
header.payload.signature
```

* Contains:

  * User ID
  * Expiry time

* Used in future requests to verify user

---

## 🔄 4. UNIVERSAL REQUEST FLOW (VERY IMPORTANT)

👉 This applies to **ANY API in backend**

```
Client (Postman / Frontend)
        ↓
server.js (entry point)
        ↓
Middleware (express.json)
        ↓
Route matching (routes/)
        ↓
Controller logic (controllers/)
        ↓
Model interaction (models/)
        ↓
Database (MongoDB)
        ↓
Response sent back to client
```

---

## 🧠 Step-by-Step Execution Flow

### 1️⃣ Request enters backend

* Example: `POST /auth/signup`
* First handled by **server.js**

---

### 2️⃣ Middleware runs

* `express.json()` parses request body
* Converts JSON → JavaScript object

---

### 3️⃣ Route matching

* Example:

  ```js
  app.use("/auth", authRoutes)
  ```
* Redirects request to `authRoutes.js`

---

### 4️⃣ Route handler executes

* Example:

  ```js
  router.post("/signup", signup)
  ```
* Calls controller function

---

### 5️⃣ Controller logic runs

* Validates input
* Performs operations (DB / auth / processing)

---

### 6️⃣ Model interacts with DB

* Example:

  ```js
  User.create(...)
  Task.find(...)
  ```
* Data stored or retrieved from MongoDB

---

### 7️⃣ Response sent

* Example:

  ```js
  res.json(...)
  ```
* Sent back to client (Postman / UI)

---

## 🧠 Key Understanding

* Every request follows the **same pipeline**
* Only the **controller logic changes**
* Backend is just a **flow of data processing**

---

## 🔥 Real-World Analogy

Think of backend like a **restaurant system**:

* Client → Customer
* Server.js → Reception
* Routes → Waiter
* Controller → Chef
* Database → Kitchen storage
* Response → Food served

---

## 🧠 Debugging Understanding

* `console.log()` → shows in terminal
* `res.json()` → shows in client

---

### 🚀 Next

* Implement JWT middleware
* Protect routes (only logged-in users access tasks)
* Connect tasks with users
