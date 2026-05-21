import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import PremiumAppShell from "components/layout/PremiumAppShell";
import Button from "components/ui/Button";

const COMMUNITY_SECTIONS = [
  {
    title: "Mentorship Network",
    description: "Connect with mentors, alumni, and peers to grow faster through structured guidance.",
    cta: "Open Mentorship Workflows",
    path: "/workspace",
    icon: "Handshake",
  },
  {
    title: "Resource Library",
    description: "Access role-specific guides, playbooks, and interview resources in one curated stream.",
    cta: "Browse Learning Resources",
    path: "/course-detail-learning-interface",
    icon: "Library",
  },
  {
    title: "Virtual Career Events",
    description: "Attend live sessions, hiring events, and community showcases with recruiter interactions.",
    cta: "View Active Events",
    path: "/hackathons-competitions",
    icon: "CalendarDays",
  },
  {
    title: "Alumni and Referrals",
    description: "Build trusted connections and referral pathways through alumni success communities.",
    cta: "Go to Alumni Network",
    path: "/alumni-network-referrals",
    icon: "Users",
  },
];

const ROOM_PRESETS = [
  {
    id: "seekers-recruiters",
    title: "Job Seekers x Recruiters",
    summary: "Ask role-fit questions, share resume snippets, and get recruiter guidance.",
    participants: ["Priya (Recruiter)", "Nikhil (Job Seeker)", "Sam (Recruiter)"],
  },
  {
    id: "alumni-referrals",
    title: "Alumni Referrals",
    summary: "Discuss open referral slots and prep applications before requesting referrals.",
    participants: ["Sarah (Alumni)", "David (Alumni)", "Maya (Job Seeker)"],
  },
  {
    id: "interview-prep-room",
    title: "Interview Prep Room",
    summary: "Practice mock questions, peer review responses, and share role-specific tips.",
    participants: ["Arjun (Mentor)", "Lina (Candidate)", "Ravi (Candidate)"],
  },
];

const STORAGE_KEY = "communityRoomMessages";

const CommunityHub = () => {
  const navigate = useNavigate();
  const [activeRoomId, setActiveRoomId] = useState(ROOM_PRESETS[0].id);
  const [draftMessage, setDraftMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  });

  const activeRoom = useMemo(
    () => ROOM_PRESETS.find((room) => room.id === activeRoomId) || ROOM_PRESETS[0],
    [activeRoomId]
  );

  const messages = roomMessages[activeRoom.id] || [
    {
      id: "seed",
      sender: "system",
      body: `Welcome to ${activeRoom.title}. Start a conversation with the community.`,
      timestamp: new Date().toISOString(),
    },
  ];

  const persistMessages = (next) => {
    setRoomMessages(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      // Ignore storage issues.
    }
  };

  const sendRoomMessage = () => {
    const body = draftMessage.trim();
    if (!body) return;

    const outgoing = {
      id: `msg-${Date.now()}`,
      sender: "me",
      body,
      timestamp: new Date().toISOString(),
    };

    const autoReply = {
      id: `reply-${Date.now() + 1}`,
      sender: "peer",
      body: "Thanks for posting. A recruiter or alumni member will respond shortly.",
      timestamp: new Date(Date.now() + 900).toISOString(),
    };

    const current = roomMessages[activeRoom.id] || [];
    persistMessages({
      ...roomMessages,
      [activeRoom.id]: [...current, outgoing, autoReply],
    });
    setDraftMessage("");
  };

  return (
    <PremiumAppShell
      badge="Community Suite"
      icon="MessagesSquare"
      title="Community and Growth Hub"
      subtitle="A unified home for mentorship, resources, events, and alumni networks across all platform roles."
      hideFloatingChat
    >
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-1">
          {COMMUNITY_SECTIONS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/90 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary p-2 text-secondary-foreground">
                  <Icon name={item.icon} size={18} />
                </div>
                <h2 className="font-heading text-lg">{item.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              <Link
                to={item.path}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
              >
                {item.cta}
                <Icon name="ArrowRight" size={14} />
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border/90 bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl">Live Community Rooms</h2>
              <p className="text-sm text-muted-foreground">Chat with recruiters, alumni, and peers in role-focused rooms.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/alumni-network-referrals')}
            >
              <Icon name="Users" size={14} className="mr-2" />
              Open Alumni Network
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {ROOM_PRESETS.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveRoomId(room.id)}
                className={`rounded-xl border p-3 text-left transition-all ${room.id === activeRoom.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border/70 bg-background hover:border-primary/40'
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{room.title}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{room.summary}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border/70 bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{activeRoom.title}</p>
                <p className="text-xs text-muted-foreground">{activeRoom.participants.join(' • ')}</p>
              </div>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-border/60 bg-card/70 p-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.sender === 'me'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border border-border/40'
                  }`}>
                    {message.body}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    sendRoomMessage();
                  }
                }}
                placeholder="Write a message to this room..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button size="sm" onClick={sendRoomMessage}>
                <Icon name="Send" size={14} className="mr-1" />
                Send
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PremiumAppShell>
  );
};

export default CommunityHub;
