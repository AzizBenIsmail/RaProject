import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, MoreHorizontal, ShieldCheck, Users } from 'lucide-react';
import { teamMembers } from '../data/seedData';
import { Avatar } from '../components/common/Ui';
import { PageHeading } from '../components/layout/PageHeader';

export function TeamPage({ t, tasks, incidents }) {
  const navigate = useNavigate();
  const workload = (name) => tasks.filter((task) => task.assignee === name && task.status !== 'Done').length;
  const handled = (name) => incidents.filter((incident) => incident.assignee === name && incident.status !== 'Resolved').length;
  return <>
    <PageHeading eyebrow={t.operations} title={t.teamTitle} subtitle={t.teamSubtitle} />
    <div className="team-summary"><span className="team-summary-icon"><Users size={18} /></span><div><strong>{teamMembers.length} <span>{t.teamMembers.toLowerCase()}</span></strong><small>{t.demoNotice}</small></div><div className="team-avatar-stack">{teamMembers.slice(0, 4).map((member) => <Avatar key={member.name} name={member.name} />)}<span className="avatar avatar-more">+1</span></div></div>
    <section className="team-grid">{teamMembers.map((member) => <article className="panel team-card" key={member.name}><div className="team-card-top"><Avatar name={member.name} size="large" /><span className="online-indicator"><i />{t.active}</span><button className="icon-btn" aria-label={member.name}><MoreHorizontal size={18} /></button></div><h2>{member.name}</h2><span className="team-role">{member.role}</span><div className="team-focus"><span>{t.focus}</span><strong>{member.focus}</strong></div><div className="team-metrics"><span><strong>{workload(member.name)}</strong><small>{t.assignedTasks}</small></span><i /><span><strong>{handled(member.name)}</strong><small>{t.openIncidents}</small></span></div><div className="team-card-foot"><span className="team-secure"><ShieldCheck size={14} />{t.active}</span><button className="btn btn-small btn-quiet" onClick={() => navigate('/tasks')}>{t.tasks}<ArrowUpRight size={13} /></button></div></article>)}</section>
  </>;
}
