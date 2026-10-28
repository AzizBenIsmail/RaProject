import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, AlertOctagon, AlertTriangle, ArrowDown, ArrowUpRight, ArrowUp, Bell,
  Check, CheckCircle2, ChevronRight, CircleHelp,
  Clock3, Cloud, Command, FileCheck2, Filter, Globe2, LayoutDashboard,
  ListTodo, LockKeyhole, Menu, Moon, MoreHorizontal, Plus, Search, Settings,
  Shield, ShieldAlert, ShieldCheck, Sun, Users, X, Zap,
} from 'lucide-react';
import { usePersistentState } from './hooks/usePersistentState';
import { translations, localeNames } from './i18n/translations';
import {
  categories, incidentStatuses, incidentTypes, priorities, seedActivity, seedIncidents,
  seedTasks, taskStatuses, teamMembers,
} from './data/seedData';
import './App.css';

const paths = ['/dashboard', '/tasks', '/board', '/incidents', '/team', '/activity', '/settings'];
const navItems = [
  { path: paths[0], key: 'dashboard', icon: LayoutDashboard, group: 'workspace' },
  { path: paths[1], key: 'tasks', icon: ListTodo, group: 'workspace' },
  { path: paths[2], key: 'board', icon: Command, group: 'workspace' },
  { path: paths[3], key: 'incidents', icon: ShieldAlert, group: 'operations' },
  { path: paths[4], key: 'team', icon: Users, group: 'operations' },
  { path: paths[5], key: 'activity', icon: Activity, group: 'operations' },
  { path: paths[6], key: 'settings', icon: Settings, group: 'operations' },
];

const getTitle = (location, t) => {
  const found = navItems.find((item) => location.pathname === item.path);
  return found ? t[found.key] : t.dashboard;
};

function readValidArray(value, fallback, key) {
  if (Array.isArray(value)) return value;
  if (value !== fallback) console.warn(`Invalid local data for "${key}". Restoring demo data.`);
  return fallback;
}

function TaskPriorityCompact({ task, t }) {
  return <div className="incident-compact"><span className={`incident-marker marker-${classFor(task.priority)}`}><ListTodo size={15} /></span><span className="compact-main"><strong>{task.title}</strong><small>{task.id} <i /> {task.assignee}</small></span><Badge kind="priority" value={task.priority} t={t} /></div>;
}

