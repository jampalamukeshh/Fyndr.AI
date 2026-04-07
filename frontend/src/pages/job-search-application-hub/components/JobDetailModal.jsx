import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Image from 'components/AppImage';

const JobDetailModal = ({ job, isOpen, onClose, onApply, onQuickApply, onSave }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isQuickApplying, setIsQuickApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !job) return null;

  const handleApply = async () => {
    setIsApplying(true);
    await onApply(job.id);
    setIsApplying(false);
  };

  const handleQuickApply = async () => {
    if (!onQuickApply) return;
    setIsQuickApplying(true);
    try { await onQuickApply(job.id); } finally { setIsQuickApplying(false); }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(job.id, !isSaved);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-accent';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  const formatSalary = (min, max) => {
    // Interpret inputs as LPA when API provides K; display in INR format
    const toINR = (valK) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((valK || 0) * 100000);
    if (min && max) return `${toINR(min)} - ${toINR(max)} per year`;
    if (min) return `${toINR(min)}+ per year`;
    return 'Salary not disclosed';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' },
    { id: 'company', label: 'Company', icon: 'Building' },
    { id: 'benefits', label: 'Benefits', icon: 'Gift' }
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 dark:bg-black/80 backdrop-blur-2xl backdrop-saturate-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border/60 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 text-foreground shadow-[0_30px_80px_-24px_rgba(15,23,42,0.65)] dark:shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/40 dark:ring-white/5">
        {/* Header */}
        <div className="p-6 border-b border-border/60 dark:border-white/10 bg-gradient-to-b from-white/85 to-white/70 dark:from-slate-950/95 dark:to-slate-950/80 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            {/* Left: Company & Title */}
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted/60 dark:bg-white/5 ring-1 ring-border/70 dark:ring-white/10 flex-shrink-0 shadow-sm">
                <Image src={job.company.logo} alt={`${job.company.name} logo`} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight break-words">{job.title}</h1>
                <p className="text-lg text-muted-foreground mt-1 break-words">{job.company.name}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1"><Icon name="MapPin" size={14} /><span>{job.location}</span></div>
                  <div className="flex items-center space-x-1"><Icon name="Clock" size={14} /><span>{job.type}</span></div>
                  <div className={`font-medium ${getMatchColor(job.matchPercentage)}`}>{job.matchPercentage}% match</div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSave}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 border ${isSaved
                  ? 'text-error bg-error/10 border-error/20 dark:bg-error/15'
                  : 'text-muted-foreground hover:text-error hover:bg-error/10 border-transparent'
                  }`}
              >
                <Icon name="Heart" size={20} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <div className="flex items-center gap-2">
                <Button variant="default" loading={isApplying} onClick={handleApply} iconName="Send" iconPosition="left">Apply Now</Button>
                {onQuickApply && (
                  <Button
                    variant="outline"
                    loading={isQuickApplying}
                    onClick={handleQuickApply}
                    iconName="Zap"
                    iconPosition="left"
                    title="Quick Apply (Beta): may auto-fill and attempt automation on external forms"
                    className="border-dashed"
                  >
                    Quick Apply (Beta)
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/70 dark:hover:bg-white/10">
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Sub-actions */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Button variant="outline" onClick={() => window.location.href = `/job-detail-view?id=${job.id}`} iconName="ExternalLink" iconPosition="left">View Full Details</Button>
            <Button variant="outline" iconName="Share" iconPosition="left">Share Job</Button>
            <Button variant="outline" iconName="Flag" iconPosition="left">Report</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border/60 dark:border-white/10 bg-background/70 dark:bg-slate-950/70 backdrop-blur-xl">
          <div className="flex flex-wrap gap-2 p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-primary/15 text-primary border-primary/30 shadow-sm' : 'text-muted-foreground border-transparent hover:bg-muted/60 dark:hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)] bg-gradient-to-b from-transparent via-transparent to-muted/20 dark:to-white/5">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed break-words">{job.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Key Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="DollarSign" size={16} className="text-primary" />
                      <span className="font-medium text-foreground">Salary</span>
                    </div>
                    <p className="text-muted-foreground">{formatSalary(job.salary.min, job.salary.max)}</p>
                  </div>

                  <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span className="font-medium text-foreground">Team Size</span>
                    </div>
                    <p className="text-muted-foreground">{job.teamSize || '5-10 people'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary-foreground rounded-full text-sm border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Minimum Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements?.minimum?.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 rounded-lg bg-muted/30 dark:bg-white/5 p-3">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  )) || [
                    "Bachelor's degree in Computer Science or related field",
                    "3+ years of experience with React and JavaScript",
                    "Strong understanding of web development fundamentals",
                    "Experience with version control systems (Git)"
                  ].map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 rounded-lg bg-muted/30 dark:bg-white/5 p-3">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Preferred Qualifications</h3>
                <ul className="space-y-2">
                  {job.requirements?.preferred?.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 rounded-lg bg-muted/30 dark:bg-white/5 p-3">
                      <Icon name="Plus" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  )) || [
                    "Experience with TypeScript and modern build tools",
                    "Knowledge of testing frameworks (Jest, React Testing Library)",
                    "Familiarity with cloud platforms (AWS, Azure, GCP)",
                    "Previous experience in agile development environments"
                  ].map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 rounded-lg bg-muted/30 dark:bg-white/5 p-3">
                      <Icon name="Plus" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">About {job.company.name}</h3>
                <p className="text-muted-foreground leading-relaxed break-words">
                  {job.company.description || `${job.company.name} is a leading technology company focused on innovation and excellence. We're committed to creating products that make a difference in people's lives while fostering a collaborative and inclusive work environment.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Company Size</span>
                  </div>
                  <p className="text-muted-foreground">{job.company.size || '500-1000 employees'}</p>
                </div>

                <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Headquarters</span>
                  </div>
                  <p className="text-muted-foreground">{job.company.headquarters || 'Bengaluru, Karnataka'}</p>
                </div>

                <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Founded</span>
                  </div>
                  <p className="text-muted-foreground">{job.company.founded || '2015'}</p>
                </div>

                <div className="glassmorphic-surface p-4 rounded-2xl border border-border/60 dark:border-white/10 shadow-sm bg-white/70 dark:bg-white/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Industry</span>
                  </div>
                  <p className="text-muted-foreground">{job.company.industry || 'Technology'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(job.benefits || [
                    'Health Insurance',
                    'Provident Fund (PF)',
                    'Paid Leave',
                    'Remote/Hybrid Work Options',
                    'Learning & Development Budget',
                    'Gym/Wellness Benefits',
                    'Meal Card/Food Coupons',
                    'ESOPs/Stock Options'
                  ]).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 glassmorphic-surface rounded-2xl border border-border/60 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm">
                      <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
