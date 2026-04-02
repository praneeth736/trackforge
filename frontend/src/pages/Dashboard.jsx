import { useState, useEffect } from "react";

function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  // 🔥 EDIT STATES
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("low");
  const [editStatus, setEditStatus] = useState("pending");

  // 🔥 AUTO FETCH (MAIN FIX)
  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, [page, filterStatus, token]);

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
      body: JSON.stringify({ title, priority }),
    });

    const data = await res.json();

    if (res.ok) {
      setTitle("");
      getTasks(); // refresh
    } else {
      alert(data.message);
    }
  };

  // 🔥 GET TASKS
  const getTasks = async () => {
    const res = await fetch(
      `http://localhost:5000/api/v1/tasks?status=${filterStatus}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setTasks(data.tasks);
      getStats();
    } else {
      alert(data.message);
    }
  };

  // 🔥 GET STATS
  const getStats = async () => {
    const res = await fetch("http://localhost:5000/api/v1/tasks/stats", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setStats(data);
    }
  };

  // 🔥 DELETE TASK
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (res.ok) {
      getTasks();
    } else {
      alert("Delete failed");
    }
  };

  // 🔥 START EDIT
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  // 🔥 SAVE EDIT
  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: editTitle,
        priority: editPriority,
        status: editStatus,
      }),
    });

    if (res.ok) {
      setEditingId(null);
      getTasks();
    } else {
      alert("Update failed");
    }
  };

  // 🔐 AUTH UI
  if (!token) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>🚀 TrackForge</h1>

        <h2>Signup / Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={signup}>Signup</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  // 🔐 DASHBOARD
  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 Your Tasks</h1>

      <h3>📊 Analytics</h3>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Pending: {stats.pending}</p>

      <button onClick={() => setToken("")}>Logout</button>

      <h3>Add Task</h3>

      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <br /><br />

      <button onClick={createTask}>Add Task</button>

      <h3>Filter</h3>

      <select onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {editingId === t._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>

                <button onClick={() => saveEdit(t._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {t.title} | {t.priority} | {t.status}

                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => deleteTask(t._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <br />

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>

      <span> Page {page} </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={tasks.length < limit}
      >
        Next
      </button>
    </div>
  );
}

export default Dashboard;