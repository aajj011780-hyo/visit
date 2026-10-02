import React, { useState } from 'react';
import { Send, Loader2, Sparkles, Dices, Smile, Tag, MessageSquareHeart } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { EMOJI_OPTIONS, TAG_OPTIONS, RANDOM_NICKNAMES } from '../constants/appsScriptCode';

interface EntryFormProps {
  onSubmit: (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => Promise<boolean>;
  isSubmitting: boolean;
  isSheetConnected: boolean;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  onSubmit,
  isSubmitting,
  isSheetConnected
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');
  const [selectedTag, setSelectedTag] = useState('#응원해요');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleRandomNickname = () => {
    const random = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    setName(random);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    const success = await onSubmit({
      name: name.trim() || '익명',
      message: message.trim(),
      emoji: selectedEmoji,
      tag: selectedTag
    });

    if (success) {
      setMessage('');
      // Keep name or slightly modify
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden backdrop-blur-sm transition-all">
      {/* Card Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              따뜻한 응원 한마디 남기기
            </h2>
            <p className="text-xs text-slate-500">
              {isSheetConnected ? (
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  연동된 구글 스프레드시트에 즉시 기록됩니다
                </span>
              ) : (
                '체험 모드: 작성된 글은 브라우저에 임시 저장됩니다'
              )}
            </p>
          </div>
        </div>

        {/* Quick Tag pills for visual delight */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>자유롭게 적어주세요!</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {/* Name & Emoji row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Avatar / Emoji Selector */}
          <div className="sm:col-span-4 relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-slate-400" />
              <span>프로필 아이콘</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-11 h-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="아이콘 변경"
              >
                {selectedEmoji}
              </button>
              <div className="text-xs text-slate-500 truncate flex-1">
                아이콘을 눌러 변경해보세요
              </div>
            </div>

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 z-20 p-3 bg-white rounded-xl shadow-xl border border-slate-200 grid grid-cols-4 gap-2 w-56 animate-in fade-in zoom-in-95 duration-150">
                {EMOJI_OPTIONS.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(item.emoji);
                      setShowEmojiPicker(false);
                    }}
                    className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all ${
                      selectedEmoji === item.emoji
                        ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105'
                        : 'hover:bg-slate-100 hover:scale-105'
                    }`}
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name input with randomizer */}
          <div className="sm:col-span-8">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="author-name" className="block text-xs font-semibold text-slate-600">
                작성자 이름 / 닉네임
              </label>
              <button
                type="button"
                onClick={handleRandomNickname}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline active:scale-95 transition-transform"
              >
                <Dices className="w-3 h-3" />
                랜덤 닉네임
              </button>
            </div>
            <input
              id="author-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 행복한 쿼카 (비워두면 익명)"
              maxLength={20}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Tag selection pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>태그 선택</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30 font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="guest-message" className="block text-xs font-semibold text-slate-600">
              응원 한마디 / 메시지 <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[11px] ${
                message.length > 280 ? 'text-amber-600 font-bold' : 'text-slate-400'
              }`}
            >
              {message.length} / 300자
            </span>
          </div>
          <textarea
            id="guest-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="응원의 한마디, 축하 메시지, 방명록 글을 자유롭게 남겨주세요! (Ctrl + Enter로 바로 등록)"
            maxLength={300}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Submit Button & Shortcut hint */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="hidden sm:inline">단축키:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-500 font-mono">
              Ctrl + Enter
            </kbd>
            <span>로 빠른 등록 가능</span>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>구글 시트에 저장 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>응원 등록하기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
