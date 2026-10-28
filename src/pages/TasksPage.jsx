import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Check, CheckCircle2, Clock3, Command, ListTodo, Plus, Zap } from 'lucide-react';
import { priorities } from '../data/seedData';
import { Avatar, Badge, EmptyState, RowActions } from '../components/common/Ui';
import { PageHeading } from '../components/layout/PageHeader';
import { formatDate } from '../utils/formatters';
import { StatCard } from '../components/dashboard/DashboardWidgets';
import { TaskToolbar, filterTasks } from '../components/tasks/TaskFilters';

export function TasksPage({ t, locale, tasks, onNewTask, onEditTask, onDeleteTask }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [sort, setSort] = useState('deadline');
  const filtered = useMemo(() => filterTasks(tasks, search, filters).sort((a, b) => sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : sort === 'priority' ? priorities.indexOf(b.priority) - priorities.indexOf(a.priority) : a.dueDate.localeCompare(b.dueDate)), [tasks, search, filters, sort]);
  return <>
    <PageHeading eyebrow={t.workspace} title={t.tasksTitle} subtitle={t.tasksSubtitle} action={<button className="btn btn-primary" onClick={onNewTask}><Plus size={16} />{t.newTask}</button>} />
    <section className="stats-grid task-stats"><StatCard label={t.totalTasks} value={tasks.length} icon={ListTodo} color="blue" trend={t.all} trendIcon={ArrowUpRight} /><StatCard label={t.pendingTasks} value={tasks.filter((task) => task.status === 'To Do').length} icon={Clock3} color="orange" trend={t.active} trendIcon={ArrowUpRight} /><StatCard label={t.inProgress} value={tasks.filter((task) => task.status === 'In Progress').length} icon={Zap} color="teal" trend={t.active} trendIcon={ArrowUpRight} /><StatCard label={t.completed} value={tasks.filter((task) => task.status === 'Done').length} icon={CheckCircle2} color="green" trend={t.thisWeek} trendIcon={Check} /></section>
    <section className="panel list-panel"><div className="panel-head"><div><span className="eyebrow">{t.workspace}</span><h2>{t.allTasks} <span className="count-pill">{filtered.length}</span></h2></div><Link to="/kanban" className="text-link"><Command size={15} />{t.board}</Link></div><TaskToolbar t={t} search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} /><div className="table-scroll"><table className="data-table"><thead><tr><th>{t.title}</th><th>{t.assignee}</th><th>{t.priority}</th><th>{t.status}</th><th>{t.dueDate}<ArrowDown size={13} /></th><th>{t.category}</th><th aria-label={t.actionLabel} /></tr></thead><tbody>{filtered.map((task) => <tr key={task.id}><td><div className="table-task-title"><strong>{task.title}</strong><small>{task.id} · {task.description}</small></div></td><td><span className="table-assignee"><Avatar name={task.assignee} size="tiny" />{task.assignee}</span></td><td><Badge value={task.priority} kind="priority" t={t} /></td><td><Badge value={task.status} t={t} /></td><td><span className={task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== 'Done' ? 'text-overdue' : ''}>{formatDate(task.dueDate, locale)}</span></td><td><span className="category-label">{t[task.category]}</span></td><td><RowActions onEdit={() => onEditTask(task)} onDelete={() => onDeleteTask(task)} t={t} /></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState icon={ListTodo} title={t.noTasks} detail={t.noResults} />}</div></section>
  </>;
}
