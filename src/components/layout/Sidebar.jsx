import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Activity, Command, LayoutDashboard, ListTodo, LockKeyhole, MoreHorizontal,
  Settings, ShieldAlert, ShieldCheck, Users,
} from 'lucide-react';
import { Avatar } from '../common/Ui';
import { useApp } from '../../context/AppContext';

const navigation = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard, group: 'workspace' },
  { to: '/tasks', key: 'tasks', icon: ListTodo, group: 'workspace' },
  { to: '/kanban', key: 'board', icon: Command, group: 'workspace' },
  { to: '/incidents', key: 'incidents', icon: ShieldAlert, group: 'operations' },
  { to: '/team', key: 'team', icon: Users, group: 'operations' },
  { to: '/activity', key: 'activity', icon: Activity, group: 'operations' },
  { to: '/settings', key: 'settings', icon: Settings, group: 'operations' },
];

export default function Sidebar({ open, onClose }) {
  const { t, language, incidents } = useApp();
  const navigate = useNavigate();
  const attentionCount = incidents.filter((incident) => incident.status !== 'Resolved' && ['Critical', 'High'].includes(incident.severity)).length;
  const renderLinks = (group) => navigation.filter((item) => item.group === group).map((item) => {
    const Icon = item.icon;
    return <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon size={17} strokeWidth={1.8} /><span>{t[item.key]}</span>{item.key === 'incidents' && attentionCount > 0 && <span className="nav-count">{attentionCount}</span>}</NavLink>;
  });
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <Link to="/" className="brand" onClick={onClose}><span className="brand-mark"><ShieldCheck size={20} strokeWidth={2.2} /></span><span className="brand-name">Secure<span>Nexus</span><small>{t.tagline}</small></span></Link>
    <div className="nav-section-title">{t.workspace}</div>
    <nav className="side-nav" aria-label={t.workspace}>{renderLinks('workspace')}</nav>
    <div className="nav-section-title operations-label">{t.operations}</div>
    <nav className="side-nav" aria-label={t.operations}>{renderLinks('operations')}</nav>
    <div className="sidebar-bottom">
      <div className="secure-card"><div className="secure-card-icon"><LockKeyhole size={15} /></div><div><strong>{t.privacyTitle}</strong><p>{language === 'fr' ? 'Votre navigateur, vos données.' : language === 'ar' ? 'بياناتك في متصفحك.' : 'Your browser. Your data.'}</p></div><ShieldCheck size={14} className="secure-check" /></div>
      <div className="profile"><Avatar name="Amira Ben Ali" /><span className="profile-info"><strong>Amira Ben Ali</strong><small>{language === 'fr' ? 'Responsable sécurité' : language === 'ar' ? 'قائدة الأمن' : 'Security Lead'}</small></span><button className="icon-btn profile-more" aria-label={t.settings} onClick={() => navigate('/settings')}><MoreHorizontal size={19} /></button></div>
    </div>
  </aside>;
}
