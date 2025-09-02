import React from 'react';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';


const LivePreview = ({ resumeData, selectedTemplate, forceLightTheme = true, scale = 1, onZoomIn, onZoomOut, onToggleMaximize }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderModernTemplate = () => (
    <div className="bg-white text-black p-8 min-h-full rounded-card">
      {/* Header */}
      <div className="border-b-2 border-purple-500 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">
          {resumeData.personal?.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-800 mb-4">
          {resumeData.personal?.title || 'Professional Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          {resumeData.personal?.email && (
            <div className="flex items-center space-x-1">
              <Icon name="Mail" size={14} />
              <span>{resumeData.personal.email}</span>
            </div>
          )}
          {resumeData.personal?.phone && (
            <div className="flex items-center space-x-1">
              <Icon name="Phone" size={14} />
              <span>{resumeData.personal.phone}</span>
            </div>
          )}
          {resumeData.personal?.location && (
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{resumeData.personal.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personal?.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-3 flex items-center">
            <Icon name="User" size={18} className="mr-2 text-black" />
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed">{resumeData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Briefcase" size={18} className="mr-2 text-black" />
            Work Experience
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-purple-200 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-black">{exp.title}</h3>
                    <p className="text-gray-800">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="text-gray-800 text-sm leading-relaxed list-disc ml-5 space-y-1">
                    {(exp.description || '').split(/\n|•/).map((line, i) => line.trim()).filter(Boolean).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="GraduationCap" size={18} className="mr-2 text-black" />
            Education
          </h2>
          <div className="space-y-3">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-purple-200 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-800">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
                  </div>
                  {edu.year && <span className="text-sm text-gray-600">{edu.year}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Zap" size={18} className="mr-2 text-black" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="FolderGit" size={18} className="mr-2 text-black" />
            Projects
          </h2>
          <div className="space-y-3">
            {resumeData.projects.map((prj, idx) => (
              <div key={idx} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-black">{prj.title}</h3>
                  {prj.link && (
                    <a href={prj.link} className="text-sm text-gray-700 underline" target="_blank" rel="noreferrer">Link</a>
                  )}
                </div>
                {prj.description && <p className="text-gray-800 text-sm mt-1">{prj.description}</p>}
                {(prj.tech_stack || []).length > 0 && (
                  <p className="text-gray-700 text-xs mt-1">Tech: {prj.tech_stack.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Award" size={18} className="mr-2 text-black" />
            Achievements
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {resumeData.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Certificate" size={18} className="mr-2 text-black" />
            Certifications
          </h2>
          <div className="space-y-2">
            {resumeData.certifications.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-black font-medium">{c.name}</p>
                  <p className="text-gray-700 text-sm">{c.issuer}</p>
                </div>
                <div className="text-right">
                  {c.year && <p className="text-gray-700 text-sm">{c.year}</p>}
                  {c.credential && <p className="text-gray-700 text-xs">{c.credential}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {resumeData.links && Object.keys(resumeData.links).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Link" size={18} className="mr-2 text-black" />
            Links
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            {resumeData.links.linkedin && <a className="underline text-gray-800" href={resumeData.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {resumeData.links.github && <a className="underline text-gray-800" href={resumeData.links.github} target="_blank" rel="noreferrer">GitHub</a>}
            {resumeData.links.portfolio && <a className="underline text-gray-800" href={resumeData.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
            {resumeData.links.website && <a className="underline text-gray-800" href={resumeData.links.website} target="_blank" rel="noreferrer">Website</a>}
          </div>
        </div>
      )}

      {/* Languages */}
      {resumeData.languages && resumeData.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center">
            <Icon name="Globe" size={18} className="mr-2 text-black" />
            Languages
          </h2>
          <p className="text-gray-800">{resumeData.languages.join(' • ')}</p>
        </div>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white text-black p-8 min-h-full rounded-card">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">
          {resumeData.personal?.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-800 mb-3">
          {resumeData.personal?.title || 'Professional Title'}
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-700">
          {resumeData.personal?.email && <span>{resumeData.personal.email}</span>}
          {resumeData.personal?.phone && <span>{resumeData.personal.phone}</span>}
          {resumeData.personal?.location && <span>{resumeData.personal.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.personal?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed">{resumeData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-black">{exp.title}</h3>
                    <p className="text-gray-800 italic">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-700">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-800 text-sm leading-relaxed ml-4">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-black">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-800 italic">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
                </div>
                {edu.year && <span className="text-sm text-gray-700">{edu.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
            Skills
          </h2>
          <p className="text-gray-800">{resumeData.skills.join(' • ')}</p>
        </div>
      )}
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="bg-white text-black p-10 min-h-full rounded-card">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{resumeData.personal?.fullName || 'Your Name'}</h1>
        <p className="text-sm text-gray-700 mt-1">{[resumeData.personal?.email, resumeData.personal?.phone, resumeData.personal?.location].filter(Boolean).join(' • ')}</p>
      </div>
      {resumeData.personal?.summary && (
        <div className="mb-5">
          <h2 className="text-base font-semibold uppercase tracking-wide">Summary</h2>
          <p className="text-gray-800 text-sm mt-1 leading-relaxed">{resumeData.personal.summary}</p>
        </div>
      )}
      {!!(resumeData.experience || []).length && (
        <div className="mb-5">
          <h2 className="text-base font-semibold uppercase tracking-wide">Experience</h2>
          <div className="mt-2 space-y-3">
            {(resumeData.experience || []).map((e, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium">{e.title}</h3>
                  <span className="text-xs text-gray-700">{formatDate(e.startDate)} - {e.current ? 'Present' : formatDate(e.endDate)}</span>
                </div>
                <div className="text-sm text-gray-800">{e.company}</div>
                {e.description && (
                  <ul className="text-sm text-gray-800 mt-1 leading-relaxed list-disc ml-5 space-y-1">
                    {(e.description || '').split(/\n|•/).map((line, i) => line.trim()).filter(Boolean).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {!!(resumeData.education || []).length && (
        <div className="mb-5">
          <h2 className="text-base font-semibold uppercase tracking-wide">Education</h2>
          <div className="mt-2 space-y-2">
            {(resumeData.education || []).map((ed, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <div>
                  <div className="font-medium">{ed.degree}{ed.field ? ` in ${ed.field}` : ''}</div>
                  <div className="text-sm text-gray-800">{ed.institution}</div>
                </div>
                <div className="text-xs text-gray-700">{[ed.year, ed.gpa && `GPA: ${ed.gpa}`].filter(Boolean).join(' • ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!!(resumeData.skills || []).length && (
        <div>
          <h2 className="text-base font-semibold uppercase tracking-wide">Skills</h2>
          <p className="text-sm text-gray-800 mt-1">{(resumeData.skills || []).join(' • ')}</p>
        </div>
      )}
    </div>
  );

  const renderTechnicalTemplate = () => (
    <div className="bg-white text-black p-8 min-h-full rounded-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{resumeData.personal?.fullName || 'Your Name'}</h1>
          <p className="text-sm text-gray-800">{resumeData.personal?.title || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-xs text-gray-700">
          {[resumeData.personal?.email, resumeData.personal?.phone, resumeData.personal?.location].filter(Boolean).map((x, i) => <div key={i}>{x}</div>)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {resumeData.personal?.summary && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Summary</h2>
              <p className="text-sm text-gray-800 mt-1 leading-relaxed">{resumeData.personal.summary}</p>
            </div>
          )}
          {!!(resumeData.experience || []).length && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Experience</h2>
              <div className="mt-2 space-y-3">
                {(resumeData.experience || []).map((e, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold">{e.title} — {e.company}</h3>
                      <span className="text-xs text-gray-700">{formatDate(e.startDate)} - {e.current ? 'Present' : formatDate(e.endDate)}</span>
                    </div>
                    {e.description && (
                      <ul className="text-sm text-gray-800 mt-1 leading-relaxed list-disc ml-5 space-y-1">
                        {(e.description || '').split(/\n|•/).map((line, i) => line.trim()).filter(Boolean).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!(resumeData.projects || []).length && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Projects</h2>
              <div className="mt-2 space-y-2">
                {(resumeData.projects || []).map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{p.title}</h3>
                      {p.link && <a className="text-xs underline text-gray-700" href={p.link} target="_blank" rel="noreferrer">Link</a>}
                    </div>
                    {p.description && <p className="text-sm text-gray-800">{p.description}</p>}
                    {!!(p.tech_stack || []).length && <p className="text-xs text-gray-700 mt-0.5">Tech: {p.tech_stack.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          {!!(resumeData.skills || []).length && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Skills</h2>
              <ul className="mt-2 grid grid-cols-1 gap-1 text-sm text-gray-800 list-disc list-inside">
                {(resumeData.skills || []).map((s, i) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}
          {!!(resumeData.certifications || []).length && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Certifications</h2>
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                {(resumeData.certifications || []).map((c, i) => (<li key={i}>{c.name}{c.issuer ? `, ${c.issuer}` : ''}</li>))}
              </ul>
            </div>
          )}
          {!!(resumeData.education || []).length && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold tracking-wide uppercase">Education</h2>
              <ul className="mt-2 space-y-1 text-sm text-gray-800">
                {(resumeData.education || []).map((ed, i) => (<li key={i}>{ed.degree}{ed.field ? ` in ${ed.field}` : ''} — {ed.institution}{ed.year ? ` • ${ed.year}` : ''}</li>))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderElegantTemplate = () => (
    <div className="bg-white text-black p-10 min-h-full rounded-card">
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-3xl font-serif font-bold">{resumeData.personal?.fullName || 'Your Name'}</h1>
        <p className="text-sm text-gray-700 italic">{resumeData.personal?.title || 'Professional Title'}</p>
      </div>
      {resumeData.personal?.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold font-serif mb-1">Profile</h2>
          <p className="text-gray-800 leading-relaxed">{resumeData.personal.summary}</p>
        </div>
      )}
      {!!(resumeData.experience || []).length && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold font-serif mb-2">Experience</h2>
          <div className="space-y-3">
            {(resumeData.experience || []).map((e, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <div className="font-medium">{e.title} — {e.company}</div>
                  <div className="text-xs text-gray-700">{formatDate(e.startDate)} - {e.current ? 'Present' : formatDate(e.endDate)}</div>
                </div>
                {e.description && (
                  <ul className="text-sm text-gray-800 mt-1 list-disc ml-5 space-y-1">
                    {(e.description || '').split(/\n|•/).map((line, i) => line.trim()).filter(Boolean).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {!!(resumeData.education || []).length && (
          <div>
            <h2 className="text-lg font-semibold font-serif mb-2">Education</h2>
            <div className="space-y-2 text-sm text-gray-800">
              {(resumeData.education || []).map((ed, i) => (
                <div key={i}>{ed.degree}{ed.field ? ` in ${ed.field}` : ''} • {ed.institution}{ed.year ? ` • ${ed.year}` : ''}</div>
              ))}
            </div>
          </div>
        )}
        {!!(resumeData.skills || []).length && (
          <div>
            <h2 className="text-lg font-semibold font-serif mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(resumeData.skills || []).map((s, i) => (<span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{s}</span>))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactTemplate = () => (
    <div className="bg-white text-black p-6 min-h-full rounded-card">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-xl font-bold">{resumeData.personal?.fullName || 'Your Name'}</h1>
        <span className="text-xs text-gray-700">{resumeData.personal?.location}</span>
      </div>
      <p className="text-xs text-gray-700">{[resumeData.personal?.email, resumeData.personal?.phone].filter(Boolean).join(' • ')}</p>
      {resumeData.personal?.summary && <p className="text-sm text-gray-800 mt-2">{resumeData.personal.summary}</p>}
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="space-y-2">
          {!!(resumeData.experience || []).length && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">Experience</h2>
              <div className="mt-1 space-y-1">
                {(resumeData.experience || []).slice(0, 3).map((e, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{e.title}</span>
                      <span className="text-xs text-gray-700">{e.current ? 'Present' : formatDate(e.endDate)}</span>
                    </div>
                    <div className="text-xs text-gray-800">{e.company}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!(resumeData.education || []).length && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">Education</h2>
              <div className="mt-1 space-y-1 text-xs text-gray-800">
                {(resumeData.education || []).map((ed, i) => (<div key={i}>{ed.degree}{ed.field ? ` in ${ed.field}` : ''} — {ed.institution}</div>))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {!!(resumeData.skills || []).length && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">Skills</h2>
              <p className="text-xs text-gray-800 mt-1">{(resumeData.skills || []).join(' • ')}</p>
            </div>
          )}
          {!!(resumeData.projects || []).length && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">Projects</h2>
              <div className="text-xs text-gray-800 mt-1 space-y-1">
                {(resumeData.projects || []).slice(0, 3).map((p, i) => (<div key={i}>{p.title}</div>))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'classic':
        return renderClassicTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'technical':
        return renderTechnicalTemplate();
      case 'elegant':
        return renderElegantTemplate();
      case 'compact':
        return renderCompactTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-card">
        <h3 className="font-semibold text-foreground">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Button aria-label="Zoom In" variant="ghost" size="sm" className="text-foreground" onClick={onZoomIn}>
            <Icon name="ZoomIn" size={16} />
          </Button>
          <Button aria-label="Zoom Out" variant="ghost" size="sm" className="text-foreground" onClick={onZoomOut}>
            <Icon name="ZoomOut" size={16} />
          </Button>
          <Button aria-label="Toggle Fullscreen" variant="ghost" size="sm" className="text-foreground" onClick={onToggleMaximize}>
            <Icon name="Maximize2" size={16} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto bg-muted p-6">
        <motion.div
          id="resume-canvas"
          key={selectedTemplate}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-border"
          style={{ width: '8.27in', minHeight: '11.69in', transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          {renderTemplate()}
        </motion.div>
      </div>
    </div>
  );
};

export default LivePreview;
