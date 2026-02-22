'use client';

import React, { useState } from 'react';
import {
    Bell,
    Settings,
    Key,
    Clock,
    Shield,
    User,
    ChevronDown,
} from 'lucide-react';
import styles from './TopBar.module.css';
import { useSystem } from '@/contexts/SystemContext';

interface TopBarProps {
    onOpenApiKeyModal?: () => void;
}

export default function TopBar({ onOpenApiKeyModal }: TopBarProps) {
    const { systemInfo, localScrubbing, toggleLocalScrubbing } = useSystem();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isAMD = systemInfo?.cpuInfo?.vendor === 'AMD';
    const isIntel = systemInfo?.cpuInfo?.vendor === 'Intel';
    const hasNPU = systemInfo?.cpuInfo?.hasNPU;

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <header className={styles.topbar}>
            {/* Left Section - Status Banner & Hardware Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.alertBanner}>
                    <Shield size={16} className={styles.alertIcon} />
                    <span className={styles.alertText}>Campus Protected</span>
                </div>

                {/* Hardware Detect Badge */}
                {isAMD && (
                    <div className={styles.statusPill} style={{ background: 'rgba(237, 28, 36, 0.1)', border: '1px solid rgba(237, 28, 36, 0.2)', color: '#ED1C24', padding: '0.3rem 0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.6rem' }}>AMD RYZEN AI {hasNPU ? 'NPU' : ''}</span>
                    </div>
                )}
                {isIntel && (
                    <div className={styles.statusPill} style={{ background: 'rgba(0, 113, 197, 0.1)', border: '1px solid rgba(0, 113, 197, 0.2)', color: '#0071C5', padding: '0.3rem 0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.6rem' }}>INTEL CORE™</span>
                    </div>
                )}
            </div>

            {/* Center Section - Global Privacy Toggle */}
            <div className={styles.searchSection}>
                <div
                    onClick={toggleLocalScrubbing}
                    className={styles.statusPill}
                    style={{
                        cursor: 'pointer',
                        background: localScrubbing ? 'rgba(163, 190, 140, 0.1)' : 'rgba(235, 203, 139, 0.05)',
                        border: localScrubbing ? '1px solid rgba(163, 190, 140, 0.4)' : '1px solid rgba(235, 203, 139, 0.3)',
                        color: localScrubbing ? 'var(--color-accent-green)' : 'var(--color-warning)',
                        padding: '0.5rem 1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        borderRadius: '20px'
                    }}
                >
                    <Shield size={14} className={localScrubbing ? styles.statusPulse : ''} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Local Privacy Mode: {localScrubbing ? 'ON' : 'OFF'}
                    </span>
                    {isAMD && localScrubbing && (
                        <span style={{ fontSize: '0.55rem', fontWeight: 800, background: 'rgba(163, 190, 140, 0.2)', padding: '2px 5px', borderRadius: '4px' }}>
                            RYZEN™ AI
                        </span>
                    )}
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className={styles.actionsSection}>
                <div className={styles.timeDisplay}>
                    <Clock size={16} />
                    <span>{currentTime}</span>
                </div>

                <div className={styles.statusPill}>
                    <Shield size={14} className={styles.statusPulse} />
                    <span>Protected</span>
                </div>

                <button className={styles.iconBtn} onClick={onOpenApiKeyModal} title="Configure API Key">
                    <Key size={18} />
                </button>

                <button className={styles.iconBtn} title="Notifications">
                    <Bell size={18} />
                    <span className={styles.notifBadge}>2</span>
                </button>

                <button className={styles.iconBtn} title="Settings">
                    <Settings size={18} />
                </button>

                <div className={styles.userMenu}>
                    <button className={styles.userBtn} onClick={() => setShowUserMenu(!showUserMenu)}>
                        <div className={styles.avatar}>
                            <User size={18} />
                        </div>
                        <span className={styles.userName}>Student</span>
                        <ChevronDown size={14} />
                    </button>
                    {showUserMenu && (
                        <div className={styles.dropdown}>
                            <a href="#profile">My Profile</a>
                            <a href="#progress">My Progress</a>
                            <a href="#logout">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