function formatDate(value, locale, options = { month: 'short', day: 'numeric' }) {
  if (!value) return '—';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function classFor(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Avatar({ name, size = 'normal' }) {
  const member = teamMembers.find((person) => person.name === name);
  const initials = member ? member.initials : (name || '?').split(' ').map((part) => part[0]).join('').slice(0, 2);
  return <span className={`avatar ${size} avatar-${member ? member.color : 'blue'}`}>{initials}</span>;
}

function Badge({ value, kind = 'status', t }) {
  return <span className={`badge ${kind}-${classFor(value)}`}>{t[value] || value}</span>;
}

function EmptyState({ icon: Icon = Search, title, detail }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={20} /></span><strong>{title}</strong><span>{detail}</span></div>;
}

function Field({ label, children, required = false, wide = false }) {
  return <label className={`field ${wide ? 'field-wide' : ''}`}><span>{label}{required && <i className="required-mark"> *</i>}</span>{children}</label>;
}

function Modal({ title, onClose, children, size = '', closeLabel = 'Close' }) {
  useEffect(() => {
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-head"><div><span className="eyebrow">{title}</span></div><button className="icon-btn" type="button" onClick={onClose} aria-label={closeLabel}><X size={18} /></button></header>
      {children}
    </section>
  </div>;
}

function TaskForm({ task, t, onClose, onSubmit }) {
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: form.get('title').trim(), description: form.get('description').trim(),
      assignee: form.get('assignee'), priority: form.get('priority'), status: form.get('status'),
      dueDate: form.get('dueDate'), category: form.get('category'),
      tags: form.get('tags').split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    if (!values.title || !values.description || !values.assignee || !values.dueDate) {
      setError(t.required);
      return;
    }
    onSubmit(values);
  };
  return <Modal title={task ? t.edit : t.newTask} onClose={onClose} closeLabel={t.close}>
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t.title} required wide><input name="title" defaultValue={task?.title || ''} required autoFocus placeholder="e.g. Review endpoint alerts" /></Field>
      <Field label={t.description} required wide><textarea name="description" rows="3" defaultValue={task?.description || ''} required placeholder="Add context and expected outcome..." /></Field>
      <Field label={t.assignee} required><select name="assignee" defaultValue={task?.assignee || teamMembers[0].name} required>{teamMembers.map((member) => <option key={member.name}>{member.name}</option>)}</select></Field>
      <Field label={t.category}><select name="category" defaultValue={task?.category || categories[0]}>{categories.map((category) => <option key={category} value={category}>{t[category]}</option>)}</select></Field>
      <Field label={t.priority}><select name="priority" defaultValue={task?.priority || 'Medium'}>{priorities.map((priority) => <option key={priority} value={priority}>{t[priority]}</option>)}</select></Field>
      <Field label={t.status}><select name="status" defaultValue={task?.status || 'To Do'}>{taskStatuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select></Field>
      <Field label={t.dueDate} required><input type="date" name="dueDate" defaultValue={task?.dueDate || ''} required /></Field>
      <Field label={t.tags}><input name="tags" defaultValue={task?.tags?.join(', ') || ''} placeholder="security, endpoint" /></Field>
      {error && <p className="form-error field-wide" role="alert">{error}</p>}
      <footer className="form-actions field-wide"><button className="btn btn-quiet" type="button" onClick={onClose}>{t.cancel}</button><button className="btn btn-primary" type="submit">{task ? t.saveTask : t.createTask}</button></footer>
    </form>
  </Modal>;
}

function IncidentForm({ incident, t, onClose, onSubmit }) {
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: form.get('title').trim(), description: form.get('description').trim(),
      type: form.get('type'), severity: form.get('severity'), status: form.get('status'),
      detectedAt: form.get('detectedAt'), asset: form.get('asset').trim(),
      assignee: form.get('assignee'), actions: form.get('actions').trim(), notes: form.get('notes').trim(),
    };
    if (!values.title || !values.description || !values.detectedAt || !values.asset) {
      setError(t.required);
      return;
    }
    onSubmit(values);
  };
  const currentDate = new Date().toISOString().slice(0, 16);
  return <Modal title={incident ? t.edit : t.reportNew} onClose={onClose} closeLabel={t.close} size="modal-large">
    <form className="form-grid" onSubmit={handleSubmit}>
      {incident && <div className="field-wide incident-ref"><span className="ref-icon"><Shield size={15} /></span><span>{t.reference}</span><strong>{incident.id}</strong></div>}
      <Field label={t.title} required wide><input name="title" defaultValue={incident?.title || ''} required autoFocus /></Field>
      <Field label={t.description} required wide><textarea name="description" rows="3" defaultValue={incident?.description || ''} required /></Field>
      <Field label={t.type}><select name="type" defaultValue={incident?.type || incidentTypes[0]}>{incidentTypes.map((type) => <option key={type} value={type}>{t[type]}</option>)}</select></Field>
      <Field label={t.severity}><select name="severity" defaultValue={incident?.severity || 'Medium'}>{priorities.map((priority) => <option key={priority} value={priority}>{t[priority]}</option>)}</select></Field>
      <Field label={t.status}><select name="status" defaultValue={incident?.status || 'Detected'}>{incidentStatuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select></Field>
      <Field label={t.detectedAt} required><input type="datetime-local" name="detectedAt" defaultValue={incident?.detectedAt || currentDate} required /></Field>
      <Field label={t.asset} required wide><input name="asset" defaultValue={incident?.asset || ''} required placeholder="e.g. payment-api-prod-01" /></Field>
      <Field label={t.assignee}><select name="assignee" defaultValue={incident?.assignee || teamMembers[0].name}>{teamMembers.map((member) => <option key={member.name}>{member.name}</option>)}</select></Field>
      <Field label={t.actionsTaken} wide><textarea name="actions" rows="2" defaultValue={incident?.actions || ''} /></Field>
      <Field label={t.notes} wide><textarea name="notes" rows="2" defaultValue={incident?.notes || ''} /></Field>
      {error && <p className="form-error field-wide" role="alert">{error}</p>}
      <footer className="form-actions field-wide"><button className="btn btn-quiet" type="button" onClick={onClose}>{t.cancel}</button><button className="btn btn-primary" type="submit">{incident ? t.saveIncident : t.createIncident}</button></footer>
    </form>
  </Modal>;
}

function App() {
  const [storedTasks, setTasks] = usePersistentState('securenexus.tasks', seedTasks);
  const [storedIncidents, setIncidents] = usePersistentState('securenexus.incidents', seedIncidents);
  const [storedActivity, setActivity] = usePersistentState('securenexus.activity', seedActivity);
  const [language, setLanguage] = usePersistentState('securenexus.language', 'en');
  const [theme, setTheme] = usePersistentState('securenexus.theme', 'dark');
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const locale = language === 'ar' ? 'ar' : language === 'fr' ? 'fr-FR' : 'en-US';
  const tasks = useMemo(() => readValidArray(storedTasks, seedTasks, 'tasks'), [storedTasks]);
  const incidents = useMemo(() => readValidArray(storedIncidents, seedIncidents, 'incidents'), [storedIncidents]);
  const activity = useMemo(() => readValidArray(storedActivity, seedActivity, 'activity'), [storedActivity]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
  }, [language, theme]);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const addActivity = (action, subject) => {
    setActivity((previous) => [{ id: `${Date.now()}-${Math.random()}`, action, subject, at: new Date().toISOString(), actor: 'Amira Ben Ali' }, ...readValidArray(previous, [], 'activity')].slice(0, 100));
  };
  const saveTask = (values) => {
    const existing = modal.task;
    if (existing) {
      setTasks((previous) => readValidArray(previous, seedTasks, 'tasks').map((task) => task.id === existing.id ? { ...task, ...values } : task));
      addActivity('updated', values.title);
    } else {
      const nextId = tasks.reduce((maximum, item) => Math.max(maximum, Number(item.id.replace(/\D/g, '')) || 0), 0) + 1;
      const task = { ...values, id: `T-${String(nextId).padStart(4, '0')}`, createdAt: new Date().toISOString().slice(0, 10) };
      setTasks((previous) => [task, ...readValidArray(previous, seedTasks, 'tasks')]);
      addActivity('created', values.title);
    }
    setModal(null);
    setToast(t.saved);
  };
  const saveIncident = (values) => {
    const existing = modal.incident;
    if (existing) {
      setIncidents((previous) => readValidArray(previous, seedIncidents, 'incidents').map((incident) => incident.id === existing.id ? { ...incident, ...values } : incident));
      addActivity('updated', existing.id);
    } else {
      const nextId = incidents.reduce((maximum, item) => Math.max(maximum, Number(item.id.split('-').pop()) || 0), 0) + 1;
      const incident = { ...values, id: `INC-2026-${String(nextId).padStart(3, '0')}` };
      setIncidents((previous) => [incident, ...readValidArray(previous, seedIncidents, 'incidents')]);
      addActivity('reported', incident.id);
    }
    setModal(null);
    setToast(t.saved);
  };
  const deleteItem = () => {
    if (pendingDelete?.kind === 'task') {
      setTasks((previous) => readValidArray(previous, seedTasks, 'tasks').filter((task) => task.id !== pendingDelete.item.id));
      addActivity('deleted', pendingDelete.item.title);
    } else if (pendingDelete?.kind === 'incident') {
      setIncidents((previous) => readValidArray(previous, seedIncidents, 'incidents').filter((incident) => incident.id !== pendingDelete.item.id));
      addActivity('deleted', pendingDelete.item.id);
    }
    setPendingDelete(null);
    setToast(t.deletedMessage);
  };
  const updateTaskStatus = (taskId, status) => {
    setTasks((previous) => readValidArray(previous, seedTasks, 'tasks').map((task) => task.id === taskId ? { ...task, status } : task));
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.status !== status) addActivity('moved', `${task.title} · ${t[status]}`);
  };
  const restoreDemo = () => {
    setTasks(seedTasks);
    setIncidents(seedIncidents);
    setActivity(seedActivity);
    setToast(t.demoRestored);
  };

  const pageProps = { t, locale, tasks, incidents, activity, onNewTask: () => setModal({ type: 'task' }), onEditTask: (task) => setModal({ type: 'task', task }), onDeleteTask: (task) => setPendingDelete({ kind: 'task', item: task }), onUpdateStatus: updateTaskStatus, onNewIncident: () => setModal({ type: 'incident' }), onEditIncident: (incident) => setModal({ type: 'incident', incident }), onDeleteIncident: (incident) => setPendingDelete({ kind: 'incident', item: incident }), addActivity, setToast };
  const isLight = theme === 'light';
  return <div className="app-shell min-h-screen" data-theme={theme}>
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <Link to="/dashboard" className="brand" onClick={() => setMenuOpen(false)}><span className="brand-mark"><ShieldCheck size={20} strokeWidth={2.2} /></span><span className="brand-name">Secure<span>Nexus</span><small>{t.tagline}</small></span></Link>
      <div className="nav-section-title">{t.workspace}</div>
      <nav className="side-nav">
        {navItems.slice(0, 3).map((item) => <NavItem key={item.path} item={item} t={t} />)}
      </nav>
      <div className="nav-section-title operations-label">{t.operations}</div>
      <nav className="side-nav">
        {navItems.slice(3).map((item) => <NavItem key={item.path} item={item} t={t} />)}
      </nav>
      <div className="sidebar-bottom">
        <div className="secure-card"><div className="secure-card-icon"><LockKeyhole size={15} /></div><div><strong>{t.privacyTitle}</strong><p>{language === 'fr' ? 'Votre navigateur, vos données.' : language === 'ar' ? 'بياناتك في متصفحك.' : 'Your browser. Your data.'}</p></div><ShieldCheck size={14} className="secure-check" /></div>
        <div className="profile"><Avatar name="Amira Ben Ali" /><span className="profile-info"><strong>Amira Ben Ali</strong><small>{language === 'fr' ? 'Responsable sécurité' : language === 'ar' ? 'قائدة الأمن' : 'Security Lead'}</small></span><button className="icon-btn profile-more" aria-label={t.settings} onClick={() => navigate('/settings')}><MoreHorizontal size={19} /></button></div>
      </div>
    </aside>
    {menuOpen && <button className="mobile-scrim" aria-label={t.closeNavigation} onClick={() => setMenuOpen(false)} />}
    <main className="main-shell">
      <header className="topbar">
        <div className="topbar-leading"><button className="icon-btn mobile-menu" onClick={() => setMenuOpen(true)} aria-label={t.openNavigation}><Menu size={20} /></button><div className="breadcrumbs"><span>{t.appName}</span><ChevronRight size={14} /><strong>{getTitle(location, t)}</strong></div></div>
        <div className="topbar-actions"><button className="top-search" onClick={() => setSearchOpen(true)}><Search size={16} /><span>{t.search}</span><kbd>Ctrl K</kbd></button><button className="icon-btn theme-toggle" aria-label={isLight ? t.dark : t.light} onClick={() => setTheme(isLight ? 'dark' : 'light')}>{isLight ? <Moon size={18} /> : <Sun size={18} />}</button><label className="language-switch"><Globe2 size={15} /><select className="language-toggle" aria-label={t.language} value={language} onChange={(event) => setLanguage(event.target.value)}>{Object.entries(localeNames).map(([code, name]) => <option value={code} key={code}>{code.toUpperCase()} · {name}</option>)}</select></label><button className="icon-btn notification-btn" aria-label={t.attention} onClick={() => { setToast(`${incidents.filter((incident) => ['Critical', 'High'].includes(incident.severity) && incident.status !== 'Resolved').length} ${t.highAttention.toLowerCase()}`); }}><Bell size={18} /><i /></button><Avatar name="Amira Ben Ali" /></div>
      </header>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<DashboardPage {...pageProps} />} />
          <Route path="/dashboard" element={<DashboardPage {...pageProps} />} />
          <Route path="/tasks" element={<TasksPage {...pageProps} />} />
          <Route path="/board" element={<BoardPage {...pageProps} />} />
          <Route path="/incidents" element={<IncidentsPage {...pageProps} />} />
          <Route path="/team" element={<TeamPage {...pageProps} />} />
          <Route path="/activity" element={<ActivityPage {...pageProps} />} />
          <Route path="/settings" element={<SettingsPage {...pageProps} language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} onRestore={restoreDemo} />} />
          <Route path="*" element={<DashboardPage {...pageProps} />} />
        </Routes>
        <footer className="app-footer"><span>SecureNexus <span className="footer-dot">·</span> v1.0</span><span><span className="status-dot" />{t.demoNotice}</span></footer>
      </div>
    </main>
    {modal?.type === 'task' && <TaskForm task={modal.task} t={t} onClose={() => setModal(null)} onSubmit={saveTask} />}
    {modal?.type === 'incident' && <IncidentForm incident={modal.incident} t={t} onClose={() => setModal(null)} onSubmit={saveIncident} />}
    {pendingDelete && <Modal title={pendingDelete.kind === 'task' ? t.deleteTask : t.deleteIncident} onClose={() => setPendingDelete(null)} closeLabel={t.close}><div className="confirm-body"><span className="confirm-icon"><AlertTriangle size={22} /></span><p>{t.confirmDelete}</p><div className="form-actions"><button className="btn btn-quiet" onClick={() => setPendingDelete(null)}>{t.cancel}</button><button className="btn btn-danger" onClick={deleteItem}>{t.delete}</button></div></div></Modal>}
    {searchOpen && <GlobalSearch tasks={tasks} incidents={incidents} t={t} onClose={() => setSearchOpen(false)} />}
    {toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}<button className="icon-btn" aria-label={t.close} onClick={() => setToast('')}><X size={15} /></button></div>}
  </div>;
}

