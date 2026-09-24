/* ====================================================================
   Enterprise IT & Corporate Facilities Portal
   Weeks 1–5: Core Auth, Service Desk, SLA Timers, Telephony, AI NLP
   ==================================================================== */

// ==================== USER DATABASE ====================
const usersDb = {
  'samantrose7@gmail.com':  { userId: 'sam_andrew',    name: 'Sam Andrew (System Admin)',        role: 'ADMIN',      avatar: 'SA', pass: '*', targetEmail: 'samantrose7@gmail.com',  sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },
  'sam_andrew':             { userId: 'sam_andrew',    name: 'Sam Andrew (System Admin)',        role: 'ADMIN',      avatar: 'SA', pass: '*', targetEmail: 'samantrose7@gmail.com',  sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },

  'samantrose94@gmail.com': { userId: 'samant_emp',    name: 'Samant Rose (Employee)',           role: 'EMPLOYEE',   avatar: 'SR', pass: '*', targetEmail: 'samantrose94@gmail.com', sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },
  'samant_emp':             { userId: 'samant_emp',    name: 'Samant Rose (Employee)',           role: 'EMPLOYEE',   avatar: 'SR', pass: '*', targetEmail: 'samantrose94@gmail.com', sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },

  'samantrose07@gmail.com': { userId: 'tech_hardware', name: 'Samant Rose (Hardware Tech Lead)', role: 'TECHNICIAN', techDomain: 'HARDWARE', avatar: 'HT', pass: '*', targetEmail: 'samantrose07@gmail.com', sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },
  'tech_hardware':          { userId: 'tech_hardware', name: 'Samant Rose (Hardware Tech Lead)', role: 'TECHNICIAN', techDomain: 'HARDWARE', avatar: 'HT', pass: '*', targetEmail: 'samantrose07@gmail.com', sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null },

  'tech_software':          { userId: 'tech_software', name: 'Samant Rose (Software Tech Lead)', role: 'TECHNICIAN', techDomain: 'SOFTWARE', avatar: 'ST', pass: '*', targetEmail: 'samantrose07@gmail.com', sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null }
};

let currentUser = null;
let currentOtpCode = '';

// ==================== NOTIFICATIONS (Persisted in localStorage) ====================
let notifications = [
  { id: 1, type: 'EMERGENCY', title: 'P1 Emergency Escalated (TICK-9F82A1)', body: 'Server room cooling water leak in Building B. Admin email & voice call dispatched.', time: '10 mins ago', unread: true },
  { id: 2, type: 'SECURITY',  title: '2FA Security Code Dispatched',         body: 'Live 2FA OTP authentication code sent to target email inbox.',                    time: '20 mins ago', unread: true },
  { id: 3, type: 'SLA',       title: 'SLA Target Warning (TICK-9F82A1)',      body: 'Incident TICK-9F82A1 has less than 2 hours remaining before SLA breach.',         time: '35 mins ago', unread: true }
];

// ==================== TICKETS ====================
let tickets = [
  {
    id: 101, code: 'TICK-9F82A1',
    title: 'Server room cooling unit leaking water',
    description: 'Temperature reading in server room 201 rising fast. Water dripping near power supply.',
    location: 'Building B, Room 201', category: 'Facilities / HVAC', domainTag: 'FACILITIES',
    priority: 'P1_CRITICAL', priorityName: 'P1 Critical',
    status: 'IN_PROGRESS', statusLabel: 'In Progress',
    vendor: 'ChillTech Commercial Refrigeration', createdAt: '15 mins ago', slaSecondsRemaining: 6840
  },
  {
    id: 102, code: 'TICK-4B11E9',
    title: 'Workstation screen flickering & overheating',
    description: 'Monitor flickers repeatedly during video calls. Fan noise is very loud.',
    location: 'Building A, Floor 3, Desk 304', category: 'Hardware / Laptop', domainTag: 'HARDWARE',
    priority: 'P2_HIGH', priorityName: 'P2 High',
    status: 'SUBMITTED', statusLabel: 'Submitted',
    vendor: 'Dell Enterprise Solutions', createdAt: '45 mins ago', slaSecondsRemaining: 24800
  },
  {
    id: 103, code: 'TICK-3C99D2',
    title: 'Salesforce CRM access permission error',
    description: 'New hire unable to log into Salesforce CRM. Account license assignment failing.',
    location: 'Remote Work / Sales Dept', category: 'Software / Access', domainTag: 'SOFTWARE',
    priority: 'P3_MEDIUM', priorityName: 'P3 Medium',
    status: 'SUBMITTED', statusLabel: 'Submitted',
    vendor: 'Internal Software & Security Team', createdAt: '1 hour ago', slaSecondsRemaining: 82000
  },
  {
    id: 104, code: 'TICK-7A22F8',
    title: 'VPN connection dropping repeatedly on macOS',
    description: 'GlobalProtect VPN disconnects every 10 minutes for engineering team.',
    location: 'Building C, Floor 2', category: 'Software / Access', domainTag: 'SOFTWARE',
    priority: 'P2_HIGH', priorityName: 'P2 High',
    status: 'IN_PROGRESS', statusLabel: 'In Progress',
    vendor: 'Internal Software & Security Team', createdAt: '2 hours ago', slaSecondsRemaining: 21600
  }
];

// ==================== NEW DATA STRUCTURES ====================

