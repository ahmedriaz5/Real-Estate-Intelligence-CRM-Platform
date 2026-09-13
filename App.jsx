import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Target,
  UserRound,
  Users,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "./api/client";
import "./App.css";

const stats = [
  { title: "Total Revenue", value: "$284,520", change: "+18.4%", description: "vs. last month", icon: DollarIcon },
  { title: "Properties", value: "—", change: "", description: "active listings", icon: Building2 },
  { title: "Qualified Leads", value: "—", change: "", description: "this month", icon: Target },
  { title: "Customers", value: "—", change: "", description: "total accounts", icon: Users },
];

function DollarIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("access_token")));
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.post("/users/login", { email, password });
      localStorage.setItem("access_token", response.data.access_token);
      setLoggedIn(true);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  if (!loggedIn) {
    return (
      <LoginScreen
        email={email}
        password={password}
        message={message}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        logout={logout}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />
      <main className="main-content">
        <Header activePage={activePage} setMobileMenu={setMobileMenu} />
        {activePage === "Dashboard" && <Dashboard setActivePage={setActivePage} />}
        {activePage === "Properties" && <PropertiesPage />}
        {activePage === "Leads" && <LeadsPage />}
        {activePage === "Customers" && <CustomersPage />}
        {activePage === "Settings" && (
          <PlaceholderPage
            icon={<Settings size={28} />}
            label="SYSTEM CONFIGURATION"
            title="Settings"
            description="Configure your CRM workspace and preferences."
          />
        )}
      </main>
    </div>
  );
}

function LoginScreen({ email, password, message, setEmail, setPassword, handleLogin }) {
  return (
    <div className="login-page">
      <div className="login-background-grid" />
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon"><Building2 size={24} /></div>
          <div><strong>NEXORA</strong><span>REALTY OS</span></div>
        </div>
        <div className="login-heading">
          <div className="section-kicker">PRIVATE WORKSPACE</div>
          <h1>Welcome back.</h1>
          <p>Sign in to access your real estate command center.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="field">
            <label>Email address</label>
            <div className="input-wrap">
              <UserRound size={17} />
              <input type="email" placeholder="ahmad@test.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <Activity size={17} />
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          {message && <div style={{ color: "#ff6b6b", fontSize: 14, marginBottom: 12, textAlign: "center" }}>{message}</div>}
          <button className="login-button" type="submit">
            <span>Sign in to Nexora</span>
            <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ activePage, setActivePage, logout, mobileMenu, setMobileMenu }) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Properties", label: "Properties", icon: Building2 },
    { id: "Leads", label: "Leads", icon: Target },
    { id: "Customers", label: "Customers", icon: Users },
    { id: "Settings", label: "Settings", icon: Settings },
  ];
  return (
    <>
      {mobileMenu && <div className="sidebar-overlay" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><Building2 size={22} /></div>
          <div><strong>NEXORA</strong><span>Realty OS</span></div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); setMobileMenu(false); }}
            >
              <item.icon size={18} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={logout}>
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ activePage, setMobileMenu }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={() => setMobileMenu(true)}><Menu size={20} /></button>
        <div>
          <div className="section-kicker">OVERVIEW</div>
          <h1>{activePage}</h1>
        </div>
      </div>
      <div className="header-right">
        <div className="search-box"><Search size={16} /><input placeholder="Search..." /></div>
        <button className="icon-btn"><Bell size={18} /></button>
      </div>
    </header>
  );
}

function Dashboard({ setActivePage }) {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-icon"><stat.icon size={20} /></div>
            <div className="stat-body">
              <span>{stat.title}</span>
              <strong>{stat.value}</strong>
              <div className="stat-meta">
                {stat.change && <span className="positive">{stat.change}</span>}
                <span>{stat.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div><div className="panel-kicker">PIPELINE</div><h2>Recent leads</h2></div>
            <button className="text-button" onClick={() => setActivePage("Leads")}>View all <ArrowUpRight size={14} /></button>
          </div>
          <p style={{ opacity: 0.6, fontSize: 14 }}>Go to Leads page to manage real data from the API.</p>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <div><div className="panel-kicker">PORTFOLIO</div><h2>Properties</h2></div>
            <button className="text-button" onClick={() => setActivePage("Properties")}>Explore <ArrowUpRight size={14} /></button>
          </div>
          <p style={{ opacity: 0.6, fontSize: 14 }}>Go to Properties page to manage real data from the API.</p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ icon, label, title, description }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">{icon}</div>
        <div className="panel-kicker">{label}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <Loader2 size={28} className="spin" />
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)",
      borderRadius: 12, padding: "12px 16px", marginBottom: 16,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      color: "#ff8a8a", fontSize: 14,
    }}>
      <span>{message}</span>
      {onRetry && <button className="text-button" onClick={onRetry}>Retry</button>}
    </div>
  );
}

