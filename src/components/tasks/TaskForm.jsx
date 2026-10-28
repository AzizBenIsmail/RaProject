import React, { useState } from 'react';
import { categories, priorities, taskStatuses, teamMembers } from '../../data/seedData';
import { Field, Modal } from '../common/Ui';

export default function TaskForm({ task, t, onClose, onSubmit }) {
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: form.get('title').trim(), description: form.get('description').trim(),
      assignee: form.get('assignee'), priority: form.get('priority'), status: form.get('status'),
      dueDate: form.get('dueDate'), category: form.get('category'),
      tags: form.get('tags').split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    if (!values.title || !values.description || !values.assignee || !values.dueDate) {
      setError(t.required);
      return;
    }
    onSubmit(values);
  };
  return <Modal title={task ? t.edit : t.newTask} onClose={onClose} closeLabel={t.close}>
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t.title} required wide><input name="title" defaultValue={task?.title || ''} required autoFocus placeholder="e.g. Review endpoint alerts" /></Field>
      <Field label={t.description} required wide><textarea name="description" rows="3" defaultValue={task?.description || ''} required placeholder="Add context and expected outcome..." /></Field>
      <Field label={t.assignee} required><select name="assignee" defaultValue={task?.assignee || teamMembers[0].name} required>{teamMembers.map((member) => <option key={member.name}>{member.name}</option>)}</select></Field>
      <Field label={t.category}><select name="category" defaultValue={task?.category || categories[0]}>{categories.map((category) => <option key={category} value={category}>{t[category]}</option>)}</select></Field>
      <Field label={t.priority}><select name="priority" defaultValue={task?.priority || 'Medium'}>{priorities.map((priority) => <option key={priority} value={priority}>{t[priority]}</option>)}</select></Field>
      <Field label={t.status}><select name="status" defaultValue={task?.status || 'To Do'}>{taskStatuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select></Field>
      <Field label={t.dueDate} required><input type="date" name="dueDate" defaultValue={task?.dueDate || ''} required /></Field>
      <Field label={t.tags}><input name="tags" defaultValue={task?.tags?.join(', ') || ''} placeholder="security, endpoint" /></Field>
      {error && <p className="form-error field-wide" role="alert">{error}</p>}
      <footer className="form-actions field-wide"><button className="btn btn-quiet" type="button" onClick={onClose}>{t.cancel}</button><button className="btn btn-primary" type="submit">{task ? t.saveTask : t.createTask}</button></footer>
    </form>
  </Modal>;
}
