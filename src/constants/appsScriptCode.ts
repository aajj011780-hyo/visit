export const APPS_SCRIPT_CODE = `/**
 * ==============================================================
 * 구글 스프레드시트 방명록 웹앱 API (Google Apps Script)
 * ==============================================================
 * 
 * [배포 방법]
 * 1. 스프레드시트 상단 메뉴: [확장 프로그램] -> [Apps Script] 클릭
 * 2. 기존 코드를 지우고 이 전체 코드를 붙여넣기 후 저장 (Ctrl+S / Cmd+S)
 * 3. 우측 상단 [배포] 버튼 클릭 -> [새 배포] 선택
 * 4. 톱니바퀴 아이콘 클릭 -> [웹 앱(Web App)] 선택
 * 5. 설정:
 *    - 설명: 방명록 API
 *    - 다음 사용자로 실행: '나(me)'
 *    - 액세스 권한이 있는 사용자: '모든 사용자(Anyone)'  <-- 필수! (로그인 없이 누구나 읽기/쓰기 가능)
 * 6. [배포] 클릭 후 승인 절차 진행 ('고급' -> '안전하지 않은 페이지로 이동' 클릭)
 * 7. 생성된 '웹 앱 URL' (https://script.google.com/macros/s/.../exec) 을 복사하여 앱에 입력!
 */

// 1. 방명록 목록 불러오기 (GET)
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // 데이터가 없거나 헤더만 있는 경우 빈 배열 반환
    if (data.length <= 1) {
      return responseJSON({
        status: 'success',
        count: 0,
        data: []
      });
    }
    
    const headers = data[0].map(h => String(h).trim().toLowerCase());
    const rows = data.slice(1);
    
    const entries = rows.map((row, index) => {
      let item = {};
      headers.forEach((header, colIdx) => {
        item[header] = row[colIdx];
      });
      
      // 필수 속성 기본값 보정
      if (!item.id) item.id = 'row_' + (index + 2);
      if (!item.timestamp) item.timestamp = new Date().toISOString();
      if (!item.name) item.name = '익명';
      if (!item.message) item.message = '';
      if (!item.emoji) item.emoji = '💬';
      if (!item.tag) item.tag = '#응원해요';
      
      return item;
    });
    
    // 최신 등록순으로 정렬 (id 역순)
    entries.reverse();
    
    return responseJSON({
      status: 'success',
      count: entries.length,
      data: entries
    });
  } catch (error) {
    return responseJSON({
      status: 'error',
      message: error.toString()
    });
  }
}

// 2. 새로운 방명록 글 등록하기 (POST)
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 시트가 완전 비어있다면 헤더 행 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id', 'timestamp', 'name', 'message', 'emoji', 'tag']);
    }
    
    let params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }
    
    const id = params.id || 'entry_' + new Date().getTime();
    
    // 한국 시간 기준 타임스탬프 포맷
    const now = new Date();
    const formattedTime = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy.MM.dd HH:mm');
    const timestamp = params.timestamp || formattedTime;
    
    const name = (params.name || '익명').toString().trim();
    const message = (params.message || '').toString().trim();
    const emoji = (params.emoji || '💬').toString();
    const tag = (params.tag || '#응원해요').toString();
    
    // 새 행 추가 (A: id, B: timestamp, C: name, D: message, E: emoji, F: tag)
    sheet.appendRow([id, timestamp, name, message, emoji, tag]);
    
    return responseJSON({
      status: 'success',
      message: '등록되었습니다.',
      data: {
        id: id,
        timestamp: timestamp,
        name: name,
        message: message,
        emoji: emoji,
        tag: tag
      }
    });
  } catch (error) {
    return responseJSON({
      status: 'error',
      message: error.toString()
    });
  }
}

// JSON 응답 생성 헬퍼 함수
function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const INITIAL_DEMO_ENTRIES = [
  {
    id: 'demo-1',
    name: '김개발자',
    message: '구글 스프레드시트가 이렇게 멋진 실시간 데이터베이스가 되다니 신기하네요! 응원합니다 🎉',
    emoji: '🚀',
    tag: '#응원해요',
    timestamp: '2026.10.01 13:20',
    likes: 12
  },
  {
    id: 'demo-2',
    name: '디자인요정',
    message: '색감이 너무 따뜻하고 예뻐요. 방명록 작성도 부드럽고 빠르네요. 앞으로 자주 찾아올게요 💖',
    emoji: '🌸',
    tag: '#대박기원',
    timestamp: '2026.10.01 11:45',
    likes: 8
  },
  {
    id: 'demo-3',
    name: '코딩초보',
    message: '가이드 보고 3분 만에 구글 시트 웹앱 연결 성공했습니다! 초보자도 쉽게 따라할 수 있어 감동이에요.',
    emoji: '💡',
    tag: '#감사합니다',
    timestamp: '2026.10.01 09:15',
    likes: 19
  },
  {
    id: 'demo-4',
    name: '익명의 커피러버',
    message: '오늘 하루도 모두 파이팅하시고 커피 한 잔의 여유를 잊지 마세요 ☕🍀',
    emoji: '☕',
    tag: '#화이팅',
    timestamp: '2026.09.30 21:00',
    likes: 5
  }
];

export const EMOJI_OPTIONS = [
  { emoji: '🌸', label: '벚꽃' },
  { emoji: '🚀', label: '로켓' },
  { emoji: '🍀', label: '네잎클로버' },
  { emoji: '☕', label: '커피' },
  { emoji: '🌟', label: '별' },
  { emoji: '💡', label: '전구' },
  { emoji: '🔥', label: '불꽃' },
  { emoji: '🥑', label: '아보카도' },
  { emoji: '🎈', label: '풍선' },
  { emoji: '🐱', label: '고양이' },
  { emoji: '🐶', label: '강아지' },
  { emoji: '🌻', label: '해바라기' }
];

export const TAG_OPTIONS = [
  '#응원해요',
  '#감사합니다',
  '#축하해요',
  '#대박기원',
  '#화이팅',
  '#자유글'
];

export const RANDOM_NICKNAMES = [
  '행복한 쿼카',
  '열정 넘치는 개발자',
  '빛나는 별빛',
  '달콤한 라떼',
  '구름 위의 산책자',
  '아침 햇살',
  '친절한 이웃',
  '따뜻한 바람',
  '꿈꾸는 고양이',
  '행운의 클로버'
];
