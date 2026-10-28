import { ArrowUp, ListTodo } from 'lucide-react';
import { Avatar, Badge } from '../common/Ui';
import { classFor, formatDate } from '../../utils/formatters';

export function TaskPriorityCompact({ task, t }) {
  return <div className="incident-compact"><span className={`incident-marker marker-${classFor(task.priority)}`}><ListTodo size={15} /></span><span className="compact-main"><strong>{task.title}</strong><small>{task.id} <i /> {task.assignee}</small></span><Badge kind="priority" value={task.priority} t={t} /></div>;
}

export function languageLabel(locale) {
  return locale === 'fr-FR' ? 'de votre équipe' : locale === 'ar' ? 'من الفريق' : 'of team';
}

export function StatCard({ label, value, icon: Icon, color, trend, trendIcon: TrendIcon = ArrowUp }) {
  return <article className="stat-card"><div className={`stat-icon stat-${color}`}><Icon size={18} /></div><span className="stat-label">{label}</span><div className="stat-value">{value}<span className={`stat-trend trend-${color}`}><TrendIcon size={13} />{trend}</span></div><div className={`stat-sparkline spark-${color}`}><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>;
}

export function DeadlineRow({ task, t, locale }) {
  return <div className="deadline-row"><span className={`deadline-date ${task.dueDate < new Date().toISOString().slice(0, 10) ? 'deadline-late' : ''}`}><strong>{formatDate(task.dueDate, locale, { day: '2-digit' })}</strong><small>{formatDate(task.dueDate, locale, { month: 'short' })}</small></span><span className="compact-main"><strong>{task.title}</strong><small><Avatar name={task.assignee} size="tiny" />{task.assignee}</small></span><Badge kind="priority" value={task.priority} t={t} /></div>;
}
