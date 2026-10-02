import React, { useState, useMemo } from 'react';
import { Search, RotateCw, Filter, MessageSquareDashed, ArrowUpDown } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { EntryCard } from './EntryCard';
import { TAG_OPTIONS } from '../constants/appsScriptCode';

interface EntryGridProps {
  entries: GuestbookEntry[];
  isLoading: boolean;
  onRefresh: () => void;
  likedIds: Set<string>;
  onToggleLike: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const EntryGrid: React.FC<EntryGridProps> = ({
  entries,
  isLoading,
  onRefresh,
  likedIds,
  onToggleLike,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q) ||
          (e.tag && e.tag.toLowerCase().includes(q))
      );
    }

    if (selectedTag !== 'all') {
      result = result.filter((e) => e.tag === selectedTag);
    }

    if (sortOrder === 'asc') {
      result.reverse();
    }

    return result;
  }, [entries, searchQuery, selectedTag, sortOrder]);

  return (
    <div className="space-y-5">
      {/* Control bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름이나 응원 메시지 검색..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter and Sort actions */}
        <div className="flex items-center flex-wrap gap-2 justify-between md:justify-end">
          {/* Tag filter selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">태그 전체</option>
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all cursor-pointer"
            title="정렬 순서 변경"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortOrder === 'desc' ? '최신순' : '오래된순'}</span>
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95"
            title="목록 새로고침"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>

      {/* Counter header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          총 <span className="font-bold text-emerald-700">{filteredEntries.length}</span>개의 응원
          메시지
          {searchQuery && ` ('${searchQuery}' 검색 결과)`}
          {selectedTag !== 'all' && ` [${selectedTag}]`}
        </div>
      </div>

      {/* Grid of Cards or Skeletons */}
      {isLoading && entries.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-4/5" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 text-2xl">
            <MessageSquareDashed className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {searchQuery || selectedTag !== 'all'
              ? '조건에 맞는 응원글이 없습니다'
              : '아직 등록된 응원글이 없습니다'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery || selectedTag !== 'all'
              ? '검색어나 필터 조건을 변경해보세요.'
              : '첫 번째 응원 메시지의 주인공이 되어보세요!'}
          </p>
          {(searchQuery || selectedTag !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isLiked={likedIds.has(entry.id)}
              onToggleLike={onToggleLike}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};
