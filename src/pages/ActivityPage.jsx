import { Activity, Clock3, LockKeyhole } from 'lucide-react';
import { Avatar, EmptyState } from '../components/common/Ui';
import { PageHeading } from '../components/layout/PageHeader';
import { formatDate } from '../utils/formatters';

export function ActivityList({ activity, locale, t }) {
  const actionText = (action) => {
    const labels = {
      en: { created: 'created', updated: 'updated', deleted: 'deleted', moved: 'moved', reported: 'reported' },
      fr: { created: 'a créé', updated: 'a modifié', deleted: 'a supprimé', moved: 'a déplacé', reported: 'a signalé' },
      ar: { created: 'أنشأ', updated: 'عدّل', deleted: 'حذف', moved: 'نقل', reported: 'أبلغ عن' },
    };
    return (labels[locale === 'fr-FR' ? 'fr' : locale === 'ar' ? 'ar' : 'en'][action] || action);
  };
  return <div className="activity-list">{activity.map((item) => <div className="activity-row" key={item.id}><Avatar name={item.actor} size="small" /><div className="activity-copy"><p><strong>{item.actor || 'Amira Ben Ali'}</strong> {actionText(item.action)} <b>{item.subject}</b></p><span><Clock3 size={12} />{formatDate(item.at, locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div><span className={`activity-action activity-${item.action}`}>{actionText(item.action)}</span></div>)}</div>;
}

export function ActivityPage({ t, locale, activity }) {
  const items = activity;
  return <><PageHeading eyebrow={t.operations} title={t.activityTitle} subtitle={t.activitySubtitle} /><div className="panel activity-page-panel"><div className="panel-head"><div><span className="eyebrow">{t.today}</span><h2>{t.recentActivity}</h2></div><span className="count-pill">{items.length}</span></div>{items.length ? <ActivityList activity={items} locale={locale} t={t} /> : <EmptyState icon={Activity} title={t.noActivity} detail={t.noResults} />}</div><div className="local-note"><LockKeyhole size={16} /><span>{t.privacyTitle}</span><p>{t.privacyText}</p></div></>;
}
