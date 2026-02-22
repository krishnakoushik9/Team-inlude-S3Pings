'use client';

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, FolderSearch, Home, HardDrive, FolderOpen,
    Loader2, CheckCircle, AlertTriangle, Lightbulb, Search, Sparkles
} from 'lucide-react';
import styles from './page.module.css';

type ScanType = 'quick' | 'user' | 'system' | 'custom';

export default function FileSafety() {
    const [clamInstalled, setClamInstalled] = useState<boolean | null>(null);
    const [clamVersion, setClamVersion] = useState('');
    const [scanType, setScanType] = useState<ScanType>('quick');
    const [customPath, setCustomPath] = useState('');
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{
        success: boolean;
        output: string;
        threatsFound: boolean;
    } | null>(null);
    const [explaining, setExplaining] = useState(false);
    const [explanation, setExplanation] = useState('');

    // Check if ClamAV is installed
    useEffect(() => {
        const checkClam = async () => {
            try {
                const res = await fetch('/api/malware', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'check' }),
                });
                const data = await res.json();
                setClamInstalled(data.installed);
                if (data.version) setClamVersion(data.version);
            } catch {
                setClamInstalled(false);
            }
        };
        checkClam();
    }, []);

    const handleScan = async () => {
        setScanning(true);
        setScanResult(null);
        setExplanation('');
        try {
            const res = await fetch('/api/malware', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'scan',
                    scanType,
                    customPath: scanType === 'custom' ? customPath : undefined,
                }),
            });
            const data = await res.json();
            setScanResult(data);
        } catch (error) {
            console.error('Scan error:', error);
            setScanResult({ success: false, output: 'Failed to run scan.', threatsFound: false });
        } finally {
            setScanning(false);
        }
    };

    const handleExplain = async () => {
        if (!scanResult?.output) return;
        setExplaining(true);
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyzeCampusAlert',
                    alertInfo: `ClamAV file scan results:\n${scanResult.output.slice(0, 2000)}\n\nThreats found: ${scanResult.threatsFound}`,
                }),
            });
            const data = await res.json();
            if (data.result) setExplanation(data.result);
        } catch (e) { console.error(e); }
        finally { setExplaining(false); }
    };

    const scanOptions = [
        { type: 'quick' as ScanType, icon: <Search size={22} />, title: 'Quick Scan', desc: 'Scan /tmp for suspicious files' },
        { type: 'user' as ScanType, icon: <Home size={22} />, title: 'My Files', desc: 'Scan your home directory' },
        { type: 'system' as ScanType, icon: <HardDrive size={22} />, title: 'System Scan', desc: 'Scan system binaries' },
        { type: 'custom' as ScanType, icon: <FolderOpen size={22} />, title: 'Custom Path', desc: 'Choose a folder to scan' },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><ShieldCheck size={28} /> File Safety Checker</h1>
                <p>Scan your files for viruses and malware — powered by ClamAV, explained in plain English</p>
            </div>

            {/* ClamAV Status */}
            {clamInstalled !== null && (
                <div className={`${styles.statusBanner} ${clamInstalled ? styles.installed : styles.notInstalled}`}>
                    {clamInstalled ? (
                        <><CheckCircle size={18} /> ClamAV is installed — {clamVersion}. You&apos;re ready to scan!</>
                    ) : (
                        <><AlertTriangle size={18} /> ClamAV not found. Install it with: <code>sudo apt install clamav</code></>
                    )}
                </div>
            )}

            {/* Scan Options */}
            <div className={styles.section}>
                <h2><FolderSearch size={20} /> Choose What to Scan</h2>
                <div className={styles.scanGrid}>
                    {scanOptions.map((opt) => (
                        <div
                            key={opt.type}
                            className={`${styles.scanCard} ${scanType === opt.type ? styles.active : ''}`}
                            onClick={() => setScanType(opt.type)}
                        >
                            <div className={styles.scanIcon}>{opt.icon}</div>
                            <h3>{opt.title}</h3>
                            <p>{opt.desc}</p>
                        </div>
                    ))}
                </div>

                {scanType === 'custom' && (
                    <div className={styles.customPath}>
                        <input
                            className={styles.customInput}
                            placeholder="Enter folder path (e.g., /home/student/Downloads)"
                            value={customPath}
                            onChange={(e) => setCustomPath(e.target.value)}
                        />
                    </div>
                )}

                <button
                    className={styles.scanBtn}
                    onClick={handleScan}
                    disabled={scanning || !clamInstalled || (scanType === 'custom' && !customPath.trim())}
                >
                    {scanning ? <><Loader2 size={18} /> Scanning...</> : <><ShieldCheck size={18} /> Start Scan</>}
                </button>
            </div>

            {/* Scanning Indicator */}
            {scanning && (
                <div className={styles.loadingSpinner}>
                    <Loader2 size={20} /> Scanning your files for threats... this may take a moment.
                </div>
            )}

            {/* Results */}
            {scanResult && !scanning && (
                <div className={styles.section}>
                    <div className={styles.resultHeader}>
                        <h2><ShieldCheck size={20} /> Scan Results</h2>
                        <span className={`${styles.resultBadge} ${scanResult.threatsFound ? styles.threats : styles.clean}`}>
                            {scanResult.threatsFound ? <><AlertTriangle size={14} /> Threats Found</> : <><CheckCircle size={14} /> All Clear!</>}
                        </span>
                    </div>

                    <pre className={styles.resultOutput}>
                        {scanResult.output || 'No output returned.'}
                    </pre>

                    {/* AI Explanation */}
                    <button
                        className={styles.scanBtn}
                        onClick={handleExplain}
                        disabled={explaining}
                        style={{ background: 'linear-gradient(135deg, var(--color-purple), var(--color-accent-blue))' }}
                    >
                        {explaining ? <><Loader2 size={16} /> Explaining...</> : <><Sparkles size={16} /> Explain This in Plain English</>}
                    </button>

                    {explanation && (
                        <div className={styles.explainBox}>
                            <h4><Lightbulb size={16} /> What does this mean?</h4>
                            <p>{explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
