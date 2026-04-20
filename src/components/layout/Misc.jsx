import React from 'react';
import { ShieldCheck } from 'lucide-react';

const announcements = [
  '🚀 Welcome to the SMC e-TDR Portal. Platform is now LIVE and secured by Blockchain.',
  '🔐 Modernizing land issuance through Distributed Ledger Technology (DLT).',
];

export const AnnouncementTicker = () => {
  const text = announcements.join('       ◆       ');
  return (
    <div className="ticker-bar">
      <div className="ticker-label">NOTICE</div>
      <div className="ticker-content">
        <div className="ticker-text">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</div>
      </div>
    </div>
  );
};

export const GovBanner = () => (
  <div className="gov-banner">
    <ShieldCheck size={13} color="var(--success)" />
    <span className="banner-badge">Official Portal</span>
    <span className="banner-text">of Surat Municipal Corporation — Government of Gujarat</span>
  </div>
);
