import React, { useEffect, useMemo, useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const STORAGE_KEY = 'alumniCommunityChats';

const normalizeThreadId = (currentUser, recipient) => {
  const left = String(currentUser?.id || 'current-user');
  const right = String(recipient?.id || recipient?.name || 'unknown');
  return [left, right].sort().join('::');
};

const createSeedMessage = (recipient) => ({
  id: `seed-${Date.now()}`,
  sender: 'system',
  body: `You are now connected with ${recipient?.name || 'this contact'}. Introduce yourself and ask how you can collaborate.`,
  timestamp: new Date().toISOString(),
});

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return '';
  }
};

const CommunityChatPanel = ({ currentUser, activeRecipient, onClose }) => {
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState({});

  const threadId = useMemo(() => {
    if (!activeRecipient) return null;
    return normalizeThreadId(currentUser, activeRecipient);
  }, [activeRecipient, currentUser]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      setThreads(parsed && typeof parsed === 'object' ? parsed : {});
    } catch (error) {
      setThreads({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    } catch (error) {
      // Ignore storage quota issues.
    }
  }, [threads]);

  useEffect(() => {
    if (!threadId || !activeRecipient) return;
    setThreads((prev) => {
      if (Array.isArray(prev[threadId]) && prev[threadId].length > 0) {
        return prev;
      }
      return {
        ...prev,
        [threadId]: [createSeedMessage(activeRecipient)],
      };
    });
  }, [activeRecipient, threadId]);

  if (!activeRecipient || !threadId) {
    return null;
  }

  const messages = threads[threadId] || [];

  const sendMessage = () => {
    const body = input.trim();
    if (!body) return;

    const outbound = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      body,
      timestamp: new Date().toISOString(),
    };

    const autoReply = {
      id: `reply-${Date.now() + 1}`,
      sender: 'them',
      body: `Thanks for reaching out. I saw your message: \"${body.slice(0, 80)}\". Let's continue this thread and coordinate next steps.`,
      timestamp: new Date(Date.now() + 1000).toISOString(),
    };

    setThreads((prev) => {
      const existing = Array.isArray(prev[threadId]) ? prev[threadId] : [];
      return {
        ...prev,
        [threadId]: [...existing, outbound, autoReply],
      };
    });

    setInput('');
  };

  return (
    <div className="glassmorphic rounded-xl border border-border/80 p-4 shadow-elevation-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Direct Message</h3>
          <p className="text-xs text-muted-foreground">Chatting with {activeRecipient.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Icon name="X" size={16} />
        </Button>
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-border/60 bg-background/70 p-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.sender === 'me'
                ? 'bg-primary text-primary-foreground'
                : message.sender === 'system'
                  ? 'bg-muted text-muted-foreground border border-border/60'
                  : 'bg-card border border-border text-foreground'
              }`}
            >
              <p>{message.body}</p>
              <p className={`mt-1 text-[10px] ${message.sender === 'me' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder={`Message ${activeRecipient.name}...`}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button size="sm" onClick={sendMessage}>
          <Icon name="Send" size={14} className="mr-1" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default CommunityChatPanel;
