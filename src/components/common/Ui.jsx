import { useEffect } from 'react';
import { FileCheck2, Search, X } from 'lucide-react';
import { teamMembers } from '../../data/seedData';
import { classFor } from '../../utils/formatters';

export function Avatar({ name, size = 'normal' }) {
  const member = teamMembers.find((person) => person.name === name);
  const initials = member ? member.initials : (name || '?').split(' ').map((part) => part[0]).join('').slice(0, 2);
  return <span className={`avatar ${size} avatar-${member ? member.color : 'blue'}`}>{initials}</span>;
}

export function Badge({ value, kind = 'status', t }) {
  return <span className={`badge ${kind}-${classFor(value)}`}>{t[value] || value}</span>;
}

export function EmptyState({ icon: Icon = Search, title, detail }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={20} /></span><strong>{title}</strong><span>{detail}</span></div>;
}

export function Field({ label, children, required = false, wide = false }) {
  return <label className={`field ${wide ? 'field-wide' : ''}`}><span>{label}{required && <i className="required-mark"> *</i>}</span>{children}</label>;
}

export function Modal({ title, onClose, children, size = '', closeLabel = 'Close' }) {
  useEffect(() => {
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-head"><div><span className="eyebrow">{title}</span></div><button className="icon-btn" type="button" onClick={onClose} aria-label={closeLabel}><X size={18} /></button></header>
      {children}
    </section>
  </div>;
}

export function RowActions({ onEdit, onDelete, t }) {
  return <div className="row-actions"><button className="icon-btn" onClick={onEdit} aria-label={t.edit}><FileCheck2 size={16} /></button><button className="icon-btn action-delete" onClick={onDelete} aria-label={t.delete}><X size={16} /></button></div>;
}
