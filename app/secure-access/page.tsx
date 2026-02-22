'use client';

import React, { useState } from 'react';
import {
    Lock, Shield, Users, Eye, CheckCircle, AlertTriangle,
    Monitor, Globe, Clock, Info, UserCheck
} from 'lucide-react';
import styles from './page.module.css';

interface Permission {
    id: string;
    name: string;
    requester: string;
    type: 'club' | 'lab' | 'service';
    dataAccess: string;
    enabled: boolean;
}

const initialPermissions: Permission[] = [
    { id: 'chess', name: 'Chess Club', requester: 'Chess Society', type: 'club', dataAccess: 'Email address only', enabled: true },
    { id: 'cslab', name: 'CS Lab Access', requester: 'CS Department', type: 'lab', dataAccess: 'Student ID + Schedule', enabled: true },
    { id: 'library', name: 'Library Portal', requester: 'University Library', type: 'service', dataAccess: 'Name + Enrollment year', enabled: true },
    { id: 'hackathon', name: 'Hackathon Team', requester: 'Tech Club', type: 'club', dataAccess: 'Email + GitHub username', enabled: false },
    { id: 'gym', name: 'Campus Gym', requester: 'Sports Office', type: 'service', dataAccess: 'Student ID only', enabled: true },
    { id: 'robotics', name: 'Robotics Lab', requester: 'Mech Department', type: 'lab', dataAccess: 'ID + Lab hours', enabled: false },
];

const fraudAlerts = [
    { id: 1, level: 'safe', title: 'Login from CS Lab, Building A', description: 'Your usual device and location. Everything looks normal.', time: '10 minutes ago' },
    { id: 2, level: 'warning', title: 'New device detected', description: 'Someone (or you) logged in from a new phone. If this wasn\'t you, change your password immediately.', time: '2 hours ago' },
    { id: 3, level: 'safe', title: 'Password changed successfully', description: 'Your password was updated. Good job keeping it fresh!', time: 'Yesterday' },
];

const consentLog = [
    { action: 'granted', text: 'You allowed Chess Club to see your email', time: 'Jan 15' },
    { action: 'revoked', text: 'You revoked Hackathon Team access', time: 'Jan 12' },
    { action: 'granted', text: 'You allowed Campus Gym to see your Student ID', time: 'Jan 10' },
    { action: 'granted', text: 'You allowed CS Lab to access your schedule', time: 'Jan 5' },
];

export default function SecureAccess() {
    const [permissions, setPermissions] = useState(initialPermissions);

    const togglePermission = (id: string) => {
        setPermissions(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    };

    const activeCount = permissions.filter(p => p.enabled).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><Lock size={28} /> Consent-First Secure Access</h1>
                <p>Control exactly who can see your data — grant, revoke, and track permissions in one place</p>
            </div>

            {/* Consent Banner */}
            <div className={styles.consentBanner}>
                <UserCheck size={20} />
                <span>You control your data. {activeCount} active permissions · {permissions.length - activeCount} revoked · All changes are logged.</span>
            </div>

            {/* Permissions */}
            <div className={styles.section}>
                <h2><Shield size={20} /> Your Permissions</h2>
                <div className={styles.permissionGrid}>
                    {permissions.map((perm) => (
                        <div key={perm.id} className={styles.permissionCard}>
                            <div className={styles.permInfo}>
                                <div className={`${styles.permIcon} ${styles[perm.type]}`}>
                                    {perm.type === 'club' ? <Users size={18} /> : perm.type === 'lab' ? <Monitor size={18} /> : <Globe size={18} />}
                                </div>
                                <div className={styles.permDetails}>
                                    <h4>{perm.name}</h4>
                                    <p>Requested by: {perm.requester} · Shares: {perm.dataAccess}</p>
                                </div>
                            </div>
                            <div className={styles.permActions}>
                                <button
                                    className={`${styles.toggle} ${perm.enabled ? styles.on : ''}`}
                                    onClick={() => togglePermission(perm.id)}
                                    aria-label={`${perm.enabled ? 'Revoke' : 'Grant'} permission for ${perm.name}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fraud Signals */}
            <div className={styles.section}>
                <h2><Eye size={20} /> Login Activity (Plain English)</h2>
                <div className={styles.fraudGrid}>
                    {fraudAlerts.map((alert) => (
                        <div key={alert.id} className={`${styles.fraudAlert} ${styles[alert.level]}`}>
                            {alert.level === 'safe' ? <CheckCircle size={18} style={{ color: 'var(--color-accent-green)', flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />}
                            <div className={styles.fraudInfo}>
                                <h4>{alert.title}</h4>
                                <p>{alert.description}</p>
                                <div className={styles.fraudTime}><Clock size={10} /> {alert.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consent Log */}
            <div className={styles.section}>
                <h2><Clock size={20} /> Consent History</h2>
                <div className={styles.consentLog}>
                    {consentLog.map((log, idx) => (
                        <div key={idx} className={styles.logItem}>
                            <span className={`${styles.logDot} ${styles[log.action]}`} />
                            <span>{log.text}</span>
                            <span style={{ marginLeft: 'auto' }}>{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className={styles.consentBanner}>
                <Info size={20} />
                <span>All permission changes are instant and logged. You can revoke any access at any time. Organizations will be notified but cannot override your choice.</span>
            </div>
        </div>
    );
}