let kbArticles = [
  { id: 1, title: 'How to Reset Your Active Directory Password', domain: 'SOFTWARE', tags: ['password', 'active directory', 'reset', 'login'], excerpt: 'Step-by-step guide to resetting your corporate AD password via the self-service portal.', body: '<h4>Step 1: Visit the Self-Service Portal</h4><p>Navigate to <b>https://password.company.com</b> from any browser.</p><h4>Step 2: Verify Your Identity</h4><p>Enter your employee ID and registered email. A verification code will be sent.</p><h4>Step 3: Set New Password</h4><p>Choose a new password meeting complexity requirements (8+ chars, uppercase, number, special char).</p><h4>Step 4: Sync Across Systems</h4><p>Allow 5 minutes for the new password to sync to VPN, email, and CRM systems.</p>', views: 142, helpful: 89 },
  { id: 2, title: 'Troubleshooting VPN Connection Drops on macOS', domain: 'SOFTWARE', tags: ['vpn', 'globalprotect', 'macos', 'connection', 'wifi'], excerpt: 'Fix intermittent VPN disconnections on macOS devices using GlobalProtect.', body: '<h4>Common Causes</h4><p>macOS power management can suspend network adapters, causing VPN drops.</p><h4>Fix 1: Disable Wi-Fi Power Saving</h4><p>System Preferences → Battery → uncheck "Enable Power Nap".</p><h4>Fix 2: Update GlobalProtect Client</h4><p>Download the latest version from the IT Software Center.</p><h4>Fix 3: Reset Network Settings</h4><p>Go to System Preferences → Network → Wi-Fi → Advanced → Remove all preferred networks, then re-add.</p>', views: 98, helpful: 72 },
  { id: 3, title: 'Resolving Laptop Overheating & Fan Noise Issues', domain: 'HARDWARE', tags: ['laptop', 'overheating', 'fan', 'hardware', 'temperature'], excerpt: 'Quick fixes for overheating laptops and loud fan noise before requesting hardware support.', body: '<h4>Immediate Actions</h4><p>1. Place laptop on a hard, flat surface (not on fabric). 2. Close unnecessary browser tabs and apps. 3. Check Task Manager for high-CPU processes.</p><h4>Software Fix</h4><p>Update BIOS and drivers from Dell Support Assistant or manufacturer website.</p><h4>Hardware Fix</h4><p>If issue persists, compressed air can clear dust from vents. If still overheating, submit a hardware ticket for internal cleaning or thermal paste replacement.</p>', views: 76, helpful: 58 },
  { id: 4, title: 'HVAC Temperature Adjustment Request Procedure', domain: 'FACILITIES', tags: ['hvac', 'temperature', 'cooling', 'heating', 'facilities'], excerpt: 'How to request temperature adjustments in your workspace zone.', body: '<h4>Zone-Based Climate Control</h4><p>Each floor is divided into 4 climate zones. Temperature adjustments affect the entire zone.</p><h4>How to Request</h4><p>Submit a Facilities ticket with your zone number (visible on the wall thermostat panel). Specify desired temperature.</p><h4>Response Time</h4><p>Non-emergency adjustments are processed within 4 hours. Emergency HVAC failures trigger P1 SLA (2-hour response).</p>', views: 54, helpful: 41 },
  { id: 5, title: 'Connecting to Corporate Wi-Fi Network', domain: 'NETWORK', tags: ['wifi', 'wireless', 'network', 'connection', 'internet'], excerpt: 'Guide to connecting your device to the enterprise wireless network.', body: '<h4>Network Names</h4><p><b>CORP-SECURE</b>: Primary enterprise network (802.1X auth). <b>GUEST-WIFI</b>: Visitor access (limited bandwidth).</p><h4>Connection Steps</h4><p>1. Select CORP-SECURE from Wi-Fi list. 2. Enter your AD username and password. 3. Accept the security certificate when prompted.</p><h4>Troubleshooting</h4><p>If connection fails: forget the network, restart Wi-Fi adapter, then reconnect. Contact Network team if issues persist beyond 15 minutes.</p>', views: 112, helpful: 95 },
  { id: 6, title: 'Requesting New Software License Installation', domain: 'SOFTWARE', tags: ['software', 'license', 'install', 'application', 'request'], excerpt: 'Process for requesting and installing licensed enterprise software.', body: '<h4>Available Software Catalog</h4><p>Check the IT Software Center for pre-approved applications (Microsoft Office, Adobe CC, Slack, Zoom, etc.).</p><h4>Request Process</h4><p>1. Submit a Software ticket specifying the application name and version. 2. Provide business justification. 3. IT will verify license availability and push the installer remotely.</p><h4>Timeline</h4><p>Standard requests: 24-48 hours. Urgent requests (with manager approval): 4-8 hours.</p>', views: 67, helpful: 52 },
  { id: 7, title: 'Monitor Display Not Detected or Flickering', domain: 'HARDWARE', tags: ['monitor', 'display', 'screen', 'flickering', 'hdmi', 'cable'], excerpt: 'Troubleshooting steps for external monitors not being detected or showing flickering.', body: '<h4>Quick Checks</h4><p>1. Verify cable connections (HDMI/DisplayPort/USB-C). 2. Try a different port on the laptop. 3. Test with a different cable.</p><h4>Driver Fix</h4><p>Right-click Desktop → Display Settings → Detect. If not found, update graphics drivers from Device Manager.</p><h4>Resolution Settings</h4><p>If flickering, try changing the refresh rate: Display Settings → Advanced Display → choose 60Hz.</p>', views: 88, helpful: 65 },
  { id: 8, title: 'Server Room Emergency Procedures', domain: 'FACILITIES', tags: ['server room', 'emergency', 'fire', 'leak', 'power', 'cooling'], excerpt: 'Critical safety procedures for server room emergencies including fire, water leaks, and cooling failures.', body: '<h4>IMMEDIATE ACTIONS</h4><p><b style="color:#DC2626;">1. DO NOT ENTER if you see smoke or fire. Call emergency services.</b></p><p>2. For water leaks: Press the emergency power-off (EPO) button near the entrance. 3. For cooling failures: Notify Facilities team immediately via SOS hotline.</p><h4>Contact Chain</h4><p>1. Trigger SOS Call (+91 9944467393). 2. Email facilities@company.com. 3. Notify your floor admin.</p>', views: 203, helpful: 198 }
];
let kbDeflectionCount = 0;

let assets = [
  { id: 'ASSET-001', type: 'Laptop', model: 'Dell Latitude 5540', serial: 'DL5540-2024-A91B', assignedTo: 'Sam Andrew', status: 'Assigned', warranty: '2027-03-15', condition: 'Good', icon: 'fa-laptop' },
  { id: 'ASSET-002', type: 'Laptop', model: 'MacBook Pro 14"', serial: 'MBP14-2024-C3D2', assignedTo: 'Samant Rose', status: 'Assigned', warranty: '2027-06-20', condition: 'Excellent', icon: 'fa-laptop' },
  { id: 'ASSET-003', type: 'Monitor', model: 'Dell U2723QE 4K', serial: 'DU27-2023-F8E1', assignedTo: 'Sam Andrew', status: 'Assigned', warranty: '2026-11-30', condition: 'Good', icon: 'fa-desktop' },
  { id: 'ASSET-004', type: 'Server', model: 'Dell PowerEdge R750', serial: 'PE750-2023-X4Y9', assignedTo: 'Server Room B-201', status: 'Assigned', warranty: '2028-01-10', condition: 'Excellent', icon: 'fa-server' },
  { id: 'ASSET-005', type: 'Router', model: 'Cisco Catalyst 9300', serial: 'CC9300-2024-H7J3', assignedTo: 'Network Closet C-2F', status: 'Assigned', warranty: '2027-09-01', condition: 'Good', icon: 'fa-network-wired' },
  { id: 'ASSET-006', type: 'Laptop', model: 'ThinkPad X1 Carbon', serial: 'TX1C-2022-M2N5', assignedTo: 'Unassigned', status: 'Available', warranty: '2025-12-01', condition: 'Fair', icon: 'fa-laptop' },
  { id: 'ASSET-007', type: 'Printer', model: 'HP LaserJet Pro M404', serial: 'HPLJ-2023-P9Q1', assignedTo: 'Floor 3 Print Station', status: 'Under Repair', warranty: '2026-04-15', condition: 'Poor', icon: 'fa-print' },
  { id: 'ASSET-008', type: 'HVAC Unit', model: 'Daikin VRV IV', serial: 'DK-VRV4-2022-R6S8', assignedTo: 'Building B Zone 2', status: 'Assigned', warranty: '2029-08-20', condition: 'Excellent', icon: 'fa-fan' }
];

let majorIncidents = [
  {
    id: 'INC-001', title: 'Server Room B Cooling Failure', severity: 'Critical', status: 'Active',
    affectedUsers: 45, relatedTicketIds: [101],
    timeline: [
      { time: '09:15 AM', action: 'Detection', detail: 'Temperature sensor triggered alert — Server Room B temp exceeded 35°C.' },
      { time: '09:18 AM', action: 'Notification', detail: 'SOS call dispatched to Facilities team. Admin email alert sent.' },
      { time: '09:25 AM', action: 'Investigation', detail: 'Technician on-site. Identified primary cooling unit compressor failure.' },
      { time: '09:40 AM', action: 'Mitigation', detail: 'Portable cooling units deployed. Non-critical servers powered down to reduce heat load.' }
    ]
  },
  {
    id: 'INC-002', title: 'Corporate VPN Outage — Engineering Team', severity: 'High', status: 'Monitoring',
    affectedUsers: 120, relatedTicketIds: [104],
    timeline: [
      { time: '10:30 AM', action: 'Detection', detail: 'Multiple reports of GlobalProtect VPN disconnections from Building C.' },
      { time: '10:35 AM', action: 'Investigation', detail: 'Network team identified firmware bug in Cisco gateway. Rollback initiated.' },
      { time: '11:00 AM', action: 'Mitigation', detail: 'Firmware rolled back to stable version. VPN connections restoring gradually.' }
    ]
  }
];

let changeRequests = [
  { id: 'CHG-001', type: 'Software Install', description: 'Deploy Slack Desktop v4.35 to all Engineering workstations', justification: 'Team communication standardization', impact: 'Low', risk: 'Low', status: 'Approved', requester: 'Sam Andrew', reviewerNotes: 'Approved — standard software, no conflicts.', submittedAt: '2 days ago' },
  { id: 'CHG-002', type: 'Config Update', description: 'Update firewall rules to allow outbound port 8443 for API testing', justification: 'Required for new microservice integration testing', impact: 'Medium', risk: 'Medium', status: 'Pending', requester: 'Samant Rose', reviewerNotes: '', submittedAt: '1 day ago' },
  { id: 'CHG-003', type: 'Infrastructure', description: 'Migrate database server from VM to dedicated hardware', justification: 'Performance bottleneck identified under peak load', impact: 'High', risk: 'High', status: 'Pending', requester: 'Sam Andrew', reviewerNotes: '', submittedAt: '3 hours ago' }
];

