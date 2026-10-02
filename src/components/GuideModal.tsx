import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, AlertTriangle, BookOpen, Code2, HelpCircle, Sparkles } from 'lucide-react';
import { APPS_SCRIPT_CODE } from '../constants/appsScriptCode';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'code' | 'faq'>('tutorial');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      onShowToast('Apps Script 코드가 클립보드에 복사되었습니다!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('코드 복사에 실패했습니다. 직접 복사해주세요.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                구글 시트 연동 초보자 가이드
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">3분 완성</span>
              </h2>
              <p className="text-xs text-slate-500">
                구글 스프레드시트를 무료 데이터베이스(DB)로 연결하는 가장 쉬운 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/70 text-sm">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`flex items-center gap-2 py-3 px-4 font-medium border-b-2 transition-all ${
              activeTab === 'tutorial'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            단계별 따라하기 (5단계)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-3 px-4 font-medium border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Apps Script 코드 복사
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 py-3 px-4 font-medium border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            자주 묻는 질문 & 주의사항
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'tutorial' && (
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    새 구글 스프레드시트 만들기
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-normal"
                    >
                      (sheets.new 바로가기 <ExternalLink className="w-3 h-3" />)
                    </a>
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    구글 드라이브에서 새 스프레드시트를 만듭니다. 스프레드시트 제목은 아무거나 괜찮습니다 (예: <span className="font-medium text-slate-800">"내 방명록 DB"</span>).
                  </p>
                  <div className="mt-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-100/90 px-3 py-1.5 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        시트 1행(헤더) 권장 구조
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText("id\ttimestamp\tname\tmessage\temoji\ttag");
                          onShowToast('스프레드시트에 붙여넣을 헤더 텍스트가 복사되었습니다!', 'success');
                        }}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        헤더 탭 복사 (시트 A1에 바로 붙여넣기)
                      </button>
                    </div>
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono">
                            <th className="p-2 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                            <th className="p-2 border-r border-slate-200 font-bold text-emerald-700">A열 (id)</th>
                            <th className="p-2 border-r border-slate-200 font-bold text-emerald-700">B열 (timestamp)</th>
                            <th className="p-2 border-r border-slate-200 font-bold text-emerald-700">C열 (name)</th>
                            <th className="p-2 border-r border-slate-200 font-bold text-emerald-700">D열 (message)</th>
                            <th className="p-2 border-r border-slate-200 font-bold text-emerald-700">E열 (emoji)</th>
                            <th className="p-2 font-bold text-emerald-700">F열 (tag)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                          <tr className="bg-emerald-50/40 font-mono text-[11px] font-semibold text-emerald-900">
                            <td className="p-2 border-r border-slate-200 text-center text-slate-400 bg-slate-50 font-bold">1</td>
                            <td className="p-2 border-r border-slate-200">id</td>
                            <td className="p-2 border-r border-slate-200">timestamp</td>
                            <td className="p-2 border-r border-slate-200">name</td>
                            <td className="p-2 border-r border-slate-200">message</td>
                            <td className="p-2 border-r border-slate-200 text-center">emoji</td>
                            <td className="p-2">tag</td>
                          </tr>
                          <tr className="text-[11px] text-slate-500">
                            <td className="p-2 border-r border-slate-200 text-center text-slate-400 bg-slate-50">설명</td>
                            <td className="p-2 border-r border-slate-200">글 고유 식별자</td>
                            <td className="p-2 border-r border-slate-200">작성 일시</td>
                            <td className="p-2 border-r border-slate-200">작성자 닉네임</td>
                            <td className="p-2 border-r border-slate-200">응원 메시지 본문</td>
                            <td className="p-2 border-r border-slate-200 text-center">프로필 이모지</td>
                            <td className="p-2">분류 태그</td>
                          </tr>
                          <tr className="text-[11px] text-slate-600 bg-slate-50/30">
                            <td className="p-2 border-r border-slate-200 text-center text-slate-400 bg-slate-50">예시</td>
                            <td className="p-2 border-r border-slate-200 font-mono text-[10px]">entry_17277648</td>
                            <td className="p-2 border-r border-slate-200 font-mono text-[10px]">2026.10.01 14:30</td>
                            <td className="p-2 border-r border-slate-200 font-medium">행복한 쿼카</td>
                            <td className="p-2 border-r border-slate-200 truncate max-w-[150px]">오늘 하루도 힘내세요!</td>
                            <td className="p-2 border-r border-slate-200 text-center text-base">🌸</td>
                            <td className="p-2 font-medium text-emerald-700">#응원해요</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>💡 <strong>팁:</strong> 비워두셔도 첫 글 작성 시 위 헤더가 자동 생성됩니다.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Apps Script 편집기 열기
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    스프레드시트 상단 메뉴에서 <span className="font-semibold text-slate-800">[확장 프로그램]</span> → <span className="font-semibold text-slate-800">[Apps Script]</span>를 클릭합니다. 새 탭으로 편집 창이 열립니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      API 스크립트 코드 붙여넣기 및 저장
                    </h3>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? '복사 완료!' : '코드 원클릭 복사'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    기존 <code className="text-xs bg-slate-200 px-1 py-0.5 rounded">myFunction()</code> 코드를 모두 지우고, 상단 복사 버튼으로 복사한 스크립트를 붙여넣은 뒤 <span className="font-medium text-slate-800">Ctrl + S (Mac: Cmd + S)</span>를 눌러 저장합니다.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/30">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    웹 앱으로 배포하기
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">★ 중요 포인트</span>
                  </h3>
                  <div className="text-sm text-slate-700 mt-2 space-y-2">
                    <p>
                      1) Apps Script 우측 상단 <span className="font-bold text-slate-900">[배포]</span> 버튼 클릭 → <span className="font-bold text-slate-900">[새 배포]</span> 선택
                    </p>
                    <p>
                      2) 유형 선택에서 톱니바퀴 아이콘 ⚙️ 클릭 → <span className="font-bold text-slate-900">[웹 앱]</span> 선택
                    </p>
                    <p>
                      3) 설정값 입력:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                      <li><strong>설명</strong>: 방명록 API</li>
                      <li><strong>다음 사용자로 실행</strong>: <span className="text-emerald-700 font-semibold">나(내 계정 이메일)</span></li>
                      <li>
                        <strong className="text-rose-600">액세스 권한이 있는 사용자</strong>:{' '}
                        <span className="bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">모든 사용자 (Anyone)</span>
                        <span className="block text-slate-500 mt-0.5">※ '나만' 또는 '조직 구성원'으로 하면 방문자의 글 읽기/쓰기가 차단됩니다.</span>
                      </li>
                    </ul>
                    <p>
                      4) <span className="font-bold text-slate-900">[배포]</span> 버튼 클릭 후 권한 승인 창이 뜨면 계정 선택 → <span className="text-slate-800">[고급]</span> → <span className="text-slate-800">[안전하지 않은 페이지로 이동]</span> → <span className="text-emerald-700 font-semibold">[허용]</span>을 순서대로 누릅니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    웹 앱 URL 복사해서 본 웹앱에 연결하기
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    배포 완료 창에 표시된 <code className="text-xs bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">https://script.google.com/macros/s/.../exec</code> 형태의 URL을 복사하여 아래 설정창에 입력하면 연동 끝!
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSettings();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>지금 구글 시트 URL 입력하러 가기</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Code.gs</span> 에 들어갈 Google Apps Script 전체 코드입니다.
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '복사 완료!' : '전체 코드 복사'}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 max-h-[500px] overflow-y-auto">
                <pre className="p-4 leading-relaxed">
                  <code>{APPS_SCRIPT_CODE}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Q. '권한 승인' 창에서 위험하다는 경고 화면이 떠요!
                </h4>
                <p className="mt-1.5 text-slate-600 text-xs leading-relaxed">
                  직접 작성한 개인 스크립트이므로 구글 심사를 거치지 않아 나타나는 표준 안내입니다. 당황하지 마시고 하단의 <strong className="text-slate-800">[고급]</strong>(Advanced) 링크를 누른 뒤 맨 아래 <strong className="text-slate-800">[제목 없는 프로젝트로 이동(안전하지 않음)]</strong>을 클릭하여 승인하시면 안전하게 실행됩니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Q. 코드를 수정한 후 웹앱에 반영이 안 됩니다.
                </h4>
                <p className="mt-1.5 text-slate-600 text-xs leading-relaxed">
                  Google Apps Script는 코드를 수정한 뒤 반드시 <strong className="text-slate-800">[배포 관리]</strong>에서 새 버전을 배포하거나, <strong className="text-slate-800">[새 배포]</strong>를 진행해야 웹에 반영됩니다. 단순 코드 저장은 웹앱에 즉시 반영되지 않습니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Q. 무료 사용량 제한이 있나요?
                </h4>
                <p className="mt-1.5 text-slate-600 text-xs leading-relaxed">
                  일반 무료 구글 계정 기준으로 하루 수만 건의 읽기/쓰기 호출이 무료로 제공됩니다. 개인 블로그 방명록, 동호회 게시판, 이벤트 응원벽 용도로는 차고 넘칠 정도로 넉넉합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emerald-600" />
                  Q. 시트 데이터는 언제든 엑셀이나 CSV로 다운로드할 수 있나요?
                </h4>
                <p className="mt-1.5 text-slate-600 text-xs leading-relaxed">
                  네! 구글 스프레드시트 파일 메뉴에서 언제든 엑셀(.xlsx) 또는 CSV 파일로 백업할 수 있으며, 구글 시트 모바일 앱으로도 실시간 작성 내역을 확인하거나 수정할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            도움이 더 필요하신가요? 앱 우측 상단 '시트 설정'에서 언제든 URL을 변경할 수 있습니다.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
