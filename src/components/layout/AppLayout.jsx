import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { GlobalSearch } from '../common/GlobalSearch';
import { Modal } from '../common/Ui';
import IncidentForm from '../incidents/IncidentForm';
import TaskForm from '../tasks/TaskForm';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const {
    t, tasks, incidents, theme, modal, setModal, pendingDelete, setPendingDelete,
    toast, setToast, deleteItem, saveTask, saveIncident, searchOpen, setSearchOpen,
  } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSearchOpen]);

  return <div className="app-shell min-h-screen" data-theme={theme}>
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
    <main className="main-shell">
      <Header onMenu={() => setMenuOpen(true)} />
      <div className="page-container">
        <Outlet />
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
