'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HelpCircle, MessageCircle, Send, Shield, Sparkles, BookOpen, Brain } from 'lucide-react';
import styles from './page.module.css';

const suggestedQuestions = [
    'What is phishing and how do I avoid it?',
    'How do I create a strong password?',
    'Is public WiFi safe to use?',
    'What is two-factor authentication?',
    'How do I check if my email was in a data breach?',
    'What should I do if I clicked a suspicious link?',
];

const chatHistory = [
    { role: 'user', message: 'Is it safe to use the campus WiFi?' },
    { role: 'ai', message: 'Great question! 🛡️ Campus WiFi is generally safer than, say, coffee shop WiFi because your university manages it. However, it\'s still a shared network — think of it like a shared hallway in your dorm. \n\n**You should:**\n- ✅ Use your university\'s VPN when accessing sensitive accounts\n- ✅ Look for HTTPS (the lock icon) in your browser\n- ❌ Avoid logging into your bank on open WiFi\n- ❌ Don\'t transfer sensitive files without encryption\n\nTip: Your university probably offers a free VPN — check the IT desk website!' },
];

import { useSystem } from '@/contexts/SystemContext';

export default function Guidance() {
    const { localScrubbing } = useSystem();
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState(chatHistory);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSend = async (customMessage?: string) => {
        const msgToSend = customMessage || message;
        if (!msgToSend.trim()) return;

        setMessage('');
        const newHistory = [...history, { role: 'user', message: msgToSend }];
        setHistory(newHistory);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msgToSend,
                    context: history.map(h => `${h.role}: ${h.message}`).join('\n'),
                    localScrubbing
                }),
            });

            const data = await res.json();

            if (data.response) {
                setHistory([...newHistory, { role: 'ai', message: data.response }]);
            } else {
                setHistory([...newHistory, { role: 'ai', message: "Hmm, I'm having trouble connecting right now. In the meantime — when in doubt about any email, don't click links and contact your campus IT desk! 🛡️" }]);
            }
        } catch (error) {
            console.error(error);
            setHistory([...newHistory, { role: 'ai', message: 'Connection error. Make sure you\'re online and try again!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1><Sparkles size={28} /> AI Security Mentor</h1>
                <p>Your friendly cybersecurity companion — ask anything about staying safe online</p>
            </div>

            <div className={styles.mainGrid}>
                {/* Suggested Questions */}
                <div className={styles.actionsSection}>
                    <h2><BookOpen size={20} /> Suggested Questions</h2>
                    <p className={styles.sectionDesc}>Click any question to ask the AI mentor:</p>
                    <div className={styles.actionsList}>
                        {suggestedQuestions.map((q, idx) => (
                            <div key={idx} className={`${styles.actionItem} ${styles.pending}`}>
                                <span className={styles.priority}>?</span>
                                <div className={styles.actionContent}>
                                    <h4>{q}</h4>
                                </div>
                                <div className={styles.actionMeta}>
                                    <button
                                        className={styles.doItBtn}
                                        onClick={() => handleSend(q)}
                                    >
                                        Ask This →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat */}
                <div className={styles.chatSection}>
                    <h2><Brain size={20} /> Chat with Guardian AI</h2>
                    <div className={styles.chatContainer}>
                        <div className={styles.chatHistory}>
                            {history.map((msg, idx) => (
                                <div key={idx} className={`${styles.chatMessage} ${styles[msg.role]}`}>
                                    {msg.role === 'ai' && <Brain size={18} className={styles.aiIcon} />}
                                    <div className={styles.messageContent}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.message}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className={`${styles.chatMessage} ${styles.ai}`}>
                                    <Brain size={18} className={`${styles.aiIcon} ${styles.pulse}`} />
                                    <p>Thinking...</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className={styles.chatInput}>
                            <input
                                type="text"
                                placeholder="Ask me anything about cybersecurity..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button onClick={() => handleSend()} disabled={isLoading || !message.trim()}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.reassuranceBox}>
                <Shield size={24} />
                <div>
                    <h3>No Question Is Too Simple</h3>
                    <p>Whether you're wondering what "HTTPS" means or how to spot a fake Instagram DM, we're here to help. Your questions are private and never stored. Ask away! 🎓</p>
                </div>
            </div>
        </div>
    );
}
