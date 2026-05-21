export const homepageContent = {
  hero: {
    brandName: "Fyndr.AI",
    tagline: "Intelligent Hiring Platform",
    rotatingTitles: [
      "AI-Powered Hiring Revolution",
      "Smart Recruitment Solutions",
      "Future of Talent Acquisition",
    ],
    subtitle:
      "Transform your hiring process with AI-powered screening, bias-free interviews, and intelligent candidate matching. Join teams that are modernizing recruiting with measurable outcomes.",
    ctas: {
      primary: {
        label: "Get Started Free",
        path: "/authentication-login-register",
      },
      secondary: {
        label: "Watch Demo",
        path: "/about-contact-page",
      },
    },
    stats: [
      { label: "Companies Trust Us", value: "10K+", tone: "text-primary" },
      { label: "Hiring Success Rate", value: "95%", tone: "text-accent" },
      { label: "Time Reduction", value: "50%", tone: "text-success" },
    ],
    scrollHint: "Scroll to explore",
  },

  roles: {
    heading: "Choose Your Path",
    subheading:
      "Whether you are seeking opportunities, finding talent, or building teams, Fyndr.AI has a tailored workspace for your workflow.",
    cards: [
      {
        id: "job-seeker",
        title: "Job Seeker",
        subtitle: "Find Your Dream Career",
        description:
          "Discover opportunities with AI-powered job matching, skill assessments, and personalized career guidance.",
        icon: "User",
        color: "from-primary to-primary/80",
        features: [
          "AI Resume Screening",
          "Skill Development Tracking",
          "Interview Preparation",
          "Career Path Guidance",
        ],
        cta: "Start Job Search",
        stats: "50K+ Jobs Available",
      },
      {
        id: "recruiter",
        title: "Recruiter",
        subtitle: "Streamline Your Hiring",
        description:
          "Leverage AI-powered candidate screening, bias-free interviews, and intelligent matching algorithms.",
        icon: "Search",
        color: "from-accent to-accent/80",
        features: [
          "Automated Screening",
          "Bias-Free Interviews",
          "Candidate Analytics",
          "Team Collaboration",
        ],
        cta: "Start Recruiting",
        stats: "10K+ Recruiters Active",
      },
      {
        id: "employer",
        title: "Employer",
        subtitle: "Build Your Dream Team",
        description:
          "Manage your entire hiring funnel with comprehensive analytics, team tools, and data-driven insights.",
        icon: "Building",
        color: "from-success to-success/80",
        features: [
          "Hiring Funnel Management",
          "Team Collaboration Tools",
          "Analytics Dashboard",
          "Compliance Tracking",
        ],
        cta: "Hire Top Talent",
        stats: "5K+ Companies Hiring",
      },
    ],
    guidanceCta: {
      label: "Get Personalized Guidance",
      path: "/about-contact-page",
    },
  },

  featuredCapabilities: {
    heading: "Featured Platform Capabilities",
    subheading:
      "Every showcased feature on our homepage is actionable, connected, and optimized for real-world recruiting workflows.",
    cards: [
      {
        icon: "Brain",
        title: "AI-Powered Screening",
        description:
          "Advanced algorithms analyze resumes, skills, and role-fit signals to shortlist the best candidates.",
        color: "from-primary to-primary/80",
        stats: "95% Accuracy Rate",
        path: "/workspace",
      },
      {
        icon: "Video",
        title: "Smart Video Interviews",
        description:
          "Run structured interviews with rubric-driven evaluation and collaborative review workflows.",
        color: "from-accent to-accent/80",
        stats: "50% Time Saved",
        path: "/video-interview-interface",
      },
      {
        icon: "BarChart3",
        title: "Analytics Dashboard",
        description:
          "Track funnel metrics, time-to-hire, and candidate progression in one command center.",
        color: "from-success to-success/80",
        stats: "360° Visibility",
        path: "/workspace",
      },
      {
        icon: "Shield",
        title: "Bias-Free Hiring",
        description:
          "Reduce bias using skill-centric evaluations and transparent decision records.",
        color: "from-warning to-warning/80",
        stats: "40% More Diverse",
        path: "/workspace",
      },
      {
        icon: "Zap",
        title: "Instant Matching",
        description:
          "Connect candidates to open roles using semantic matching and profile-based fit scoring.",
        color: "from-secondary to-secondary/80",
        stats: "3x Faster Hiring",
        path: "/ai-powered-job-feed-dashboard",
      },
      {
        icon: "Users",
        title: "Team Collaboration",
        description:
          "Coordinate hiring decisions with shared notes, stage updates, and role-based permissions.",
        color: "from-primary/80 to-accent/80",
        stats: "100% Team Sync",
        path: "/community-hub",
      },
    ],
    platformStats: [
      { label: "Uptime Guarantee", value: "99.9%", tone: "text-primary" },
      { label: "Support Available", value: "24/7", tone: "text-accent" },
      { label: "Compliant Security", value: "SOC 2", tone: "text-success" },
      { label: "Privacy Ready", value: "GDPR", tone: "text-warning" },
    ],
  },

  testimonials: {
    heading: "Success Stories",
    subheading:
      "Hear from professionals and teams that improved hiring outcomes with Fyndr.AI.",
    entries: [
      {
        id: 1,
        name: "Sarah Chen",
        role: "Senior Software Engineer",
        company: "TechCorp",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b332c3c8?w=150&h=150&fit=crop&crop=face",
        content:
          "Fyndr.AI transformed my job search. AI-powered matching connected me with opportunities I would have missed, and I landed my dream role in weeks.",
        rating: 5,
        skills: ["React", "Node.js", "Python", "AWS"],
        outcome: "Hired in 3 weeks",
        type: "job-seeker",
      },
      {
        id: 2,
        name: "Michael Rodriguez",
        role: "Head of Talent Acquisition",
        company: "InnovateLabs",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        content:
          "Bias-free screening and better candidate matching improved our hiring quality by 40% while reducing manual review overhead.",
        rating: 5,
        skills: ["Talent Acquisition", "AI Screening", "Team Building"],
        outcome: "40% better quality",
        type: "recruiter",
      },
      {
        id: 3,
        name: "Emily Watson",
        role: "VP of Engineering",
        company: "StartupXYZ",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        content:
          "We scaled from 5 to 50 engineers in 6 months using the analytics dashboard and collaborative decision workflows.",
        rating: 5,
        skills: ["Engineering Leadership", "Team Scaling", "Analytics"],
        outcome: "10x team growth",
        type: "employer",
      },
    ],
    stats: [
      { label: "Average Rating", value: "4.9/5", tone: "text-primary" },
      { label: "Success Stories", value: "25K+", tone: "text-accent" },
      { label: "Satisfaction Rate", value: "98%", tone: "text-success" },
    ],
  },

  about: {
    heading: "About Fyndr.AI",
    subheading:
      "We are building the future of hiring with practical AI and human-centered workflow design.",
    missionHeading: "Our Mission",
    missionBody:
      "To revolutionize hiring through AI-powered solutions that reduce bias, improve speed, and expand access to opportunity.",
    missionDetail:
      "We believe talent should connect with opportunity based on capability and potential, not legacy gatekeeping.",
    impactStats: [
      { icon: "Target", label: "Profiles Analyzed", value: "100M+", tone: "text-primary" },
      { icon: "Zap", label: "Companies Served", value: "50K+", tone: "text-accent" },
      { icon: "Users", label: "Successful Hires", value: "1M+", tone: "text-success" },
      { icon: "Award", label: "Satisfaction Rate", value: "99%", tone: "text-warning" },
    ],
    teamHeading: "Meet Our Team",
    teamSubheading:
      "A diverse group of AI experts, builders, and recruiting practitioners shaping modern hiring.",
    team: [
      {
        name: "Alex Johnson",
        role: "CEO & Co-Founder",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/alexjohnson",
        expertise: ["AI Strategy", "Product Vision", "Leadership"],
      },
      {
        name: "Sarah Kim",
        role: "CTO & Co-Founder",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/sarahkim",
        expertise: ["Machine Learning", "System Architecture", "Engineering"],
      },
      {
        name: "Michael Chen",
        role: "Head of AI Research",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/michaelchen",
        expertise: ["Deep Learning", "NLP", "Computer Vision"],
      },
      {
        name: "Emily Rodriguez",
        role: "VP of Product",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b332c3c8?w=150&h=150&fit=crop&crop=face",
        linkedin: "https://linkedin.com/in/emilyrodriguez",
        expertise: ["Product Strategy", "UX Design", "User Research"],
      },
    ],
    visionHeading: "Our Vision",
    visionBody:
      "A world where hiring decisions are transparent, skill-first, and equally accessible across geographies and backgrounds.",
    aboutCta: {
      label: "Learn More About Us",
      path: "/about-contact-page",
    },
  },

  footer: {
    brand: {
      name: "Fyndr.AI",
      tagline: "Intelligent Hiring Platform",
      description:
        "Revolutionizing hiring with AI-driven, human-centered workflows that improve outcomes for candidates and teams.",
    },
    groups: [
      {
        title: "Product",
        links: [
          { label: "Featured Capabilities", path: "/homepage" },
          { label: "Video Interviews", path: "/video-interview-interface" },
          { label: "AI Job Feed", path: "/ai-powered-job-feed-dashboard" },
          { label: "Workspace", path: "/workspace" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", path: "/about-contact-page" },
          { label: "Contact", path: "/about-contact-page" },
          { label: "Community", path: "/community-hub" },
          { label: "Hackathons", path: "/hackathons-competitions" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Career Coach", path: "/ai-career-coach-chat-interface" },
          { label: "Learning Interface", path: "/course-detail-learning-interface" },
          { label: "Applications", path: "/job-applications" },
          { label: "Resume Builder", path: "/ai-resume-builder" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", path: "/about-contact-page" },
          { label: "Terms", path: "/about-contact-page" },
          { label: "Cookie Policy", path: "/about-contact-page" },
          { label: "Accessibility", path: "/about-contact-page" },
        ],
      },
    ],
    socialLinks: [
      { name: "Twitter", icon: "Twitter", url: "https://twitter.com/fyndrai", color: "hover:text-blue-400" },
      { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/company/fyndrai", color: "hover:text-blue-600" },
      { name: "GitHub", icon: "Github", url: "https://github.com/fyndrai", color: "hover:text-gray-400" },
      { name: "YouTube", icon: "Youtube", url: "https://youtube.com/fyndrai", color: "hover:text-red-500" },
    ],
    complianceText: "SOC 2 Compliant",
    operationalStatus: "All systems operational",
    newsletter: {
      title: "Stay Updated",
      description: "Get updates on AI hiring trends and feature releases.",
      placeholder: "Enter your email",
      buttonLabel: "Subscribe",
      buttonIcon: "Send",
      successMessage: "Thank you for subscribing to our newsletter!",
    },
  },
};
