export const seedTasks = [
  { id: 'T-1042', title: 'Patch exposed OpenSSL servers', description: 'Apply the latest security patches to all internet-facing Linux hosts and verify service health.', assignee: 'Amira Ben Ali', priority: 'Critical', status: 'In Progress', dueDate: '2026-10-29', category: 'Vulnerability Management', createdAt: '2026-10-20', tags: ['CVE-2026', 'external'] },
  { id: 'T-1041', title: 'Review privileged access policies', description: 'Audit administrator group membership and enforce least-privilege access across production.', assignee: 'Karim Haddad', priority: 'High', status: 'To Do', dueDate: '2026-10-30', category: 'Security Audit', createdAt: '2026-10-21', tags: ['IAM', 'quarterly'] },
  { id: 'T-1040', title: 'Hunt for suspicious PowerShell activity', description: 'Investigate unusual encoded PowerShell executions observed in endpoint telemetry.', assignee: 'Lina Mansour', priority: 'High', status: 'Under Review', dueDate: '2026-10-28', category: 'Threat Hunting', createdAt: '2026-10-18', tags: ['endpoint'] },
  { id: 'T-1039', title: 'Tune endpoint detection rules', description: 'Reduce false positives for the new credential-dumping detection rule without lowering coverage.', assignee: 'Youssef Rahal', priority: 'Medium', status: 'In Progress', dueDate: '2026-11-02', category: 'Monitoring', createdAt: '2026-10-22', tags: ['EDR'] },
  { id: 'T-1038', title: 'Complete cloud configuration review', description: 'Validate encryption, network exposure, and audit logging across cloud storage accounts.', assignee: 'Amira Ben Ali', priority: 'Medium', status: 'To Do', dueDate: '2026-11-04', category: 'Compliance', createdAt: '2026-10-23', tags: ['cloud', 'SOC 2'] },
  { id: 'T-1037', title: 'Document incident response playbook', description: 'Update containment and communication steps for suspected business email compromise.', assignee: 'Karim Haddad', priority: 'Low', status: 'Done', dueDate: '2026-10-25', category: 'Incident Response', createdAt: '2026-10-16', tags: ['playbook'] },
  { id: 'T-1036', title: 'Investigate anomalous outbound traffic', description: 'Correlate firewall and DNS logs for the traffic spike reported by network monitoring.', assignee: 'Lina Mansour', priority: 'High', status: 'In Progress', dueDate: '2026-10-28', category: 'Threat Hunting', createdAt: '2026-10-19', tags: ['network'] },
  { id: 'T-1035', title: 'Rotate service account credentials', description: 'Rotate credentials for scheduled jobs and confirm dependent integrations are operational.', assignee: 'Youssef Rahal', priority: 'Medium', status: 'Under Review', dueDate: '2026-11-01', category: 'Vulnerability Management', createdAt: '2026-10-17', tags: ['IAM'] },
  { id: 'T-1034', title: 'Validate SIEM alert escalation paths', description: 'Test on-call routing and escalation acknowledgements for priority-one alerts.', assignee: 'Nadia Trabelsi', priority: 'Low', status: 'Done', dueDate: '2026-10-26', category: 'Monitoring', createdAt: '2026-10-15', tags: ['SIEM'] },
  { id: 'T-1033', title: 'Review database backup permissions', description: 'Check access controls and retention settings for critical database backups.', assignee: 'Nadia Trabelsi', priority: 'Medium', status: 'To Do', dueDate: '2026-11-06', category: 'Security Audit', createdAt: '2026-10-24', tags: ['database'] },
];

