import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowUpRight, ArrowUp, Check, CheckCircle2, ChevronRight, ListTodo, Plus, Shield, ShieldAlert, Zap } from 'lucide-react';
import { priorities } from '../data/seedData';
import { EmptyState } from '../components/common/Ui';
import { PageHeading } from '../components/layout/PageHeader';
import { StatCard, TaskPriorityCompact, DeadlineRow, languageLabel } from '../components/dashboard/DashboardWidgets';
import { classFor, formatDate } from '../utils/formatters';
import { ActivityList } from './ActivityPage';

export function DashboardPage(props) {
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
