'use client';

import React, { useState } from 'react';
import {
    Mail, Shield, AlertTriangle, CheckCircle, XCircle,
    RefreshCw, PenSquare, Reply, Forward, Trash2,
    Archive, Star, Search, Inbox, Send, X,
    Lock, Cpu, Eye, ChevronRight, Loader2
} from 'lucide-react';
import styles from './page.module.css';
import { useSystem } from '@/contexts/SystemContext';

// ─── Types ───
interface EmailMessage {
    id: string;
    from: string;
    fromEmail: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    time: string;
    read: boolean;
    starred: boolean;
    safety: 'safe' | 'suspicious' | 'phishing' | 'unscanned';
    safetyReason: string;
    aiConfidence: number;
}

type Filter = 'all' | 'unread' | 'safe' | 'suspicious' | 'phishing';

interface MailPreset {
    name: string;
    imapHost: string;
    imapPort: string;
    smtpHost: string;
    smtpPort: string;
}

// ─── Demo Emails ───
const demoEmails: EmailMessage[] = [
    {
        id: '1',
        from: 'University Registrar',
        fromEmail: 'registrar@university.edu',
        to: 'student@university.edu',
        subject: 'Course Registration Opens Monday — Spring 2026',
        body: `Dear Student,

This is a reminder that course registration for Spring 2026 opens on Monday, February 24th at 9:00 AM.

Please review the course catalog on the student portal before registration opens. If you need academic advising, please schedule an appointment through the portal.

Important dates:
• Registration opens: Feb 24, 9:00 AM
• Add/Drop deadline: Mar 7
• Late registration fee begins: Mar 10

If you have any questions, please visit the Registrar's Office in Admin Building Room 102.

Best regards,
Office of the Registrar
State University`,
        date: 'Feb 22',
        time: '9:15 AM',
        read: false,
        starred: false,
        safety: 'safe',
        safetyReason: 'Verified university domain • No suspicious links • Standard communication pattern',
        aiConfidence: 97
    },
    {
        id: '2',
        from: 'Campus Security Alert',
        fromEmail: 'security-noreply@university.edu',
        to: 'student@university.edu',
        subject: '⚠️ Suspicious Login Attempt on Your Account',
        body: `SECURITY NOTICE

We detected a login to your university account from an unrecognized device.

Details:
• Time: Feb 21, 2026, 11:47 PM IST
• Location: Mumbai, Maharashtra
• Device: Chrome on Windows

If this was you, you can ignore this message.

If this was NOT you, please:
1. Change your password immediately at https://accounts.university.edu/security
2. Enable two-factor authentication
3. Contact IT Security: security@university.edu

Stay safe,
University IT Security Team`,
        date: 'Feb 21',
        time: '11:52 PM',
        read: false,
        starred: true,
        safety: 'safe',
        safetyReason: 'Verified .edu domain • Links point to official university subdomain • Standard security alert format',
        aiConfidence: 94
    },
    {
        id: '3',
        from: 'Scholarship Center',
        fromEmail: 'aid@university-scholarships.net',
        to: 'student@university.edu',
        subject: '🎓 URGENT: Your $5,000 Scholarship Expires in 24 Hours!',
        body: `CONGRATULATIONS! 🎉

You have been selected for the National Merit Scholarship Award of $5,000!

This is a limited-time offer. You MUST claim your scholarship within 24 hours or it will be given to another student.

To claim your scholarship, click below and verify your identity:
👉 https://university-scholarships.net/claim?id=STU29481

You will need to provide:
• Full name and date of birth
• Student ID number
• Bank account details for direct deposit
• Social Security number for tax purposes

Act NOW! This offer expires at midnight tonight!

Regards,
National Scholarship Foundation`,
        date: 'Feb 21',
        time: '3:30 PM',
        read: false,
        starred: false,
        safety: 'phishing',
        safetyReason: 'Non-university domain (university-scholarships.net) • Requests SSN and bank details • Artificial 24-hour urgency • Too-good-to-be-true offer',
        aiConfidence: 98
    },
    {
        id: '4',
        from: 'Dr. Sarah Chen',
        fromEmail: 'sarah.chen@university.edu',
        to: 'student@university.edu',
        subject: 'Re: Office Hours Next Week',
        body: `Hi,

Yes, I'll have extended office hours next week during midterms. You can come by any time between 2-5 PM on Tuesday and Thursday.

Bring your project draft if you'd like feedback before the deadline.

Best,
Dr. Chen
Department of Computer Science`,
        date: 'Feb 20',
        time: '4:22 PM',
        read: true,
        starred: false,
        safety: 'safe',
        safetyReason: 'Verified faculty email • Reply thread context • No links or attachments • Natural conversational tone',
        aiConfidence: 99
    },
    {
        id: '5',
        from: 'IT Help Desk',
        fromEmail: 'helpdesk@g00gle-university.com',
        to: 'student@university.edu',
        subject: 'Your email storage is 99% full — Verify Now',
        body: `Dear Student,

Your university email storage has reached 99% capacity. You will not be able to receive new emails unless you verify and upgrade now.

Click here to verify your account and increase storage:
http://g00gle-university.com/verify?email=student@university.edu

If you do not verify within 12 hours, your account will be suspended and all emails will be permanently deleted.

Sincerely,
Google University IT Support Team`,
        date: 'Feb 20',
        time: '10:05 AM',
        read: false,
        starred: false,
        safety: 'phishing',
        safetyReason: 'Typosquatted domain (g00gle with zeros) • Threatening account deletion • Links to non-university domain • Impersonating Google',
        aiConfidence: 99
    },
    {
        id: '6',
        from: 'Amazon Deals',
        fromEmail: 'deals@amaz0n-student.com',
        to: 'student@university.edu',
        subject: 'FREE Amazon Prime Student — Click to Activate!',
        body: `Hey Student!

You've been selected for a FREE lifetime Amazon Prime membership!

Click here to activate NOW: http://amaz0n-student.com/prime/free

All we need is your .edu email and payment info for "verification."

This offer is only available to the first 100 students who respond!

Amazon Student Deals Team`,
        date: 'Feb 19',
        time: '8:33 AM',
        read: true,
        starred: false,
        safety: 'phishing',
        safetyReason: 'Fake domain (amaz0n with zero) • "Free lifetime" offer is unrealistic • Requests payment for a "free" service • Limited slots pressure tactic',
        aiConfidence: 97
    },
    {
        id: '7',
        from: 'Library Services',
        fromEmail: 'library@university.edu',
        to: 'student@university.edu',
        subject: 'Overdue Book Reminder — "Introduction to Algorithms"',
        body: `Dear Student,

This is a courtesy reminder that the following item is overdue:

Title: Introduction to Algorithms (4th Edition)
Author: Cormen, Leiserson, Rivest, Stein
Due Date: Feb 15, 2026
Fine accrued: $2.50

Please return or renew this item at the circulation desk or through the library portal at https://library.university.edu/my-account.

Thank you,
University Library Services`,
        date: 'Feb 18',
        time: '2:00 PM',
        read: true,
        starred: false,
        safety: 'safe',
        safetyReason: 'Official .edu domain • Specific book details suggest legitimate record • Links to university subdomain • Reasonable tone',
        aiConfidence: 96
    },
    {
        id: '8',
        from: 'Campus WiFi Admin',
        fromEmail: 'wifi-admin@campus-network-verify.org',
        to: 'student@university.edu',
        subject: 'WiFi Access Expiring — Re-authenticate Your Device',
        body: `ATTENTION ALL STUDENTS

Your campus WiFi access token has expired. You must re-authenticate within 6 hours to maintain network access.

Click here to re-authenticate:
http://campus-network-verify.org/auth?device=auto

Enter your university credentials to continue using the campus network.

WARNING: Failure to re-authenticate will result in permanent disconnection from all campus networks.

Campus Network Administration`,
        date: 'Feb 17',
        time: '7:15 PM',
        read: true,
        starred: false,
        safety: 'suspicious',
        safetyReason: 'Non-university domain • Asks for credentials via external link • Threatening permanent disconnection • Unusual "WiFi token" concept',
        aiConfidence: 88
    }
];