/* ===================== CUSTOMERS ===================== */
function CustomersPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", is_active: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/customers", { params: { page: 1, page_size: 50 } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load customers");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      await api.post("/customers", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        is_active: form.is_active,
      });
      setShowModal(false);
      setForm({ full_name: "", email: "", phone: "", is_active: true });
      fetchCustomers();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : "Failed to create customer");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try { await api.delete(`/customers/${id}`); fetchCustomers(); }
    catch (err) { alert(err.response?.data?.detail || "Delete failed"); }
  };

  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <div className="panel-kicker">CUSTOMER RELATIONSHIPS</div>
          <h2 style={{ margin: "4px 0 0" }}>Customers {total > 0 && <span style={{ opacity: 0.5 }}>({total})</span>}</h2>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Customer</button>
      </div>
      {error && <ErrorBanner message={error} onRetry={fetchCustomers} />}
      {loading ? <LoadingState /> : items.length === 0 ? (
        <div className="empty-state">
          <Users size={40} /><h3>No customers yet</h3>
          <p>Create your first customer to get started.</p>
          <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Customer</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.full_name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td><span className={`lead-status ${c.is_active ? "status-hot" : "status-new"}`}><i />{c.is_active ? "Active" : "Inactive"}</span></td>
                  <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td>
                  <td><button className="icon-btn danger" onClick={() => handleDelete(c.id)} title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="field"><label>Full Name *</label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required minLength={2} placeholder="John Doe" />
            </div>
            <div className="field"><label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="john@example.com" />
            </div>
            <div className="field"><label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 1234567" />
            </div>
            <div className="field checkbox-field">
              <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            {formError && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{formError}</div>}
            <div className="modal-actions">
              <button type="button" className="text-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                {saving ? "Saving..." : "Create Customer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ===================== PROPERTIES ===================== */
function PropertiesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", city: "", address: "", price: "", bedrooms: 0, property_type: "House", is_available: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/properties", { params: { page: 1, page_size: 50 } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load properties");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      await api.post("/properties", {
        title: form.title.trim(), city: form.city.trim(), address: form.address.trim(),
        price: Number(form.price), bedrooms: Number(form.bedrooms),
        property_type: form.property_type, is_available: form.is_available,
      });
      setShowModal(false);
      setForm({ title: "", city: "", address: "", price: "", bedrooms: 0, property_type: "House", is_available: true });
      fetchProperties();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : "Failed to create property");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try { await api.delete(`/properties/${id}`); fetchProperties(); }
    catch (err) { alert(err.response?.data?.detail || "Delete failed"); }
  };

  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <div className="panel-kicker">PROPERTY MANAGEMENT</div>
          <h2 style={{ margin: "4px 0 0" }}>Properties {total > 0 && <span style={{ opacity: 0.5 }}>({total})</span>}</h2>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Property</button>
      </div>
      {error && <ErrorBanner message={error} onRetry={fetchProperties} />}
      {loading ? <LoadingState /> : items.length === 0 ? (
        <div className="empty-state">
          <Building2 size={40} /><h3>No properties yet</h3>
          <p>Add your first property listing.</p>
          <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Property</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>City</th><th>Type</th><th>Price</th><th>Beds</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong><div style={{ fontSize: 12, opacity: 0.6 }}>{p.address}</div></td>
                  <td>{p.city}</td>
                  <td>{p.property_type}</td>
                  <td><strong>${Number(p.price).toLocaleString()}</strong></td>
                  <td>{p.bedrooms}</td>
                  <td><span className={`lead-status ${p.is_available ? "status-hot" : "status-new"}`}><i />{p.is_available ? "Available" : "Sold"}</span></td>
                  <td><button className="icon-btn danger" onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <Modal title="Add Property" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="field"><label>Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required minLength={2} placeholder="Modern Villa" />
            </div>
            <div className="field"><label>City *</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required placeholder="Lahore" />
            </div>
            <div className="field full"><label>Address *</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="123 Main Street" />
            </div>
            <div className="field"><label>Price *</label>
              <input type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="500000" />
            </div>
            <div className="field"><label>Bedrooms *</label>
              <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} required />
            </div>
            <div className="field"><label>Type *</label>
              <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })}>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="field checkbox-field">
              <label><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> Available</label>
            </div>
            {formError && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{formError}</div>}
            <div className="modal-actions">
              <button type="button" className="text-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                {saving ? "Saving..." : "Create Property"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ===================== LEADS ===================== */
function LeadsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ customer_id: "", property_id: "", status: "new", notes: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/leads", { params: { page: 1, page_size: 50 } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load leads");
    } finally { setLoading(false); }
  }, []);

  const loadOptions = useCallback(async () => {
    try {
      const [custRes, propRes] = await Promise.all([
        api.get("/customers", { params: { page_size: 100 } }),
        api.get("/properties", { params: { page_size: 100 } }),
      ]);
      setCustomers(custRes.data.items || []);
      setProperties(propRes.data.items || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { if (showModal) loadOptions(); }, [showModal, loadOptions]);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setFormError("");
    try {
      const payload = { customer_id: Number(form.customer_id), status: form.status, notes: form.notes?.trim() || null };
      if (form.property_id) payload.property_id = Number(form.property_id);
      await api.post("/leads", payload);
      setShowModal(false);
      setForm({ customer_id: "", property_id: "", status: "new", notes: "" });
      fetchLeads();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : "Failed to create lead");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try { await api.delete(`/leads/${id}`); fetchLeads(); }
    catch (err) { alert(err.response?.data?.detail || "Delete failed"); }
  };

  const statusClass = (s) => {
    const map = { new: "status-new", hot: "status-hot", warm: "status-warm", cold: "status-new", won: "status-hot", lost: "status-new" };
    return map[(s || "").toLowerCase()] || "status-new";
  };

  return (
    <div className="page-content">
      <div className="page-toolbar">
        <div>
          <div className="panel-kicker">LEAD INTELLIGENCE</div>
          <h2 style={{ margin: "4px 0 0" }}>Leads {total > 0 && <span style={{ opacity: 0.5 }}>({total})</span>}</h2>
        </div>
        <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Lead</button>
      </div>
      {error && <ErrorBanner message={error} onRetry={fetchLeads} />}
      {loading ? <LoadingState /> : items.length === 0 ? (
        <div className="empty-state">
          <Target size={40} /><h3>No leads yet</h3>
          <p>Create a lead by linking a customer (and optional property).</p>
          <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={17} /> Add Lead</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Customer ID</th><th>Property ID</th><th>Status</th><th>Notes</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td>{l.customer_id}</td>
                  <td>{l.property_id || "—"}</td>
                  <td><span className={`lead-status ${statusClass(l.status)}`}><i />{l.status}</span></td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.notes || "—"}</td>
                  <td>{l.created_at ? new Date(l.created_at).toLocaleDateString() : "—"}</td>
                  <td><button className="icon-btn danger" onClick={() => handleDelete(l.id)} title="Delete"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <Modal title="Add Lead" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="field full"><label>Customer *</label>
              <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
                <option value="">Select customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
              </select>
              {customers.length === 0 && <small style={{ color: "#ff8a8a" }}>No customers found. Create a customer first.</small>}
            </div>
            <div className="field full"><label>Property (optional)</label>
              <select value={form.property_id} onChange={(e) => setForm({ ...form, property_id: e.target.value })}>
                <option value="">None</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.title} — {p.city}</option>)}
              </select>
            </div>
            <div className="field"><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="new">New</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="field full"><label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any notes about this lead..." />
            </div>
            {formError && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{formError}</div>}
            <div className="modal-actions">
              <button type="button" className="text-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving || !form.customer_id}>
                {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                {saving ? "Saving..." : "Create Lead"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;