function NavItem({ item, t }) {
  const Icon = item.icon;
  return <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{t[item.key]}</span>{item.key === 'incidents' && <span className="nav-count">2</span>}</NavLink>;
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}

function DashboardPage(props) {
  const { t, tasks, incidents, activity, locale, onNewTask } = props;
  const openIncidents = incidents.filter((incident) => incident.status !== 'Resolved');
  const critical = openIncidents.filter((incident) => incident.severity === 'Critical').length;
  const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
  const done = tasks.filter((task) => task.status === 'Done').length;
  const pending = tasks.filter((task) => task.status === 'To Do').length;
  const priorityIncidents = openIncidents.filter((incident) => ['Critical', 'High'].includes(incident.severity));
  const priorityTasksList = tasks.filter((task) => ['Critical', 'High'].includes(task.priority) && task.status !== 'Done').sort((a, b) => priorities.indexOf(b.priority) - priorities.indexOf(a.priority)).slice(0, 3);
  const dueTasks = tasks.filter((task) => task.status !== 'Done').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const severityOrder = ['Critical', 'High', 'Medium', 'Low'];
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  });
  const chartSeries = [[5, 2, 1], [3, 3, 2], [4, 2, 2], [2, 3, 2], [3, 2, 3], [1, 1, 1], [pending, inProgress, done]];
  return <>
    <PageHeading eyebrow={`${t.today} · ${formatDate(new Date().toISOString(), locale, { weekday: 'long', month: 'long', day: 'numeric' })}`} title={t.dashboardTitle} subtitle={t.dashboardSubtitle} action={<button className="btn btn-primary" onClick={onNewTask}><Plus size={16} />{t.newTask}</button>} />
    <section className="stats-grid">
      <StatCard label={t.totalTasks} value={tasks.length} icon={ListTodo} color="blue" trend={`${pending} ${t.pendingTasks.toLowerCase()}`} trendIcon={ArrowUpRight} />
      <StatCard label={t.inProgress} value={inProgress} icon={Zap} color="teal" trend={`${Math.round((inProgress / Math.max(tasks.length, 1)) * 100)}% ${languageLabel(locale)}`} trendIcon={ArrowUp} />
      <StatCard label={t.completed} value={done} icon={CheckCircle2} color="green" trend={t.thisWeek} trendIcon={Check} />
      <StatCard label={t.openIncidents} value={openIncidents.length} icon={ShieldAlert} color="orange" trend={`${critical} ${t.criticalIncidents.toLowerCase()}`} trendIcon={AlertOctagon} />
    </section>
    {priorityIncidents.length > 0 && <section className="attention-banner"><span className="attention-icon"><AlertOctagon size={18} /></span><div><strong>{t.attention}</strong><span>{priorityIncidents.length} {t.highAttention.toLowerCase()} · {priorityIncidents[0].title}</span></div><Link to="/incidents" className="attention-link">{t.viewAll}<ChevronRight size={15} /></Link></section>}
    <section className="dashboard-grid">
      <div className="panel task-overview-panel"><div className="panel-head"><div><span className="eyebrow">{t.workspace}</span><h2>{t.taskOverview}</h2></div><Link to="/tasks" className="text-link">{t.viewAll}<ChevronRight size={15} /></Link></div>
        <div className="chart-legend"><span><i className="legend-dot dot-blue" />{t.pendingTasks}</span><span><i className="legend-dot dot-teal" />{t.inProgress}</span><span><i className="legend-dot dot-green" />{t.completed}</span></div>
        <div className="task-chart" aria-label={`${t.totalTasks}: ${tasks.length}`}><div className="chart-axis"><span>{tasks.length}</span><span>{Math.ceil(tasks.length / 2)}</span><span>0</span></div><div className="chart-bars">{chartSeries.map(([a, b, c], index) => <div className="bar-group" key={weekDays[index]}><div className="bar-stack"><i className="bar-blue" style={{ height: `${Math.min(a * 12, 72)}px` }} /><i className="bar-teal" style={{ height: `${Math.min(b * 12, 72)}px` }} /><i className="bar-green" style={{ height: `${Math.min(c * 12, 72)}px` }} /></div><span>{weekDays[index]}</span></div>)}</div></div>
        <div className="chart-summary"><span><strong>{tasks.length}</strong>{t.allTasks}</span><span><strong>{Math.round((done / Math.max(tasks.length, 1)) * 100)}%</strong>{t.completed}</span><span><strong>{pending}</strong>{t.pendingTasks}</span></div>
      </div>
      <div className="panel severity-panel"><div className="panel-head"><div><span className="eyebrow">{t.operations}</span><h2>{t.severityDistribution}</h2></div><span className="panel-icon"><Shield size={17} /></span></div><div className="severity-total"><strong>{incidents.length}</strong><span>{t.incidents.toLowerCase()}</span></div><div className="severity-bars">{severityOrder.map((severity) => { const count = incidents.filter((incident) => incident.severity === severity).length; return <div className="severity-row" key={severity}><span className={`severity-key severity-${classFor(severity)}`}><i />{t[severity]}</span><div className="severity-track"><i style={{ width: `${incidents.length ? count / incidents.length * 100 : 0}%` }} /></div><strong>{String(count).padStart(2, '0')}</strong></div>; })}</div><Link to="/incidents" className="panel-bottom-link">{t.incidentsTitle}<ArrowUpRight size={15} /></Link></div>
    </section>
    <section className="dashboard-grid dashboard-lower">
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">{t.attention}</span><h2>{t.priorityTasks}</h2></div><Link to="/tasks" className="text-link">{t.viewAll}<ChevronRight size={15} /></Link></div><div className="compact-list">{priorityTasksList.map((task) => <TaskPriorityCompact key={task.id} task={task} t={t} />)}{priorityTasksList.length === 0 && <EmptyState icon={ListTodo} title={t.noTasks} detail={t.noResults} />}</div></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">{t.thisWeek}</span><h2>{t.upcomingDeadlines}</h2></div><Link to="/tasks" className="text-link">{t.viewAll}<ChevronRight size={15} /></Link></div><div className="compact-list">{dueTasks.map((task) => <DeadlineRow key={task.id} task={task} t={t} locale={locale} />)}{dueTasks.length === 0 && <EmptyState title={t.noTasks} detail={t.noResults} />}</div></div>
    </section>
    <div className="panel activity-preview"><div className="panel-head"><div><span className="eyebrow">{t.workspace}</span><h2>{t.recentActivity}</h2></div><Link to="/activity" className="text-link">{t.viewAll}<ChevronRight size={15} /></Link></div>    <ActivityList activity={activity.slice(0, 3)} locale={locale} t={t} /></div>
  </>;
}