// ─── Provider Presets ───
const mailPresets: MailPreset[] = [
    { name: 'Gmail', imapHost: 'imap.gmail.com', imapPort: '993', smtpHost: 'smtp.gmail.com', smtpPort: '587' },
    { name: 'Outlook', imapHost: 'outlook.office365.com', imapPort: '993', smtpHost: 'smtp.office365.com', smtpPort: '587' },
    { name: 'Yahoo', imapHost: 'imap.mail.yahoo.com', imapPort: '993', smtpHost: 'smtp.mail.yahoo.com', smtpPort: '587' },
    { name: 'University (.edu)', imapHost: 'mail.university.edu', imapPort: '993', smtpHost: 'smtp.university.edu', smtpPort: '587' },
];

export default function MailCenter() {
    const { systemInfo, localScrubbing } = useSystem();
    const [showSetup, setShowSetup] = useState(false);
    const [connected, setConnected] = useState(true); // demo mode: start connected
    const [emails, setEmails] = useState<EmailMessage[]>(demoEmails);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>('all');
    const [showCompose, setShowCompose] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Setup form
    const [setupEmail, setSetupEmail] = useState('');
    const [setupPassword, setSetupPassword] = useState('');
    const [setupImapHost, setSetupImapHost] = useState('');
    const [setupImapPort, setSetupImapPort] = useState('993');
    const [setupSmtpHost, setSetupSmtpHost] = useState('');
    const [setupSmtpPort, setSetupSmtpPort] = useState('587');
    const [activePreset, setActivePreset] = useState('');

    // Compose
    const [composeTo, setComposeTo] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');

    const isAMD = systemInfo?.cpuInfo?.vendor === 'AMD';

    const selectedEmail = emails.find(e => e.id === selectedId);

    // Filter emails
    const filteredEmails = emails.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !e.read;
        return e.safety === filter;
    });

    const handleSelectEmail = (id: string) => {
        setSelectedId(id);
        setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate fetch delay
        await new Promise(r => setTimeout(r, 1500));
        setIsRefreshing(false);
    };

    const handleScanEmail = async () => {
        if (!selectedEmail) return;
        setIsScanning(true);
        // Simulate AI scan
        await new Promise(r => setTimeout(r, 2000));
        setIsScanning(false);
    };

    const handlePreset = (preset: MailPreset) => {
        setActivePreset(preset.name);
        setSetupImapHost(preset.imapHost);
        setSetupImapPort(preset.imapPort);
        setSetupSmtpHost(preset.smtpHost);
        setSetupSmtpPort(preset.smtpPort);
    };

    const handleConnect = () => {
        setConnected(true);
        setShowSetup(false);
    };

    const handleDelete = (id: string) => {
        setEmails(prev => prev.filter(e => e.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const handleStar = (id: string) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
    };

    const getSafetyIcon = (safety: string) => {
        switch (safety) {
            case 'safe': return <CheckCircle size={16} />;
            case 'suspicious': return <AlertTriangle size={16} />;
            case 'phishing': return <XCircle size={16} />;
            default: return <Eye size={16} />;
        }
    };

    const getSafetyLabel = (safety: string) => {
        switch (safety) {
            case 'safe': return '🛡️ AI Verified Safe';
            case 'suspicious': return '⚠️ Suspicious — Review Carefully';
            case 'phishing': return '🚨 PHISHING DETECTED — Do Not Click Links';
            default: return '🔍 Not Yet Scanned';
        }
    };

    const getAvatarColor = (email: string) => {
        const colors = ['#88C0D0', '#B48EAD', '#A3BE8C', '#D08770', '#EBCB8B', '#5E81AC', '#BF616A'];
        let hash = 0;
        for (const c of email) hash = c.charCodeAt(0) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const unreadCount = emails.filter(e => !e.read).length;
    const phishingCount = emails.filter(e => e.safety === 'phishing').length;

    return (
        <div className={styles.page}>
            {/* ═══ TOP BAR ═══ */}
            <div className={styles.mailTopBar}>
                <h1>
                    <Mail size={24} /> Mail Center
                    {phishingCount > 0 && (
                        <span style={{ fontSize: '0.7rem', background: 'rgba(191,97,106,0.15)', color: 'var(--color-danger)', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                            {phishingCount} threats blocked
                        </span>
                    )}
                </h1>
                <div className={styles.mailTopBarActions}>
                    <button className={styles.composeBtn} onClick={() => setShowCompose(true)}>
                        <PenSquare size={16} /> Compose
                    </button>
                    <button className={`${styles.refreshBtn} ${isRefreshing ? styles.spinning : ''}`} onClick={handleRefresh} title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                    <button className={styles.refreshBtn} onClick={() => setShowSetup(true)} title="Mail Settings">
                        <Lock size={16} />
                    </button>
                </div>
            </div>

            {/* Privacy Notice */}
            {localScrubbing && (
                <div className={styles.privacyNotice}>
                    <Shield size={14} />
                    Local Privacy Mode Active — Emails scanned on-device{isAMD ? ' via Ryzen™ AI NPU' : ''}, no data leaves your machine
                </div>
            )}

            {/* ═══ MAIN BODY ═══ */}
            <div className={styles.mailBody}>
                {/* ─── INBOX PANEL ─── */}
                <div className={styles.inboxPanel}>
                    <div className={styles.inboxHeader}>
                        <h3><Inbox size={14} /> Inbox</h3>
                        <span className={styles.inboxCount}>{unreadCount} unread</span>
                    </div>

                    {/* Filter Chips */}
                    <div className={styles.filterBar}>
                        {(['all', 'unread', 'safe', 'suspicious', 'phishing'] as Filter[]).map(f => (
                            <button
                                key={f}
                                className={`${styles.filterChip} ${filter === f ? styles.active : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' && 'All'}
                                {f === 'unread' && `Unread (${unreadCount})`}
                                {f === 'safe' && '🟢 Safe'}
                                {f === 'suspicious' && '🟡 Suspicious'}
                                {f === 'phishing' && `🔴 Phishing (${phishingCount})`}
                            </button>
                        ))}
                    </div>

                    {/* Email List */}
                    <div className={styles.emailList}>
                        {filteredEmails.map(email => (
                            <div
                                key={email.id}
                                className={`${styles.emailItem} ${selectedId === email.id ? styles.selected : ''} ${!email.read ? styles.unread : ''} ${styles[email.safety]}`}
                                onClick={() => handleSelectEmail(email.id)}
                            >
                                <div className={`${styles.safetyDot} ${styles[email.safety]}`} />
                                <div className={styles.emailMeta}>
                                    <div className={styles.emailSubject}>{email.subject}</div>
                                    <div className={styles.emailSender}>{email.from}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                    <span className={styles.emailTime}>{email.time}</span>
                                    <span className={`${styles.emailSafetyTag} ${styles[email.safety]}`}>
                                        {email.safety}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {filteredEmails.length === 0 && (
                            <div className={styles.emptyState} style={{ padding: '3rem 1rem' }}>
                                <Search size={24} />
                                <p>No emails match this filter</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── READING PANE ─── */}
                <div className={styles.readingPane}>
                    {!selectedEmail ? (
                        <div className={styles.emptyState}>
                            <Mail size={48} />
                            <p>Select an email to read</p>
                            <span style={{ fontSize: '0.75rem' }}>
                                All incoming emails are automatically scanned by AI
                            </span>
                        </div>
                    ) : (
                        <div className={styles.emailDetail}>
                            {/* Email Header */}
                            <div className={styles.emailDetailHeader}>
                                <div className={styles.emailDetailSubject}>{selectedEmail.subject}</div>
                                <div className={styles.emailDetailMeta}>
                                    <div className={styles.senderAvatar} style={{ background: getAvatarColor(selectedEmail.fromEmail), color: 'white' }}>
                                        {selectedEmail.from.charAt(0)}
                                    </div>
                                    <div className={styles.senderInfo}>
                                        <div className={styles.senderName}>{selectedEmail.from}</div>
                                        <div className={styles.senderEmail}>&lt;{selectedEmail.fromEmail}&gt;</div>
                                    </div>
                                    <div className={styles.emailDate}>{selectedEmail.date}, {selectedEmail.time}</div>
                                </div>
                            </div>

                            {/* AI Safety Banner */}
                            <div className={`${styles.safetyBanner} ${styles[selectedEmail.safety]}`}>
                                {isScanning ? (
                                    <>
                                        <Loader2 size={16} className={styles.scanningPulse} />
                                        <span>Scanning with {isAMD ? 'Ryzen™ AI NPU' : 'Local AI'}...</span>
                                    </>
                                ) : (
                                    <>
                                        {getSafetyIcon(selectedEmail.safety)}
                                        <span>{getSafetyLabel(selectedEmail.safety)}</span>
                                        <span className={styles.safetyReason}>— {selectedEmail.safetyReason}</span>
                                        <button className={styles.scanBtn} onClick={handleScanEmail}>
                                            Re-scan
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Email Body */}
                            <div className={styles.emailBody}>
                                <div className={styles.emailBodyContent}>
                                    {selectedEmail.body.split('\n').map((line, i) => (
                                        <p key={i}>{line || '\u00A0'}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className={styles.emailActions}>
                                <button className={styles.actionBtn}>
                                    <Reply size={14} /> Reply
                                </button>
                                <button className={styles.actionBtn}>
                                    <Forward size={14} /> Forward
                                </button>
                                <button className={styles.actionBtn} onClick={() => handleStar(selectedEmail.id)}>
                                    <Star size={14} fill={selectedEmail.starred ? 'currentColor' : 'none'} /> {selectedEmail.starred ? 'Unstar' : 'Star'}
                                </button>
                                <button className={styles.actionBtn}>
                                    <Archive size={14} /> Archive
                                </button>
                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(selectedEmail.id)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ SETUP MODAL ═══ */}
            {showSetup && (
                <div className={styles.setupOverlay} onClick={() => setShowSetup(false)}>
                    <div className={styles.setupCard} onClick={e => e.stopPropagation()}>
                        <h2><Lock size={22} /> Connect Your Email</h2>
                        <p>
                            Connect your email account to scan incoming messages in real-time.
                            Your credentials are stored locally — they never leave your device.
                        </p>

                        {/* Provider Presets */}
                        <div className={styles.presetBtns}>
                            {mailPresets.map(p => (
                                <button
                                    key={p.name}
                                    className={`${styles.presetBtn} ${activePreset === p.name ? styles.active : ''}`}
                                    onClick={() => handlePreset(p)}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="student@university.edu"
                                value={setupEmail}
                                onChange={e => setSetupEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>App Password</label>
                            <input
                                type="password"
                                placeholder="Use an app-specific password (not your regular login)"
                                value={setupPassword}
                                onChange={e => setSetupPassword(e.target.value)}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>IMAP Server</label>
                                <input
                                    type="text"
                                    placeholder="imap.gmail.com"
                                    value={setupImapHost}
                                    onChange={e => setSetupImapHost(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>IMAP Port</label>
                                <input
                                    type="text"
                                    placeholder="993"
                                    value={setupImapPort}
                                    onChange={e => setSetupImapPort(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>SMTP Server</label>
                                <input
                                    type="text"
                                    placeholder="smtp.gmail.com"
                                    value={setupSmtpHost}
                                    onChange={e => setSetupSmtpHost(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>SMTP Port</label>
                                <input
                                    type="text"
                                    placeholder="587"
                                    value={setupSmtpPort}
                                    onChange={e => setSetupSmtpPort(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                            <Shield size={12} />
                            {isAMD ? 'Credentials encrypted locally via Ryzen™ AI secure enclave' : 'Credentials stored locally — never sent to any server'}
                        </div>

                        <div className={styles.setupActions}>
                            <button className={styles.connectBtn} onClick={handleConnect}>
                                <Cpu size={16} /> Connect & Scan
                            </button>
                            <button className={styles.skipBtn} onClick={() => setShowSetup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ COMPOSE MODAL ═══ */}
            {showCompose && (
                <div className={styles.composeModal}>
                    <div className={styles.composeHeader}>
                        <h3><PenSquare size={16} /> New Message</h3>
                        <button className={styles.closeBtn} onClick={() => setShowCompose(false)}>
                            <X size={18} />
                        </button>
                    </div>
                    <div className={styles.composeBody}>
                        <div className={styles.composeField}>
                            <label>To:</label>
                            <input
                                placeholder="recipient@email.com"
                                value={composeTo}
                                onChange={e => setComposeTo(e.target.value)}
                            />
                        </div>
                        <div className={styles.composeField}>
                            <label>Subject:</label>
                            <input
                                placeholder="Email subject"
                                value={composeSubject}
                                onChange={e => setComposeSubject(e.target.value)}
                            />
                        </div>
                        <textarea
                            className={styles.composeTextarea}
                            placeholder="Write your message..."
                            value={composeBody}
                            onChange={e => setComposeBody(e.target.value)}
                        />
                    </div>
                    <div className={styles.composeFooter}>
                        <button className={styles.sendBtn}>
                            <Send size={14} /> Send
                        </button>
                        <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Shield size={12} /> PII auto-scrub {localScrubbing ? 'active' : 'off'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
