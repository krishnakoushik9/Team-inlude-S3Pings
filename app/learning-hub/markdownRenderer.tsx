'use client';

import React from 'react';

// ─── Lightweight Markdown-to-JSX renderer ──────────────────────────────────
// Supports: headings, bold, italic, inline code, code blocks, lists,
// blockquotes, horizontal rules, tables, checkboxes, links.
// No external dependencies.

interface Props {
    content: string;
    className?: string;
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseInline(text: string): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    // Process: **bold**, *italic*, `code`, [text](url)
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+?)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        if (match[1]) {
            // **bold**
            nodes.push(<strong key={key++}>{match[2]}</strong>);
        } else if (match[3]) {
            // *italic*
            nodes.push(<em key={key++}>{match[4]}</em>);
        } else if (match[5]) {
            // `code`
            nodes.push(
                <code key={key++} style={{
                    background: 'rgba(136,192,208,0.15)',
                    padding: '0.15em 0.4em',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    color: '#88C0D0'
                }}>
                    {match[6]}
                </code>
            );
        } else if (match[7]) {
            // [text](url)
            nodes.push(
                <a key={key++} href={match[9]} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#88C0D0', textDecoration: 'underline' }}>
                    {match[8]}
                </a>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes.length > 0 ? nodes : [text];
}

export default function MarkdownRenderer({ content, className }: Props) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ─── Code Block ───
        if (line.trim().startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip closing ```
            elements.push(
                <pre key={key++} style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    fontFamily: 'monospace',
                    margin: '0.75rem 0',
                    border: '1px solid rgba(136,192,208,0.1)'
                }}>
                    <code>{codeLines.join('\n')}</code>
                </pre>
            );
            continue;
        }

        // ─── Table ───
        if (line.includes('|') && line.trim().startsWith('|')) {
            const tableRows: string[][] = [];
            let isHeader = true;
            while (i < lines.length && lines[i].includes('|')) {
                const row = lines[i].trim();
                // Skip separator row (| --- | --- |)
                if (row.match(/^\|[\s\-:|]+\|$/)) {
                    i++;
                    continue;
                }
                const cells = row.split('|').filter(c => c.trim() !== '').map(c => c.trim());
                tableRows.push(cells);
                i++;
            }
            elements.push(
                <div key={key++} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.85rem',
                    }}>
                        <thead>
                            <tr>
                                {tableRows[0]?.map((cell, ci) => (
                                    <th key={ci} style={{
                                        padding: '0.6rem 0.75rem',
                                        borderBottom: '2px solid rgba(136,192,208,0.2)',
                                        textAlign: 'left',
                                        fontWeight: 700,
                                        color: 'var(--color-text)',
                                        background: 'rgba(136,192,208,0.05)'
                                    }}>
                                        {parseInline(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.slice(1).map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} style={{
                                            padding: '0.5rem 0.75rem',
                                            borderBottom: '1px solid rgba(136,192,208,0.08)',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {parseInline(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            continue;
        }

        // ─── Heading ───
        if (line.startsWith('### ')) {
            elements.push(<h3 key={key++} style={{ fontSize: '1.05rem', fontWeight: 700, margin: '1.25rem 0 0.5rem', color: 'var(--color-text)' }}>{parseInline(line.slice(4))}</h3>);
            i++; continue;
        }
        if (line.startsWith('## ')) {
            elements.push(<h2 key={key++} style={{ fontSize: '1.2rem', fontWeight: 700, margin: '1.5rem 0 0.5rem', color: 'var(--color-text)', borderBottom: '1px solid rgba(136,192,208,0.1)', paddingBottom: '0.4rem' }}>{parseInline(line.slice(3))}</h2>);
            i++; continue;
        }
        if (line.startsWith('# ')) {
            elements.push(<h1 key={key++} style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem', color: 'var(--color-text)' }}>{parseInline(line.slice(2))}</h1>);
            i++; continue;
        }

        // ─── Horizontal Rule ───
        if (line.trim() === '---') {
            elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid rgba(136,192,208,0.15)', margin: '1.25rem 0' }} />);
            i++; continue;
        }

        // ─── Blockquote ───
        if (line.trimStart().startsWith('> ')) {
            const quoteLines: string[] = [];
            while (i < lines.length && lines[i].trimStart().startsWith('> ')) {
                quoteLines.push(lines[i].trimStart().slice(2));
                i++;
            }
            elements.push(
                <blockquote key={key++} style={{
                    borderLeft: '3px solid #88C0D0',
                    paddingLeft: '1rem',
                    margin: '0.75rem 0',
                    color: '#88C0D0',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    background: 'rgba(136,192,208,0.05)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0 8px 8px 0'
                }}>
                    {quoteLines.map((ql, qi) => <p key={qi} style={{ margin: '0.25rem 0' }}>{parseInline(ql)}</p>)}
                </blockquote>
            );
            continue;
        }

        // ─── Checkbox List ───
        if (line.trimStart().startsWith('- [ ] ') || line.trimStart().startsWith('- [x] ')) {
            const checked = line.trimStart().startsWith('- [x] ');
            const text = line.trimStart().slice(6);
            elements.push(
                <div key={key++} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.3rem 0', fontSize: '0.9rem',
                    color: checked ? 'var(--color-accent-green)' : 'var(--color-text-muted)',
                }}>
                    <span style={{ fontSize: '1.1rem' }}>{checked ? '☑' : '☐'}</span>
                    <span>{parseInline(text)}</span>
                </div>
            );
            i++; continue;
        }

        // ─── Unordered List ───
        if (line.trimStart().startsWith('- ')) {
            const items: { text: string; indent: number }[] = [];
            while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
                const indent = lines[i].search(/\S/);
                items.push({ text: lines[i].trimStart().slice(2), indent });
                i++;
            }
            elements.push(
                <ul key={key++} style={{ paddingLeft: '1.25rem', margin: '0.5rem 0', listStyle: 'none' }}>
                    {items.map((item, ii) => (
                        <li key={ii} style={{
                            padding: '0.2rem 0',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: '1.6',
                            paddingLeft: item.indent > 0 ? '1rem' : '0',
                        }}>
                            <span style={{ color: '#88C0D0', marginRight: '0.5rem' }}>•</span>
                            {parseInline(item.text)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // ─── Ordered List ───
        if (/^\d+\.\s/.test(line.trimStart())) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trimStart())) {
                items.push(lines[i].trimStart().replace(/^\d+\.\s/, ''));
                i++;
            }
            elements.push(
                <ol key={key++} style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                    {items.map((item, ii) => (
                        <li key={ii} style={{
                            padding: '0.2rem 0',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: '1.6'
                        }}>
                            {parseInline(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // ─── Empty Line ───
        if (line.trim() === '') {
            i++; continue;
        }

        // ─── Paragraph ───
        elements.push(
            <p key={key++} style={{
                fontSize: '0.9rem',
                lineHeight: '1.7',
                color: 'var(--color-text-muted)',
                margin: '0.4rem 0'
            }}>
                {parseInline(line)}
            </p>
        );
        i++;
    }

    return <div className={className}>{elements}</div>;
}
