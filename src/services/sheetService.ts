import { GuestbookEntry } from '../types';
import { INITIAL_DEMO_ENTRIES } from '../constants/appsScriptCode';

const STORAGE_KEY_URL = 'sheet_guestbook_app_url';
const STORAGE_KEY_LOCAL_ENTRIES = 'sheet_guestbook_local_entries';
const STORAGE_KEY_LIKES = 'sheet_guestbook_liked_ids';

export const DEFAULT_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbyTh_K4yvbDmL7fV9Vyqj9sibzFTT5BYL_RzaTojUEoz6drbqwY-HalsXS74u4QdyLACA/exec';

export function getSavedSheetUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_URL);
    if (saved !== null && saved !== '') {
      return saved;
    }
    // Set user's provided URL as default
    return DEFAULT_SHEET_URL;
  } catch {
    return DEFAULT_SHEET_URL;
  }
}

export function saveSheetUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  } catch (e) {
    console.error('Failed to save URL to localStorage', e);
  }
}

export function getLikedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIKES);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function saveLikedId(id: string): void {
  try {
    const liked = getLikedIds();
    liked.add(id);
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(Array.from(liked)));
  } catch (e) {
    console.error('Failed to save like', e);
  }
}

// Local mock data handlers
export function getLocalEntries(): GuestbookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_ENTRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOCAL_ENTRIES, JSON.stringify(INITIAL_DEMO_ENTRIES));
      return INITIAL_DEMO_ENTRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ENTRIES;
  }
}

export function saveLocalEntry(entry: Omit<GuestbookEntry, 'id' | 'timestamp'>): GuestbookEntry {
  const localList = getLocalEntries();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const newEntry: GuestbookEntry = {
    id: 'local_' + Date.now(),
    timestamp: formattedTime,
    name: entry.name.trim() || '익명',
    message: entry.message.trim(),
    emoji: entry.emoji || '💬',
    tag: entry.tag || '#응원해요',
    likes: 0
  };

  const updated = [newEntry, ...localList];
  try {
    localStorage.setItem(STORAGE_KEY_LOCAL_ENTRIES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save local entry', e);
  }
  return newEntry;
}

/**
 * Test the Google Apps Script Web App URL
 */
export async function testConnection(url: string): Promise<{ success: boolean; message: string; count?: number }> {
  const trimmed = url.trim();
  if (!trimmed) {
    return { success: false, message: 'URL을 입력해주세요.' };
  }
  if (!trimmed.startsWith('https://script.google.com/macros/s/')) {
    return {
      success: false,
      message: '올바른 Google Apps Script 웹 앱 URL 형식이 아닙니다. (https://script.google.com/macros/s/.../exec)'
    };
  }

  try {
    // Add cache-busting timestamp
    const testUrl = `${trimmed}${trimmed.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    const res = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      return {
        success: false,
        message: `HTTP 상태 코드 에러 (${res.status}): 웹 앱 권한이 '모든 사용자(Anyone)'로 배포되었는지 확인하세요.`
      };
    }

    const json = await res.json();
    let count = 0;
    if (Array.isArray(json)) {
      count = json.length;
    } else if (json && Array.isArray(json.data)) {
      count = json.data.length;
    }

    return {
      success: true,
      message: `구글 스프레드시트와 성공적으로 연결되었습니다! (현재 등록 글: ${count}개)`,
      count
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      return {
        success: false,
        message: '연결 실패: CORS 또는 권한 오류입니다. Apps Script [배포] -> [액세스 권한: 모든 사용자]로 설정했는지 확인해주세요.'
      };
    }
    return {
      success: false,
      message: `연결 테스트 중 오류 발생: ${errorMsg}`
    };
  }
}

/**
 * Fetch entries from the Google Apps Script Web App
 */
export async function fetchEntriesFromSheet(url: string): Promise<GuestbookEntry[]> {
  const trimmed = url.trim();
  const fetchUrl = `${trimmed}${trimmed.includes('?') ? '&' : '?'}_t=${Date.now()}`;

  const res = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`스프레드시트 데이터를 불러오지 못했습니다. (코드: ${res.status})`);
  }

  const json = await res.json();
  let rawList: Record<string, unknown>[] = [];

  if (Array.isArray(json)) {
    rawList = json;
  } else if (json && Array.isArray(json.data)) {
    rawList = json.data;
  } else if (json && json.status === 'error') {
    throw new Error(json.message || '시트 스크립트 실행 중 에러가 반환되었습니다.');
  }

  // Format and validate items
  return rawList.map((item, idx) => {
    let timestamp = String(item.timestamp || '');
    if (timestamp.includes('T') && timestamp.includes('Z')) {
      try {
        const d = new Date(timestamp);
        timestamp = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      } catch {
        // keep as is
      }
    }

    return {
      id: String(item.id || `sheet_${idx}_${Date.now()}`),
      name: String(item.name || '익명'),
      message: String(item.message || ''),
      emoji: String(item.emoji || '💬'),
      tag: String(item.tag || '#응원해요'),
      timestamp: timestamp || '방금 전',
      likes: typeof item.likes === 'number' ? item.likes : 0
    };
  });
}

/**
 * Submit an entry to the Google Apps Script Web App
 */
export async function submitEntryToSheet(
  url: string,
  entry: Omit<GuestbookEntry, 'id' | 'timestamp'>
): Promise<GuestbookEntry> {
  const trimmed = url.trim();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const payload = {
    id: 'entry_' + Date.now(),
    name: entry.name.trim() || '익명',
    message: entry.message.trim(),
    emoji: entry.emoji || '💬',
    tag: entry.tag || '#응원해요',
    timestamp: formattedTime
  };

  try {
    // Note: Using text/plain avoids CORS preflight OPTIONS request in Apps Script Web App
    const res = await fetch(trimmed, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      }
    });

    if (res.ok) {
      try {
        const result = await res.json();
        if (result && result.data) {
          return {
            id: result.data.id || payload.id,
            name: result.data.name || payload.name,
            message: result.data.message || payload.message,
            emoji: result.data.emoji || payload.emoji,
            tag: result.data.tag || payload.tag,
            timestamp: result.data.timestamp || payload.timestamp,
            likes: 0
          };
        }
      } catch {
        // Responded ok but body wasn't JSON
      }
    }
    
    // Return payload optimistically
    return {
      ...payload,
      likes: 0
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // If it was a redirect CORS blockage on POST in some browsers, GAS still writes the row!
    // Try sending with no-cors as backup if needed
    console.warn('Standard POST error, falling back or returning optimistic result:', errorMsg);

    try {
      await fetch(trimmed, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      });
      return {
        ...payload,
        likes: 0
      };
    } catch (innerErr) {
      throw new Error('구글 시트에 저장하는 중 오류가 발생했습니다. Apps Script 권한 및 네트워크 연결을 확인해주세요.');
    }
  }
}
