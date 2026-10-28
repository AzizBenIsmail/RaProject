import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { incidentStatuses, incidentTypes, priorities, teamMembers } from '../../data/seedData';
import { Field, Modal } from '../common/Ui';

export default function IncidentForm({ incident, t, onClose, onSubmit }) {
  const [error, setError] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      title: form.get('title').trim(), description: form.get('description').trim(),
      type: form.get('type'), severity: form.get('severity'), status: form.get('status'),
      detectedAt: form.get('detectedAt'), asset: form.get('asset').trim(),
      assignee: form.get('assignee'), actions: form.get('actions').trim(), notes: form.get('notes').trim(),
    };
    if (!values.title || !values.description || !values.detectedAt || !values.asset) {
      setError(t.required);
      return;
    }
    onSubmit(values);
  };
  const currentDate = new Date().toISOString().slice(0, 16);
  return <Modal title={incident ? t.edit : t.reportNew} onClose={onClose} closeLabel={t.close} size="modal-large">
    <form className="form-grid" onSubmit={handleSubmit}>
      {incident && <div className="field-wide incident-ref"><span className="ref-icon"><Shield size={15} /></span><span>{t.reference}</span><strong>{incident.id}</strong></div>}
      <Field label={t.title} required wide><input name="title" defaultValue={incident?.title || ''} required autoFocus /></Field>
      <Field label={t.description} required wide><textarea name="description" rows="3" defaultValue={incident?.description || ''} required /></Field>
      <Field label={t.type}><select name="type" defaultValue={incident?.type || incidentTypes[0]}>{incidentTypes.map((type) => <option key={type} value={type}>{t[type]}</option>)}</select></Field>
      <Field label={t.severity}><select name="severity" defaultValue={incident?.severity || 'Medium'}>{priorities.map((priority) => <option key={priority} value={priority}>{t[priority]}</option>)}</select></Field>
      <Field label={t.status}><select name="status" defaultValue={incident?.status || 'Detected'}>{incidentStatuses.map((status) => <option key={status} value={status}>{t[status]}</option>)}</select></Field>
      <Field label={t.detectedAt} required><input type="datetime-local" name="detectedAt" defaultValue={incident?.detectedAt || currentDate} required /></Field>
      <Field label={t.asset} required wide><input name="asset" defaultValue={incident?.asset || ''} required placeholder="e.g. payment-api-prod-01" /></Field>
      <Field label={t.assignee}><select name="assignee" defaultValue={incident?.assignee || teamMembers[0].name}>{teamMembers.map((member) => <option key={member.name}>{member.name}</option>)}</select></Field>
      <Field label={t.actionsTaken} wide><textarea name="actions" rows="2" defaultValue={incident?.actions || ''} /></Field>
      <Field label={t.notes} wide><textarea name="notes" rows="2" defaultValue={incident?.notes || ''} /></Field>
      {error && <p className="form-error field-wide" role="alert">{error}</p>}
      <footer className="form-actions field-wide"><button className="btn btn-quiet" type="button" onClick={onClose}>{t.cancel}</button><button className="btn btn-primary" type="submit">{incident ? t.saveIncident : t.createIncident}</button></footer>
    </form>
  </Modal>;
}
