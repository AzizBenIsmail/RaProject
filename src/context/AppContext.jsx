import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { translations } from '../i18n/translations';
import { readValidArray } from '../utils/formatters';
import { seedActivity, seedIncidents, seedTasks } from '../data/seedData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [storedTasks, setTasks] = usePersistentState('securenexus.tasks', seedTasks);
  const [storedIncidents, setIncidents] = usePersistentState('securenexus.incidents', seedIncidents);
  const [storedActivity, setActivity] = usePersistentState('securenexus.activity', seedActivity);
  const [language, setLanguage] = usePersistentState('securenexus.language', 'en');
  const [theme, setTheme] = usePersistentState('securenexus.theme', 'dark');
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const tasks = useMemo(() => readValidArray(storedTasks, seedTasks, 'tasks'), [storedTasks]);
  const incidents = useMemo(() => readValidArray(storedIncidents, seedIncidents, 'incidents'), [storedIncidents]);
  const activity = useMemo(() => readValidArray(storedActivity, seedActivity, 'activity'), [storedActivity]);
  const t = translations[language] || translations.en;
  const locale = language === 'ar' ? 'ar' : language === 'fr' ? 'fr-FR' : 'en-US';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
  }, [language, theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addActivity = useCallback((action, subject) => {
    setActivity((previous) => [
      { id: `${Date.now()}-${Math.random()}`, action, subject, at: new Date().toISOString(), actor: 'Amira Ben Ali' },
      ...readValidArray(previous, seedActivity, 'activity'),
    ].slice(0, 100));
  }, [setActivity]);

  const saveTask = useCallback((values) => {
    if (modal.task) {
      const existing = modal.task;
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
  }, [addActivity, modal, setTasks, t.saved, tasks]);

  const saveIncident = useCallback((values) => {
    if (modal.incident) {
      const existing = modal.incident;
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
  }, [addActivity, incidents, modal, setIncidents, t.saved]);

  const deleteItem = useCallback(() => {
    if (pendingDelete?.kind === 'task') {
      setTasks((previous) => readValidArray(previous, seedTasks, 'tasks').filter((task) => task.id !== pendingDelete.item.id));
      addActivity('deleted', pendingDelete.item.title);
    } else if (pendingDelete?.kind === 'incident') {
      setIncidents((previous) => readValidArray(previous, seedIncidents, 'incidents').filter((incident) => incident.id !== pendingDelete.item.id));
      addActivity('deleted', pendingDelete.item.id);
    }
    setPendingDelete(null);
    setToast(t.deletedMessage);
  }, [addActivity, pendingDelete, setIncidents, setTasks, t.deletedMessage]);

  const updateTaskStatus = useCallback((taskId, status) => {
    const task = tasks.find((item) => item.id === taskId);
    setTasks((previous) => readValidArray(previous, seedTasks, 'tasks').map((item) => item.id === taskId ? { ...item, status } : item));
    if (task && task.status !== status) addActivity('moved', `${task.title} · ${t[status]}`);
  }, [addActivity, setTasks, t, tasks]);

  const restoreDemo = useCallback(() => {
    setTasks(seedTasks);
    setIncidents(seedIncidents);
    setActivity(seedActivity);
    setToast(t.demoRestored);
  }, [setActivity, setIncidents, setTasks, t.demoRestored]);

  const value = useMemo(() => ({
    tasks, incidents, activity, language, setLanguage, theme, setTheme, t, locale,
    modal, setModal, pendingDelete, setPendingDelete, toast, setToast,
    searchOpen, setSearchOpen, saveTask, saveIncident, deleteItem, updateTaskStatus,
    restoreDemo, addActivity,
  }), [tasks, incidents, activity, language, setLanguage, theme, setTheme, t, locale, modal, pendingDelete, toast, searchOpen, saveTask, saveIncident, deleteItem, updateTaskStatus, restoreDemo, addActivity]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider.');
  return context;
}
