import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';

const JobCard = ({ job, onBookmark, onApply, onQuickApply }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [isApplying, setIsApplying] = useState(false);
  const [isQuickApplying, setIsQuickApplying] = useState(false);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark(job.id, !isBookmarked);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsApplying(true);
    await onApply(job.id);
    setIsApplying(false);
  };

  const handleQuickApply = async (e) => {
    if (!onQuickApply) return;
    e.preventDefault();
    e.stopPropagation();
    setIsQuickApplying(true);
    try {
      await onQuickApply(job.id);
    } finally {
      setIsQuickApplying(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/job-detail-view?id=${job.id}`}>
        <div className="glass-card relative overflow-hidden rounded-3xl border border-border/60 dark:border-white/10 bg-white/90 dark:bg-slate-950/85 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-muted/70 dark:bg-white/5 ring-1 ring-border/70 dark:ring-white/10 flex-shrink-0 shadow-sm">
                  {job.company.logo ? (
                    <Image
                      src={job.company.logo}
                      alt={`${job.company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/70 dark:bg-white/5 flex items-center justify-center">
                      <span className="text-muted-foreground text-xs font-medium">
                        {job.company.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-semibold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                    {job.company.name}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`flex-shrink-0 rounded-full ring-1 ring-transparent transition-all duration-200 hover:scale-110 ${isBookmarked
                  ? 'bg-primary/10 text-primary ring-primary/20'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-primary hover:ring-border/70'
                }`}
              >
                <Icon
                  name={isBookmarked ? 'BookmarkCheck' : 'Bookmark'}
                  size={18}
                  className="transition-colors"
                />
              </Button>
            </div>

            <div className="flex items-center flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
              {job.location && (
                <div className="flex items-center space-x-1.5">
                  <Icon name="MapPin" size={14} />
                  <span>{job.location}</span>
                </div>
              )}
              {(job.type || job.job_type) && (
                <div className="flex items-center space-x-1.5">
                  <Icon name="Clock" size={14} />
                  <span>{job.type || job.job_type}</span>
                </div>
              )}
              {job.employment_mode && (
                <div className="flex items-center space-x-1.5">
                  <Icon name="Home" size={14} />
                  <span className="capitalize">{job.employment_mode}</span>
                </div>
              )}
              {job.experience_level && (
                <div className="flex items-center space-x-1.5">
                  <Icon name="TrendingUp" size={14} />
                  <span className="capitalize">{job.experience_level}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="text-sm font-medium text-foreground">
                {job.salary?.min && job.salary?.max
                  ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                  : job.salary?.text || (typeof job.salary === 'string' ? job.salary : 'Salary not disclosed')
                }
                {job.salary?.min && job.salary?.max && (
                  <span className="text-muted-foreground text-sm ml-1">/ year</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end sm:text-right">
                {job.isRealTime && (
                  <div className="flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>LIVE</span>
                  </div>
                )}
                <div className={`text-sm font-semibold ${getMatchColor(job.matchPercentage || 0)}`}>
                  {job.matchPercentage || 0}% match
                </div>
              </div>
            </div>

            {Array.isArray(job.skills || job.skills_required) && (
              <div className="mb-5">
                <div className="flex flex-wrap gap-2">
                  {(job.skills || job.skills_required).slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-full border border-border/70 dark:border-white/10 bg-primary/8 text-primary text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {(job.skills || job.skills_required).length > 5 && (
                    <span className="px-2.5 py-1 rounded-full border border-border/70 dark:border-white/10 bg-muted/40 text-muted-foreground text-xs">
                      +{(job.skills || job.skills_required).length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full bg-background/80 dark:bg-white/5 ring-1 ring-border/70 dark:ring-white/10 shadow-sm flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted opacity-20"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray={`${job.matchPercentage || 0}, 100`}
                      style={{
                        stroke: job.matchPercentage >= 90 ? '#10B981' :
                          job.matchPercentage >= 70 ? '#8B5CF6' :
                            job.matchPercentage >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${getMatchColor(job.matchPercentage || 0)}`}>
                      {job.matchPercentage || 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs text-muted-foreground">AI Match</p>
                    {job.isRealTime && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">LIVE</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${getMatchColor(job.matchPercentage || 0)}`}>
                    {(job.matchPercentage || 0) >= 90 ? 'Excellent' :
                      (job.matchPercentage || 0) >= 70 ? 'Good' :
                        (job.matchPercentage || 0) >= 50 ? 'Fair' : 'Low'}
                  </p>
                  {job.lastScoreUpdate && (
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(job.lastScoreUpdate).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              {job.hasApplied ? (
                <Button
                  variant="success"
                  size="sm"
                  iconName="Check"
                  iconPosition="left"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled
                >
                  Applied
                </Button>
              ) : (
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Button
                    variant="default"
                    size="sm"
                    loading={isApplying}
                    onClick={handleApply}
                    iconName="Send"
                    iconPosition="left"
                    className="bg-gradient-to-r from-primary to-accent hover:shadow-elevation-2"
                  >
                    Apply
                  </Button>
                  {onQuickApply && (
                    <Button
                      variant="outline"
                      size="sm"
                      loading={isQuickApplying}
                      onClick={handleQuickApply}
                      iconName="Zap"
                      iconPosition="left"
                      className="border-dashed"
                    >
                      Quick Apply
                    </Button>
                  )}
                </div>
              )}
            </div>

            {(Array.isArray(job.benefits) && job.benefits.length > 0) || job.application_deadline || job.date_posted || job.postedDate ? (
              <div className="mt-4 pt-4 border-t border-border/60 dark:border-white/10 space-y-3">
                {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.slice(0, 3).map((benefit, index) => (
                      <span key={index} className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/15">
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {job.application_deadline && (
                    <>
                      Deadline: {new Date(job.application_deadline).toLocaleDateString()} ·{' '}
                    </>
                  )}
                  {job.date_posted || job.postedDate ? (
                    <>Posted {new Date(job.date_posted || job.postedDate).toLocaleDateString()}</>
                  ) : (
                    job.postedTime && <>Posted {job.postedTime}</>
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;