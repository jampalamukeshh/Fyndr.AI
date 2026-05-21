import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import { getSemanticMatches } from "services/assistantAPI";
import PremiumAppShell from "components/layout/PremiumAppShell";

const ROLE_SECTIONS = {
  job_seeker: {
    title: "Premium Job Search Workspace",
    subtitle: "Discover real-time jobs, track applications, and use AI to apply faster.",
    actions: [
      { label: "Explore Live Jobs", path: "/ai-powered-job-feed-dashboard", icon: "Radar" },
      { label: "Application Timeline", path: "/job-applications", icon: "Route" },
      { label: "AI Resume Studio", path: "/ai-resume-builder", icon: "FilePenLine" },
      { label: "Career Assistant", path: "/ai-career-coach-chat-interface", icon: "Bot" },
    ],
  },
  recruiter: {
    title: "Recruiter Control Center",
    subtitle: "Find better candidates, collaborate with teams, and move talent through stages quickly.",
    actions: [
      { label: "Pipeline Dashboard", path: "/company-dashboard-pipeline-management", icon: "BarChart3" },
      { label: "Candidate Evaluation", path: "/candidate-profile-evaluation-interface", icon: "UserRoundSearch" },
      { label: "Team Collaboration", path: "/team/recruiter", icon: "Users" },
      { label: "Smart Job Search", path: "/job-search-application-hub", icon: "Search" },
    ],
  },
  company: {
    title: "Company Hiring Command Center",
    subtitle: "Manage recruiters, post openings, and monitor hiring outcomes in one premium workspace.",
    actions: [
      { label: "Hiring Pipeline", path: "/company-dashboard-pipeline-management", icon: "KanbanSquare" },
      { label: "Manage Team", path: "/team/company", icon: "UserPlus" },
      { label: "Company Profile", path: "/company-profile-management", icon: "Building2" },
      { label: "Candidate Intelligence", path: "/candidate-profile-evaluation-interface", icon: "Brain" },
    ],
  },
  administrator: {
    title: "Platform Operations Center",
    subtitle: "Monitor system health, moderation, and ecosystem growth with central controls.",
    actions: [
      { label: "Admin Dashboard", path: "/admin-dashboard-system-management", icon: "ShieldCheck" },
      { label: "Notifications", path: "/notifications-center", icon: "Bell" },
      { label: "User Governance", path: "/admin-profile-management", icon: "UsersRound" },
      { label: "Platform Insights", path: "/admin-dashboard-system-management", icon: "LineChart" },
    ],
  },
};

const PLATFORM_MODULES = [
  {
    title: "Real-Time Job Intelligence",
    description: "Continuously refreshed job feeds with outbound link redirection and source trust checks.",
    icon: "Globe2",
  },
  {
    title: "Actionable AI Assistant",
    description: "Chat assistant that can suggest jobs, prepare actions, and guide workflow execution.",
    icon: "Sparkles",
  },
  {
    title: "Recruiter + Community Chat",
    description: "Role-based communication channels across seekers, recruiters, and alumni communities.",
    icon: "MessagesSquare",
  },
  {
    title: "Timeline Application Tracking",
    description: "Milestone-driven status tracking from application to offer with event history.",
    icon: "Clock3",
  },
];

function readUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.role) return "job_seeker";
    if (user.role === "jobseeker") return "job_seeker";
    if (user.role === "employer") return "company";
    return user.role;
  } catch (error) {
    return "job_seeker";
  }
}

const PlatformCommandCenter = () => {
  const role = readUserRole();
  const section = useMemo(() => ROLE_SECTIONS[role] || ROLE_SECTIONS.job_seeker, [role]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    let active = true;

    const loadMatches = async () => {
      if (role !== "job_seeker") return;
      try {
        const response = await getSemanticMatches(4);
        if (active && response?.success) {
          setMatches(response.matches || []);
        }
      } catch (error) {
        if (active) {
          setMatches([]);
        }
      }
    };

    loadMatches();
    return () => {
      active = false;
    };
  }, [role]);

  return (
    <PremiumAppShell
      title={section.title}
      subtitle={section.subtitle}
      badge="Premium Workspace"
      icon="Gem"
      hideFloatingChat
    >
      <div className="mx-auto mb-6 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {section.actions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="group rounded-2xl border border-border bg-background/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <Icon name={action.icon} size={18} className="text-primary" />
              <Icon
                name="ArrowUpRight"
                size={16}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="mt-3 text-sm font-semibold">{action.label}</p>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {PLATFORM_MODULES.map((module) => (
            <article
              key={module.title}
              className="rounded-2xl border border-border/90 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary p-2 text-secondary-foreground">
                  <Icon name={module.icon} size={18} />
                </div>
                <h2 className="font-heading text-xl">{module.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{module.description}</p>
            </article>
          ))}
        </div>

        {role === "job_seeker" && matches.length > 0 && (
          <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-2xl">Live Semantic Matches</h3>
              <Link to="/ai-powered-job-feed-dashboard" className="text-sm font-semibold text-primary">
                View all jobs
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {matches.map((job) => (
                <a
                  key={job.job_id}
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border p-4 transition-colors hover:border-primary/50"
                >
                  <p className="text-sm font-semibold">{job.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{job.company} • {job.location || "Remote"}</p>
                  <p className="mt-2 text-xs font-medium text-primary">Match {job.score}%</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </PremiumAppShell>
  );
};

export default PlatformCommandCenter;
