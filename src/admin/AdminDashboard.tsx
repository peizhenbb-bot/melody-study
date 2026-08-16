import React, { useState, useEffect, useRef } from 'react';
import {
  StudentProfile,
  ProjectItem,
  TimelineItem,
  SkillItem,
  AuthUser,
} from '../types';
import {
  StorageService,
  ADMIN_EMAIL,
} from '../lib/storage';
import { compressImage } from '../lib/imageUtils';
import { parseGoogleDriveVideoUrl } from '../lib/videoUtils';
import {
  User,
  FolderGit2,
  History,
  Award,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Video,
  ImageIcon,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [inputEmail, setInputEmail] = useState(ADMIN_EMAIL);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'timeline' | 'skills' | 'backup'>('profile');
  
  // Data states
  const [profile, setProfile] = useState<StudentProfile>(StorageService.getProfile());
  const [projects, setProjects] = useState<ProjectItem[]>(StorageService.getProjects());
  const [timeline, setTimeline] = useState<TimelineItem[]>(StorageService.getTimeline());
  const [skills, setSkills] = useState<SkillItem[]>(StorageService.getSkills());

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Project editing/modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  // Timeline editing/modal state
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);

  // Skill editing/modal state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  // Image upload compression feedback
  const [imageCompressing, setImageCompressing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const projectImgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedUser = StorageService.getAuthUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Auto login as admin for smooth development/demo if preferred, or prompt Google login
      // By default let user see login screen with 1-click Google Sign-in as peizhenbb@gmail.com
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auth Handlers
  const handleGoogleSignIn = (emailToUse = ADMIN_EMAIL) => {
    const newUser: AuthUser = {
      email: emailToUse,
      displayName: emailToUse === ADMIN_EMAIL ? '蔡沛蓁 (管理員)' : '訪客使用者',
      isLoggedIn: true,
    };
    StorageService.setAuthUser(newUser);
    setUser(newUser);
    showToast(emailToUse === ADMIN_EMAIL ? '管理員登入成功！' : '已登入，但此帳號無管理權限');
  };

  const handleSignOut = () => {
    StorageService.setAuthUser(null);
    setUser(null);
    showToast('已安全登出後台');
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveProfile(profile);
    showToast('基本資料儲存成功！已同步至公開網站');
  };

  // Avatar Upload with Compression
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageCompressing(true);
    try {
      const res = await compressImage(file, 800, 800, 350);
      if (res.isAcceptable && res.dataUrl) {
        setProfile((prev) => ({ ...prev, avatarUrl: res.dataUrl }));
        showToast(`頭像壓縮成功 (${res.sizeKb} KB)`);
      } else {
        showToast(res.errorMessage || '圖片過大，請選擇較小的圖片', 'error');
      }
    } catch {
      showToast('圖片處理失敗', 'error');
    } finally {
      setImageCompressing(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Project Handlers
  const handleOpenNewProject = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      date: new Date().toISOString().slice(0, 7),
      category: '專案實作',
      summary: '',
      content: '',
      challenge: '',
      solution: '',
      reflection: '',
      images: [],
      videoUrl: '',
      order: projects.length + 1,
      createdAt: Date.now(),
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) {
      showToast('請填寫作品名稱', 'error');
      return;
    }
    StorageService.saveProject(editingProject);
    setProjects(StorageService.getProjects());
    setIsProjectModalOpen(false);
    setEditingProject(null);
    showToast('作品儲存成功！');
  };

  const handleConfirmDeleteProject = () => {
    if (projectToDelete) {
      StorageService.deleteProject(projectToDelete.id);
      setProjects(StorageService.getProjects());
      setProjectToDelete(null);
      showToast('作品已成功刪除');
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    if (editingProject.images.length >= 3) {
      showToast('每個作品最多上傳 3 張圖片', 'error');
      return;
    }

    setImageCompressing(true);
    try {
      const res = await compressImage(file, 1200, 1200, 400);
      if (res.isAcceptable && res.dataUrl) {
        setEditingProject({
          ...editingProject,
          images: [...editingProject.images, res.dataUrl],
        });
        showToast(`作品圖片壓縮完成 (${res.sizeKb} KB)`);
      } else {
        showToast(res.errorMessage || '圖片檔案太大，請選擇較小的圖片。', 'error');
      }
    } catch {
      showToast('圖片處理發生錯誤', 'error');
    } finally {
      setImageCompressing(false);
      if (projectImgInputRef.current) projectImgInputRef.current.value = '';
    }
  };

  const handleRemoveProjectImage = (indexToRemove: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      images: editingProject.images.filter((_, idx) => idx !== indexToRemove),
    });
  };

  // Timeline Handlers
  const handleOpenNewTimeline = () => {
    setEditingTimeline({
      id: `time-${Date.now()}`,
      yearOrPeriod: '2026 年',
      title: '',
      description: '',
      category: '專案實作',
      order: timeline.length + 1,
    });
    setIsTimelineModalOpen(true);
  };

  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeline || !editingTimeline.title.trim()) {
      showToast('請填寫里程碑標題', 'error');
      return;
    }
    StorageService.saveTimelineItem(editingTimeline);
    setTimeline(StorageService.getTimeline());
    setIsTimelineModalOpen(false);
    setEditingTimeline(null);
    showToast('學習歷程里程碑已儲存！');
  };

  const handleDeleteTimeline = (id: string) => {
    StorageService.deleteTimelineItem(id);
    setTimeline(StorageService.getTimeline());
    showToast('里程碑已刪除');
  };

  // Skill Handlers
  const handleOpenNewSkill = () => {
    setEditingSkill({
      id: `skill-${Date.now()}`,
      name: '',
      category: '程式設計',
      order: skills.length + 1,
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) {
      showToast('請填寫技能名稱', 'error');
      return;
    }
    StorageService.saveSkill(editingSkill);
    setSkills(StorageService.getSkills());
    setIsSkillModalOpen(false);
    setEditingSkill(null);
    showToast('技能項目已儲存！');
  };

  const handleDeleteSkill = (id: string) => {
    StorageService.deleteSkill(id);
    setSkills(StorageService.getSkills());
    showToast('技能已刪除');
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const data = {
      profile,
      projects,
      timeline,
      skills,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${profile.name}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已下載完整資料備份檔！');
  };

  const handleResetDefaults = () => {
    if (window.confirm('確定要還原為初始範例資料嗎？這將覆蓋目前的自訂內容。')) {
      StorageService.resetToDefaults();
      setProfile(StorageService.getProfile());
      setProjects(StorageService.getProjects());
      setTimeline(StorageService.getTimeline());
      setSkills(StorageService.getSkills());
      showToast('已還原為預設範例資料');
    }
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // 1. Not Logged In View
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            學生學習歷程管理後台
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            請使用管理員 Google 帳號（<strong className="text-blue-600">{ADMIN_EMAIL}</strong>）登入以編輯網站資料。
          </p>

          <div className="space-y-4">
            {/* Quick 1-Click Google Sign In for Admin */}
            <button
              id="google-signin-admin-btn"
              type="button"
              onClick={() => handleGoogleSignIn(ADMIN_EMAIL)}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>以 {ADMIN_EMAIL} 登入</span>
            </button>

            {/* Alternative custom email input for permission test */}
            <div className="pt-4 border-t border-slate-100 text-left">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                測試其他帳號登入（測試非管理員阻擋機制）：
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="輸入其他 Gmail"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn(inputEmail)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  登入
                </button>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                返回公開網站首頁
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Signed In But NOT Admin View
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-rose-200 p-8 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            沒有管理權限
          </h1>
          <p className="text-sm text-slate-600 mb-2">
            目前登入帳號為：<strong>{user.email}</strong>
          </p>
          <p className="text-sm font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 mb-6">
            此帳號沒有網站管理權限。只有 {ADMIN_EMAIL} 可以編輯資料。
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              切換或登出帳號
            </button>
            <div>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                返回公開首頁
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Main Workspace
  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/10'
                : 'bg-rose-600 text-white border-rose-500 shadow-rose-900/10'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              管
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-none">
                學習歷程管理後台
              </h1>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                已驗證管理員：{user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>在新分頁查看前台</span>
            </a>
            <button
              id="admin-logout-btn"
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>登出</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>基本資料</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>作品管理 ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>學習歷程 ({timeline.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>專長技能 ({skills.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>備份與重設</span>
          </button>
        </div>
      </div>

      {/* Main Form Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: 基本資料 (Profile) */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">個人基本資料設定</h2>
                  <p className="text-xs sm:text-sm text-slate-500">修改前台首頁 Hero 與「關於我」區塊顯示的文字與個人照片</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>儲存變更</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 姓名 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    學生姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：蔡沛蓁"
                  />
                </div>

                {/* 學校與年級 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      學校名稱 *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.school}
                      onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="例如：沙崙國際高中"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      年級 *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.grade}
                      onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="例如：高中一年級"
                    />
                  </div>
                </div>

                {/* 一句自我介紹 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    一句自我介紹 (Hero 大字引言) *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="喜歡透過觀察、思考與創作解決生活中的問題"
                  />
                </div>

                {/* 個人照片上傳 (WebP 壓縮) */}
                <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    個人大頭照 / 形象照片 (支援自動壓縮至 WebP)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-xs flex-shrink-0">
                      <img
                        src={profile.avatarUrl}
                        alt="預覽大頭照"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <input
                        type="file"
                        ref={avatarInputRef}
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-file-input"
                      />
                      <label
                        htmlFor="avatar-file-input"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>選擇新照片並自動壓縮</span>
                      </label>
                      <p className="text-xs text-slate-500">
                        {imageCompressing
                          ? '正在進行瀏覽器端 WebP 壓縮中...'
                          : '自動維持長寬比、轉換為 WebP 格式並控制在 400KB 以下。'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 興趣標籤 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    我的興趣 (用逗號分隔)
                  </label>
                  <input
                    type="text"
                    value={profile.interests.join('、')}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        interests: e.target.value
                          .split(/[,、，]/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="閱讀、寫作、彈鋼琴"
                  />
                  <p className="text-xs text-slate-400 mt-1">例如：閱讀、寫作、彈鋼琴、攝影、程式設計</p>
                </div>

                {/* 學習方向 */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    探索領域與學習方向
                  </label>
                  <textarea
                    rows={3}
                    value={profile.learningDirection}
                    onChange={(e) => setProfile({ ...profile, learningDirection: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="說明你的學習方向與核心理念..."
                  />
                </div>

                {/* 目前正在學習的內容 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    目前正在學習的內容
                  </label>
                  <textarea
                    rows={3}
                    value={profile.currentLearning}
                    onChange={(e) => setProfile({ ...profile, currentLearning: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：Python 程式設計、高中物理探究實作..."
                  />
                </div>

                {/* 未來想挑戰的事情 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    未來想挑戰的事情與目標
                  </label>
                  <textarea
                    rows={3}
                    value={profile.futureAspirations}
                    onChange={(e) => setProfile({ ...profile, futureAspirations: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：參加全國科展、完成跨領域專案..."
                  />
                </div>

              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>儲存所有基本資料</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: 作品管理 (Projects) */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">專案與作品管理</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  可新增、修改、刪除專案，並支援圖片自動壓縮與 Google Drive 影片播放
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>新增作品</span>
              </button>
            </div>

            {/* Projects List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Preview */}
                    <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          無封面照片
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded text-[11px] font-bold text-slate-700">
                        {project.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <span className="text-xs text-slate-400 font-medium block mb-1">
                        {project.date || '無日期'} · 順序 #{project.order}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject({ ...project });
                        setIsProjectModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>編輯內容</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(project)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>刪除</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 學習歷程管理 (Timeline) */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">學習歷程時間軸管理</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  記錄成長歷程中的關鍵事件、比賽獲獎與自我挑戰
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewTimeline}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>新增里程碑</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {timeline.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold whitespace-nowrap">
                      {item.yearOrPeriod}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      {item.category && (
                        <span className="inline-block mt-2 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          分類：{item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTimeline({ ...item });
                        setIsTimelineModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="編輯里程碑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTimeline(item.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="刪除里程碑"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 技能管理 (Skills) */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">專長技能管理</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  以徽章方式呈現客觀技能，不使用無依據的百分比
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenNewSkill}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>新增技能徽章</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {skill.category}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkill({ ...skill });
                        setIsSkillModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 備份與重設 (Backup & Reset) */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">資料備份與安全維護</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                可將您精心輸入的學習歷程資料下載為 JSON 檔案保存，或隨時還原初始設定。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Backup JSON */}
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">下載資料備份 (JSON)</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    匯出包含個人簡介、所有專案、時間軸與專長技能的完整備份檔。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>立即下載 JSON 備份</span>
                </button>
              </div>

              {/* Reset to Defaults */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center mb-4">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">還原初始示範資料</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    若想重新檢視蔡沛蓁的初始範例內容（3個精選專案、歷程與技能），可按此還原。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold shadow-2xs active:scale-98 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>還原為初始示範資料</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL: Project Edit/Add */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingProject.title ? `編輯作品：${editingProject.title}` : '新增學習作品'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    作品名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：我的第一個 AI 專題"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    完成日期
                  </label>
                  <input
                    type="text"
                    value={editingProject.date}
                    onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：2026-03"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    作品分類
                  </label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="例如：AI與科技、自主學習、探究實作"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    顯示順序 (數字愈小愈前)
                  </label>
                  <input
                    type="number"
                    value={editingProject.order}
                    onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* 簡短介紹 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  簡短介紹 (卡片預覽文字) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="用 2-3 句話介紹這個作品的核心亮點..."
                />
              </div>

              {/* 完整作品內容 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  完整作品內容與探究過程
                </label>
                <textarea
                  rows={4}
                  value={editingProject.content}
                  onChange={(e) => setEditingProject({ ...editingProject, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="詳細說明專案動機、研究方法、實作細節與成果..."
                />
              </div>

              {/* 困難與解決策略 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5">
                    製作過程遇到的問題 (Challenge)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 text-sm focus:ring-2 focus:ring-rose-400 font-medium"
                    placeholder="例如：感測器訊號受到環境光線干擾..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                    我是如何解決問題 (Solution)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/30 text-sm focus:ring-2 focus:ring-emerald-400 font-medium"
                    placeholder="例如：加入動態校正演算法並加上遮光罩..."
                  />
                </div>
              </div>

              {/* 學習心得與反思 */}
              <div>
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                  學習心得與反思 (Reflection)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.reflection}
                  onChange={(e) => setEditingProject({ ...editingProject, reflection: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 text-sm focus:ring-2 focus:ring-indigo-400 font-medium"
                  placeholder="說明這次專案帶給你的啟發與未來想延伸的方向..."
                />
              </div>

              {/* 作品圖片上傳 (最多 3 張) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>作品圖片 (最多 3 張，自動 WebP 壓縮)</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    目前 {editingProject.images.length} / 3 張
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {editingProject.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 shadow-2xs group">
                      <img src={imgUrl} alt={`成果圖片 ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveProjectImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity"
                        title="移除此圖片"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {editingProject.images.length < 3 && (
                    <div>
                      <input
                        type="file"
                        ref={projectImgInputRef}
                        accept="image/*"
                        onChange={handleProjectImageUpload}
                        className="hidden"
                        id="project-image-file-input"
                      />
                      <label
                        htmlFor="project-image-file-input"
                        className="w-28 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-[11px] font-bold">新增照片</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Google Drive 影片連結 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Google Drive 影片網址</span>
                </label>
                <input
                  type="text"
                  value={editingProject.videoUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                  placeholder="https://drive.google.com/file/d/FILE_ID/view"
                />
                {editingProject.videoUrl && (
                  <div className="text-xs">
                    {parseGoogleDriveVideoUrl(editingProject.videoUrl).isValid ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        成功解析 Google Drive 影片！前台將自動嵌入播放器
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        無法辨識此網址格式，請確認是否為 Google Drive 共享連結
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs active:scale-98"
                >
                  儲存作品
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              確定要刪除這個作品嗎？
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              作品名稱：「<strong>{projectToDelete.title}</strong>」<br />
              刪除後無法直接復原。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-xs"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Timeline Add/Edit */}
      {isTimelineModalOpen && editingTimeline && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              {editingTimeline.title ? '編輯學習里程碑' : '新增學習里程碑'}
            </h3>
            <form onSubmit={handleSaveTimeline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  時間 / 年份 *
                </label>
                <input
                  type="text"
                  required
                  value={editingTimeline.yearOrPeriod}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, yearOrPeriod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="例如：2026 年 或 未來展望"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  事件標題 *
                </label>
                <input
                  type="text"
                  required
                  value={editingTimeline.title}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="例如：第一次完成 AI 專題"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  分類標籤
                </label>
                <input
                  type="text"
                  value={editingTimeline.category || ''}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="例如：競賽獲獎、專案發表、程式啟蒙"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  說明與收穫
                </label>
                <textarea
                  rows={3}
                  value={editingTimeline.description}
                  onChange={(e) => setEditingTimeline({ ...editingTimeline, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="簡述此事件的過程與心得..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimelineModalOpen(false);
                    setEditingTimeline(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
                >
                  儲存里程碑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Skill Add/Edit */}
      {isSkillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              {editingSkill.name ? '編輯專長技能' : '新增專長技能'}
            </h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  技能名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="例如：Python 程式設計、鋼琴演奏"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  所屬領域分類
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  placeholder="例如：程式設計、新興科技、藝術與音樂、軟實力"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSkillModalOpen(false);
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
                >
                  儲存技能
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
