import { useCallback, useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api/v1";

function Icon({ name }) {
  const shapes = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chart: <><path d="M4 19V5M4 19h17"/><path d="m7 14 4-4 3 2 6-7"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      {shapes[name] || shapes.grid}
    </svg>
  );
}

function TaskList({ tasks, onEdit, onDelete, onToggle, emptyText }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <span className="empty-star">✦</span>
        <strong>All clear for now</strong>
        <span>{emptyText}</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <article
          className={`task-row ${task.status === "completed" ? "task-done" : ""}`}
          key={task._id}
        >
          <button
            className={`task-check ${task.status === "completed" ? "checked" : ""}`}
            onClick={() => onToggle(task)}
            aria-label="Toggle task"
          >
            {task.status === "completed" && <Icon name="check"/>}
          </button>

          <div className="task-main">
            <strong>{task.title}</strong>
            <span>In your workspace</span>
          </div>

          <span className={`priority-pill priority-${task.priority || "low"}`}>
            <i/>{task.priority || "low"}
          </span>

          <span className={`status-pill status-${task.status}`}>
            {task.status}
          </span>

          <div className="task-actions">
            <button className="icon-button" onClick={() => onEdit(task)} title="Edit">
              <Icon name="edit"/>
            </button>
            <button className="icon-button danger-hover" onClick={() => onDelete(task._id)} title="Delete">
              <Icon name="trash"/>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editStatus, setEditStatus] = useState("pending");

  const [view, setView] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const api = useCallback(async (path, options = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Request failed. Please try again.");
    }

    return data;
  }, [token]);

  const loadStats = useCallback(async () => {
    setStats(await api("/tasks/stats"));
  }, [api]);

  const loadTasks = useCallback(async () => {
    if (!token) return;

    setBusy(true);

    try {
      const q = new URLSearchParams({
        status: filterStatus,
        page: String(page),
        limit: String(limit)
      });

      const data = await api(`/tasks?${q}`);

      setTasks(data.tasks || []);
      await loadStats();

    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }, [token, filterStatus, page, api, loadStats]);

  useEffect(() => {
    if (token) loadTasks();
  }, [token, loadTasks]);

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter(t =>
      !q || t.title.toLowerCase().includes(q)
    );
  }, [tasks, search]);

  const rate = stats.total
    ? Math.round(stats.completed / stats.total * 100)
    : 0;

  const highPriority = tasks.filter(
    t => t.priority === "high" && t.status !== "completed"
  ).length;

  async function authenticate(e) {
    e.preventDefault();
    setAuthError("");
    setAuthBusy(true);

    try {
      const data = await api(
        authMode === "login" ? "/auth/login" : "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({ email, password })
        }
      );

      if (authMode === "signup") {
        setAuthMode("login");
        setNotice("Account created. Please sign in.");
      } else {
        setToken(data.token);
      }

    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          priority
        })
      });

      setTitle("");
      setNotice("Task added.");
      await loadTasks();

    } catch (e) {
      setNotice(e.message);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api(`/tasks/${id}`, { method: "DELETE" });
      setNotice("Task deleted.");
      await loadTasks();

    } catch (e) {
      setNotice(e.message);
    }
  }

  function startEdit(t) {
    setEditingTask(t);
    setEditTitle(t.title);
    setEditPriority(t.priority || "low");
    setEditStatus(t.status || "pending");
  }

  async function saveEdit(e) {
    e.preventDefault();

    try {
      await api(`/tasks/${editingTask._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle.trim(),
          priority: editPriority,
          status: editStatus
        })
      });

      setEditingTask(null);
      setNotice("Task updated.");
      await loadTasks();

    } catch (e) {
      setNotice(e.message);
    }
  }

  async function toggleTask(t) {
    try {
      await api(`/tasks/${t._id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: t.status === "completed" ? "pending" : "completed"
        })
      });

      await loadTasks();

    } catch (e) {
      setNotice(e.message);
    }
  }

  function logout() {
    setToken("");
    setTasks([]);
    setStats({ total: 0, completed: 0, pending: 0 });
    setPage(1);
    setView("overview");
  }

  if (!token) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <div className="brand">
            <span className="brand-mark">T</span>
            <span>Track<span>Forge</span></span>
          </div>

          <div className="eyebrow">YOUR WORKSPACE, REIMAGINED</div>

          <h1>
            {authMode === "login" ? "Welcome back." : "Create your account."}
          </h1>

          <p className="muted">
            {authMode === "login"
              ? "Sign in and pick up where your best work begins."
              : "Build momentum. Organize your work. Get things done."}
          </p>

          <form className="auth-form" onSubmit={authenticate}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {authError && <p className="error">{authError}</p>}

            <button className="primary full" disabled={authBusy}>
              {authBusy
                ? "Please wait..."
                : authMode === "login" ? "Sign in" : "Create account"}
              <Icon name="arrow"/>
            </button>
          </form>

          <p className="switch-auth">
            {authMode === "login"
              ? "New to TrackForge?"
              : "Already have an account?"}

            <button onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login");
              setAuthError("");
            }}>
              {authMode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <div className="auth-foot">
            <i/> Your personal productivity space
          </div>
        </section>

        <aside className="auth-promo">
          <div className="promo-star">✦</div>
          <h2>Make every<br/>day <span>count.</span></h2>
          <p>One focused space for your tasks, priorities, and progress.</p>
          <div className="promo-points">
            <b>Focus<small>on what matters</small></b>
            <b>Track<small>your momentum</small></b>
            <b>Grow<small>every day</small></b>
          </div>
        </aside>
      </main>
    );
  }

  const nav = [
    { id: "overview", label: "Overview", icon: "grid" },
    { id: "tasks", label: "My Tasks", icon: "check" },
    { id: "analytics", label: "Analytics", icon: "chart" }
  ];

  const heading = nav.find(n => n.id === view)?.label;

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">T</span>
          <span>Track<span>Forge</span></span>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="close"/>
          </button>
        </div>

        <div className="nav-caption">WORKSPACE</div>

        <nav>
          {nav.map(n => (
            <button
              key={n.id}
              className={`nav-link ${view === n.id ? "selected" : ""}`}
              onClick={() => {
                setView(n.id);
                setMobileOpen(false);
              }}
            >
              <Icon name={n.icon}/>
              {n.label}
              {n.id === "tasks" && <small>{stats.pending}</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip">
            <b>✦ Stay in your flow</b>
            <p>Small steps every day lead to big results.</p>
            <div><i/></div>
          </div>

          <div className="user-row">
            <span className="avatar">{email.slice(0,1).toUpperCase()}</span>
            <span className="user-info">
              <b>{email.split("@")[0]}</b>
              <small>Personal workspace</small>
            </span>
            <button className="icon-button" onClick={logout} title="Log out">
              <Icon name="logout"/>
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu"/>
          </button>

          <div className="crumb">
            Workspace <span>/</span> <b>{heading}</b>
          </div>

          <div className="top-right">
            <span className="active-pill"><i/> Workspace active</span>
            <span className="avatar">{email.slice(0,1).toUpperCase()}</span>
          </div>
        </header>

        <div className="content">
          {notice && (
            <div className="notice">
              {notice}
              <button onClick={() => setNotice("")}>
                <Icon name="close"/>
              </button>
            </div>
          )}

          {view === "overview" && <>
            <section className="welcome">
              <div>
                <div className="eyebrow">YOUR PRODUCTIVITY AT A GLANCE</div>
                <h1>Good to see you<span>.</span></h1>
                <p>Here's what's happening with your tasks today.</p>
              </div>

              <button className="primary" onClick={() => setView("tasks")}>
                <Icon name="plus"/> Add a task
              </button>
            </section>

            <section className="stats">
              <Stat label="Total tasks" value={stats.total}
                hint="Across your workspace" icon="grid" color="purple"/>
              <Stat label="Completed" value={stats.completed}
                hint="Tasks you've finished" icon="check" color="green"/>
              <Stat label="In progress" value={stats.pending}
                hint="Still on your list" icon="chart" color="blue"/>
              <Stat label="Completion rate" value={`${rate}%`}
                hint="Based on all your tasks" icon="↗" color="orange"/>
            </section>

            <section className="two-col">
              <article className="panel">
                <PanelTitle eyebrow="YOUR MOMENTUM" title="Progress overview"/>
                <div className="progress-area">
                  <div className="donut" style={{ "--rate": `${rate}%` }}>
                    <div><b>{rate}%</b><small>completed</small></div>
                  </div>

                  <div className="legend">
                    <p><i className="green-dot"/>Completed <b>{stats.completed}</b></p>
                    <p><i className="purple-dot"/>Pending <b>{stats.pending}</b></p>
                    <hr/>
                    <p>Total tasks <b>{stats.total}</b></p>
                  </div>
                </div>
              </article>

              <article className="panel focus-panel">
                <PanelTitle eyebrow="FOCUS CHECK" title="Priority snapshot"/>
                <div className="focus-number">
                  {highPriority}<small> high-priority tasks</small>
                </div>
                <p>
                  {highPriority
                    ? "These tasks may need your attention. Make a little progress on one today."
                    : "You're clear of outstanding high-priority tasks. Nice work!"}
                </p>
                <button className="text-link" onClick={() => {
                  setFilterStatus("pending");
                  setView("tasks");
                }}>
                  Review pending tasks <Icon name="arrow"/>
                </button>
              </article>
            </section>

            <article className="panel">
              <PanelTitle
                eyebrow="KEEP THE MOMENTUM"
                title="Recent tasks"
                action={
                  <button className="text-link" onClick={() => setView("tasks")}>
                    View all <Icon name="arrow"/>
                  </button>
                }
              />
              <TaskList
                tasks={tasks.slice(0,4)}
                onEdit={startEdit}
                onDelete={deleteTask}
                onToggle={toggleTask}
                emptyText="Add your first task to get started."
              />
            </article>
          </>}

          {view === "tasks" && <>
            <section className="welcome">
              <div>
                <div className="eyebrow">PLAN IT. DO IT. DONE.</div>
                <h1>My tasks<span>.</span></h1>
                <p>Keep your priorities clear and your momentum going.</p>
              </div>
            </section>

            <article className="panel add-panel">
              <div className="add-heading">
                <span className="add-icon"><Icon name="plus"/></span>
                <div>
                  <b>Create a task</b>
                  <small>What's one thing you want to get done?</small>
                </div>
              </div>

              <form className="add-form" onSubmit={createTask}>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Finish project documentation..."
                  required
                />

                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="high">High priority</option>
                </select>

                <button className="primary">
                  <Icon name="plus"/> Add task
                </button>
              </form>
            </article>

            <article className="panel">
              <div className="task-toolbar">
                <PanelTitle
                  eyebrow="YOUR WORK QUEUE"
                  title={<>All tasks <small className="count">{stats.total}</small></>}
                />

                <div className="controls">
                  <div className="search">
                    <Icon name="search"/>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search tasks..."
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={e => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {busy
                ? <div className="empty-state">Loading tasks...</div>
                : <TaskList
                    tasks={visibleTasks}
                    onEdit={startEdit}
                    onDelete={deleteTask}
                    onToggle={toggleTask}
                    emptyText="Nothing here yet. Add a task above to get started."
                  />
              }

              <div className="pagination">
                <span>
                  Showing {tasks.length ? (page-1)*limit+1 : 0}–{(page-1)*limit+tasks.length} on this page
                </span>

                <div>
                  <button
                    className="secondary"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1,p-1))}
                  >
                    Previous
                  </button>
                  <b>{page}</b>
                  <button
                    className="secondary"
                    disabled={tasks.length < limit}
                    onClick={() => setPage(p => p+1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </article>
          </>}

          {view === "analytics" && <>
            <section className="welcome">
              <div>
                <div className="eyebrow">MEASURE YOUR MOMENTUM</div>
                <h1>Analytics<span>.</span></h1>
                <p>A simple look at how your work is progressing.</p>
              </div>
            </section>

            <section className="stats analytics-stats">
              <Stat label="Total tasks" value={stats.total}
                hint="Created in your workspace" icon="grid" color="purple"/>
              <Stat label="Completed" value={stats.completed}
                hint="Successfully finished" icon="check" color="green"/>
              <Stat label="Pending" value={stats.pending}
                hint="Waiting for your attention" icon="chart" color="blue"/>
            </section>

            <section className="two-col">
              <article className="panel">
                <PanelTitle eyebrow="COMPLETION" title="Overall progress"/>
                <div className="progress-area">
                  <div className="donut large-donut" style={{ "--rate": `${rate}%` }}>
                    <div><b>{rate}%</b><small>complete</small></div>
                  </div>

                  <div>
                    <h3>{stats.completed} of {stats.total}</h3>
                    <p className="muted">tasks completed so far</p>
                    <div className="bar">
                      <i style={{ width: `${rate}%` }}/>
                    </div>
                  </div>
                </div>
              </article>

              <article className="panel">
                <PanelTitle eyebrow="TASK BREAKDOWN" title="Status distribution"/>
                <Breakdown label="Completed" value={stats.completed}
                  total={stats.total} color="green"/>
                <Breakdown label="Pending" value={stats.pending}
                  total={stats.total} color="purple"/>
              </article>
            </section>

            <article className="panel">
              <PanelTitle
                eyebrow="LATEST ACTIVITY"
                title="Tasks to keep an eye on"
                action={
                  <button className="text-link" onClick={() => setView("tasks")}>
                    Manage tasks <Icon name="arrow"/>
                  </button>
                }
              />
              <TaskList
                tasks={tasks.slice(0,5)}
                onEdit={startEdit}
                onDelete={deleteTask}
                onToggle={toggleTask}
                emptyText="Your task activity will appear here."
              />
            </article>
          </>}

          <footer className="footer">
            <span>© {new Date().getFullYear()} TrackForge</span>
            <span>Built for focused work <b>✦</b></span>
          </footer>
        </div>
      </main>

      {editingTask && (
        <div className="modal-backdrop" onMouseDown={e => {
          if (e.target === e.currentTarget) setEditingTask(null);
        }}>
          <form className="edit-modal" onSubmit={saveEdit}>
            <div className="modal-head">
              <div className="eyebrow">MAKE AN UPDATE</div>
              <h2>Edit task</h2>
              <button
                type="button"
                className="icon-button"
                onClick={() => setEditingTask(null)}
              >
                <Icon name="close"/>
              </button>
            </div>

            <label>Task title</label>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />

            <label>Priority</label>
            <select value={editPriority} onChange={e => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label>Status</label>
            <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setEditingTask(null)}>
                Cancel
              </button>
              <button className="primary">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, hint, icon, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${color}`}>
          {["grid","check","chart"].includes(icon) ? <Icon name={icon}/> : icon}
        </span>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

function PanelTitle({ eyebrow, title, action }) {
  return (
    <div className="panel-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Breakdown({ label, value, total, color }) {
  return (
    <div className="breakdown">
      <div><span>{label}</span><b>{value}</b></div>
      <div className="bar">
        <i className={color} style={{
          width: `${total ? value/total*100 : 0}%`
        }}/>
      </div>
    </div>
  );
}