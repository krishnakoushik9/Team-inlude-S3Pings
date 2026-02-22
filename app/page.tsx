'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Mail,
  Wifi,
  Users,
  TrendingUp,
  Clock,
  Eye,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Activity,
  Sparkles,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import { useSystem } from '@/contexts/SystemContext';
import styles from './page.module.css';

const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    message: 'Suspicious login attempt on your library account from a new device',
    source: 'Campus Auth',
    time: '2 min ago',
  },
  {
    id: 2,
    type: 'critical',
    message: 'Phishing email detected: "Scholarship Application — Urgent Action Required"',
    source: 'Email Filter',
    time: '15 min ago',
  },
  {
    id: 3,
    type: 'info',
    message: 'Your 2FA was used to sign in from the CS lab',
    source: 'Identity',
    time: '1 hr ago',
  },
];

const quickLinks = [
  { name: 'Mail Center', path: '/mail-center', icon: Inbox, desc: 'AI-powered email security' },
  { name: 'Phishing Lab', path: '/phishing-lab', icon: Mail, desc: 'Learn to spot fake emails' },
  { name: 'Digital Hygiene', path: '/digital-hygiene', icon: Shield, desc: 'Check your security score' },
  { name: 'AI Mentor', path: '/guidance', icon: Sparkles, desc: 'Ask a security question' },
];

export default function Dashboard() {
  const { systemInfo } = useSystem();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>🛡️ {greeting}, Student!</h1>
          <p>Your campus cybersecurity at a glance — stay safe, stay informed.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.systemStatus}>
            <span className={`${styles.statusDot} ${styles.active}`} />
            <span>{systemInfo?.hostname || 'Campus Network'}</span>
          </div>
          <span className={`${styles.liveBadge} ${styles.active}`}>
            <Activity size={12} /> Live
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statIcon}><Shield size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>94%</span>
            <span className={styles.statLabel}>Security Score</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statIcon}><Mail size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>3</span>
            <span className={styles.statLabel}>Phishing Blocked</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.critical}`}>
          <div className={styles.statIcon}><Wifi size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>Safe</span>
            <span className={styles.statLabel}>WiFi Status</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.success}`}>
          <div className={styles.statIcon}><Users size={24} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>128</span>
            <span className={styles.statLabel}>Students Protected</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Alerts */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><AlertTriangle size={18} /> Recent Alerts</h3>
            <span className={styles.badge}>{mockAlerts.length} new</span>
          </div>
          <div className={styles.alertsList}>
            {mockAlerts.map((alert) => (
              <div key={alert.id} className={`${styles.alertItem} ${styles[alert.type]}`}>
                <span className={styles.alertDot} />
                <div className={styles.alertContent}>
                  <span className={styles.alertMessage}>{alert.message}</span>
                  <div className={styles.alertMeta}>
                    <span><Eye size={12} /> {alert.source}</span>
                    <span><Clock size={12} /> {alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Health */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><TrendingUp size={18} /> Your Security Health</h3>
            <button className={styles.viewAllBtn}>View Report</button>
          </div>
          <div className={styles.healthList}>
            <div className={styles.healthItem}>
              <div className={styles.healthInfo}>
                <span>Password Strength</span>
                <span className={styles.healthValue}>Strong</span>
              </div>
              <div className={styles.healthBar}>
                <div className={`${styles.healthProgress} ${styles.normal}`} style={{ width: '85%' }} />
              </div>
            </div>
            <div className={styles.healthItem}>
              <div className={styles.healthInfo}>
                <span>2FA Enabled</span>
                <span className={styles.healthValue}>Yes ✓</span>
              </div>
              <div className={styles.healthBar}>
                <div className={`${styles.healthProgress} ${styles.normal}`} style={{ width: '100%' }} />
              </div>
            </div>
            <div className={styles.healthItem}>
              <div className={styles.healthInfo}>
                <span>Phishing Awareness</span>
                <span className={styles.healthValue}>Learning</span>
              </div>
              <div className={styles.healthBar}>
                <div className={`${styles.healthProgress} ${styles.warning}`} style={{ width: '60%' }} />
              </div>
            </div>
            <div className={styles.healthItem}>
              <div className={styles.healthInfo}>
                <span>Privacy Settings</span>
                <span className={styles.healthValue}>Good</span>
              </div>
              <div className={styles.healthBar}>
                <div className={`${styles.healthProgress} ${styles.normal}`} style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><Sparkles size={18} /> Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.name} href={link.path} className={styles.actionBtn}>
                  <Icon size={22} />
                  <span>{link.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>{link.desc}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tips of the Day */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><BookOpen size={18} /> Tip of the Day</h3>
          </div>
          <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-accent-blue)' }}>
              🎓 Public WiFi Safety
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Campus WiFi is convenient, but avoid accessing bank accounts or entering passwords
              on open networks. Use your university's VPN when possible — it's like putting your
              data in a sealed envelope instead of a postcard!
            </p>
            <Link href="/digital-hygiene" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-accent-blue)' }}>
              Learn more <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Team Banner */}
      <div className={styles.systemMeta}>
        <span>Team #include S3Pings</span>
        <span>CyberSafe Campus — AMD Slingshot 2026</span>
        <span>Powered by Gemini AI</span>
      </div>
    </div>
  );
}
