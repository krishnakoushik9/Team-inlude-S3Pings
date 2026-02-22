'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Monitor,
    Shield,
    ShieldCheck,
    Mail,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Lock,
    BarChart3,
    BookOpen,
    Search,
    GraduationCap,
    Inbox
} from 'lucide-react';
import styles from './Sidebar.module.css';

const modules = [
    { name: 'Dashboard', path: '/', icon: Sparkles },
    { name: 'Mail Center', path: '/mail-center', icon: Inbox, alert: true },
    { name: 'Cyber Academy', path: '/learning-hub', icon: GraduationCap },
    { name: 'Phishing Lab', path: '/phishing-lab', icon: Mail },
    { name: 'File Safety', path: '/file-safety', icon: ShieldCheck },
    { name: 'Network View', path: '/control-room', icon: Monitor },
    { name: 'Digital Hygiene', path: '/digital-hygiene', icon: Shield },
    { name: 'Privacy Analytics', path: '/privacy-analytics', icon: BarChart3 },
    { name: 'Secure Access', path: '/secure-access', icon: Lock },
    { name: 'Explainer', path: '/explainer', icon: Search },
    { name: 'AI Mentor', path: '/guidance', icon: HelpCircle },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                    <BookOpen size={28} />
                </div>
                {!collapsed && (
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>CyberSafe</span>
                        <span className={styles.logoSubtitle}>Campus</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {modules.map((mod) => {
                    const Icon = mod.icon;
                    const isActive = pathname === mod.path;
                    return (
                        <Link
                            key={mod.name}
                            href={mod.path}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            title={collapsed ? mod.name : undefined}
                        >
                            <div className={styles.iconWrapper}>
                                <Icon size={20} />
                                {mod.alert && <span className={styles.alertDot} />}
                            </div>
                            {!collapsed && <span className={styles.navLabel}>{mod.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <button
                className={styles.collapseBtn}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Status Indicator */}
            <div className={styles.statusSection}>
                <div className={styles.statusIndicator}>
                    <Shield size={16} className={styles.statusIcon} />
                    {!collapsed && <span>Protected</span>}
                </div>
            </div>
        </aside>
    );
}
