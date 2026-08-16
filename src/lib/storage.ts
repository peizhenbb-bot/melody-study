import { StudentProfile, ProjectItem, TimelineItem, SkillItem, AuthUser } from '../types';

export const ADMIN_EMAIL = 'peizhenbb@gmail.com';

// 預設示範資料（符合 Prompt 規格）
export const INITIAL_PROFILE: StudentProfile = {
  name: '蔡沛蓁',
  school: '沙崙國際高中',
  grade: '高中一年級',
  bio: '喜歡透過觀察、思考與創作解決生活中的問題',
  interests: ['閱讀', '寫作', '彈鋼琴'],
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  learningDirection: '自主探究、跨領域學習、人工智慧應用與科技人文整合',
  currentLearning: '學習 Python 程式設計基礎、高中物理與自然科學探究、文學創作賞析',
  futureAspirations: '希望在高中階段完成 3 個跨領域專題，並將科技結合人文關懷，打造對社會有幫助的數位工具。',
  email: 'peizhenbb@gmail.com',
  themeColor: '#2563eb', // 藍色主調
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: '我的第一個 AI 專題：校園智慧閱讀推薦系統',
    date: '2026-03',
    category: 'AI與科技',
    summary: '結合自然語言處理與同學們的閱讀心得，打造出能推薦適合高中生好書的智慧助手。',
    content: '在圖書館擔任志工期間，我發現許多同學不知道如何挑選適合自己程度與興趣的書籍。因此我利用課餘時間學習基礎機器學習觀念，蒐集了校內熱門書目與主題標籤，設計了一款簡單的智慧選書互動系統。',
    challenge: '一開始對演算法與模型架構不熟悉，資料標記也非常耗時，且推薦結果有時過於單一。',
    solution: '透過閱讀線上開放課程、向資訊科老師請益，並採用關鍵字關聯性權重調整，最後成功提升推薦準確度。',
    reflection: '這次專題讓我明白「科技是為了解決真實生活問題而存在」，更提升了自己獨立思考與解決問題的勇氣。',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
    order: 1,
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'proj-2',
    title: '機器人挑戰：自主避障巡線車實作',
    date: '2025-11',
    category: '機器人與硬體',
    summary: '使用 Arduino 與超音波感測器，設計並組裝具備循線與智慧避障功能的自走車。',
    content: '參加校內創客社團的年度成果挑戰，我擔任團隊的硬體組裝與程式邏輯整合負責人。從麵包板電路配線、焊接感測器到撰寫 C++ 循線邏輯，完整體驗軟硬體整合的魅力。',
    challenge: '在不同光線條件下，紅外線感測器常常受到環境干擾而誤判黑線位置。',
    solution: '我們加入動態門檻值校正機制，並在車頭增加遮光罩，大幅改善了光源影響。',
    reflection: '學會了團隊分工的重要性，也體會到硬體除錯需要極大的耐心與條理。',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: '',
    order: 2,
    createdAt: Date.now() - 2000000,
  },
  {
    id: 'proj-3',
    title: '我的學習反思：高中一年級的自我探索與閱讀筆記',
    date: '2025-09',
    category: '學習反思',
    summary: '記錄從國中升上高中的心態轉變，整理三十本跨領域書籍的精華心得與個人筆記法。',
    content: '進入高中後課業節奏變快，我開始嘗試「康乃爾筆記法」與「子彈筆記術」，並將每週的閱讀心得寫成短文。這份專題整理了我高一上學期的學習策略、時間管理工具與心態調適歷程。',
    challenge: '如何在繁重課業中維持規律寫作與深度閱讀的習慣。',
    solution: '設定每天睡前 25 分鐘番茄鐘閱讀，並利用心智圖將複雜概念視覺化。',
    reflection: '反思讓我更清楚自己的節奏，寫作也讓思維變得更加清晰敏銳。',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: '',
    order: 3,
    createdAt: Date.now() - 3000000,
  },
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'time-1',
    yearOrPeriod: '2024 年',
    title: '第一次學習程式設計',
    description: '接觸 Scratch 與 Python，完成生平第一個文字冒險小遊戲，開啟對科技的興趣。',
    category: '程式啟蒙',
    order: 1,
  },
  {
    id: 'time-2',
    yearOrPeriod: '2025 年',
    title: 'Robot Competition 機器人挑戰',
    description: '與同學組隊參加校際創客自走車競賽，獲得最佳創意機構獎。',
    category: '競賽獲獎',
    order: 2,
  },
  {
    id: 'time-3',
    yearOrPeriod: '2026 年初',
    title: 'AI Project 智慧閱讀推薦系統',
    description: '結合自然語言處理與圖書館實務，獨立完成第一個 AI 應用專案。',
    category: '專案實作',
    order: 3,
  },
  {
    id: 'time-4',
    yearOrPeriod: '2026 年中',
    title: '完成個人學習歷程網站',
    description: '架設可自主管理的數位學習歷程網站，系統化記錄高中三年累積的成果。',
    category: '作品集發表',
    order: 4,
  },
  {
    id: 'time-5',
    yearOrPeriod: '未來展望',
    title: '下一個學習目標',
    description: '計畫探索自然語言處理在大眾傳播的應用，並參與青年志工科技推廣計畫。',
    category: '未來挑戰',
    order: 5,
  },
];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 'skill-1', name: 'Python 基礎', category: '程式設計', order: 1 },
  { id: 'skill-2', name: 'AI 與機器學習概念', category: '新興科技', order: 2 },
  { id: 'skill-3', name: 'Arduino 與感測器', category: '硬體創客', order: 3 },
  { id: 'skill-4', name: '簡報設計與表達', category: '軟實力', order: 4 },
  { id: 'skill-5', name: '文章寫作與探究反思', category: '人文思考', order: 5 },
  { id: 'skill-6', name: '鋼琴演奏 (八級)', category: '藝術與音樂', order: 6 },
  { id: 'skill-7', name: '閱讀策略與心智圖筆記', category: '自主學習', order: 7 },
  { id: 'skill-8', name: '團隊協作與溝通', category: '軟實力', order: 8 },
];

