import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneratorPage.css';

const SAMPLE_TEMPLATES = [
    { id: 1, name: 'Hackathon Certificate', desc: 'Hackathon Completion' },
    { id: 2, name: 'Workshop Certificate', desc: 'Workshop Completion' },
    { id: 3, name: 'Speaker Award', desc: 'Speaker Award' },
];

const TEMPLATE_VARIABLES = ['name', 'date'];

const GeneratorPage = () => {
    const navigate = useNavigate();
    const [sheetsUrl, setSheetsUrl] = useState('');
    const [sheetColumns, setSheetColumns] = useState([]);
    const [sheetData, setSheetData] = useState([]);
    const [mappings, setMappings] = useState({});

    // System Log & Generation State
    const [logs, setLogs] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewRowIndex, setPreviewRowIndex] = useState(0);

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, `[${time}] ${msg}`]);
    }

    const handleFetchData = useCallback(() => {
        if (!sheetsUrl.trim()) return;
        const mockColumns = ['Full Name', 'Date'];
        const mockData = Array.from({ length: 50 }).map((_, i) => ({
            'Full Name': `Nguyen Van ${String.fromCharCode(65 + (i % 26))}`,
            'Date': `2026-02-27`
        }));
        setSheetColumns(mockColumns);
        setSheetData(mockData);
        setMappings({ 'name': 'Full Name', 'date': 'Date' });
        setPreviewRowIndex(0);
    }, [sheetsUrl]);

    const handleMappingChange = (variable, column) => {
        setMappings(prev => ({ ...prev, [variable]: column }));
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setProgress(0);
        setLogs([]);
        addLog('Initializing GDGoC Asset Generator...');

        setTimeout(() => addLog('Fetching data from Google Sheets...'), 800);
        setTimeout(() => addLog('Loading template SVG...'), 1600);
        setTimeout(() => addLog(`Processing ${sheetData.length || 50} records...`), 2400);

        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 8 + 2;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                addLog('Generating PDFs... Done');
                addLog('Ready for generation.');
                setTimeout(() => setIsGenerating(false), 1000);
            }
            setProgress(Math.min(p, 100));
        }, 150);
    };

    return (
        <div className="generator-page">
            {/* Header */}
            <header className="gen-header">
                <div className="gen-header-left" onClick={() => navigate(-1)} style={{ cursor: 'pointer', paddingLeft: '8px' }}>
                    <div className="home-logo-icon" style={{ width: '40px', height: '40px' }}>
                        <img src="/assets/bugkathon_logo.svg" alt="Bugkathon Logo" style={{ width: "100%", height: "100%" }} className="bugkathon-logo" />
                    </div>
                </div>
                <h1 className="gen-header-title">Bugkathon</h1>
                <div className="gen-header-right">
                    <div className="profile-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>
                </div>
            </header>

            <div className="gen-columns">
                {/* ===== LEFT COLUMN ===== */}
                <div className="gen-col-left">

                    {/* DATA SOURCE */}
                    <div className="gen-card">
                        <div className="gen-card-title">DATA SOURCE</div>
                        <div className="data-source-row">
                            <input
                                className="sheets-url-input"
                                type="text"
                                placeholder="Paste Google Sheets URL here..."
                                value={sheetsUrl}
                                onChange={e => setSheetsUrl(e.target.value)}
                            />
                            <button className="fetch-btn-outline" onClick={handleFetchData}>
                                Fetch Data
                            </button>
                        </div>
                    </div>

                    {/* TEMPLATE */}
                    <div className="gen-card">
                        <div className="gen-card-title">TEMPLATE</div>
                        <div className="template-carousel-wrapper">
                            <button className="carousel-arrow disabled"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg></button>
                            <div className="template-cards">
                                {SAMPLE_TEMPLATES.map((tpl, i) => (
                                    <div key={tpl.id} className="template-card-small">
                                        <div className="tpl-mock-preview">
                                            <div className="tpl-mock-inner">
                                                <div className="tpl-mock-box"></div>
                                                <div className="tpl-mock-txt">Certificate</div>
                                            </div>
                                        </div>
                                        <div className="tpl-name-small">{tpl.name}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></button>
                        </div>
                        <button className="browse-templates-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" /></svg>
                            Browse My Templates
                        </button>
                    </div>

                    {/* DATA MAPPING */}
                    <div className="gen-card">
                        <div className="gen-card-title">DATA MAPPING</div>
                        <div className="mapping-grid">
                            <div className="mapping-col-headers">
                                <span>Variable</span>
                                <span>Maps to</span>
                            </div>
                            {TEMPLATE_VARIABLES.map(v => (
                                <div className="mapping-row" key={v}>
                                    <div className="mapping-var-pill">{`{{${v}}}`}</div>
                                    <select className="mapping-select-box" value={mappings[v] || ''} onChange={e => handleMappingChange(v, e.target.value)}>
                                        <option value=""></option>
                                        {sheetColumns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ===== RIGHT COLUMN ===== */}
                <div className="gen-col-right">

                    {/* LIVE PREVIEW */}
                    <div className="gen-card live-preview-section">
                        <div className="gen-card-title">LIVE PREVIEW</div>

                        <div className="cert-live-frame-wrapper">
                            <div className="cert-live-frame">
                                <div className="cert-live-content">
                                    <h3 className="cert-live-org">Google Developer Groups on Campus</h3>
                                    <p className="cert-live-uni">FPT University</p>

                                    <h1 className="cert-live-title">CERTIFICATE OF PARTICIPATION</h1>
                                    <p className="cert-live-presented">This certificate is proudly<br />presented to</p>

                                    <h2 className="cert-live-name-display">
                                        {mappings.name && sheetData[previewRowIndex] ? sheetData[previewRowIndex][mappings.name] : '{{name}}'}
                                    </h2>

                                    <p className="cert-live-reason">For successfully completing the Hackathon<br />event as</p>
                                    <h3 className="cert-live-role">{`{{role}}`}</h3>

                                    <div className="cert-live-signatures">
                                        <div className="cert-live-sig">
                                            <div className="sig-line"></div>
                                            <div className="sig-name">Nguyen Van A</div>
                                            <div className="sig-title">Event Manager</div>
                                        </div>
                                        <div className="cert-live-sig">
                                            <div className="sig-line"></div>
                                            <div className="sig-name">Tran Thi B</div>
                                            <div className="sig-title">GDGoC Lead</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="abstract-shape top-left"></div>
                                <div className="abstract-shape top-right"></div>
                                <div className="abstract-shape bottom-right"></div>
                            </div>
                        </div>

                        <div className="preview-pagination">
                            <button className="page-btn" onClick={() => setPreviewRowIndex(Math.max(0, previewRowIndex - 1))}>
                                &lt; Previous
                            </button>
                            <span className="page-info">{sheetData.length ? previewRowIndex + 1 : 1} of {sheetData.length || 50}</span>
                            <button className="page-btn" onClick={() => setPreviewRowIndex(Math.min((sheetData.length || 50) - 1, previewRowIndex + 1))}>
                                Next &gt;
                            </button>
                        </div>
                    </div>

                    {/* EXECUTION OPTIONS */}
                    <div className="gen-card">
                        <div className="gen-card-title">EXECUTION OPTIONS</div>
                        <div className="execution-options">
                            <label className="exec-opt"><span style={{ color: '#EA4335' }}>📄</span> Create PDF</label>
                            <label className="exec-opt"><span style={{ color: '#FBBC04' }}>🗂️</span> Save to Drive</label>
                            <label className="exec-opt"><span style={{ color: '#34A853' }}>✉️</span> Send Email</label>
                        </div>
                        <button className="start-gen-btn" onClick={handleGenerate} disabled={isGenerating}>
                            Start Generation & Send
                        </button>
                    </div>

                    {/* SYSTEM LOG */}
                    <div className="gen-card card-no-padding">
                        <div className="gen-card-title pad-title">SYSTEM LOG</div>
                        <div className="sys-log-box">
                            {logs.map((log, i) => (
                                <div key={i} className="sys-log-line">
                                    <span className="sys-log-time">{log.split(']')[0] + ']'}</span>
                                    <span className={`sys-log-msg ${log.toLowerCase().includes('done') || log.toLowerCase().includes('ready') ? 'success' : ''}`}>
                                        {log.split(']')[1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="progress-container">
                            <div className="progress-labels">
                                <span className="prog-text">Processing...</span>
                                <span className="prog-pct">{Math.round(progress)}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GeneratorPage;
