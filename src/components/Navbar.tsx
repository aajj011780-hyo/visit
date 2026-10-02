import React from 'react';
import { Table, Settings, BookOpen, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  sheetUrl: string;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sheetUrl,
  onOpenSettings,
  onOpenGuide
}) => {
  const isConnected = Boolean(sheetUrl.trim());

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                SheetGuestbook
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                구글 시트 DB 방명록
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Google Apps Script 기반 초간단 실시간 게시판
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Badge */}
          <button
            onClick={onOpenSettings}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80'
            }`}
            title={isConnected ? '구글 스프레드시트 연동 중' : '클릭하여 내 구글 시트 연결하기'}
          >
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline">구글 시트</span> 연동 완료
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>체험 모드 (로컬)</span>
              </>
            )}
          </button>

          {/* Guide Button */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>초보자 가이드</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">시트 연동 설정</span>
            <span className="sm:hidden">설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
