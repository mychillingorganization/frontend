import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ProfileIcon from '../components/ProfileIcon';
import { Stage, Layer, Rect, Text, Transformer, Circle, RegularPolygon, Star, Line as KonvaLine, Image as KonvaImage } from 'react-konva';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_TEMPLATE_VARIABLES, STORAGE_KEYS } from '../constants';
import './GeneratorPage.css';

const TEMPLATE_VARIABLES = DEFAULT_TEMPLATE_VARIABLES;

const GeneratorPage = () => {
    const navigate = useNavigate();
    const [sheetsUrl, setSheetsUrl] = useState('');
    const [sheetColumns, setSheetColumns] = useState([]);
    const [sheetData, setSheetData] = useState([]);
    const [mappings, setMappings] = useState({});

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templateStartIndex, setTemplateStartIndex] = useState(0);

    const handleNextTemplates = () => {
        if (templates.length > 3) {
            setTemplateStartIndex((prev) => (prev + 1) % templates.length);
        }
    };

    const handlePrevTemplates = () => {
        if (templates.length > 3) {
            setTemplateStartIndex((prev) => (prev - 1 + templates.length) % templates.length);
        }
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
            if (stored && stored !== '[]') {
                const parsed = JSON.parse(stored);
                setTemplates(parsed);
                if (parsed.length > 0) setSelectedTemplate(parsed[0]);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            setTemplates([]);
        }
    }, []);

    const [logs, setLogs] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewRowIndex, setPreviewRowIndex] = useState(0);
    const csvInputRef = useRef(null);
    const offscreenStageRef = useRef(null);

    const [processingRowIndex, setProcessingRowIndex] = useState(-1);

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, `[${time}] ${msg}`]);
    }

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        addLog(`Parsing CSV: ${file.name}`);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    const columns = Object.keys(results.data[0]);
                    setSheetColumns(columns);
                    setSheetData(results.data);

                    // Auto-map if column names match template variables exactly
                    const autoMap = {};
                    (selectedTemplate?.variables || TEMPLATE_VARIABLES).forEach(v => {
                        const match = columns.find(c => c.toLowerCase().includes(v.toLowerCase()));
                        if (match) autoMap[v] = match;
                    });
                    setMappings(autoMap);

                    setPreviewRowIndex(0);
                    addLog(`Successfully loaded ${results.data.length} records.`);
                } else {
                    addLog('Error: CSV file is empty or invalid.');
                }
            },
            error: (err) => {
                addLog(`CSV Parse Error: ${err.message}`);
            }
        });
        e.target.value = ''; // Reset input
    };

    const handleMappingChange = (variable, column) => {
        setMappings(prev => ({ ...prev, [variable]: column }));
    };

    const handleGenerate = async () => {
        if (!selectedTemplate) return addLog('Error: No template selected.');
        if (!sheetData || sheetData.length === 0) return addLog('Error: No data available. Upload CSV first.');

        setIsGenerating(true);
        setProgress(0);
        setLogs([]);
        addLog('Initializing GDGoC Asset Generator...');
        addLog(`Preparing to generate ${sheetData.length} records...`);

        const zip = new JSZip();

        for (let i = 0; i < sheetData.length; i++) {
            setProcessingRowIndex(i); // Force a re-render of the hidden stage with the new row data
            // Small pause to allow React/Konva to deeply update the DOM/Canvas for the text shifts
            await new Promise(resolve => setTimeout(resolve, 50));

            if (!offscreenStageRef.current) break;

            try {
                const dataUrl = offscreenStageRef.current.toDataURL({ pixelRatio: 2 });
                const pdf = new jsPDF({
                    orientation: CANVAS_WIDTH > CANVAS_HEIGHT ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [CANVAS_WIDTH, CANVAS_HEIGHT]
                });
                pdf.addImage(dataUrl, 'PNG', 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                const pdfBlob = pdf.output('blob');

                // Safe filename extraction
                const rowData = sheetData[i];
                let fileName = `certificate_${i + 1}.pdf`;
                // Try to find a name column to use as filename
                const nameCol = Object.keys(mappings).find(k => k.toLowerCase().includes('name'));
                if (nameCol && mappings[nameCol] && rowData[mappings[nameCol]]) {
                    fileName = `${rowData[mappings[nameCol]].trim().replace(/[^a-z0-9]/gi, '_')}.pdf`;
                }

                zip.file(fileName, pdfBlob);

                setProgress(Math.round(((i + 1) / sheetData.length) * 100));
            } catch (err) {
                addLog(`Error rendering row ${i + 1}: ${err.message}`);
            }
        }

        addLog('Zipping PDF files...');
        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'Bugkathon_Generated_Assets.zip');
            addLog('Ready. Download complete!');
        } catch (err) {
            addLog(`Error zipping files: ${err.message}`);
        }

        setProcessingRowIndex(-1);
        setIsGenerating(false);
    };

    return (
        <React.Fragment>
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
                        <div className="profile-icon" style={{ background: 'none', padding: 0 }}>
                            <ProfileIcon />
                        </div>
                    </div>
                </header>

                <div className="gen-columns">
                    {/* ===== LEFT COLUMN ===== */}
                    <div className="gen-col-left">

                        {/* DATA SOURCE */}
                        <div className="gen-card">
                            <div className="gen-card-title">DATA SOURCE</div>
                            <div className="card-top-action">
                                <div className="url-input-wrap">
                                    <div className="url-icon"></div>
                                    <input type="text" className="url-input" placeholder="A local CSV file allows real test rendering!" value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)} disabled />
                                </div>
                                <button className="btn-primary" onClick={() => csvInputRef.current?.click()}>
                                    Upload CSV Data
                                </button>
                                <input
                                    type="file"
                                    accept=".csv"
                                    ref={csvInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleCSVUpload}
                                />
                            </div>
                        </div>

                        {/* TEMPLATE */}
                        <div className="gen-card">
                            <div className="gen-card-title">TEMPLATE</div>
                            <div className="template-carousel-wrapper">
                                <button
                                    className={`carousel-arrow ${templates.length <= 3 ? 'disabled' : ''}`}
                                    onClick={handlePrevTemplates}
                                    disabled={templates.length <= 3}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <div className="template-cards">
                                    {templates.length > 0 && Array.from({ length: Math.min(3, templates.length) }).map((_, i) => {
                                        const tpl = templates[(templateStartIndex + i) % templates.length];
                                        return (
                                            <div key={tpl.id} className="template-card-small" onClick={() => setSelectedTemplate(tpl)} style={{ cursor: 'pointer' }}>
                                                <div className={`tpl-mock-preview ${selectedTemplate?.id === tpl.id ? 'active' : ''}`}>
                                                    <div className="tpl-mock-inner">
                                                        <div className="tpl-mock-box"></div>
                                                        <div className="tpl-mock-txt">Certificate</div>
                                                    </div>
                                                </div>
                                                <div className="tpl-name-small">{tpl.title}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <button
                                    className={`carousel-arrow ${templates.length <= 3 ? 'disabled' : ''}`}
                                    onClick={handleNextTemplates}
                                    disabled={templates.length <= 3}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                                </button>
                            </div>
                            <button className="browse-templates-btn" onClick={() => setIsTemplateModalOpen(true)}>
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
                                {(selectedTemplate?.variables || TEMPLATE_VARIABLES).map(v => (
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
                                <div className="cert-live-frame" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0' }}>
                                    {selectedTemplate ? (
                                        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ transform: 'scale(0.55)', transformOrigin: 'center center' }}>
                                            <Layer>
                                                <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />
                                                {selectedTemplate.elements?.map(el => {
                                                    const isFilled = el.filled !== false;
                                                    const fillOpt = isFilled ? el.fill : undefined;
                                                    const strokeOpt = isFilled ? undefined : el.fill;
                                                    const strokeWidthOpt = isFilled ? 0 : (el.strokeWidth || 2);

                                                    if (el.type === 'rect') return <Rect key={el.id} x={el.x} y={el.y} width={el.width} height={el.height} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} cornerRadius={el.cornerRadius || 0} opacity={el.opacity != null ? el.opacity : 1} />;
                                                    if (el.type === 'circle') return <Circle key={el.id} x={el.x} y={el.y} radius={el.radius} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;
                                                    if (el.type === 'triangle') return <RegularPolygon key={el.id} sides={3} x={el.x} y={el.y} radius={el.radius} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;
                                                    if (el.type === 'star') return <Star key={el.id} numPoints={5} innerRadius={el.innerRadius} outerRadius={el.radius} x={el.x} y={el.y} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;

                                                    if (el.type === 'text') {
                                                        let displayTxt = el.text;
                                                        if (sheetData[previewRowIndex]) {
                                                            const rowData = sheetData[previewRowIndex];
                                                            const currentTemplateVars = selectedTemplate?.variables || TEMPLATE_VARIABLES;
                                                            currentTemplateVars.forEach(v => {
                                                                const token = `{{${v}}}`;
                                                                if (displayTxt.includes(token) && mappings[v]) {
                                                                    displayTxt = displayTxt.split(token).join(rowData[mappings[v]] || '');
                                                                }
                                                            });
                                                        }
                                                        return (
                                                            <Text key={el.id} x={el.x} y={el.y} text={displayTxt} fontSize={el.fontSize} fontFamily={el.fontFamily} fill={el.fill} align={el.align} fontStyle={el.fontStyle} textDecoration={el.textDecoration} opacity={el.opacity != null ? el.opacity : 1} width={el.width} />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </Layer>
                                        </Stage>
                                    ) : (
                                        <div style={{ color: '#5F6368', fontSize: '14px', textAlign: 'center' }}>No Template Selected</div>
                                    )}
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
            {
                isTemplateModalOpen && (
                    <div className="template-modal-overlay" onClick={() => setIsTemplateModalOpen(false)}>
                        <div className="template-modal" onClick={e => e.stopPropagation()}>
                            <div className="template-modal-header">
                                <h2>Select a Template</h2>
                                <button className="close-modal-btn" onClick={() => setIsTemplateModalOpen(false)}>&times;</button>
                            </div>
                            <div className="template-modal-grid">
                                {templates.map(tpl => (
                                    <div
                                        key={tpl.id}
                                        className={`modal-tpl-card ${selectedTemplate?.id === tpl.id ? 'selected' : ''}`}
                                        onClick={() => { setSelectedTemplate(tpl); setIsTemplateModalOpen(false); }}
                                    >
                                        <div className="modal-tpl-preview"></div>
                                        <div className="modal-tpl-title">{tpl.title}</div>
                                    </div>
                                ))}
                                {templates.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>No templates found. Go to My Templates to create one.</div>}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* HIDDEN OFFSCREEN STAGE FOR BATCH GENERATION */}
            {isGenerating && processingRowIndex >= 0 && selectedTemplate && (
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={offscreenStageRef}>
                        <Layer>
                            <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />
                            {selectedTemplate.elements?.map(el => {
                                const isFilled = el.filled !== false;
                                const fillOpt = isFilled ? el.fill : undefined;
                                const strokeOpt = isFilled ? undefined : el.fill;
                                const strokeWidthOpt = isFilled ? 0 : (el.strokeWidth || 2);

                                if (el.type === 'rect') return <Rect key={`gen_${el.id}`} x={el.x} y={el.y} width={el.width} height={el.height} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} cornerRadius={el.cornerRadius || 0} opacity={el.opacity != null ? el.opacity : 1} />;
                                if (el.type === 'circle') return <Circle key={`gen_${el.id}`} x={el.x} y={el.y} radius={el.radius} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;
                                if (el.type === 'triangle') return <RegularPolygon key={`gen_${el.id}`} sides={3} x={el.x} y={el.y} radius={el.radius} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;
                                if (el.type === 'star') return <Star key={`gen_${el.id}`} numPoints={5} innerRadius={el.innerRadius} outerRadius={el.radius} x={el.x} y={el.y} fill={fillOpt} stroke={strokeOpt} strokeWidth={strokeWidthOpt} opacity={el.opacity != null ? el.opacity : 1} />;

                                if (el.type === 'text') {
                                    let displayTxt = el.text;
                                    const rowData = sheetData[processingRowIndex];
                                    if (rowData) {
                                        const currentTemplateVars = selectedTemplate?.variables || TEMPLATE_VARIABLES;
                                        currentTemplateVars.forEach(v => {
                                            const token = `{{${v}}}`;
                                            if (displayTxt.includes(token) && mappings[v]) {
                                                displayTxt = displayTxt.split(token).join(rowData[mappings[v]] || '');
                                            }
                                        });
                                    }
                                    return (
                                        <Text key={`gen_${el.id}`} x={el.x} y={el.y} text={displayTxt} fontSize={el.fontSize} fontFamily={el.fontFamily} fill={el.fill} align={el.align} fontStyle={el.fontStyle} textDecoration={el.textDecoration} opacity={el.opacity != null ? el.opacity : 1} width={el.width} />
                                    );
                                }
                                return null;
                            })}
                        </Layer>
                    </Stage>
                </div>
            )}
        </React.Fragment >
    );
};

export default GeneratorPage;
