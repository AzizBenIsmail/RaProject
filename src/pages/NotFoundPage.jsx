import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotFoundPage() {
  const { t } = useApp();
  return <section className="not-found-page">
    <span className="not-found-icon"><ShieldAlert size={25} /></span>
    <span className="eyebrow">404 · {t.appName}</span>
    <h1>{t.notFoundTitle}</h1>
    <p>{t.notFoundDescription}</p>
    <Link to="/" className="btn btn-primary"><ArrowLeft size={15} />{t.backToDashboard}</Link>
  </section>;
}