function languageLabel(locale) {
  return locale === 'fr-FR' ? 'de votre équipe' : locale === 'ar' ? 'من الفريق' : 'of team';
}

function StatCard({ label, value, icon: Icon, color, trend, trendIcon: TrendIcon }) {
  return <article className="stat-card"><div className={`stat-icon stat-${color}`}><Icon size={18} /></div><span className="stat-label">{label}</span><div className="stat-value">{value}<span className={`stat-trend trend-${color}`}><TrendIcon size={13} />{trend}</span></div><div className={`stat-sparkline spark-${color}`}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>;
}

function DeadlineRow({ task, t, locale }) {
  return <div className="deadline-row"><span className={`deadline-date ${task.dueDate < new Date().toISOString().slice(0, 10) ? 'deadline-late' : ''}`}><strong>{formatDate(task.dueDate, locale, { day: '2-digit' })}</strong><small>{formatDate(task.dueDate, locale, { month: 'short' })}</small></span><span className="compact-main"><strong>{task.title}</strong><small><Avatar name={task.assignee} size="tiny" />{task.assignee}</small></span><Badge kind="priority" value={task.priority} t={t} /></div>;
}

function TaskToolbar({ t, search, setSearch, filters, setFilters, showCategory = true, sort, setSort }) {
  return <div className="toolbar"><label className="input-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchTasks} aria-label={t.searchTasks} />{search && <button onClick={() => setSearch('')} aria-label={t.close}><X size={14} /></button>}</label><span className="toolbar-filter-icon"><Filter size={15} /></span><select aria-label={t.filterStatus} value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">{t.filterStatus}</option>{taskStatuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select><select aria-label={t.filterPriority} value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}><option value="">{t.filterPriority}</option>{priorities.map((priority) => <option key={priority} value={priority}>{t[priority]}</option>)}</select>{showCategory && <select aria-label={t.filterCategory} value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}><option value="">{t.filterCategory}</option>{categories.map((category) => <option key={category} value={category}>{t[category]}</option>)}</select>}{sort && setSort && <select aria-label={t.sortBy} value={sort} onChange={(event) => setSort(event.target.value)}><option value="deadline">{t.deadline}</option><option value="newest">{t.newest}</option><option value="priority">{t.prioritySort}</option></select>}</div>;
}

