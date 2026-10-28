import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useApp } from '../context/AppContext';
import { localeNames } from '../i18n/translations';
import { ActivityPage } from '../pages/ActivityPage';
import { DashboardPage } from '../pages/DashboardPage';
import { IncidentsPage } from '../pages/IncidentsPage';
import { BoardPage as KanbanPage } from '../pages/KanbanPage';
import NotFoundPage from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TasksPage } from '../pages/TasksPage';
import { TeamPage } from '../pages/TeamPage';

export default function AppRouter() {
  const app = useApp();
  const pageProps = {
    t: app.t,
    locale: app.locale,
    tasks: app.tasks,
    incidents: app.incidents,
    activity: app.activity,
    onNewTask: () => app.setModal({ type: 'task' }),
    onEditTask: (task) => app.setModal({ type: 'task', task }),
    onDeleteTask: (task) => app.setPendingDelete({ kind: 'task', item: task }),
    onUpdateStatus: app.updateTaskStatus,
    onNewIncident: () => app.setModal({ type: 'incident' }),
    onEditIncident: (incident) => app.setModal({ type: 'incident', incident }),
    onDeleteIncident: (incident) => app.setPendingDelete({ kind: 'incident', item: incident }),
    addActivity: app.addActivity,
    setToast: app.setToast,
    language: app.language,
    localeNames,
    setLanguage: app.setLanguage,
    theme: app.theme,
    setTheme: app.setTheme,
    onRestore: app.restoreDemo,
  };

  return <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<DashboardPage {...pageProps} />} />
      <Route path="tasks" element={<TasksPage {...pageProps} />} />
      <Route path="kanban" element={<KanbanPage {...pageProps} />} />
      <Route path="incidents" element={<IncidentsPage {...pageProps} />} />
      <Route path="team" element={<TeamPage {...pageProps} />} />
      <Route path="activity" element={<ActivityPage {...pageProps} />} />
      <Route path="settings" element={<SettingsPage {...pageProps} />} />
      <Route path="dashboard" element={<Navigate to="/" replace />} />
      <Route path="board" element={<Navigate to="/kanban" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>;
}
