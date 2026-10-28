import { useState } from 'react';
import { Clock3, Plus, Shield } from 'lucide-react';
import { taskStatuses } from '../data/seedData';
import { Avatar, RowActions } from '../components/common/Ui';
import { PageHeading } from '../components/layout/PageHeader';
import { classFor, formatDate } from '../utils/formatters';
import { TaskToolbar, filterTasks } from '../components/tasks/TaskFilters';

export function BoardPage({ t, tasks, onNewTask, onEditTask, onDeleteTask, onUpdateStatus }) {
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