function filterTasks(tasks, search, filters) {
  const query = search.trim().toLowerCase();
  return tasks.filter((task) => (!query || `${task.title} ${task.description} ${task.assignee} ${task.id} ${task.category} ${(task.tags || []).join(' ')}`.toLowerCase().includes(query)) && (!filters.status || task.status === filters.status) && (!filters.priority || task.priority === filters.priority) && (!filters.category || task.category === filters.category));
}

function TasksPage({ t, locale, tasks, onNewTask, onEditTask, onDeleteTask }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [sort, setSort] = useState('deadline');
  const filtered = useMemo(() => filterTasks(tasks, search, filters).sort((a, b) => sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : sort === 'priority' ? priorities.indexOf(b.priority) - priorities.indexOf(a.priority) : a.dueDate.localeCompare(b.dueDate)), [tasks, search, filters, sort]);
  return <>
    <PageHeading eyebrow={t.workspace} title={t.tasksTitle} subtitle={t.tasksSubtitle} action={<button className="btn btn-primary" onClick={onNewTask}><Plus size={16} />{t.newTask}</button>} />
    <section className="stats-grid task-stats"><StatCard label={t.totalTasks} value={tasks.length} icon={ListTodo} color="blue" trend={t.all} trendIcon={ArrowUpRight} /><StatCard label={t.pendingTasks} value={tasks.filter((task) => task.status === 'To Do').length} icon={Clock3} color="orange" trend={t.active} trendIcon={ArrowUpRight} /><StatCard label={t.inProgress} value={tasks.filter((task) => task.status === 'In Progress').length} icon={Zap} color="teal" trend={t.active} trendIcon={ArrowUpRight} /><StatCard label={t.completed} value={tasks.filter((task) => task.status === 'Done').length} icon={CheckCircle2} color="green" trend={t.thisWeek} trendIcon={Check} /></section>
    <section className="panel list-panel"><div className="panel-head"><div><span className="eyebrow">{t.workspace}</span><h2>{t.allTasks} <span className="count-pill">{filtered.length}</span></h2></div><Link to="/board" className="text-link"><Command size={15} />{t.board}</Link></div><TaskToolbar t={t} search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} /><div className="table-scroll"><table className="data-table"><thead><tr><th>{t.title}</th><th>{t.assignee}</th><th>{t.priority}</th><th>{t.status}</th><th>{t.dueDate}<ArrowDown size={13} /></th><th>{t.category}</th><th aria-label={t.actionLabel} /></tr></thead><tbody>{filtered.map((task) => <tr key={task.id}><td><div className="table-task-title"><strong>{task.title}</strong><small>{task.id} · {task.description}</small></div></td><td><span className="table-assignee"><Avatar name={task.assignee} size="tiny" />{task.assignee}</span></td><td><Badge value={task.priority} kind="priority" t={t} /></td><td><Badge value={task.status} t={t} /></td><td><span className={task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== 'Done' ? 'text-overdue' : ''}>{formatDate(task.dueDate, locale)}</span></td><td><span className="category-label">{t[task.category]}</span></td><td><RowActions onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} t={t} /></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState icon={ListTodo} title={t.noTasks} detail={t.noResults} />}</div></section>
  </>;
}