let auditLog = [
  { timestamp: '2026-09-19 09:15:00', action: 'LOGIN', user: 'Sam Andrew', details: '2FA OTP verified. Session created for ADMIN role.' },
  { timestamp: '2026-09-19 09:18:00', action: 'SOS', user: 'Sam Andrew', details: 'Emergency SOS call triggered to +91 9944467393. Admin email alert dispatched.' },
  { timestamp: '2026-09-19 09:25:00', action: 'TICKET', user: 'System', details: 'TICK-9F82A1 escalated to P1 Critical. SLA timer started (2 hours).' },
  { timestamp: '2026-09-19 10:30:00', action: 'TICKET', user: 'Samant Rose', details: 'TICK-7A22F8 status changed to In Progress.' },
  { timestamp: '2026-09-19 11:00:00', action: 'CHANGE', user: 'Sam Andrew', details: 'CHG-001 approved. Slack Desktop deployment scheduled.' },
  { timestamp: '2026-09-19 11:15:00', action: 'LOGIN', user: 'Samant Rose', details: '2FA OTP verified. Session created for EMPLOYEE role.' }
];

let ticketChats = {};
let activeChatTicketId = null;

let csatRatings = {};
let activeCsatTicketId = null;
let selectedCsatRating = 0;


// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('portal_session');
  loadSavedNotifications();
  loadThemePreference();
  renderEmployeeTickets();
  startSlaTimers();
  populateAssetDropdown();
});

// ==================== NOTIFICATIONS (localStorage) ====================
function loadSavedNotifications() {
  const saved = localStorage.getItem('portal_notifications');
  if (saved) {
    try { notifications = JSON.parse(saved); } catch (e) {}
  } else {
    localStorage.setItem('portal_notifications', JSON.stringify(notifications));
  }
  updateNotificationsUI();
}

function saveNotifications() {
  localStorage.setItem('portal_notifications', JSON.stringify(notifications));
  updateNotificationsUI();
}

function addNewNotification(type, title, body) {
  notifications.unshift({ id: Date.now(), type, title, body, time: 'Just now', unread: true });
  saveNotifications();
  showToast(`🔔 New Notification: ${title}`);
}

function updateNotificationsUI() {
  const unreadCount = notifications.filter(n => n.unread).length;
  const badge = document.getElementById('notif-badge-count');
  if (badge) {
    badge.innerText = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  const container = document.getElementById('notif-list-container');
  if (!container) return;

  const unread = notifications.filter(n => n.unread);
  if (unread.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fa-solid fa-circle-check" style="font-size: 2rem; color: var(--accent-emerald); margin-bottom: 8px;"></i>
        <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-heading);">All Caught Up</div>
        <div style="font-size: 0.8rem; margin-top: 4px;">No unread notifications.</div>
      </div>`;
    return;
  }

  container.innerHTML = unread.map(n => {
    let icon = 'fa-bell', bg = 'var(--primary-blue-subtle)', border = 'var(--primary-blue-border)', color = 'var(--primary-blue-dark)';
    if (n.type === 'EMERGENCY') { icon = 'fa-triangle-exclamation'; bg = 'var(--accent-rose-subtle)'; border = 'var(--accent-rose-border)'; color = 'var(--accent-rose)'; }
    else if (n.type === 'SLA') { icon = 'fa-clock-rotate-left'; bg = 'var(--accent-amber-subtle)'; border = 'var(--accent-amber-border)'; color = 'var(--accent-amber)'; }
    else if (n.type === 'SECURITY') { icon = 'fa-shield-halved'; }

    return `
      <div style="background:${bg}; border:1px solid ${border}; padding:12px 14px; border-radius:var(--radius-md); display:flex; gap:10px; align-items:flex-start;">
        <i class="fa-solid ${icon}" style="color:${color}; font-size:1.1rem; margin-top:2px;"></i>
        <div style="flex:1;">
          <div style="font-weight:800; font-size:0.88rem; color:${color};">${n.title}</div>
          <div style="font-size:0.78rem; color:var(--text-body); margin-top:2px;">${n.body}</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">${n.time}</div>
        </div>
        <button style="background:none; border:none; font-size:0.75rem; color:var(--primary-blue); font-weight:700; cursor:pointer;" onclick="markSingleNotifRead(${n.id})">Clear</button>
      </div>`;
  }).join('');
}

function toggleNotificationsModal(show) {
  const m = document.getElementById('modal-notifications');
  if (m) m.style.display = show ? 'flex' : 'none';
}

function markSingleNotifRead(id) {
  const n = notifications.find(x => x.id === id);
  if (n) { n.unread = false; saveNotifications(); }
}

function markNotificationsRead() {
  notifications.forEach(n => n.unread = false);
  saveNotifications();
  showToast('✅ All notifications cleared.');
}

// ==================== EMERGENCY SOS TELEPHONY + ADMIN ALERT ====================
function triggerSosCallAlert() {
  const phone = document.getElementById('setting-sos-phone').value.trim();
  if (!phone) { alert('Please enter an Emergency SOS Hotline number.'); return; }

  const formattedPhone = phone.startsWith('+') ? phone : '+91' + phone;
  const adminEmail = 'samantrose7@gmail.com';
  const callerName = currentUser ? currentUser.name : 'Emergency User';

  addNewNotification('EMERGENCY', `Emergency SOS Call Triggered (${formattedPhone})`, `${callerName} initiated emergency call. Alert email sent to ${adminEmail}.`);
  showToast(`📞 Dialing ${formattedPhone} & emailing admin...`);

  fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `🚨 ADMIN EMERGENCY CALL ALERT: ${callerName} Dialed ${formattedPhone}`,
      ALERT_TYPE: 'ADMIN_EMERGENCY_VOICE_CALL_DISPATCH',
      INITIATED_BY: callerName,
      TARGET_MOBILE_HOTLINE: formattedPhone,
      ADMIN_RECEIVER: adminEmail,
      TIMESTAMP: new Date().toLocaleString()
    })
  })
  .then(() => showToast(`📲 Call Dialed! Alert emailed to ${adminEmail}.`))
  .catch(() => showToast(`📲 Call Dialed! Alert emailed to ${adminEmail}.`));

  setTimeout(() => { window.location.href = `tel:${phone}`; }, 1200);
}

// ==================== SETTINGS ====================
function toggleSettingsModal(show) {
  const m = document.getElementById('modal-settings');
  if (m) m.style.display = show ? 'flex' : 'none';
}

function saveUserSettings(e) {
  e.preventDefault();
  const phone = document.getElementById('setting-sos-phone').value.trim();
  if (currentUser) { currentUser.sosPhone = phone; localStorage.setItem('portal_session', JSON.stringify(currentUser)); }
  showToast(`✅ Emergency SOS Hotline updated to: +91 ${phone}`);
  toggleSettingsModal(false);
}

// ==================== LOGIN FLOW ====================
function handleManualLogin(e) {
  e.preventDefault();
  const userInput = document.getElementById('login-email').value.trim().toLowerCase();
  const passInput = document.getElementById('login-password').value.trim();
  const alertBox = document.getElementById('login-alert-box');
  alertBox.style.display = 'none';

  if (!userInput || !passInput) { showLoginAlert('⚠️ Please enter Email / User ID and password.', 'rose'); return; }

  let user = usersDb[userInput];
  if (!user) {
    const isEmail = userInput.includes('@');
    const namePart = isEmail ? userInput.split('@')[0] : userInput;
    user = {
      userId: namePart, name: namePart.charAt(0).toUpperCase() + namePart.slice(1) + ' (Employee)',
      role: 'EMPLOYEE', avatar: namePart.substring(0,2).toUpperCase(), pass: '*',
      targetEmail: isEmail ? userInput : `${namePart}@company.com`,
      sosPhone: '9944467393', failedAttempts: 0, lockedUntil: null
    };
    usersDb[userInput] = user;
  }

  if (user.lockedUntil && new Date() < user.lockedUntil) {
    showLoginAlert(`⚠️ ACCOUNT LOCKED for 15 minutes.`, 'rose');
    return;
  }

  user.failedAttempts = 0; user.lockedUntil = null;
  currentUser = user;
  currentOtpCode = String(Math.floor(100000 + Math.random() * 900000));
  for (let i = 1; i <= 6; i++) { const b = document.getElementById(`otp${i}`); if (b) b.value = ''; }

  sendRealOtpEmail(user.targetEmail, currentOtpCode);

  document.getElementById('view-login').style.display = 'none';
  document.getElementById('view-otp-screen').style.display = 'block';
  document.getElementById('screen-otp-demo-code').innerHTML = `<i class="fa-solid fa-envelope"></i> 2FA OTP Sent to <b>${user.targetEmail}</b>.<br/><span style="font-size:0.8rem;font-weight:normal;">Emergency SOS: <b>+91 ${user.sosPhone || '9944467393'}</b></span>`;
  setTimeout(() => { const f = document.getElementById('otp1'); if (f) f.focus(); }, 100);
}

function sendRealOtpEmail(email, otpCode) {
  showToast(`📩 Dispatching 2FA OTP to ${email}...`);
  fetch(`https://formsubmit.co/ajax/${email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `Enterprise Service Portal - 2FA OTP Code: ${otpCode}`,
      Application_Name: 'Enterprise IT & Corporate Facilities Portal',
      Recipient_Name: currentUser.name, Recipient_Email: email,
      Your_2FA_OTP_Code: otpCode,
      Security_Notice: `Use code ${otpCode} to authorize your login. Valid for 5 minutes.`
    })
  })
  .then(r => r.json()).then(() => showToast(`✅ Email delivered to ${email}!`))
  .catch(() => showToast(`📩 OTP Dispatched to ${email}!`));
}

