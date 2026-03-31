import { useState } from "react";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔥 LOGIN
  const login = async () => {
    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON. stringify({ email, password }),
    });

    const data = await res.json();
    if(res.ok){
      setToken(data.token);
    alert("Login successful");
    }
    else{
      alert(data.message || "Login failed");
    }
  };

  // 🔥 CREATE TASK
  const createTask = async () => {
    const res = await fetch("http://localhost:5000/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

if (res.ok) {
  setTasks([...tasks, data]);
} else {
  alert(data.message);
}
  };

  // 🔥 GET TASKS
  const getTasks = async () => {
    const res = await fetch("http://localhost:5000/api/v1/tasks", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();
    setTasks(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 TrackForge Assignment</h1>

      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>

      <hr />

      <h2>Tasks</h2>
      <input
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>
      <button onClick={getTasks}>Load Tasks</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;