function RowActions({ onEdit, onDelete, t }) {
  return <div className="row-actions"><button className="icon-btn" onClick={onEdit} aria-label={t.edit}><FileCheck2 size={16} /></button><button className="icon-btn action-delete" onClick={onDelete} aria-label={t.delete}><X size={16} /></button></div>;
}

function BoardPage({ t, tasks, onNewTask, onEditTask, onDeleteTask, onUpdateStatus }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const visible = filterTasks(tasks, search, filters);
  const [dragging, setDragging] = useState('');
  return <>
    <PageHeading eyebrow={t.workspace} title={t.boardTitle} subtitle={t.boardSubtitle} action={<button className="btn btn-primary" onClick={onNewTask}><Plus size={16} />{t.newTask}</button>} />
    <div className="board-tools"><TaskToolbar t={t} search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} showCategory={false} /><span className="drag-hint"><span className="drag-dots">⠿</span>{t.dragHint}</span></div>
    <section className="kanban-board">{taskStatuses.map((status) => { const cards = visible.filter((task) => task.status === status); return <div className={`kanban-column ${dragging === status ? 'column-drop' : ''}`} key={status} onDragOver={(event) => event.preventDefault()} onDragEnter={() => setDragging(status)} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(''); }} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) onUpdateStatus(id, status); setDragging(''); }}><div className="column-head"><span className={`column-dot column-${classFor(status)}`} /><h2>{t[status]}</h2><span className="column-count">{cards.length}</span><button className="icon-btn column-more" aria-label={t.newTask} onClick={onNewTask}><Plus size={16} /></button></div><div className="column-cards">{cards.map((task) => <article className="task-card" key={task.id} draggable onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; }} onDragEnd={() => setDragging('')}><div className="task-card-top"><span className={`priority-mark mark-${classFor(task.priority)}`}><i />{t[task.priority]}</span><RowActions onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} t={t} /></div><h3>{task.title}</h3><p>{task.description}</p><span className="task-card-category"><Shield size={12} />{t[task.category]}</span><div className="task-card-foot"><span className="task-owner"><Avatar name={task.assignee} size="tiny" />{task.assignee.split(' ')[0]}</span><span className={`task-due ${task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== 'Done' ? 'text-overdue' : ''}`}><Clock3 size={12} />{formatDate(task.dueDate, 'en-US', { month: 'short', day: 'numeric' })}</span></div>{task.tags?.length > 0 && <div className="task-tags">{task.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}</article>)}{cards.length === 0 && <div className="drop-empty">{t.noTasks}</div>}</div></div>; })}</section>
  </>;
}

