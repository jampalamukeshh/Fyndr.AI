import React, { useState, useEffect, useRef } from 'react';

import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import MainLayout from 'components/layout/MainLayout';
import QuickActionsToolbar from 'components/ui/QuickActionsToolbar';

// Import components
import TemplateCarousel from './components/TemplateCarousel';
import OptimizationScore from './components/OptimizationScore';
import EditingPanel from './components/EditingPanel';
import LivePreview from './components/LivePreview';
import PdfPreview from './components/PdfPreview';
import AISuggestionPanel from './components/AISuggestionPanel';
// removed ExportModal usage to export directly
import SnapshotsPanel from './components/SnapshotsPanel';
import ConfirmDialog from 'components/ui/ConfirmDialog';
import TextInputDialog from 'components/ui/TextInputDialog';

import { useNavigate } from 'react-router-dom';
import { apiRequest } from 'utils/api.js';
import showToast from 'utils/showToast.js';
import { getApiUrl } from 'utils/api.js';
import tokenManager from 'utils/tokenManager.js';

const AIResumeBuilder = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/authentication-login-register');
    }
  }, [navigate]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [stage, setStage] = useState('choose'); // 'choose' | 'edit'
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  // no export modal; we export directly on action
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [previewScale, setPreviewScale] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'Bengaluru, Karnataka',
      summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering scalable solutions that drive business growth.'
    },
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        startDate: '2021-03-01',
        endDate: '',
        current: true,
        description: 'Led development of microservices architecture serving 2M+ users daily. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and established coding standards across the engineering team.'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        startDate: '2019-01-15',
        endDate: '2021-02-28',
        current: false,
        description: 'Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components. Optimized database queries resulting in 40% performance improvement.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'University of California, Berkeley',
        year: '2018',
        gpa: '3.8/4.0'
      }
    ],
    skills: [
      'JavaScript', 'React.js', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Git', 'Agile/Scrum'
    ]
  });

  const [profileSnapshot, setProfileSnapshot] = useState(null);
  const [mappedProfileData, setMappedProfileData] = useState(null);
  const initialProfileLoad = useRef(true);
  const [availableTemplates, setAvailableTemplates] = useState(['modern', 'classic']);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [snapshotsLoading, setSnapshotsLoading] = useState(false);
  const [score, setScore] = useState(78);
  const [suggestions, setSuggestions] = useState([]);
  const [renameModal, setRenameModal] = useState({ open: false, snap: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, snap: null, loading: false });

  // Map backend JobSeekerProfile -> resumeData shape
  const profileToResume = (p) => {
    const fullName = p?.full_name || [p?.first_name, p?.last_name].filter(Boolean).join(' ');
    const personal = {
      fullName: fullName || '',
      title: p?.job_title || '',
      email: p?.email || '',
      phone: p?.phone || '',
      location: p?.location || '',
      summary: p?.bio || '',
    };
    const exp = Array.isArray(p?.experiences) ? p.experiences.map(e => ({
      title: e?.title || e?.role || '',
      company: e?.company || '',
      startDate: e?.start_date || e?.startDate || '',
      endDate: e?.end_date || e?.endDate || '',
      current: Boolean(e?.current),
      description: e?.description || '',
    })) : [];
    const edu = Array.isArray(p?.education) ? p.education.map(ed => ({
      degree: ed?.degree || '',
      field: ed?.field || ed?.major || '',
      institution: ed?.institution || ed?.school || '',
      year: ed?.year || ed?.graduation_year || '',
      gpa: ed?.gpa || '',
    })) : [];
    const skills = Array.isArray(p?.skills) ? p.skills.map(s => (typeof s === 'string' ? s : (s?.name || s?.skill || ''))).filter(Boolean) : [];
    const achievements = Array.isArray(p?.achievements) ? p.achievements : [];
    const certifications = Array.isArray(p?.certifications) ? p.certifications : [];
    const projects = Array.isArray(p?.projects) ? p.projects : [];
    const links = {
      linkedin: p?.linkedin_url || '',
      github: p?.github_url || '',
      portfolio: p?.portfolio_url || '',
      website: p?.website_url || '',
    };
    const languages = Array.isArray(p?.languages) ? p.languages : [];
    return { personal, experience: exp, education: edu, skills, achievements, certifications, projects, links, languages };
  };

  // Map resumeData -> backend patch for JobSeekerProfile
  const resumeToProfilePatch = (r) => {
    const parts = (r.personal?.fullName || '').trim().split(/\s+/).filter(Boolean);
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] || '');
    const experiences = (r.experience || []).map(e => ({
      title: e.title || '',
      company: e.company || '',
      start_date: e.startDate || '',
      end_date: e.endDate || '',
      current: Boolean(e.current),
      description: e.description || '',
    }));
    // Map to backend's EducationEntrySerializer expected fields
    const education = (r.education || [])
      .filter(ed => (ed?.degree || '').trim() && (ed?.institution || '').trim())
      .map(ed => ({
        degree: ed.degree || '',
        current: Boolean(ed.current) || false,
        start_year: ed.startYear || '',
        end_year: ed.year || '',
        location: ed.location || '',
        description: ed.description || '',
        institution: ed.institution || '',
        field_of_study: ed.field || '',
      }));
    return {
      first_name: first || '',
      last_name: last || '',
      email: r.personal?.email || '',
      phone: r.personal?.phone || '',
      location: r.personal?.location || '',
      bio: r.personal?.summary || '',
      job_title: r.personal?.title || '',
      skills: Array.isArray(r.skills) ? r.skills : [],
      experiences,
      ...(education.length ? { education } : {}),
      achievements: Array.isArray(r.achievements) ? r.achievements : [],
      certifications: Array.isArray(r.certifications) ? r.certifications : [],
      projects: Array.isArray(r.projects) ? r.projects : [],
      languages: Array.isArray(r.languages) ? r.languages : [],
      linkedin_url: r.links?.linkedin || '',
      github_url: r.links?.github || '',
      portfolio_url: r.links?.portfolio || '',
      website_url: r.links?.website || '',
    };
  };

  // Load profile but don't override sample data until user clicks Create Resume
  useEffect(() => {
    (async () => {
      try {
        const p = await apiRequest('/auth/jobseeker-profile/');
        setProfileSnapshot(p || {});
        const mapped = profileToResume(p || {});
        setMappedProfileData(mapped);
      } catch (e) {
        // ignore; builder stays with sample data
      } finally {
        initialProfileLoad.current = false;
      }
    })();
  }, []);

  // Fetch resume templates and existing snapshots
  useEffect(() => {
    (async () => {
      try {
        setTemplatesLoading(true);
        const tpl = await apiRequest('/resume/templates/');
        const ids = (tpl?.templates || []).map(t => t.id);
        if (ids.length) setAvailableTemplates(ids);
      } catch { } finally { setTemplatesLoading(false); }
      try {
        setSnapshotsLoading(true);
        const res = await apiRequest('/resume/snapshots/');
        setSnapshots(res?.items || []);
      } catch { } finally { setSnapshotsLoading(false); }
    })();
  }, []);

  // Auto-save resume changes back to profile (debounced)
  useEffect(() => {
    if (initialProfileLoad.current || stage !== 'edit') return;
    let cancelled = false;
    setAutoSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        const patch = resumeToProfilePatch(resumeData);
        await apiRequest('/auth/jobseeker-profile/', 'PATCH', patch);
        if (!cancelled) setAutoSaveStatus('saved');
      } catch (e) {
        if (!cancelled) setAutoSaveStatus('error');
        try {
          // Show one-time toast per error burst
          if (!cancelled) {
            showToast(e?.message || 'Auto-save failed', 'error');
          }
        } catch { }
      }
    }, 800);
    return () => { cancelled = true; clearTimeout(t); };
  }, [resumeData]);

  // Simple dynamic score/suggestions heuristic
  useEffect(() => {
    const words = (resumeData.personal?.summary || '').split(/\s+/).filter(Boolean).length;
    const expCount = (resumeData.experience || []).length;
    const skillsCount = (resumeData.skills || []).length;
    const computed = Math.min(95, 50 + Math.min(25, expCount * 5) + Math.min(20, Math.floor(skillsCount / 3)) + Math.min(10, Math.floor(words / 30)));
    setScore(computed);
    const sugg = [];
    if (words < 60) sugg.push({ id: 1, type: 'content', section: 'summary', title: 'Expand summary', original: resumeData.personal?.summary || '', suggested: 'Add 2-3 sentences highlighting impact, metrics, and core strengths.', reason: 'Short summaries underperform in ATS', confidence: 80 });
    if (skillsCount < 8) sugg.push({ id: 2, type: 'keyword', section: 'skills', title: 'Add more skills', original: (resumeData.skills || []).join(', '), suggested: 'React, Node.js, TypeScript, PostgreSQL, Docker, AWS, CI/CD', reason: 'Keyword density is low', confidence: 86 });
    if (expCount > 0 && !(resumeData.experience?.[0]?.description || '').match(/\d/)) sugg.push({ id: 3, type: 'content', section: 'experience', title: 'Quantify achievements', original: resumeData.experience?.[0]?.description || '', suggested: 'Increased system throughput by 30% and reduced latency by 120ms by optimizing queries and caches.', reason: 'Quantified bullets perform better', confidence: 88 });
    setSuggestions(sugg);
  }, [resumeData]);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleDataChange = (newData) => {
    setResumeData(newData);
  };

  const handleCreateResume = () => {
    if (mappedProfileData) {
      setResumeData(prev => ({ ...prev, ...mappedProfileData }));
    }
    setStage('edit');
  };

  const handleSave = async () => {
    try {
      setAutoSaveStatus('saving');
      const patch = resumeToProfilePatch(resumeData);
      await apiRequest('/auth/jobseeker-profile/', 'PATCH', patch);
      setAutoSaveStatus('saved');
      showToast('All changes saved to profile', 'success');
      // also save a snapshot
      try {
        await apiRequest('/resume/snapshots/', 'POST', { title: resumeData.personal?.fullName ? `${resumeData.personal.fullName} - ${selectedTemplate}` : 'Resume', data: { resumeData, selectedTemplate } });
        const res = await apiRequest('/resume/snapshots/');
        setSnapshots(res?.items || []);
        showToast('Snapshot saved', 'success');
      } catch { }
    } catch (e) {
      setAutoSaveStatus('error');
      const msg = e?.message || 'Save failed';
      showToast(msg, 'error');
    }
  };

  // Snapshot actions similar to Overleaf project list
  const createNewSnapshot = async () => {
    try {
      const title = resumeData.personal?.fullName ? `${resumeData.personal.fullName} - ${selectedTemplate}` : 'Resume';
      const created = await apiRequest('/resume/snapshots/', 'POST', { title, data: { resumeData, selectedTemplate } });
      const res = await apiRequest('/resume/snapshots/'); setSnapshots(res?.items || []);
      if (created?.id) setSelectedSnapshotId(created.id);
      showToast('Snapshot created', 'success');
    } catch { }
  };
  const loadSnapshot = (snap) => {
    if (!snap) return;
    const payload = snap.data || {};
    setSelectedSnapshotId(snap.id);
    if (payload.selectedTemplate) setSelectedTemplate(payload.selectedTemplate);
    if (payload.resumeData) setResumeData(payload.resumeData);
  };
  const renameSnapshot = async (snap) => {
    setRenameModal({ open: true, snap });
  };
  const deleteSnapshot = async (snap) => {
    setDeleteModal({ open: true, snap, loading: false });
  };
  const duplicateSnapshot = async (snap) => {
    try {
      const title = `${snap.title || 'Resume'} (Copy)`;
      await apiRequest('/resume/snapshots/', 'POST', { title, data: snap.data || {} });
      const res = await apiRequest('/resume/snapshots/'); setSnapshots(res?.items || []);
      showToast('Snapshot duplicated', 'success');
    } catch { }
  };

  const handleExport = async () => {
    // Default: rasterized WYSIWYG export to preserve template styling; fallback to text if it fails
    const exportTextPdf = async (jsPdfLib) => {
      const { jsPDF } = jsPdfLib;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40; const lineHeight = 16;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const textWidth = pageWidth - margin * 2; let y = margin;
      const addTextBlock = (text, opts = {}) => {
        const lines = doc.splitTextToSize(String(text || ''), textWidth);
        lines.forEach((ln) => { if (y > pageHeight - margin) { doc.addPage(); y = margin; } doc.text(ln, margin, y, opts); y += lineHeight; });
      };
      const addHeading = (label) => { if (y > pageHeight - margin - lineHeight * 2) { doc.addPage(); y = margin; } doc.setFont('helvetica', 'bold'); doc.setFontSize(13); addTextBlock(label); doc.setFont('helvetica', 'normal'); doc.setFontSize(12); };
      doc.setFont('helvetica', 'bold'); doc.setFontSize(18); addTextBlock(resumeData?.personal?.fullName || '');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); addTextBlock(resumeData?.personal?.title || '');
      addTextBlock([resumeData?.personal?.email, resumeData?.personal?.phone, resumeData?.personal?.location].filter(Boolean).join(' | '));
      if (resumeData?.personal?.summary) { addHeading('Summary'); addTextBlock(resumeData.personal.summary); }
      const experiences = Array.isArray(resumeData?.experience) ? resumeData.experience : [];
      if (experiences.length) { addHeading('Experience'); experiences.forEach((e) => { doc.setFont('helvetica', 'bold'); addTextBlock(`${e.title || ''} — ${e.company || ''}`); doc.setFont('helvetica', 'normal'); addTextBlock(`${e.startDate || ''} - ${e.current ? 'Present' : (e.endDate || '')}`); if (e.description) { const bullets = String(e.description).split(/\n|•/).map(s => s.trim()).filter(Boolean); bullets.forEach(b => addTextBlock(`• ${b}`)); } y += 6; }); }
      const education = Array.isArray(resumeData?.education) ? resumeData.education : [];
      if (education.length) { addHeading('Education'); education.forEach((ed) => { doc.setFont('helvetica', 'bold'); addTextBlock(`${ed.degree || ''}${ed.field ? ` in ${ed.field}` : ''}`); doc.setFont('helvetica', 'normal'); addTextBlock(`${ed.institution || ''}${ed.year ? ` • ${ed.year}` : ''}${ed.gpa ? ` • GPA: ${ed.gpa}` : ''}`); y += 6; }); }
      const skills = Array.isArray(resumeData?.skills) ? resumeData.skills : [];
      if (skills.length) { addHeading('Skills'); addTextBlock(skills.join(', ')); }
      const blob = doc.output('blob'); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); const name = (resumeData?.personal?.fullName || 'resume').replace(/[^a-z0-9\-_]+/gi, '_');
      a.href = url; a.download = `${name}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    };
    try {
      const loadJsPdf = () => new Promise((resolve, reject) => {
        if (window.jspdf) return resolve(window.jspdf);
        const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = () => resolve(window.jspdf); s.onerror = reject; document.body.appendChild(s);
      });
      const loadHtml2Canvas = () => new Promise((resolve, reject) => {
        if (window.html2canvas) return resolve(window.html2canvas);
        const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = () => resolve(window.html2canvas); s.onerror = reject; document.body.appendChild(s);
      });
      const jsPdfLib = await loadJsPdf(); await loadHtml2Canvas(); const { jsPDF } = jsPdfLib;
      const node = document.querySelector('#resume-canvas'); if (!node) throw new Error('Preview not available');
      const canvas = await window.html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth(); const pageHeight = doc.internal.pageSize.getHeight();
      const scale = pageWidth / canvas.width; const slicePixelHeight = Math.floor(pageHeight / scale);
      const tmp = document.createElement('canvas'); const ctx = tmp.getContext('2d');
      let yPix = 0; let first = true;
      while (yPix < canvas.height) {
        const sliceHeight = Math.min(slicePixelHeight, canvas.height - yPix);
        tmp.width = canvas.width; tmp.height = sliceHeight; ctx.clearRect(0, 0, tmp.width, tmp.height);
        ctx.drawImage(canvas, 0, yPix, canvas.width, sliceHeight, 0, 0, tmp.width, tmp.height);
        const img = tmp.toDataURL('image/png'); if (!first) doc.addPage();
        doc.addImage(img, 'PNG', 0, 0, pageWidth, sliceHeight * scale); first = false; yPix += slicePixelHeight;
      }
      const blob = doc.output('blob'); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); const name = (resumeData?.personal?.fullName || 'resume').replace(/[^a-z0-9\-_]+/gi, '_');
      a.href = url; a.download = `${name}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (e) {
      try {
        const jsPdfLib = window.jspdf ? window.jspdf : await (new Promise((resolve, reject) => {
          const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = () => resolve(window.jspdf); s.onerror = reject; document.body.appendChild(s);
        }));
        await exportTextPdf(jsPdfLib);
      } catch (err) {
        try { (await import('utils/showToast.js')).default(err?.message || 'PDF export failed', 'error'); } catch { }
      }
    }
  };

  const handleServerPdfExport = async () => {
    // Build HTML from LivePreview so server can render exact template with selectable text
    try {
      const wrapper = document.createElement('div');
      wrapper.style.width = '8.27in';
      wrapper.style.minHeight = '11.69in';
      wrapper.style.background = '#ffffff';
      const node = document.querySelector('#resume-canvas');
      if (!node) throw new Error('Preview not available');
      const clone = node.cloneNode(true);
      // Inline computed styles recursively for better fidelity
      const inlineStyles = (srcEl, dstEl) => {
        try {
          const cs = window.getComputedStyle(srcEl);
          let cssText = '';
          for (let i = 0; i < cs.length; i++) {
            const prop = cs[i];
            const val = cs.getPropertyValue(prop);
            cssText += `${prop}:${val};`;
          }
          dstEl.setAttribute('style', cssText);
        } catch { }
        const srcChildren = srcEl.children || [];
        const dstChildren = dstEl.children || [];
        for (let i = 0; i < srcChildren.length; i++) {
          if (dstChildren[i]) inlineStyles(srcChildren[i], dstChildren[i]);
        }
      };
      inlineStyles(node, clone);
      // Inline simple styles to improve server rendering fidelity
      clone.style.fontFamily = 'Inter, Arial, sans-serif';
      clone.style.color = '#111827';
      wrapper.appendChild(clone);
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:0;}@page{size:A4;margin:0;}#resume-canvas{box-shadow:none;width:8.27in;min-height:11.69in;margin:0 auto;padding:24pt;}</style></head><body>${wrapper.innerHTML}</body></html>`;
      const url = getApiUrl('/resume/export/?format=pdf');
      // Acquire a valid access token
      let authToken = null;
      try { authToken = await tokenManager.getValidAccessToken(); } catch { }
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        // We'll not call apiRequest here since it expects JSON responses; this endpoint returns PDF
        body: JSON.stringify({ html })
      });
      if (!res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const j = await res.json();
          throw new Error(j.detail || 'Server PDF export failed');
        }
        throw new Error(`Server PDF export failed (${res.status})`);
      }
      const blob = await res.blob();
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const name = (resumeData?.personal?.fullName || 'resume').replace(/[^a-z0-9\-_]+/gi, '_');
      a.href = urlBlob; a.download = `${name}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(urlBlob), 30000);
    } catch (e) {
      showToast(e?.message || 'Server PDF export failed', 'error');
    }
  };

  const handleAISuggestionAccept = (suggestion) => {
    console.log('Accepted suggestion:', suggestion);
    // Implement suggestion acceptance logic
  };

  const handleAISuggestionReject = (suggestion) => {
    console.log('Rejected suggestion:', suggestion);
    // Implement suggestion rejection logic
  };

  const getAutoSaveIcon = () => {
    switch (autoSaveStatus) {
      case 'saving': return 'Loader2';
      case 'saved': return 'Check';
      case 'error': return 'AlertCircle';
      default: return 'Save';
    }
  };

  const getAutoSaveColor = () => {
    switch (autoSaveStatus) {
      case 'saving': return 'text-warning';
      case 'saved': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <MainLayout
      title="AI Resume Builder"
      description="Create professional resumes with AI assistance"
    >
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-row items-stretch justify-stretch px-0 py-0">
        {/* Left Panel - Stage-aware: chooser or editor */}
        <div className={`${isMobilePreview ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/2 border-r border-border bg-card rounded-none shadow-none`}>
          {/* Top Section - Template & Score */}
          <div className="flex-shrink-0 p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">AI Resume Builder</h1>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon
                    name={getAutoSaveIcon()}
                    size={16}
                    className={`${getAutoSaveColor()} ${autoSaveStatus === 'saving' ? 'animate-spin' : ''}`}
                  />
                  <span className={getAutoSaveColor()}>
                    {autoSaveStatus === 'saving' ? 'Saving...' :
                      autoSaveStatus === 'saved' ? 'All changes saved' :
                        autoSaveStatus === 'error' ? 'Save failed' : 'Auto-save enabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAISuggestions(true)}
                  iconName="Sparkles"
                  iconPosition="left"
                >
                  AI Suggestions
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobilePreview(!isMobilePreview)}
                  className="lg:hidden"
                >
                  <Icon name={isMobilePreview ? 'Edit' : 'Eye'} size={16} />
                </Button>
              </div>
            </div>

            {stage === 'choose' ? (
              <>
                <TemplateCarousel
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                  templates={availableTemplates}
                />
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleCreateResume} iconName="FilePlus2" iconPosition="left">
                    Create Resume
                  </Button>
                </div>
              </>
            ) : (
              <>
                <SnapshotsPanel
                  snapshots={snapshots}
                  loading={snapshotsLoading}
                  selectedId={selectedSnapshotId}
                  onCreateNew={createNewSnapshot}
                  onLoad={loadSnapshot}
                  onRename={renameSnapshot}
                  onDuplicate={duplicateSnapshot}
                  onDelete={deleteSnapshot}
                />

                <div className="mt-8">
                  <div className="bg-card shadow-lg p-6">
                    <EditingPanel
                      resumeData={resumeData}
                      onDataChange={handleDataChange}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <OptimizationScore score={score} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview with merged QuickActionsToolbar */}
        <div className={`${isMobilePreview ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-1/2 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-none shadow-none ${isMaximized ? 'fixed inset-0 z-40 lg:static' : ''}`}>
          <div className="flex flex-col h-full justify-stretch items-stretch px-6 pt-6 pb-6">
            <div className="bg-card shadow-lg w-full h-full flex flex-col">
              <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                <QuickActionsToolbar
                  context="resume-builder"
                  onSave={handleSave}
                  onExport={handleExport}
                  onExportServer={handleServerPdfExport}
                />
                <div className="text-xs text-muted-foreground">{templatesLoading ? 'Loading templates…' : ''}</div>
              </div>
              <div className="px-6 pb-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>{snapshotsLoading ? 'Loading snapshots…' : `Snapshots: ${snapshots.length}`}</span>
              </div>
              <div className="flex-1 px-6 pb-6">
                <div className="bg-card border border-border shadow-md w-full h-full overflow-auto">
                  {stage === 'choose' ? (
                    <LivePreview
                      resumeData={resumeData}
                      selectedTemplate={selectedTemplate}
                      forceLightTheme={true}
                      scale={previewScale}
                      onZoomIn={() => setPreviewScale((s) => Math.min(2, +(s + 0.1).toFixed(2)))}
                      onZoomOut={() => setPreviewScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2)))}
                      onToggleMaximize={() => setIsMaximized((m) => !m)}
                    />
                  ) : (
                    <PdfPreview
                      resumeData={resumeData}
                      selectedTemplate={selectedTemplate}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestion Panel */}
        <AISuggestionPanel
          isVisible={showAISuggestions}
          onClose={() => setShowAISuggestions(false)}
          suggestions={suggestions}
          onAccept={(s) => {
            try {
              if (!s) return;
              const sec = (s.section || '').toLowerCase();
              if (sec === 'summary') {
                setResumeData((prev) => ({ ...prev, personal: { ...(prev.personal || {}), summary: s.suggested } }));
              } else if (sec === 'skills') {
                const list = (s.suggested || '').split(',').map((x) => x.trim()).filter(Boolean);
                setResumeData((prev) => ({ ...prev, skills: list }));
              } else if (sec === 'experience') {
                setResumeData((prev) => {
                  const exp = [...(prev.experience || [])];
                  if (exp[0]) exp[0] = { ...exp[0], description: s.suggested };
                  return { ...prev, experience: exp };
                });
              }
            } catch { }
          }}
          onReject={handleAISuggestionReject}
        />

        {/* no export modal */}

        {/* Rename Snapshot Dialog */}
        <TextInputDialog
          isOpen={renameModal.open}
          title="Rename snapshot"
          label="Snapshot name"
          initialValue={renameModal.snap?.title || ''}
          onCancel={() => setRenameModal({ open: false, snap: null })}
          onConfirm={async (value) => {
            if (!value) { setRenameModal({ open: false, snap: null }); return; }
            try {
              await apiRequest(`/resume/snapshots/${renameModal.snap.id}/`, 'PATCH', { title: value });
              const res = await apiRequest('/resume/snapshots/'); setSnapshots(res?.items || []);
              showToast('Snapshot renamed', 'success');
            } catch { }
            finally {
              setRenameModal({ open: false, snap: null });
            }
          }}
        />

        {/* Delete Snapshot Confirm */}
        <ConfirmDialog
          isOpen={deleteModal.open}
          title="Delete snapshot"
          description={`Are you sure you want to delete "${deleteModal.snap?.title || 'this snapshot'}"? This action cannot be undone.`}
          confirmText="Delete"
          destructive
          loading={deleteModal.loading}
          onCancel={() => setDeleteModal({ open: false, snap: null, loading: false })}
          onConfirm={async () => {
            try {
              setDeleteModal((d) => ({ ...d, loading: true }));
              await apiRequest(`/resume/snapshots/${deleteModal.snap.id}/`, 'DELETE');
              const res = await apiRequest('/resume/snapshots/'); setSnapshots(res?.items || []);
              if (String(selectedSnapshotId) === String(deleteModal.snap.id)) setSelectedSnapshotId(null);
              showToast('Snapshot deleted', 'success');
            } catch { }
            finally {
              setDeleteModal({ open: false, snap: null, loading: false });
            }
          }}
        />

        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed bottom-20 right-4 z-30">
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className="w-12 h-12 shadow-lg"
          >
            <Icon name={isMobilePreview ? 'Edit' : 'Eye'} size={20} />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIResumeBuilder;

