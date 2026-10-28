import React from 'react';
import { useApp } from '../../context/AppContext';

export default function MobileNavigation({ open, onClose }) {
  const { t } = useApp();
  if (!open) return null;
  return <button className="mobile-scrim" aria-label={t.closeNavigation} onClick={onClose} />;
}
