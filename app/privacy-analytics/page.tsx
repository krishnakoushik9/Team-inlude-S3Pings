'use client';

import React from 'react';
import {
    BarChart3, Shield, Lock, Eye, EyeOff, Monitor,
    Users, Clock, Wifi, CheckCircle, Info
} from 'lucide-react';
import styles from './page.module.css';

const labData = [
    { name: 'CS Lab A (Room 204)', users: 18, capacity: 30, status: 'open' },
    { name: 'EE Lab B (Room 112)', users: 24, capacity: 25, status: 'full' },
    { name: 'Library Computer Zone', users: 42, capacity: 60, status: 'open' },
    { name: 'Design Studio', users: 8, capacity: 15, status: 'open' },
    { name: 'Robotics Lab', users: 0, capacity: 20, status: 'closed' },
];

const hourlyUsage = [
    { hour: '8 AM', count: 12 },
    { hour: '10 AM', count: 45 },
    { hour: '12 PM', count: 68 },
    { hour: '2 PM', count: 54 },
    { hour: '4 PM', count: 72 },
    { hour: '6 PM', count: 38 },
    { hour: '8 PM', count: 22 },
];

const maxUsage = Math.max(...hourlyUsage.map(h => h.count));

export default function PrivacyAnalytics() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><BarChart3 size={28} /> Privacy-Preserving Analytics</h1>
                <p>Aggregated, anonymized campus data — no names, no IDs, no raw PII</p>
            </div>

            {/* Privacy Badge */}
            <div className={styles.privacyBadge}>
                <Shield size={20} />
                <span>✅ All data shown is anonymized and aggregated. No individual student can be identified. Zero raw PII is stored or transmitted.</span>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Users size={20} style={{ color: 'var(--color-accent-blue)', marginBottom: '0.5rem' }} />
                    <div className={styles.statValue}>128</div>
                    <div className={styles.statLabel}>Students Online Now</div>
                    <div className={styles.statNote}>🔒 Count only, no identities</div>
                </div>
                <div className={styles.statCard}>
                    <Monitor size={20} style={{ color: 'var(--color-accent-cyan)', marginBottom: '0.5rem' }} />
                    <div className={styles.statValue}>92</div>
                    <div className={styles.statLabel}>Lab PCs Active</div>
                    <div className={styles.statNote}>🔒 Machine IDs only</div>
                </div>
                <div className={styles.statCard}>
                    <Wifi size={20} style={{ color: 'var(--color-accent-green)', marginBottom: '0.5rem' }} />
                    <div className={styles.statValue}>4</div>
                    <div className={styles.statLabel}>WiFi Access Points</div>
                    <div className={styles.statNote}>🔒 Network-level only</div>
                </div>
                <div className={styles.statCard}>
                    <Lock size={20} style={{ color: 'var(--color-purple)', marginBottom: '0.5rem' }} />
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>PII Records Stored</div>
                    <div className={styles.statNote}>✅ Privacy-by-design</div>
                </div>
            </div>

            {/* Lab Usage */}
            <div className={styles.section}>
                <h2><Monitor size={20} /> Lab Occupancy (Anonymized)</h2>
                <div className={styles.labGrid}>
                    {labData.map((lab) => (
                        <div key={lab.name} className={styles.labCard}>
                            <div className={styles.labInfo}>
                                <div className={styles.labIcon}>
                                    <Monitor size={18} />
                                </div>
                                <div>
                                    <div className={styles.labName}>{lab.name}</div>
                                    <div className={styles.labSub}>{lab.status === 'closed' ? 'Closed' : `${lab.users}/${lab.capacity} occupied`}</div>
                                </div>
                            </div>
                            <div className={styles.labStats}>
                                <div className={styles.labCount}>{lab.users}</div>
                                <div className={styles.labPrivacy}>
                                    <EyeOff size={10} /> Anonymous
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hourly Usage Chart */}
            <div className={styles.section}>
                <h2><Clock size={20} /> Today&apos;s Usage Pattern (Aggregated)</h2>
                <div className={styles.barChart}>
                    {hourlyUsage.map((item) => (
                        <div key={item.hour} className={styles.barItem}>
                            <span className={styles.barLabel}>{item.hour}</span>
                            <div className={styles.barTrack}>
                                <div className={styles.barFill} style={{ width: `${(item.count / maxUsage) * 100}%` }}>
                                    {item.count}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Privacy Explanation */}
            <div className={styles.infoBox}>
                <Info size={20} />
                <div>
                    <strong>How we protect your privacy:</strong> All data is aggregated using k-anonymity principles.
                    Individual records are never stored. We show group sizes of 5+, so no individual can be singled out.
                    This dashboard cannot identify who used a specific computer — it only shows how many.
                </div>
            </div>
        </div>
    );
}
