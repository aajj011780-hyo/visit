import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Link2, BookOpen, Trash2, Globe } from 'lucide-react';
import { testConnection } from '../services/sheetService';

interface SettingsModalProps {
  isOpen: boolean;
  currentUrl: string;
  onClose: () => void;
  onSaveUrl: (url: string) => void;
  onSwitchToDemo: () => void;
  onOpenGuide: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUrl,
  onClose,
  onSaveUrl,
  onSwitchToDemo,
  onOpenGuide,
  onShowToast
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!urlInput.trim()) {
      setTestResult({ success: false, message: 'Apps Script 웹 앱 URL을 입력해주세요.' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    const res = await testConnection(urlInput.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      onShowToast('구글 스프레드시트 연결에 성공했습니다!', 'success');
    } else {
      onShowToast('연결 실패: 에러 메시지를 확인하세요.', 'error');
    }
  };

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onSwitchToDemo();
      onClose();
      onShowToast('체험용 로컬 모드로 전환되었습니다.', 'info');
      return;
    }
    onSaveUrl(trimmed);
    onClose();
    onShowToast('구글 시트 연동 설정이 저장되었습니다.', 'success');
  };

  const handleClear = () => {
    setUrlInput('');
    setTestResult(null);
    onSwitchToDemo();
    onClose();
    onShowToast('구글 시트 연결이 해제되어 로컬 체험 모드로 전환되었습니다.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                구글 스프레드시트 연동 설정
              </h2>
              <p className="text-xs text-slate-500">
                Google Apps Script로 배포한 Web App URL을 등록하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Google Apps Script 웹 앱 URL</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGuide();
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-normal inline-flex items-center gap-1 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                URL 만드는 법 가이드 보기
              </button>
            </label>
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono transition-all pr-24"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !urlInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>테스트 중</span>
                  </>
                ) : (
                  <span>연결 테스트</span>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ⚠️ 주소 끝이 반드시 <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">/exec</code>로 끝나야 합니다. (배포 권한: '모든 사용자(Anyone)' 필수)
            </p>
          </div>

          {/* Test Result Box */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 animate-in fade-in duration-150 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{testResult.message}</div>
            </div>
          )}

          {/* Current Status Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentUrl ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-amber-400'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {currentUrl ? '구글 스프레드시트 실시간 연동 중' : '체험용 로컬 모드 (Demo Mode)'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentUrl
                    ? '방명록 글이 구글 스프레드시트에 영구 저장됩니다.'
                    : '브라우저 로컬 저장소에서 시뮬레이션 중입니다.'}
                </div>
              </div>
            </div>
            {currentUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                연동 해제
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            취소
          </button>
          <div className="flex items-center gap-2">
            {!currentUrl && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToDemo();
                  onClose();
                }}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium transition-all"
              >
                데모 모드로 체험
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              저장 및 연동 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
