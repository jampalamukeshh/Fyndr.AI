import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

import showToast from 'utils/showToast.js';

const ExportModal = ({ isOpen, onClose, onExport, resumeData, selectedTemplate }) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadPdf = async () => {
    try {
      setIsExporting(true);
      // Load libs
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
      const { jsPDF } = jsPdfLib;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      // Grab the on-screen preview canvas/area
      const node = document.querySelector('#resume-canvas');
      if (!node) throw new Error('Preview not available');
      const canvas = await window.html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const scale = pageWidth / canvas.width;
      const slicePixelHeight = Math.floor(pageHeight / scale);
      const totalHeight = canvas.height;
      const tmp = document.createElement('canvas');
      const ctx = tmp.getContext('2d');
      let yPix = 0;
      let first = true;
      while (yPix < totalHeight) {
        const sliceHeight = Math.min(slicePixelHeight, totalHeight - yPix);
        tmp.width = canvas.width;
        tmp.height = sliceHeight;
        ctx.clearRect(0, 0, tmp.width, tmp.height);
        ctx.drawImage(canvas, 0, yPix, canvas.width, sliceHeight, 0, 0, tmp.width, tmp.height);
        const img = tmp.toDataURL('image/png');
        if (!first) doc.addPage();
        doc.addImage(img, 'PNG', 0, 0, pageWidth, sliceHeight * scale);
        first = false;
        yPix += slicePixelHeight;
      }
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const name = (resumeData?.personal?.fullName || 'resume').replace(/[^a-z0-9\-_]+/gi, '_');
      a.href = url; a.download = `${name}.pdf`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      showToast('PDF downloaded', 'success');
      onExport && onExport({ format: 'pdf' });
      onClose();
    } catch (error) {
      console.error('PDF export failed:', error);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-card border border-border rounded-card w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon name="Download" size={16} color="white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Export Resume</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 bg-card">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose a format to export your resume. PDF is great for sharing and printing. DOCX lets you edit in Microsoft Word.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <Button onClick={downloadPdf} disabled={isExporting} iconName="FileText" iconPosition="left">
                      {isExporting ? 'Exporting…' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-card">
                <Button variant="outline" onClick={onClose} disabled={isExporting}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;