const STORAGE_KEYS = {
  PROFILE: 'student_portfolio_profile_v1',
  PROJECTS: 'student_portfolio_projects_v1',
  TIMELINE: 'student_portfolio_timeline_v1',
  SKILLS: 'student_portfolio_skills_v1',
  AUTH: 'student_portfolio_auth_user_v1',
};

// 廣播更新事件給同一頁面的組件
function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('student-portfolio-data-updated'));
  }
}

export const StorageService = {
  // 基本資料
  getProfile(): StudentProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PROFILE;
  },

  saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    notifyDataChanged();
  },

  // 作品集
  getProjects(): ProjectItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: ProjectItem, b: ProjectItem) => (a.order || 0) - (b.order || 0));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECTS;
  },

  saveProject(project: ProjectItem): void {
    const list = this.getProjects();
    const existingIndex = list.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      list[existingIndex] = project;
    } else {
      list.push(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    notifyDataChanged();
  },

  deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    notifyDataChanged();
  },

  // 學習歷程
  getTimeline(): TimelineItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: TimelineItem, b: TimelineItem) => (a.order || 0) - (b.order || 0));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_TIMELINE;
  },

  saveTimelineItem(item: TimelineItem): void {
    const list = this.getTimeline();
    const existingIndex = list.findIndex((t) => t.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(list));
    notifyDataChanged();
  },

  deleteTimelineItem(id: string): void {
    const list = this.getTimeline().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(list));
    notifyDataChanged();
  },

  // 技能
  getSkills(): SkillItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: SkillItem, b: SkillItem) => (a.order || 0) - (b.order || 0));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SKILLS;
  },

  saveSkill(skill: SkillItem): void {
    const list = this.getSkills();
    const existingIndex = list.findIndex((s) => s.id === skill.id);
    if (existingIndex >= 0) {
      list[existingIndex] = skill;
    } else {
      list.push(skill);
    }
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(list));
    notifyDataChanged();
  },

  deleteSkill(id: string): void {
    const list = this.getSkills().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(list));
    notifyDataChanged();
  },

  // 還原預設值
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    notifyDataChanged();
  },

  // 驗證使用者
  getAuthUser(): AuthUser | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  },

  setAuthUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
    notifyDataChanged();
  },
};
