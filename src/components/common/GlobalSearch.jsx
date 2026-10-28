import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Command, ListTodo, Search, ShieldAlert, X } from 'lucide-react';

export function GlobalSearch({ tasks, incidents, t, onClose }) {
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
