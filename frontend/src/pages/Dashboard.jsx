import { useState } from "react";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  // 🔥 SIGNUP
  const signup = async () => {
    const res = await fetch("http://localhost:5000/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful");
    } else {
      alert(data.message);
    }
  };

  // 🔥 LOGIN
  const login = async () => {
    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
      alert("Login successful");
    } else {
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
      body: JSON.stringify({ title, priority }), // 🔥 FIXED
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

    if (res.ok) {
      setTasks(data);
    } else {
      alert(data.message);
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id) => {
    const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ status: "completed" }),
    });

    const data = await res.json();

    if (res.ok) {
      getTasks(); // refresh
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 TrackForge</h1>

      <h2>Signup / Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>

      <hr />

      <h2>Tasks</h2>

      <input
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <select onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <br /><br />
      <button onClick={createTask}>Add Task</button>
      <button onClick={getTasks}>Load Tasks</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {t.title} | {t.priority} | {t.status}

            {t.status === "pending" && (
              <button onClick={() => updateStatus(t._id)}>
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;