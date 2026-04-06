import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../api/config';
import type { SSEEvent } from '../types/api';

const MAX_EVENTS = 100;

type ConnectionStatus = 'connecting' | 'live' | 'reconnecting';

type StatusDotProps = {
  status: ConnectionStatus;
};

function StatusDot({ status }: StatusDotProps) {
  const cfg: Record<ConnectionStatus, { dot: string; label: string }> = {
    live:         { dot: 'bg-positive',           label: 'Live' },
    connecting:   { dot: 'bg-warn animate-pulse', label: 'Connecting' },
    reconnecting: { dot: 'bg-warn animate-pulse', label: 'Reconnecting' },
  };
  const { dot, label } = cfg[status];
  return (
    <span className="flex items-center gap-1.5 text-xs text-subtle">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

type EventRowProps = {
  event: SSEEvent;
};

const TYPE_COLORS: Record<string, string> = {
  trade:     'text-accent',
  fill:      'text-positive',
  connected: 'text-warn',
  error:     'text-negative',
};

function EventRow({ event }: EventRowProps) {
  const ts = event._ts ?? Date.now();
  const time = new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const typeColor = TYPE_COLORS[event.type] ?? 'text-subtle';

  return (
    <div className="flex gap-2 px-2 py-1 rounded hover:bg-overlay text-xs font-mono">
      <span className="text-muted shrink-0 w-20">{time}</span>
      <span className={`shrink-0 w-20 ${typeColor}`}>{event.type}</span>
      <span className="text-white/70 truncate flex-1 min-w-0">
        {JSON.stringify(event).replace(/^{|}$/g, '').slice(0, 140)}
      </span>
    </div>
  );
}

type SSEFeedProps = {
  onEvent?: (event: SSEEvent) => void;
};

export default function SSEFeed({ onEvent }: SSEFeedProps) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  const handleEvent = useCallback(
    (event: SSEEvent) => {
      if (event.type === 'ping') return;
      setEvents(prev => [{ ...event, _ts: Date.now() }, ...prev.slice(0, MAX_EVENTS - 1)]);
      onEvent?.(event);
    },
    [onEvent],
  );

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/forward-tests/stream`);

    es.onopen = () => setStatus('live');

    es.onmessage = (e: MessageEvent<string>) => {
      try {
        handleEvent(JSON.parse(e.data) as SSEEvent);
      } catch {
        // ignore malformed frames
      }
    };

    es.addEventListener('connected', (e: Event) => {
      try {
        const raw = (e as MessageEvent<string>).data;
        handleEvent({ type: 'connected', ...(JSON.parse(raw) as object) });
      } catch { /* ignore */ }
      setStatus('live');
    });

    es.onerror = () => setStatus('reconnecting');

    return () => es.close();
  }, [handleEvent]);

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider shrink-0">
        <h3 className="text-sm font-semibold text-white">Live Event Feed</h3>
        <StatusDot status={status} />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {events.length === 0 ? (
          <p className="text-muted text-xs text-center py-8">Waiting for events…</p>
        ) : (
          events.map((evt, i) => <EventRow key={i} event={evt} />)
        )}
      </div>
    </div>
  );
}