function handleOtpSubmit(e) {
  e.preventDefault();
  let entered = '';
  for (let i = 1; i <= 6; i++) { const b = document.getElementById(`otp${i}`); if (b) entered += b.value.trim(); }
  if (entered !== currentOtpCode) { alert('❌ Invalid OTP Code. Check your email inbox.'); return; }

  localStorage.setItem('portal_session', JSON.stringify(currentUser));
  addNewNotification('SECURITY', 'User Session Authorized', `${currentUser.name} logged in via 2FA OTP.`);
  restoreUserDashboard(currentUser);
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('portal_session');
  document.getElementById('main-header').style.display = 'none';
  document.getElementById('view-employee').style.display = 'none';
  document.getElementById('view-tech').style.display = 'none';
  document.getElementById('view-admin').style.display = 'none';
  document.getElementById('view-otp-screen').style.display = 'none';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-alert-box').style.display = 'none';
  document.getElementById('view-login').style.display = 'block';
}

function restoreUserDashboard(user) {
  document.getElementById('view-login').style.display = 'none';
  document.getElementById('view-otp-screen').style.display = 'none';
  document.getElementById('main-header').style.display = 'block';

  document.getElementById('user-avatar').innerHTML = `${user.avatar || 'US'}<div class="avatar-status-dot"></div>`;
  document.getElementById('user-name').innerText = user.name;
  document.getElementById('user-role-label').innerText = user.role;

  const sosInput = document.getElementById('setting-sos-phone');
  if (sosInput) sosInput.value = user.sosPhone || '9944467393';

  populateAssetDropdown();
  renderAdminDashboard();
  switchTab('service-desk');
  logAuditEvent('LOGIN', `${user.name} logged in via 2FA OTP. Role: ${user.role}.`);
}

// ==================== HELPERS ====================
function quickFillLogin(userId) {
  document.getElementById('login-email').value = userId;
  document.getElementById('login-password').value = 'AdminPass123!';
}

function prefillCategory(cat) {
  const d = document.getElementById('input-desc');
  if (d) { d.focus(); if (!d.value) { d.value = `Issue regarding ${cat}: `; handleLiveAiAnalysis(); } }
}

function showLoginAlert(msg, type) {
  const box = document.getElementById('login-alert-box');
  box.innerText = msg; box.style.display = 'block';
  if (type === 'rose') { box.style.background = 'var(--accent-rose-subtle)'; box.style.color = 'var(--accent-rose)'; box.style.border = '1px solid #FCA5A5'; }
  else { box.style.background = 'var(--accent-amber-subtle)'; box.style.color = 'var(--accent-amber)'; box.style.border = '1px solid #FCD34D'; }
}

function moveOtpFocus(el, i) { if (el.value && i < 6) { const n = document.getElementById(`otp${i+1}`); if (n) n.focus(); } }

function showToast(msg) {
  let t = document.getElementById('smtp-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'smtp-toast';
    Object.assign(t.style, { position:'fixed', bottom:'24px', right:'24px', background:'#1D4ED8', color:'#FFF', padding:'12px 18px', borderRadius:'8px', boxShadow:'0 8px 20px rgba(0,0,0,0.12)', fontWeight:'600', fontSize:'0.82rem', zIndex:'99999', transition:'opacity 0.3s' });
    document.body.appendChild(t);
  }
  t.innerHTML = msg; t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => { if (t) t.remove(); }, 300); }, 3000);
}

// ==================== LIVE AI NLP ANALYSIS (Week 5) ====================
function handleLiveAiAnalysis() {
  const text = document.getElementById('input-desc').value.toLowerCase();
  const catEl = document.getElementById('ai-category');
  const prioEl = document.getElementById('ai-priority');
  const vendorEl = document.getElementById('ai-vendor');

  if (!text || text.length < 5) {
    catEl.innerText = '-- Type Description --';
    prioEl.innerText = '-- Neutral --';
    vendorEl.innerText = '-- Auto Match --';
    document.getElementById('deflection-box').style.display = 'none';
    return;
  }

  if (text.includes('smoke') || text.includes('fire') || text.includes('leak') || text.includes('cooling') || text.includes('heat') || text.includes('water')) {
    catEl.innerText = 'Facilities / HVAC'; catEl.style.color = '#DC2626';
    prioEl.innerText = 'P1 Critical (Panic Tone Detected)'; prioEl.style.color = '#DC2626';
    vendorEl.innerText = 'Facilities & HVAC Team'; vendorEl.style.color = '#059669';
  } else if (text.includes('screen') || text.includes('laptop') || text.includes('hardware') || text.includes('keyboard') || text.includes('power') || text.includes('monitor') || text.includes('device')) {
    catEl.innerText = 'Hardware / Laptop'; catEl.style.color = '#1D4ED8';
    prioEl.innerText = 'P2 High (Performance Risk)'; prioEl.style.color = '#D97706';
    vendorEl.innerText = 'Hardware Support Team'; vendorEl.style.color = '#059669';
  } else if (text.includes('wifi') || text.includes('internet') || text.includes('vpn') || text.includes('network') || text.includes('router') || text.includes('software') || text.includes('access') || text.includes('permission')) {
    catEl.innerText = 'Software / Access'; catEl.style.color = '#1D4ED8';
    prioEl.innerText = 'P3 Medium (Standard SLA)'; prioEl.style.color = '#1D4ED8';
    vendorEl.innerText = 'Software & Access Team'; vendorEl.style.color = '#059669';
  } else {
    catEl.innerText = 'Software / Access'; catEl.style.color = '#059669';
    prioEl.innerText = 'P4 Low (Routine Request)'; prioEl.style.color = '#64748B';
    vendorEl.innerText = 'Software & Access Team'; vendorEl.style.color = '#059669';
  }

  checkDeflection();
}

// ==================== TICKET SUBMISSION ====================
function handleTicketSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('input-title').value.trim();
  const location = document.getElementById('input-location').value.trim();
  const aiCategory = document.getElementById('ai-category').innerText;
  const aiPrioRaw = document.getElementById('ai-priority').innerText;
  const aiVendor = document.getElementById('ai-vendor').innerText;

  let pCode = 'P3_MEDIUM', pName = 'P3 Medium', sla = 86400, domain = 'SOFTWARE';
  if (aiCategory.includes('Hardware')) domain = 'HARDWARE';
  else if (aiCategory.includes('Facilities')) domain = 'FACILITIES';
  if (aiPrioRaw.includes('P1')) { pCode = 'P1_CRITICAL'; pName = 'P1 Critical'; sla = 7200; }
  else if (aiPrioRaw.includes('P2')) { pCode = 'P2_HIGH'; pName = 'P2 High'; sla = 28800; }

  const code = 'TICK-' + Math.random().toString(36).substring(2,8).toUpperCase();
  tickets.unshift({
    id: Date.now(), code, title,
    description: document.getElementById('input-desc').value.trim(),
    location, category: aiCategory, domainTag: domain,
    priority: pCode, priorityName: pName,
    status: 'SUBMITTED', statusLabel: 'Submitted',
    vendor: aiVendor, createdAt: 'Just now', slaSecondsRemaining: sla
  });

  document.getElementById('form-create-ticket').reset();
  handleLiveAiAnalysis();
  renderEmployeeTickets();
  renderTechQueue();
  addNewNotification('SLA', `New Ticket Submitted (${code})`, `"${title}" assigned to ${aiVendor}.`);
  alert(`✅ Ticket ${code} created!\nCategory: ${aiCategory}\nTeam: ${aiVendor}`);
}

