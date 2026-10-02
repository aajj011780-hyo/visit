import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { EntryForm } from './components/EntryForm';
import { EntryGrid } from './components/EntryGrid';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/Toast';
import { GuestbookEntry, ToastInfo } from './types';
import {
  getSavedSheetUrl,
  saveSheetUrl,
  getLikedIds,
  saveLikedId,
  getLocalEntries,
  saveLocalEntry,
  fetchEntriesFromSheet,
  submitEntryToSheet
} from './services/sheetService';
import {
  BookOpen,
  Sparkles,
  Link2,
  Table,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [sheetUrl, setSheetUrl] = useState<string>(() => getSavedSheetUrl());
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => getLikedIds());
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Toast helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch entries
  const loadEntries = useCallback(async (targetUrl?: string) => {
    const url = typeof targetUrl === 'string' ? targetUrl : sheetUrl;
    setIsLoading(true);

    if (url && url.trim()) {
      try {
        const fetched = await fetchEntriesFromSheet(url.trim());
        setEntries(fetched);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch from sheet:', errMsg);
        showToast(
          '구글 시트 데이터를 가져오지 못했습니다. 로컬 데이터를 대신 표시합니다.',
          'error',
          '시트 연동 오류'
        );
        // Fallback to local entries
        setEntries(getLocalEntries());
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local demo mode
      setTimeout(() => {
        setEntries(getLocalEntries());
        setIsLoading(false);
      }, 250);
    }
  }, [sheetUrl, showToast]);

  // Load entries on URL change or initial mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Submit new entry
  const handleSubmitEntry = async (
    entryData: Omit<GuestbookEntry, 'id' | 'timestamp'>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (sheetUrl && sheetUrl.trim()) {
        const saved = await submitEntryToSheet(sheetUrl.trim(), entryData);
        setEntries((prev) => [saved, ...prev]);
        showToast('구글 스프레드시트에 방명록이 성공적으로 등록되었습니다!', 'success', '등록 완료');
      } else {
        const saved = saveLocalEntry(entryData);
        setEntries((prev) => [saved, ...prev]);
        showToast('방명록이 등록되었습니다! (로컬 체험 모드)', 'success', '등록 완료');
      }
      return true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      showToast(errMsg, 'error', '등록 실패');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like reaction toggle
  const handleToggleLike = (id: string) => {
    if (likedIds.has(id)) {
      // Already liked
      return;
    }
    saveLikedId(id);
    setLikedIds(new Set([...likedIds, id]));
    showToast('응원 공감을 남겼습니다! ❤️', 'info');
  };

  // URL configuration handlers
  const handleSaveUrl = (newUrl: string) => {
    saveSheetUrl(newUrl);
    setSheetUrl(newUrl);
    loadEntries(newUrl);
  };

  const handleSwitchToDemo = () => {
    saveSheetUrl('');
    setSheetUrl('');
    loadEntries('');
  };

  const isConnected = Boolean(sheetUrl && sheetUrl.trim());

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Bar */}
      <Navbar
        sheetUrl={sheetUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Hero / Intro Banner */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-slate-50/70 border-b border-slate-200/80 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>구글 스프레드시트 100% 무료 서버리스 데이터베이스</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            내 구글 시트와 연결되는{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              실시간 방명록 & 응원 보드
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            복잡한 백엔드 서버나 DB 구축 없이, Google Apps Script Web App API를 통해
            스프레드시트에 실시간으로 글을 저장하고 읽어오는 초경량 웹앱입니다.
          </p>

          {/* Quick Notice Banner if Demo Mode */}
          {!isConnected && (
            <div className="pt-2 max-w-xl mx-auto">
              <div className="bg-white/90 border border-amber-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Table className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      현재 '체험 모드'로 동작 중입니다
                    </div>
                    <div className="text-[11px] text-slate-500">
                      내 구글 시트 URL을 등록하면 실제 스프레드시트에 글이 저장됩니다.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    가이드
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    연동하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="pt-2 max-w-lg mx-auto">
              <div className="bg-emerald-50/90 border border-emerald-200 p-3 rounded-2xl shadow-xs flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">구글 스프레드시트 정상 연동 중</span>
                    <span className="block text-[11px] text-emerald-600 truncate max-w-xs font-mono">
                      {sheetUrl}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-medium transition-colors shrink-0"
                >
                  변경
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Entry Submission Form */}
        <section className="max-w-2xl mx-auto">
          <EntryForm
            onSubmit={handleSubmitEntry}
            isSubmitting={isSubmitting}
            isSheetConnected={isConnected}
          />
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700 max-w-4xl mx-auto text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">구글 시트 즉시 저장</div>
              <div className="text-[11px] text-slate-500">Apps Script Web App POST 연동</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">비용 0원 영구 보관</div>
              <div className="text-[11px] text-slate-500">구글 드라이브 무료 용량 활용</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">반응형 카드 그리드</div>
              <div className="text-[11px] text-slate-500">모바일 / 태블릿 / PC 최적화</div>
            </div>
          </div>
        </section>

        {/* Guestbook List / Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                방명록 & 응원 피드
              </h3>
              <p className="text-xs text-slate-500">
                방문자분들이 남겨주신 따뜻한 메시지 목록입니다.
              </p>
            </div>
          </div>

          <EntryGrid
            entries={entries}
            isLoading={isLoading}
            onRefresh={() => loadEntries()}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onShowToast={showToast}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center gap-4 text-slate-600 font-medium">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            초보자 가이드
          </button>
          <span>•</span>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
          >
            <Link2 className="w-3.5 h-3.5" />
            구글 시트 연동 설정
          </button>
          <span>•</span>
          <a
            href="https://sheets.new"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
          >
            스프레드시트 열기
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-slate-400">
          Google Sheets™ 및 Google Apps Script™ API를 활용한 초간단 웹 방명록 서비스
        </p>
      </footer>

      {/* Modals */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        currentUrl={sheetUrl}
        onClose={() => setIsSettingsOpen(false)}
        onSaveUrl={handleSaveUrl}
        onSwitchToDemo={handleSwitchToDemo}
        onOpenGuide={() => setIsGuideOpen(true)}
        onShowToast={showToast}
      />
    </div>
  );
}
