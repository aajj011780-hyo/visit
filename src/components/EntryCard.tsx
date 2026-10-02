import React, { useState } from 'react';
import { Heart, Copy, Check, MessageSquare } from 'lucide-react';
import { GuestbookEntry } from '../types';

interface EntryCardProps {
  entry: GuestbookEntry;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  isLiked,
  onToggleLike,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`[${entry.name}] ${entry.message}`);
      setCopied(true);
      onShowToast('메시지가 복사되었습니다.', 'info');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('복사에 실패했습니다.', 'error');
    }
  };

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case '#응원해요':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '#감사합니다':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '#축하해요':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '#대박기원':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '#화이팅':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const currentLikes = (entry.likes || 0) + (isLiked ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              {entry.emoji || '💬'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{entry.name}</span>
                {entry.tag && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagColor(
                      entry.tag
                    )}`}
                  >
                    {entry.tag}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                {entry.timestamp}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="메시지 복사"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Message body */}
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words py-1">
          {entry.message}
        </p>
      </div>

      {/* Footer reaction row */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>응원 카드</span>
        </span>

        <button
          type="button"
          onClick={() => onToggleLike(entry.id)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            isLiked
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
          title="응원 공감 누르기"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
            }`}
          />
          <span className="font-semibold">{currentLikes}</span>
        </button>
      </div>
    </div>
  );
};