export const seedIncidents = [
  { id: 'INC-2026-084', title: 'Suspicious sign-in from unfamiliar location', description: 'Multiple failed sign-ins followed by a successful login to a finance account from an unrecognized location.', type: 'Unauthorized Access', severity: 'Critical', status: 'Investigating', detectedAt: '2026-10-28T08:42', asset: 'Microsoft 365 — Finance', assignee: 'Amira Ben Ali', actions: 'Revoked active sessions; account password reset initiated.', notes: 'Reviewing sign-in logs and MFA challenge history.' },
  { id: 'INC-2026-083', title: 'Ransomware alert on file server', description: 'Endpoint monitoring identified rapid file renames and an attempted shadow-copy deletion.', type: 'Ransomware', severity: 'Critical', status: 'Contained', detectedAt: '2026-10-28T06:18', asset: 'FS-EU-02', assignee: 'Karim Haddad', actions: 'Isolated host from network; blocked related indicators.', notes: 'No confirmed encryption on shared volumes. Forensic image in progress.' },
  { id: 'INC-2026-082', title: 'Credential-harvesting email reported', description: 'Several employees received a spoofed document-sharing invitation with a credential capture link.', type: 'Phishing', severity: 'High', status: 'Investigating', detectedAt: '2026-10-27T15:06', asset: 'Corporate email', assignee: 'Lina Mansour', actions: 'Sender domain blocked; message removed from reported inboxes.', notes: 'Checking click telemetry and expanding mailbox search.' },
  { id: 'INC-2026-081', title: 'Traffic spike against public API', description: 'An unusual volume of requests targeted the public API endpoint over a 12-minute period.', type: 'DDoS', severity: 'Medium', status: 'Resolved', detectedAt: '2026-10-26T21:33', asset: 'api-gateway-eu-west', assignee: 'Youssef Rahal', actions: 'Rate limiting enabled; upstream mitigation activated.', notes: 'Traffic returned to baseline; no customer data affected.' },
  { id: 'INC-2026-080', title: 'Malicious attachment quarantined', description: 'Email gateway quarantined a document containing a suspected downloader payload.', type: 'Malware', severity: 'Low', status: 'Resolved', detectedAt: '2026-10-25T10:14', asset: 'Email gateway', assignee: 'Nadia Trabelsi', actions: 'Attachment quarantined and sender blocked.', notes: 'No users opened the attachment.' },
  { id: 'INC-2026-079', title: 'Unexpected public storage exposure', description: 'A scheduled cloud posture scan detected a storage bucket with public read access.', type: 'Data Breach', severity: 'High', status: 'Contained', detectedAt: '2026-10-24T11:50', asset: 'customer-exports-eu', assignee: 'Amira Ben Ali', actions: 'Public access disabled; access logs exported for review.', notes: 'Assessing exposure window and available object access records.' },
];

export const teamMembers = [
  { name: 'Amira Ben Ali', role: 'Security Lead', focus: 'Cloud security', initials: 'AB', color: 'violet' },
  { name: 'Karim Haddad', role: 'Incident Responder', focus: 'Digital forensics', initials: 'KH', color: 'blue' },
  { name: 'Lina Mansour', role: 'Threat Hunter', focus: 'Detection engineering', initials: 'LM', color: 'teal' },
  { name: 'Youssef Rahal', role: 'Security Analyst', focus: 'Network defense', initials: 'YR', color: 'orange' },
  { name: 'Nadia Trabelsi', role: 'GRC Analyst', focus: 'Compliance & audit', initials: 'NT', color: 'rose' },
];

export const seedActivity = [
  { id: 'ACT-006', action: 'updated', subject: 'Hunt for suspicious PowerShell activity', actor: 'Lina Mansour', at: '2026-10-28T09:18:00' },
  { id: 'ACT-005', action: 'reported', subject: 'INC-2026-084', actor: 'Amira Ben Ali', at: '2026-10-28T08:42:00' },
  { id: 'ACT-004', action: 'moved', subject: 'Patch exposed OpenSSL servers · In Progress', actor: 'Karim Haddad', at: '2026-10-27T16:05:00' },
  { id: 'ACT-003', action: 'reported', subject: 'INC-2026-083', actor: 'Karim Haddad', at: '2026-10-28T06:18:00' },
];

export const taskStatuses = ['To Do', 'In Progress', 'Under Review', 'Done'];
export const priorities = ['Low', 'Medium', 'High', 'Critical'];
export const categories = ['Vulnerability Management', 'Security Audit', 'Threat Hunting', 'Monitoring', 'Incident Response', 'Compliance'];
export const incidentStatuses = ['Detected', 'Investigating', 'Contained', 'Resolved'];
export const incidentTypes = ['Phishing', 'Malware', 'Ransomware', 'DDoS', 'Unauthorized Access', 'Data Breach', 'Other'];
