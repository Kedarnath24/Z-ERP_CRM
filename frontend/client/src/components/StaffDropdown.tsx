import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type TeamMember = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
};

type Props = {
  anchorEl: HTMLElement | null;
  items: TeamMember[];
  query?: string;
  visible: boolean;
  maxHeight?: number;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  accent?: 'default' | 'service' | 'sales';
  onSelect: (member: TeamMember) => void;
  onClose: () => void;
};

export default function StaffDropdown({
  anchorEl,
  items,
  query = '',
  visible,
  maxHeight = 200,
  title,
  subtitle,
  emptyMessage,
  accent = 'default',
  onSelect,
  onClose,
}: Props) {
  const [rect, setRect] = useState<ClientRect | DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!anchorEl) return;
    const update = () => setRect(anchorEl.getBoundingClientRect());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorEl]);

  // Click outside to close
  useLayoutEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!visible) return;
      const target = e.target as Node | null;
      if (!containerRef.current) return;
      if (containerRef.current.contains(target)) return;
      if (anchorEl && anchorEl.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [visible, anchorEl, onClose]);

  if (!visible || !rect) return null;

  const filtered = items.filter(m => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (m.name && m.name.toLowerCase().includes(q)) || (m.email && m.email.toLowerCase().includes(q));
  }).slice(0, 8);

  const style: React.CSSProperties = {
    position: 'fixed',
    left: rect.left,
    top: rect.bottom + 6,
    width: rect.width,
    zIndex: 9999,
  };

  const accentStyles = {
    default: 'bg-slate-100 text-slate-700 border-b border-slate-200',
    service: 'bg-purple-50 text-purple-700 border-b border-purple-200',
    sales: 'bg-blue-50 text-blue-700 border-b border-blue-200',
  } as const;

  const accentBadge = {
    default: 'bg-slate-200 text-slate-700',
    service: 'bg-purple-200 text-purple-800',
    sales: 'bg-blue-200 text-blue-800',
  } as const;

  const dropdown = (
    <div ref={containerRef} style={style}>
      <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ maxHeight, overflow: 'auto' }}>
        {title && (
          <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${accentStyles[accent]}`}>
            <div>{title}</div>
            {subtitle && <div className="text-[10px] font-normal opacity-80 normal-case leading-tight">{subtitle}</div>}
          </div>
        )}
        {items.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-500">
            <p className="font-medium">No team members found</p>
            <p className="text-xs mt-1">You can still type a name manually</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-500">{emptyMessage || 'No matching staff found'}</div>
        ) : (
          filtered.map(member => (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelect(member)}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-start gap-3 border-b last:border-b-0 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {(member.name || member.email || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 truncate text-sm">{member.name || 'Unnamed'}</p>
                  {member.role && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${accentBadge[accent]}`}>
                      {member.role}
                    </span>
                  )}
                </div>
                {member.email && (
                  <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                )}
                {member.status && (
                  <p className="text-[10px] text-slate-400 truncate uppercase">Status: {member.status}</p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return createPortal(dropdown, document.body);
}