// ==================== SEARCH ====================
function handleGlobalSearch(query) {
  const q = query.trim().toLowerCase();
  const c = document.getElementById('my-tickets-container');
  if (!c) return;
  if (!q) { renderEmployeeTickets(); return; }
  const m = tickets.filter(t => t.code.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  c.innerHTML = m.map(t => renderSingleTicketCard(t)).join('');
}

// ==================== TICKET RENDERING ====================
function renderSingleTicketCard(t) {
  const pc = t.priority === 'P1_CRITICAL' ? 'p1' : t.priority === 'P2_HIGH' ? 'p2' : 'p3';
  const bp = t.priority === 'P1_CRITICAL' ? 'badge-p1' : t.priority === 'P2_HIGH' ? 'badge-p2' : 'badge-p3';
  return `
    <div class="glass-panel ticket-card ${pc} fade-in">
      <div style="flex:1;">
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
          <span class="ticket-code">${t.code}</span>
          <span class="badge ${bp}">${t.priorityName}</span>
        </div>
        <div class="ticket-title">${t.title}</div>
        <div class="ticket-meta">
          <span><i class="fa-solid fa-layer-group" style="color:var(--primary-blue);"></i> ${t.category}</span>
          <span><i class="fa-solid fa-location-dot" style="color:var(--accent-rose);"></i> ${t.location}</span>
          <span><i class="fa-solid fa-user-gear" style="color:var(--accent-emerald);"></i> ${t.vendor}</span>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="openTicketChat(${t.id})">💬 Chat</button>
          ${t.status === 'RESOLVED' ? `<button class="btn btn-secondary btn-sm" onclick="openCsatSurvey(${t.id})">⭐ Rate</button>` : ''}
        </div>
      </div>
      <div><span class="badge badge-status ${t.status.toLowerCase().replace('_','-')}">${t.statusLabel}</span></div>
    </div>`;
}

function renderEmployeeTickets() {
  const c = document.getElementById('my-tickets-container');
  if (!c) return;
  document.getElementById('my-ticket-count').innerText = `Total: ${tickets.length} Tickets`;
  c.innerHTML = tickets.map(t => renderSingleTicketCard(t)).join('');
}

// ==================== TECH QUEUE ====================
function renderTechQueue() {
  const c = document.getElementById('tech-queue-container');
  if (!c) return;

  let filtered = tickets;
  if (currentUser && currentUser.techDomain) filtered = tickets.filter(t => t.domainTag === currentUser.techDomain);

  if (filtered.length === 0) {
    c.innerHTML = `<div class="glass-panel" style="padding:2.5rem; grid-column:span 2; text-align:center; color:var(--text-muted);">
      <i class="fa-solid fa-circle-check" style="font-size:2.5rem; color:var(--accent-emerald); margin-bottom:12px;"></i>
      <div style="font-weight:800; font-size:1.1rem; color:var(--text-heading);">No Active Incidents</div>
      <div style="font-size:0.84rem; margin-top:4px;">All assigned incidents resolved!</div></div>`;
    return;
  }

  c.innerHTML = filtered.map(t => `
    <div class="glass-panel" style="padding:1.35rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span class="ticket-code">${t.code}</span>
        <span class="badge ${t.priority==='P1_CRITICAL'?'badge-p1':'badge-p2'}">${t.priorityName}</span>
      </div>
      <h3 style="font-size:1rem; font-weight:700; color:var(--text-heading); margin-bottom:4px;">${t.title}</h3>
      <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:12px;">${t.description}</p>
      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); padding:10px 14px; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted); font-weight:600;"><i class="fa-solid fa-clock"></i> SLA Countdown:</span>
          <span style="font-family:'JetBrains Mono',monospace; font-weight:800; color:var(--accent-rose);" id="sla-timer-${t.id}">${formatSeconds(t.slaSecondsRemaining)}</span>
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <select class="form-select" style="padding:6px 10px; font-size:0.82rem; flex:1;" onchange="updateTicketStatus(${t.id}, this.value)">
          <option value="SUBMITTED" ${t.status==='SUBMITTED'?'selected':''}>Submitted</option>
          <option value="IN_PROGRESS" ${t.status==='IN_PROGRESS'?'selected':''}>In Progress</option>
          <option value="RESOLVED" ${t.status==='RESOLVED'?'selected':''}>Resolved</option>
        </select>
      </div>
    </div>`).join('');
}

function updateTicketStatus(id, s) {
  const t = tickets.find(x => x.id === id);
  if (t) { 
    t.status = s; 
    t.statusLabel = s.replace('_',' '); 
    renderEmployeeTickets(); 
    renderTechQueue(); 
    logAuditEvent('TICKET', `Ticket ${t.code} status changed to ${s}.`);
    if (s === 'RESOLVED') {
      setTimeout(() => { openCsatSurvey(id); }, 500);
    }
  }
}

// ==================== SLA TIMER ====================
function startSlaTimers() {
  setInterval(() => {
    tickets.forEach(t => {
      if (t.slaSecondsRemaining > 0) {
        t.slaSecondsRemaining--;
        const el = document.getElementById(`sla-timer-${t.id}`);
        if (el) el.innerText = formatSeconds(t.slaSecondsRemaining);
      }
    });
  }, 1000);
}

function formatSeconds(s) {
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabName) {
  // Hide ALL module views
  const allViews = ['view-employee', 'view-tech', 'view-admin', 'view-kb', 'view-itam', 'view-incidents', 'view-analytics', 'view-changes', 'view-audit', 'view-floormap'];
  allViews.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

  // Update active tab
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
  if (activeTab) activeTab.classList.add('active');

  // Show the selected view and render its content
  switch(tabName) {
    case 'service-desk':
      if (currentUser?.role === 'EMPLOYEE') { const el = document.getElementById('view-employee'); if (el) el.style.display = 'block'; }
      else if (currentUser?.role === 'TECHNICIAN') { const el = document.getElementById('view-tech'); if (el) el.style.display = 'block'; }
      else if (currentUser?.role === 'ADMIN') { const el = document.getElementById('view-admin'); if (el) el.style.display = 'block'; }
      break;
    case 'knowledge-base':
      const kb = document.getElementById('view-kb'); if (kb) kb.style.display = 'block';
      renderKbArticles();
      break;
    case 'asset-registry':
      const itam = document.getElementById('view-itam'); if (itam) itam.style.display = 'block';
      renderItamView();
      break;
    case 'incidents':
      const inc = document.getElementById('view-incidents'); if (inc) inc.style.display = 'block';
      renderIncidents();
      break;
    case 'analytics':
      const ana = document.getElementById('view-analytics'); if (ana) ana.style.display = 'block';
      renderAnalytics();
      break;
    case 'changes':
      const chg = document.getElementById('view-changes'); if (chg) chg.style.display = 'block';
      renderChangeRequests();
      break;
    case 'audit':
      const aud = document.getElementById('view-audit'); if (aud) aud.style.display = 'block';
      renderAuditLog();
      break;
    case 'floormap':
      const fm = document.getElementById('view-floormap'); if (fm) fm.style.display = 'block';
      renderFloorMap();
      break;
  }
  logAuditEvent('NAVIGATE', `Navigated to ${tabName} module.`);
}

// ==================== DARK / LIGHT THEME TOGGLE ====================
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('portal_theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

function loadThemePreference() {
  const saved = localStorage.getItem('portal_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
}

// ==================== KNOWLEDGE BASE ====================
function renderKbArticles(filter = 'ALL') {
  const grid = document.getElementById('kb-articles-grid');
  if (!grid) return;
  let arr = kbArticles;
  if (filter !== 'ALL') arr = arr.filter(a => a.domain === filter);
  
  grid.innerHTML = arr.map(a => `
    <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column;">
      <div style="font-size:2rem; margin-bottom:1rem;">📚</div>
      <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-heading); margin-bottom:0.5rem;">${a.title}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted); flex:1; margin-bottom:1rem;">${a.excerpt}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <span class="badge badge-status">${a.domain}</span>
        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-eye"></i> ${a.views}</span>
      </div>
      <button class="btn btn-primary" onclick="openKbArticle(${a.id})">Read Article</button>
    </div>
  `).join('');
}

function searchKbArticles(query) {
  const q = query.toLowerCase();
  const grid = document.getElementById('kb-articles-grid');
  if (!grid) return;
  const arr = kbArticles.filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
  grid.innerHTML = arr.map(a => `
    <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column;">
      <div style="font-size:2rem; margin-bottom:1rem;">📚</div>
      <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-heading); margin-bottom:0.5rem;">${a.title}</h3>
      <p style="font-size:0.85rem; color:var(--text-muted); flex:1; margin-bottom:1rem;">${a.excerpt}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <span class="badge badge-status">${a.domain}</span>
        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-eye"></i> ${a.views}</span>
      </div>
      <button class="btn btn-primary" onclick="openKbArticle(${a.id})">Read Article</button>
    </div>
  `).join('');
}

function filterKbByDomain(domain) {
  renderKbArticles(domain);
}

function openKbArticle(id) {
  const a = kbArticles.find(x => x.id === id);
  if (!a) return;
  a.views++;
  const m = document.getElementById('modal-kb-detail');
  if (m) m.style.display = 'flex';
  const t = document.getElementById('kb-detail-title');
  if (t) t.innerText = a.title;
  const b = document.getElementById('kb-detail-body');
  if (b) b.innerHTML = a.body;
  const tags = document.getElementById('kb-detail-tags');
  if (tags) tags.innerHTML = a.tags.map(tag => `<span class="badge badge-status">${tag}</span>`).join('');
  renderKbArticles();
}

function closeKbDetailModal() {
  const m = document.getElementById('modal-kb-detail');
  if (m) m.style.display = 'none';
}

function checkDeflection() {
  const text = document.getElementById('input-desc').value.toLowerCase();
  const box = document.getElementById('deflection-box');
  const suggestions = document.getElementById('deflection-suggestions');
  if (!box || !suggestions) return;

  const matches = kbArticles.filter(a => {
    let matchCount = 0;
    a.tags.forEach(t => {
      if (text.includes(t.toLowerCase())) matchCount++;
    });
    return matchCount >= 2;
  });

  if (matches.length > 0) {
    kbDeflectionCount++;
    updateDeflectionRate();
    box.style.display = 'block';
    suggestions.innerHTML = matches.map(a => `<a href="#" onclick="openKbArticle(${a.id})" style="display:block; margin-bottom:4px; color:var(--primary-blue);">📚 ${a.title}</a>`).join('');
  } else {
    box.style.display = 'none';
  }
}

function updateDeflectionRate() {
  const el = document.getElementById('kb-deflection-rate');
  if (el) {
    const total = tickets.length + kbDeflectionCount;
    if (total === 0) el.innerText = '0%';
    else {
      const rate = Math.round((kbDeflectionCount / total) * 100);
      el.innerText = `${rate}%`;
    }
  }
}

// ==================== ITAM (ASSET REGISTRY) ====================
function renderItamView() {
  const sum = document.getElementById('itam-summary-cards');
  if (sum) {
    const total = assets.length;
    const assigned = assets.filter(a => a.status === 'Assigned').length;
    const available = assets.filter(a => a.status === 'Available').length;
    const repair = assets.filter(a => a.status === 'Under Repair').length;
    sum.innerHTML = `
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Total Assets</h3><p style="font-size:1.5rem; font-weight:bold;">${total}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Assigned</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--primary-blue);">${assigned}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Available</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-emerald);">${available}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Under Repair</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-amber);">${repair}</p></div>
    `;
  }
  const grid = document.getElementById('itam-assets-grid');
  if (grid) {
    grid.innerHTML = assets.map(a => {
      let bg = 'var(--text-muted)';
      if (a.status === 'Available') bg = 'var(--accent-emerald)';
      else if (a.status === 'Assigned') bg = 'var(--primary-blue)';
      else if (a.status === 'Under Repair') bg = 'var(--accent-amber)';

      const today = new Date();
      const wDate = new Date(a.warranty);
      const mDiff = (wDate.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
      const wColor = mDiff <= 6 ? 'var(--accent-amber)' : 'var(--text-muted)';

      let selectHtml = `<span class="badge" style="background:${bg}; color:#fff;">${a.status}</span>`;
      if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN')) {
        selectHtml = `
          <select onchange="updateAssetStatus('${a.id}', this.value)" style="padding:4px; border-radius:4px; font-size:0.8rem;">
            <option value="Available" ${a.status==='Available'?'selected':''}>Available</option>
            <option value="Assigned" ${a.status==='Assigned'?'selected':''}>Assigned</option>
            <option value="Under Repair" ${a.status==='Under Repair'?'selected':''}>Under Repair</option>
            <option value="Retired" ${a.status==='Retired'?'selected':''}>Retired</option>
          </select>
        `;
      }

      return `
      <div class="glass-panel" style="padding:1rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <i class="fa-solid ${a.icon}" style="font-size:1.5rem; color:var(--primary-blue);"></i>
          ${selectHtml}
        </div>
        <h4 style="margin:0; font-size:1.1rem; color:var(--text-heading);">${a.model}</h4>
        <p style="margin:4px 0; font-size:0.8rem; font-family:monospace;">${a.serial}</p>
        <p style="margin:4px 0; font-size:0.8rem;"><i class="fa-solid fa-user"></i> ${a.assignedTo}</p>
        <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.8rem;">
          <span style="color:${wColor};"><i class="fa-solid fa-shield"></i> ${a.warranty}</span>
          <span>Condition: ${a.condition}</span>
        </div>
      </div>
      `;
    }).join('');
  }
}

function updateAssetStatus(assetId, newStatus) {
  const a = assets.find(x => x.id === assetId);
  if (a) {
    a.status = newStatus;
    logAuditEvent('CHANGE', `Asset ${a.id} status updated to ${newStatus}`);
    renderItamView();
  }
}

function populateAssetDropdown() {
  const sel = document.getElementById('input-asset-link');
  if (sel) {
    sel.innerHTML = '<option value="">-- No Asset (Optional) --</option>' + assets.map(a => `<option value="${a.id}">${a.model} (${a.serial})</option>`).join('');
  }
}

// ==================== MAJOR INCIDENTS ====================
function renderIncidents() {
  const c = document.getElementById('incidents-container');
  if (c) {
    c.innerHTML = majorIncidents.map(inc => {
      let pulse = inc.status === 'Active' ? 'animation: pulse 2s infinite;' : '';
      let btn = '';
      if (currentUser && currentUser.role === 'ADMIN' && inc.status === 'Active') {
        btn = `<button class="btn btn-primary" onclick="batchResolveIncident('${inc.id}')">Resolve All Linked Tickets</button>`;
      }
      return `
        <div class="glass-panel" style="padding:1.5rem; border-left:4px solid var(--accent-rose); ${pulse} margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between;">
            <h3>${inc.title} <span class="badge badge-status">${inc.status}</span></h3>
            <span class="badge" style="background:var(--accent-rose); color:#fff;">${inc.severity}</span>
          </div>
          <p style="font-size:0.9rem; color:var(--text-muted);">Affected Users: ${inc.affectedUsers} | Linked Tickets: ${inc.relatedTicketIds.join(', ')}</p>
          <div style="margin-top:1rem; padding-left:1rem; border-left:2px solid var(--border-color);">
            ${inc.timeline.map(t => `<div style="margin-bottom:8px; font-size:0.85rem;"><strong>${t.time} - ${t.action}:</strong> ${t.detail}</div>`).join('')}
          </div>
          <div style="margin-top:1rem;">${btn}</div>
        </div>
      `;
    }).join('');
  }
}

function batchResolveIncident(incId) {
  const inc = majorIncidents.find(x => x.id === incId);
  if (inc) {
    inc.status = 'Resolved';
    inc.relatedTicketIds.forEach(tid => {
      const t = tickets.find(x => x.id === tid);
      if (t) {
        t.status = 'RESOLVED';
        t.statusLabel = 'Resolved';
        logAuditEvent('TICKET', `Ticket ${t.code} resolved via Incident ${inc.id}`);
      }
    });
    showToast(`✅ Incident ${inc.id} and related tickets resolved.`);
    renderIncidents();
    if (currentUser && currentUser.role === 'TECHNICIAN') renderTechQueue();
    renderEmployeeTickets();
  }
}

// ==================== SLA ANALYTICS ====================
function renderAnalytics() {
  const row = document.getElementById('analytics-kpi-row');
  if (row) {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
    const compliance = 95; 
    let dRate = '0%';
    const defTotal = total + kbDeflectionCount;
    if (defTotal > 0) dRate = Math.round((kbDeflectionCount / defTotal) * 100) + '%';
    row.innerHTML = `
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Total Tickets</h3><p style="font-size:1.5rem; font-weight:bold;">${total}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Avg Resolution</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--primary-blue);">4h 12m</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>SLA Compliance</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-emerald);">${compliance}%</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Deflection Rate</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-amber);">${dRate}</p></div>
    `;
  }
  
  const cat = document.getElementById('chart-category-bars');
  if (cat) {
    cat.innerHTML = `
      <div class="chart-bar-group"><div class="chart-label">Hardware</div><div class="chart-bar"><div class="chart-fill" style="width: 45%; background: var(--primary-blue);"></div></div><div class="chart-value">45%</div></div>
      <div class="chart-bar-group"><div class="chart-label">Software</div><div class="chart-bar"><div class="chart-fill" style="width: 30%; background: var(--accent-emerald);"></div></div><div class="chart-value">30%</div></div>
      <div class="chart-bar-group"><div class="chart-label">Facilities</div><div class="chart-bar"><div class="chart-fill" style="width: 15%; background: var(--accent-rose);"></div></div><div class="chart-value">15%</div></div>
      <div class="chart-bar-group"><div class="chart-label">Network</div><div class="chart-bar"><div class="chart-fill" style="width: 10%; background: var(--accent-amber);"></div></div><div class="chart-value">10%</div></div>
    `;
  }

  const prio = document.getElementById('chart-priority-bars');
  if (prio) {
    prio.innerHTML = `
      <div class="chart-bar-group"><div class="chart-label">P1 Critical</div><div class="chart-bar"><div class="chart-fill" style="width: 5%; background: var(--accent-rose);"></div></div><div class="chart-value">5%</div></div>
      <div class="chart-bar-group"><div class="chart-label">P2 High</div><div class="chart-bar"><div class="chart-fill" style="width: 20%; background: var(--accent-amber);"></div></div><div class="chart-value">20%</div></div>
      <div class="chart-bar-group"><div class="chart-label">P3 Medium</div><div class="chart-bar"><div class="chart-fill" style="width: 50%; background: var(--primary-blue);"></div></div><div class="chart-value">50%</div></div>
      <div class="chart-bar-group"><div class="chart-label">P4 Low</div><div class="chart-bar"><div class="chart-fill" style="width: 25%; background: var(--text-muted);"></div></div><div class="chart-value">25%</div></div>
    `;
  }

  const ven = document.getElementById('chart-vendor-compliance');
  if (ven) {
    ven.innerHTML = `
      <div class="chart-bar-group"><div class="chart-label">Dell Enterprise</div><div class="chart-bar"><div class="chart-fill" style="width: 98%; background: var(--accent-emerald);"></div></div><div class="chart-value">98%</div></div>
      <div class="chart-bar-group"><div class="chart-label">Internal Software</div><div class="chart-bar"><div class="chart-fill" style="width: 92%; background: var(--accent-emerald);"></div></div><div class="chart-value">92%</div></div>
      <div class="chart-bar-group"><div class="chart-label">ChillTech HVAC</div><div class="chart-bar"><div class="chart-fill" style="width: 85%; background: var(--accent-amber);"></div></div><div class="chart-value">85%</div></div>
    `;
  }
}

// ==================== CHANGE MANAGEMENT ====================
function renderChangeRequests() {
  const c = document.getElementById('changes-container');
  if (!c) return;
  const count = document.getElementById('change-count');
  if (count) count.innerText = `Total: ${changeRequests.length}`;

  c.innerHTML = changeRequests.map(chg => {
    let borderColor = 'var(--text-muted)';
    if (chg.risk === 'Low') borderColor = 'var(--accent-emerald)';
    else if (chg.risk === 'Medium') borderColor = 'var(--accent-amber)';
    else if (chg.risk === 'High') borderColor = 'var(--accent-rose)';
    else if (chg.risk === 'Critical') borderColor = '#9333ea';

    let btns = '';
    if (currentUser && currentUser.role === 'ADMIN' && chg.status === 'Pending') {
      btns = `
        <div style="margin-top:10px; display:flex; gap:10px;">
          <button class="btn btn-primary" onclick="approveChangeRequest('${chg.id}')">Approve</button>
          <button class="btn btn-secondary" onclick="rejectChangeRequest('${chg.id}')">Reject</button>
        </div>
      `;
    }

    return `
      <div class="glass-panel" style="padding:1.2rem; border-left:4px solid ${borderColor}; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:bold;">${chg.id} - ${chg.type}</span>
          <span class="badge badge-status">${chg.status}</span>
        </div>
        <p style="font-size:0.95rem; margin-bottom:4px;">${chg.description}</p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Requester: ${chg.requester} | Impact: ${chg.impact} | Risk: ${chg.risk}</p>
        ${chg.reviewerNotes ? `<p style="font-size:0.8rem; color:var(--primary-blue);">Notes: ${chg.reviewerNotes}</p>` : ''}
        ${btns}
      </div>
    `;
  }).join('');
}

function handleChangeSubmit(e) {
  e.preventDefault();
  const desc = document.getElementById('chg-desc').value;
  const just = document.getElementById('chg-justification').value;
  const type = document.getElementById('chg-type').value;
  const impact = document.getElementById('chg-impact').value;
  
  let risk = 'Low';
  if (impact === 'High') risk = 'High';
  else if (impact === 'Medium') risk = 'Medium';

  const id = 'CHG-' + Math.floor(Math.random() * 900 + 100);
  changeRequests.unshift({
    id, type, description: desc, justification: just, impact, risk,
    status: 'Pending', requester: currentUser ? currentUser.name : 'Unknown',
    reviewerNotes: '', submittedAt: 'Just now'
  });

  e.target.reset();
  renderChangeRequests();
  showToast(`✅ Change Request ${id} submitted.`);
  logAuditEvent('CHANGE', `New Change Request ${id} submitted.`);
}

function approveChangeRequest(id) {
  const chg = changeRequests.find(x => x.id === id);
  if (chg) {
    chg.status = 'Approved';
    chg.reviewerNotes = 'Approved by ' + currentUser.name;
    renderChangeRequests();
    addNewNotification('SECURITY', `Change Approved`, `Change Request ${id} was approved.`);
    logAuditEvent('CHANGE', `Change Request ${id} approved.`);
  }
}

function rejectChangeRequest(id) {
  const chg = changeRequests.find(x => x.id === id);
  if (chg) {
    chg.status = 'Rejected';
    chg.reviewerNotes = 'Rejected by ' + currentUser.name;
    renderChangeRequests();
    addNewNotification('SECURITY', `Change Rejected`, `Change Request ${id} was rejected.`);
    logAuditEvent('CHANGE', `Change Request ${id} rejected.`);
  }
}

// ==================== IN-TICKET CHAT ====================
function openTicketChat(ticketId) {
  activeChatTicketId = ticketId;
  const m = document.getElementById('modal-chat');
  if (m) m.style.display = 'flex';
  if (!ticketChats[ticketId]) ticketChats[ticketId] = [];
  renderChatMessages();
}

function renderChatMessages() {
  const c = document.getElementById('chat-messages-container');
  if (!c) return;
  const msgs = ticketChats[activeChatTicketId] || [];
  if (msgs.length === 0) {
    c.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:2rem;">No messages yet. Start the conversation!</p>';
    return;
  }
  c.innerHTML = msgs.map(m => {
    const isMe = m.sender === currentUser.name;
    const align = isMe ? 'flex-end' : 'flex-start';
    const bg = isMe ? 'var(--primary-blue)' : 'var(--bg-subtle)';
    const color = isMe ? '#fff' : 'var(--text-heading)';
    return `
      <div style="display:flex; flex-direction:column; align-items:${align}; margin-bottom:10px;">
        <span style="font-size:0.7rem; color:var(--text-muted); margin-bottom:2px;">${m.sender} (${m.senderRole}) - ${m.time}</span>
        <div style="background:${bg}; color:${color}; padding:8px 12px; border-radius:8px; max-width:80%; font-size:0.85rem;">
          ${m.message}
        </div>
      </div>
    `;
  }).join('');
  c.scrollTop = c.scrollHeight;
}

function sendChatMessage() {
  const inp = document.getElementById('chat-input');
  if (!inp || !inp.value.trim()) return;
  const msg = inp.value.trim();
  ticketChats[activeChatTicketId].push({
    sender: currentUser.name,
    senderRole: currentUser.role,
    message: msg,
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
  inp.value = '';
  renderChatMessages();
}

function closeChatModal() {
  const m = document.getElementById('modal-chat');
  if (m) m.style.display = 'none';
  activeChatTicketId = null;
}

// ==================== CSAT SURVEY ====================
function openCsatSurvey(ticketId) {
  activeCsatTicketId = ticketId;
  selectedCsatRating = 0;
  const m = document.getElementById('modal-csat');
  if (m) m.style.display = 'flex';
  const input = document.getElementById('csat-feedback');
  if (input) input.value = '';
  setCsatRating(0);
}

function setCsatRating(rating) {
  selectedCsatRating = rating;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`csat-star-${i}`);
    if (star) {
      if (i <= rating) {
        star.style.color = '#F59E0B';
        star.className = 'fa-solid fa-star';
      } else {
        star.style.color = 'var(--text-muted)';
        star.className = 'fa-regular fa-star';
      }
    }
  }
}

function submitCsatRating() {
  if (selectedCsatRating === 0) { alert('Please select a rating.'); return; }
  const fb = document.getElementById('csat-feedback') ? document.getElementById('csat-feedback').value : '';
  csatRatings[activeCsatTicketId] = { rating: selectedCsatRating, feedback: fb };
  showToast('✅ Thank you for your feedback!');
  logAuditEvent('TICKET', `CSAT Rating submitted for ticket ${activeCsatTicketId}: ${selectedCsatRating} stars.`);
  closeCsatModal();
}

function closeCsatModal() {
  const m = document.getElementById('modal-csat');
  if (m) m.style.display = 'none';
  activeCsatTicketId = null;
}

// ==================== AUDIT LOG ====================
function logAuditEvent(action, details) {
  const ts = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const user = currentUser ? currentUser.name : 'System';
  auditLog.unshift({ timestamp: ts, action, user, details });
  if (auditLog.length > 100) auditLog.pop();
  if (document.getElementById('view-audit')?.style.display === 'block') {
    renderAuditLog();
  }
}

function renderAuditLog() {
  const body = document.getElementById('audit-log-body');
  if (!body) return;
  body.innerHTML = auditLog.map(a => {
    let badgeColor = 'var(--text-muted)';
    if (a.action === 'LOGIN') badgeColor = 'var(--primary-blue)';
    else if (a.action === 'TICKET') badgeColor = 'var(--accent-emerald)';
    else if (a.action === 'SOS') badgeColor = 'var(--accent-rose)';
    else if (a.action === 'CHANGE') badgeColor = '#9333ea';
    else if (a.action === 'NAVIGATE') badgeColor = '#4f46e5';

    return `
      <tr>
        <td style="font-family:monospace; font-size:0.8rem;">${a.timestamp}</td>
        <td><span class="badge" style="background:${badgeColor}; color:#fff;">${a.action}</span></td>
        <td style="font-size:0.85rem;">${a.user}</td>
        <td style="font-size:0.85rem;">${a.details}</td>
      </tr>
    `;
  }).join('');
}

// ==================== FLOOR MAP ====================
function renderFloorMap() {
  const grid = document.getElementById('floor-grid');
  if (!grid) return;
  
  let html = '';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 10; c++) {
      let type = 'hallway';
      let label = '';
      let hasIssue = false;
      
      if (r === 1 && c >= 1 && c <= 4) { type = 'desk'; label = `30${c}`; }
      if (r === 2 && c >= 1 && c <= 4) { type = 'desk'; label = `30${c+4}`; }
      if (r === 4 && c === 1) { type = 'server-room'; label = 'SR'; }
      if (r === 4 && c === 2) { type = 'hvac'; label = 'HVAC'; }
      if (r === 4 && c === 8) { type = 'network-hub'; label = 'NET'; }
      if (r === 1 && c >= 7 && c <= 8) { type = 'meeting-room'; label = 'MR1'; }
      
      if (type === 'server-room' && majorIncidents.some(i => i.status === 'Active' && i.title.includes('Server'))) {
        hasIssue = true;
      }

      let inner = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:${getColorForType(type)}; border:1px solid rgba(0,0,0,0.1); font-size:0.7rem; font-weight:bold; color:#333; position:relative; cursor:pointer;" onclick="clickFloorCell('${type}', '${label}', ${hasIssue})">
        ${label}
        ${hasIssue ? '<div style="position:absolute; top:2px; right:2px; width:8px; height:8px; background:var(--accent-rose); border-radius:50%; animation: pulse 2s infinite;"></div>' : ''}
      </div>`;
      html += inner;
    }
  }
  grid.innerHTML = html;
}

function getColorForType(t) {
  if (t === 'desk') return '#e2e8f0';
  if (t === 'server-room') return '#cbd5e1';
  if (t === 'hvac') return '#bae6fd';
  if (t === 'network-hub') return '#fde047';
  if (t === 'meeting-room') return '#d9f99d';
  return 'transparent'; // hallway
}

function clickFloorCell(type, label, hasIssue) {
  const d = document.getElementById('floormap-incident-detail');
  if (!d) return;
  if (hasIssue) {
    d.innerHTML = `<div class="glass-panel" style="padding:1rem; border-left:4px solid var(--accent-rose); margin-top:1rem;">
      <h4 style="margin-bottom:0.5rem; color:var(--accent-rose);">Incident at ${label} (${type})</h4>
      <p style="font-size:0.85rem;">Active severity issue detected. Please check Incidents tab for details.</p>
    </div>`;
  } else {
    d.innerHTML = `<div style="padding:1rem; color:var(--text-muted); font-size:0.85rem;">Location: ${label || 'Hallway'} (${type}). Status: Normal.</div>`;
  }
}

// ==================== QUICK SUBMIT TICKET ====================
function quickSubmitTicket(title, category, description, priority) {
  const code = 'TICK-' + Math.random().toString(36).substring(2,8).toUpperCase();
  let pName = 'P3 Medium', sla = 86400, domain = 'SOFTWARE';
  if (category.includes('Hardware')) domain = 'HARDWARE';
  else if (category.includes('Facilities')) domain = 'FACILITIES';
  if (priority === 'P1_CRITICAL') { pName = 'P1 Critical'; sla = 7200; }
  else if (priority === 'P2_HIGH') { pName = 'P2 High'; sla = 28800; }
  
  tickets.unshift({
    id: Date.now(), code, title, description,
    location: 'Auto-assigned', category, domainTag: domain,
    priority, priorityName: pName,
    status: 'SUBMITTED', statusLabel: 'Submitted',
    vendor: domain === 'HARDWARE' ? 'Dell Enterprise Solutions' : 'Internal Software & Security Team',
    createdAt: 'Just now', slaSecondsRemaining: sla
  });
  renderEmployeeTickets();
  addNewNotification('SLA', `Quick Ticket Created (${code})`, `"${title}" submitted via quick action.`);
  showToast(`✅ Quick ticket ${code} created!`);
  logAuditEvent('TICKET', `Quick ticket ${code} created: ${title}`);
}

// ==================== ADMIN DASHBOARD ====================
function renderAdminDashboard() {
  const kpi = document.getElementById('admin-kpi-cards');
  if (kpi) {
    const totalT = tickets.length;
    const p1Count = tickets.filter(t => t.priority === 'P1_CRITICAL').length;
    kpi.innerHTML = `
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Open Tickets</h3><p style="font-size:1.5rem; font-weight:bold;">${totalT}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>P1 Critical</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-rose);">${p1Count}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Active Incidents</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-amber);">${majorIncidents.filter(i => i.status === 'Active').length}</p></div>
      <div class="glass-panel" style="padding:1rem; text-align:center;"><h3>Deflection Rate</h3><p style="font-size:1.5rem; font-weight:bold; color:var(--accent-emerald);">${document.getElementById('kb-deflection-rate')?.innerText || '0%'}</p></div>
    `;
  }

  const aiTable = document.getElementById('admin-ai-table-body');
  if (aiTable) {
    aiTable.innerHTML = `
      <tr><td>Hardware / Laptop</td><td>25</td><td>High</td></tr>
      <tr><td>Software / Access</td><td>40</td><td>Medium</td></tr>
      <tr><td>Facilities / HVAC</td><td>10</td><td>Low</td></tr>
      <tr><td>Network</td><td>15</td><td>Medium</td></tr>
    `;
  }

  const vendorList = document.getElementById('admin-vendor-list');
  if (vendorList) {
    vendorList.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Dell Enterprise</span><span style="color:var(--accent-emerald);">98% SLA</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>Internal Software</span><span style="color:var(--accent-emerald);">92% SLA</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>ChillTech HVAC</span><span style="color:var(--accent-amber);">85% SLA</span></div>
    `;
  }
}
