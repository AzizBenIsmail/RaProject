import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronRight, Globe2, Menu, Moon, Search, Sun } from 'lucide-react';
import { Avatar } from '../common/Ui';
import { useApp } from '../../context/AppContext';
import { localeNames } from '../../i18n/translations';

const titles = {
  '/': 'dashboard', '/tasks': 'tasks', '/kanban': 'board', '/incidents': 'incidents',
  '/team': 'team', '/activity': 'activity', '/settings': 'settings',
};

export default function Header({ onMenu }) {
  const { t, language, setLanguage, theme, setTheme, incidents, setSearchOpen, setToast } = useApp();
  const location = useLocation();
  const title = t[titles[location.pathname] || 'dashboard'];
  const isLight = theme === 'light';
  return <header className="topbar">
    <div className="topbar-leading"><button className="icon-btn mobile-menu" onClick={onMenu} aria-label={t.openNavigation}><Menu size={20} /></button><div className="breadcrumbs"><span>{t.appName}</span><ChevronRight size={14} /><strong>{title}</strong></div></div>
    <div className="topbar-actions"><button className="top-search" onClick={() => setSearchOpen(true)}><Search size={16} /><span>{t.search}</span><kbd>Ctrl K</kbd></button><button className="icon-btn theme-toggle" aria-label={isLight ? t.dark : t.light} onClick={() => setTheme(isLight ? 'dark' : 'light')}>{isLight ? <Moon size={18} /> : <Sun size={18} />}</button><label className="language-switch"><Globe2 size={15} /><select className="language-toggle" aria-label={t.language} value={language} onChange={(event) => setLanguage(event.target.value)}>{Object.entries(localeNames).map(([code, name]) => <option value={code} key={code}>{code.toUpperCase()} · {name}</option>)}</select></label><button className="icon-btn notification-btn" aria-label={t.attention} onClick={() => { const count = incidents.filter((incident) => ['Critical', 'High'].includes(incident.severity) && incident.status !== 'Resolved').length; setToast(`${count} ${t.highAttention.toLowerCase()}`); }}><Bell size={18} /><i /></button><Avatar name="Amira Ben Ali" /></div>
  </header>;
}