function IncidentsPage({ t, locale, incidents, onNewIncident, onEditIncident, onDeleteIncident }) {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const query = search.trim().toLowerCase();
  const filtered = incidents.filter((incident) => (!query || `${incident.title} ${incident.id} ${incident.description} ${incident.asset} ${incident.assignee} ${incident.type}`.toLowerCase().includes(query)) && (!severity || incident.severity === severity) && (!status || incident.status === status)).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
  const open = incidents.filter((incident) => incident.status !== 'Resolved');
  const critical = open.filter((incident) => incident.severity === 'Critical').length;
  const high = open.filter((incident) => incident.severity === 'High').length;
  return <>
    <PageHeading eyebrow={t.operations} title={t.incidentsTitle} subtitle={t.incidentsSubtitle} action={<button className="btn btn-primary" onClick={onNewIncident}><Plus size={16} />{t.newIncident}</button>} />
    <div className="incident-summary"><div className="incident-summary-main"><span className="summary-shield"><ShieldAlert size={20} /></span><div><span>{t.openIncidents}</span><strong>{open.length}</strong></div><div className="summary-divider" /><div className="summary-attention"><span className="summary-alert-dot" /><span>{t.attention}</span><strong>{critical + high}</strong></div></div><div className="incident-summary-breakdown"><span><i className="severity-critical-dot" />{critical} {t.Critical}</span><span><i className="severity-high-dot" />{high} {t.High}</span><span><i className="severity-resolved-dot" />{incidents.filter((incident) => incident.status === 'Resolved').length} {t.Resolved}</span></div></div>
    <section className="panel list-panel incident-list-panel"><div className="panel-head"><div><span className="eyebrow">{t.operations}</span><h2>{t.incidents} <span className="count-pill">{filtered.length}</span></h2></div><span className="last-synced"><span className="status-dot" />{t.today}</span></div><div className="toolbar incident-toolbar"><label className="input-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchIncidents} aria-label={t.searchIncidents} /></label><span className="toolbar-filter-icon"><Filter size={15} /></span><select aria-label={t.filterSeverity} value={severity} onChange={(event) => setSeverity(event.target.value)}><option value="">{t.filterSeverity}</option>{priorities.map((value) => <option key={value} value={value}>{t[value]}</option>)}</select><select aria-label={t.filterStatus} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">{t.filterStatus}</option>{incidentStatuses.map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></div>
      <div className="incident-cards">{filtered.map((incident) => <article className={`incident-card incident-${classFor(incident.severity)}`} key={incident.id}><div className="incident-card-accent" /><div className="incident-card-content"><div className="incident-card-top"><span className={`incident-ref-badge ref-${classFor(incident.severity)}`}><ShieldAlert size={14} />{incident.id}</span><div className="incident-card-badges"><Badge value={incident.severity} kind="severity" t={t} /><Badge value={incident.status} t={t} /></div></div><h3>{incident.title}</h3><p className="incident-desc">{incident.description}</p><div className="incident-meta"><span><Zap size={14} />{t[incident.type]}</span><span><Cloud size={14} />{incident.asset}</span><span><Clock3 size={14} />{formatDate(incident.detectedAt, locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div><div className="incident-card-bottom"><span className="task-owner"><Avatar name={incident.assignee} size="tiny" />{incident.assignee}</span><div className="incident-row-actions"><button className="btn btn-small btn-quiet" onClick={() => onEditIncident(incident)}>{t.edit}<ChevronRight size={13} /></button><button className="icon-btn action-delete" aria-label={t.deleteIncident} onClick={() => onDeleteIncident(incident)}><X size={16} /></button></div></div><div className="incident-notes-preview"><strong>{t.actionsTaken}</strong><span>{incident.actions || '—'}</span></div></div></article>)}{filtered.length === 0 && <EmptyState icon={ShieldCheck} title={t.noIncidents} detail={t.noResults} />}</div>
    </section>
  </>;
}

function TeamPage({ t, tasks, incidents }) {
  const navigate = useNavigate();
  const workload = (name) => tasks.filter((task) => task.assignee === name && task.status !== 'Done').length;
  const handled = (name) => incidents.filter((incident) => incident.assignee === name && incident.status !== 'Resolved').length;
  return <>
    <PageHeading eyebrow={t.operations} title={t.teamTitle} subtitle={t.teamSubtitle} />
    <div className="team-summary"><span className="team-summary-icon"><Users size={18} /></span><div><strong>{teamMembers.length} <span>{t.teamMembers.toLowerCase()}</span></strong><small>{t.demoNotice}</small></div><div className="team-avatar-stack">{teamMembers.slice(0, 4).map((member) => <Avatar key={member.name} name={member.name} />)}<span className="avatar avatar-more">+1</span></div></div>
    <section className="team-grid">{teamMembers.map((member) => <article className="panel team-card" key={member.name}><div className="team-card-top"><Avatar name={member.name} size="large" /><span className="online-indicator"><i />{t.active}</span><button className="icon-btn" aria-label={member.name}><MoreHorizontal size={18} /></button></div><h2>{member.name}</h2><span className="team-role">{member.role}</span><div className="team-focus"><span>{t.focus}</span><strong>{member.focus}</strong></div><div className="team-metrics"><span><strong>{workload(member.name)}</strong><small>{t.assignedTasks}</small></span><i /><span><strong>{handled(member.name)}</strong><small>{t.openIncidents}</small></span></div><div className="team-card-foot"><span className="team-secure"><ShieldCheck size={14} />{t.active}</span><button className="btn btn-small btn-quiet" onClick={() => navigate('/tasks')}>{t.tasks}<ArrowUpRight size={13} /></button></div></article>)}</section>
  </>;
}

function ActivityList({ activity, locale, t }) {
  const actionText = (action) => {
    const labels = {
      en: { created: 'created', updated: 'updated', deleted: 'deleted', moved: 'moved', reported: 'reported' },
      fr: { created: 'a créé', updated: 'a modifié', deleted: 'a supprimé', moved: 'a déplacé', reported: 'a signalé' },
      ar: { created: 'أنشأ', updated: 'عدّل', deleted: 'حذف', moved: 'نقل', reported: 'أبلغ عن' },
    };
    return (labels[locale === 'fr-FR' ? 'fr' : locale === 'ar' ? 'ar' : 'en'][action] || action);
  };
  return <div className="activity-list">{activity.map((item) => <div className="activity-row" key={item.id}><Avatar name={item.actor} size="small" /><div className="activity-copy"><p><strong>{item.actor || 'Amira Ben Ali'}</strong> {actionText(item.action)} <b>{item.subject}</b></p><span><Clock3 size={12} />{formatDate(item.at, locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div><span className={`activity-action activity-${item.action}`}>{actionText(item.action)}</span></div>)}</div>;
}

function ActivityPage({ t, locale, activity }) {
  const items = activity;
  return <><PageHeading eyebrow={t.operations} title={t.activityTitle} subtitle={t.activitySubtitle} /><div className="panel activity-page-panel"><div className="panel-head"><div><span className="eyebrow">{t.today}</span><h2>{t.recentActivity}</h2></div><span className="count-pill">{items.length}</span></div>{items.length ? <ActivityList activity={items} locale={locale} t={t} /> : <EmptyState icon={Activity} title={t.noActivity} detail={t.noResults} />}</div><div className="local-note"><LockKeyhole size={16} /><span>{t.privacyTitle}</span><p>{t.privacyText}</p></div></>;
}

function SettingsPage({ t, language, setLanguage, theme, setTheme, onRestore }) {
  const [confirmRestore, setConfirmRestore] = useState(false);
  return <>
    <PageHeading eyebrow={t.appName} title={t.settingsTitle} subtitle={t.settingsSubtitle} />
    <div className="settings-layout"><div className="settings-main">
      <section className="panel settings-panel"><div className="settings-panel-icon icon-blue"><Globe2 size={18} /></div><div className="settings-panel-body"><div className="panel-head"><div><h2>{t.language}</h2><p>{t.selectLanguage}</p></div></div><div className="choice-row">{Object.entries(localeNames).map(([code, name]) => <button key={code} className={`choice-card ${language === code ? 'choice-selected' : ''}`} onClick={() => setLanguage(code)} aria-pressed={language === code}><span className={`language-symbol lang-${code}`}>{code.toUpperCase()}</span><strong>{name}</strong>{language === code && <span className="choice-check"><Check size={13} /></span>}</button>)}</div></div></section>
      <section className="panel settings-panel"><div className="settings-panel-icon icon-purple">{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</div><div className="settings-panel-body"><div className="panel-head"><div><h2>{t.theme}</h2><p>{t.selectTheme}</p></div></div><div className="choice-row"><button className={`choice-card ${theme === 'light' ? 'choice-selected' : ''}`} onClick={() => setTheme('light')} aria-pressed={theme === 'light'}><Sun size={19} /><strong>{t.light}</strong>{theme === 'light' && <span className="choice-check"><Check size={13} /></span>}</button><button className={`choice-card ${theme === 'dark' ? 'choice-selected' : ''}`} onClick={() => setTheme('dark')} aria-pressed={theme === 'dark'}><Moon size={19} /><strong>{t.dark}</strong>{theme === 'dark' && <span className="choice-check"><Check size={13} /></span>}</button></div></div></section>
      <section className="panel settings-panel restore-panel"><div className="settings-panel-icon icon-orange"><ArrowUpRight size={18} /></div><div className="settings-panel-body"><div className="panel-head"><div><h2>{t.restore}</h2><p>{t.restoreDescription}</p></div></div>{!confirmRestore ? <button className="btn btn-quiet" onClick={() => setConfirmRestore(true)}>{t.restore}</button> : <div className="restore-confirm"><span>{t.confirmRestore}</span><button className="btn btn-small btn-quiet" onClick={() => setConfirmRestore(false)}>{t.cancel}</button><button className="btn btn-small btn-primary" onClick={() => { onRestore(); setConfirmRestore(false); }}>{t.confirm}</button></div>}</div></section>
    </div><aside className="settings-aside"><div className="privacy-card"><span className="privacy-icon"><LockKeyhole size={18} /></span><h3>{t.privacyTitle}</h3><p>{t.privacyText}</p><div className="privacy-foot"><ShieldCheck size={15} /><span>{t.demoNotice}</span></div></div><div className="settings-help"><CircleHelp size={16} /><span>SecureNexus v1.0</span></div></aside></div>
  </>;
}

function GlobalSearch({ tasks, incidents, t, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = React.useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  const q = query.trim().toLowerCase();
  const matchesTasks = q ? tasks.filter((task) => `${task.title} ${task.id} ${task.assignee}`.toLowerCase().includes(q)).slice(0, 4) : [];
  const matchesIncidents = q ? incidents.filter((incident) => `${incident.title} ${incident.id} ${incident.asset}`.toLowerCase().includes(q)).slice(0, 4) : [];
  return <div className="modal-backdrop search-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="global-search" role="dialog" aria-modal="true" aria-label={t.search}><div className="global-search-field"><Search size={18} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /><kbd>ESC</kbd><button className="icon-btn" onClick={onClose} aria-label={t.close}><X size={16} /></button></div>{!q ? <div className="search-empty"><Command size={19} /><span>{t.search}</span><small>⌘ K</small></div> : <div className="search-results">{matchesTasks.length > 0 && <><span className="search-group-label">{t.tasks}</span>{matchesTasks.map((task) => <Link key={task.id} to="/tasks" onClick={onClose}><ListTodo size={16} /><span><strong>{task.title}</strong><small>{task.id} · {task.assignee}</small></span><ArrowUpRight size={14} /></Link>)}</>}{matchesIncidents.length > 0 && <><span className="search-group-label">{t.incidents}</span>{matchesIncidents.map((incident) => <Link key={incident.id} to="/incidents" onClick={onClose}><ShieldAlert size={16} /><span><strong>{incident.title}</strong><small>{incident.id} · {incident.asset}</small></span><ArrowUpRight size={14} /></Link>)}</>}{matchesTasks.length + matchesIncidents.length === 0 && <p>{t.noResults}</p>}</div>}</section></div>;
}

export default App;
