import React, { useEffect, useMemo, useRef, useState } from 'react';
import LivePreview from './LivePreview.jsx';

// PDF preview that mirrors template styling by rasterizing a hidden LivePreview
// Uses html2canvas + jsPDF UMD from CDN. Falls back gracefully on errors.
const PdfPreview = ({ resumeData, selectedTemplate }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const urlRef = useRef(null);
    const hiddenRef = useRef(null);

    const safeResume = useMemo(() => resumeData || {}, [resumeData]);

    useEffect(() => {
        let cancelled = false;
        const gen = async () => {
            try {
                // Load libs lazily if not present
                const loadJsPdf = () => new Promise((resolve, reject) => {
                    if (window.jspdf) return resolve(window.jspdf);
                    const s = document.createElement('script');
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                    s.onload = () => resolve(window.jspdf);
                    s.onerror = reject;
                    document.body.appendChild(s);
                });
                const loadHtml2Canvas = () => new Promise((resolve, reject) => {
                    if (window.html2canvas) return resolve(window.html2canvas);
                    const s = document.createElement('script');
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    s.onload = () => resolve(window.html2canvas);
                    s.onerror = reject;
                    document.body.appendChild(s);
                });
                const jsPdfLib = await loadJsPdf();
                await loadHtml2Canvas();
                if (cancelled) return;
                const { jsPDF } = jsPdfLib;
                const doc = new jsPDF({ unit: 'pt', format: 'a4' });

                // Capture the hidden live preview DOM
                const node = hiddenRef.current?.querySelector('#resume-canvas');
                if (!node) throw new Error('Preview not available');
                const canvas = await window.html2canvas(node, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const scale = pageWidth / canvas.width; // pts per pixel on width
                const slicePixelHeight = Math.floor(pageHeight / scale); // pixels per page
                const totalHeight = canvas.height;
                const tmpCanvas = document.createElement('canvas');
                const ctx = tmpCanvas.getContext('2d');
                let yPix = 0;
                let firstPage = true;
                while (yPix < totalHeight) {
                    const sliceHeight = Math.min(slicePixelHeight, totalHeight - yPix);
                    tmpCanvas.width = canvas.width;
                    tmpCanvas.height = sliceHeight;
                    ctx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
                    ctx.drawImage(
                        canvas,
                        0, yPix, canvas.width, sliceHeight, // src
                        0, 0, tmpCanvas.width, tmpCanvas.height // dst
                    );
                    const sliceData = tmpCanvas.toDataURL('image/png');
                    if (!firstPage) doc.addPage();
                    doc.addImage(sliceData, 'PNG', 0, 0, pageWidth, sliceHeight * scale);
                    firstPage = false;
                    yPix += slicePixelHeight;
                }

                const blob = doc.output('blob');
                const url = URL.createObjectURL(blob);
                if (cancelled) { URL.revokeObjectURL(url); return; }
                if (urlRef.current) { URL.revokeObjectURL(urlRef.current); }
                urlRef.current = url;
                setPdfUrl(url);
            } catch (e) {
                // fail silent; caller can render fallback
                setPdfUrl(null);
            }
        };
        gen();
        return () => {
            cancelled = true;
            if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
        };
    }, [safeResume, selectedTemplate]);

    const hiddenPreview = (
        <div ref={hiddenRef} style={{ position: 'fixed', top: -10000, left: -10000, width: '8.27in', minHeight: '11.69in', background: 'white' }}>
            <LivePreview
                resumeData={safeResume}
                selectedTemplate={selectedTemplate}
                forceLightTheme={true}
                scale={1}
                onZoomIn={() => { }}
                onZoomOut={() => { }}
                onToggleMaximize={() => { }}
            />
        </div>
    );

    if (!pdfUrl) return (
        <div className="w-full h-full relative bg-white">
            {hiddenPreview}
            <div className="absolute inset-0 overflow-auto">
                <LivePreview
                    resumeData={safeResume}
                    selectedTemplate={selectedTemplate}
                    forceLightTheme={true}
                    scale={1}
                    onZoomIn={() => { }}
                    onZoomOut={() => { }}
                    onToggleMaximize={() => { }}
                />
            </div>
        </div>
    );

    return (
        <>
            {hiddenPreview}
            <iframe
                title="Resume PDF Preview"
                src={pdfUrl}
                className="w-full h-full border-0"
            />
        </>
    );
};

export default PdfPreview;
