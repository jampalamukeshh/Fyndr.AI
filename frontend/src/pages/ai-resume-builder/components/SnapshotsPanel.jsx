import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const SnapshotsPanel = ({
    snapshots = [],
    loading = false,
    onLoad,
    onRename,
    onDelete,
    onDuplicate,
    onCreateNew,
    selectedId = null,
}) => {
    const [filter, setFilter] = useState('');

    const filtered = (snapshots || []).filter(s =>
        (s.title || '').toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="mt-4 bg-card border border-border rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Previous resumes</h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Icon name="Search" size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-7 pr-2 py-1.5 text-sm bg-background border border-border rounded-md w-44"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <Button size="sm" variant="outline" onClick={onCreateNew} iconName="Plus" iconPosition="left">
                        New
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-xs text-muted-foreground">Loading snapshots…</div>
            ) : filtered.length === 0 ? (
                <div className="text-xs text-muted-foreground">No snapshots yet. Create a new one to get started.</div>
            ) : (
                <ul className="divide-y divide-border" role="list" aria-label="Saved resume snapshots">
                    {filtered.map((s) => (
                        <li
                            key={s.id}
                            className={`py-2 flex items-center justify-between ${String(selectedId) === String(s.id) ? 'bg-primary/5' : ''}`}
                            role="listitem"
                            aria-selected={String(selectedId) === String(s.id)}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Icon name="FileText" size={14} className="text-muted-foreground" />
                                    <span className="font-medium text-sm text-foreground truncate max-w-[16rem]" title={s.title}>{s.title}</span>
                                    {String(selectedId) === String(s.id) && (
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">{new Date(s.updated_at).toLocaleString()}</div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="xs" variant="ghost" onClick={() => onLoad(s)} title="Load">
                                    <Icon name="Upload" size={14} />
                                </Button>
                                <Button size="xs" variant="ghost" onClick={() => onDuplicate(s)} title="Duplicate">
                                    <Icon name="Copy" size={14} />
                                </Button>
                                <Button size="xs" variant="ghost" onClick={() => onRename(s)} title="Rename">
                                    <Icon name="Edit3" size={14} />
                                </Button>
                                <Button size="xs" variant="ghost" onClick={() => onDelete(s)} title="Delete">
                                    <Icon name="Trash2" size={14} />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SnapshotsPanel;
