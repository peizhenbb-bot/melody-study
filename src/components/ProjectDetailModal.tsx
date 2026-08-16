import React, { useEffect, useState } from 'react';
import { X, Calendar, Tag, AlertCircle, HelpCircle, CheckCircle2, Award, Video, ImageIcon } from 'lucide-react';
import { ProjectItem } from '../types';
import { parseGoogleDriveVideoUrl } from '../lib/videoUtils';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const videoParsed = parseGoogleDriveVideoUrl(project.videoUrl || '');

  return (
    <div
      id="project-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="project-detail-container"
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
              {project.category || '專案作品'}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.date || '未標記日期'}
            </span>
          </div>
          <button
            id="close-project-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="關閉作品詳細視窗"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* Title & Summary */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              {project.summary}
            </p>
          </div>

          {/* Project Images (Up to 3) */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>專案圖片成果（共 {project.images.length} 張）</span>
              </div>
              
              {/* Main Image Display */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={project.images[selectedImageIndex] || project.images[0]}
                  alt={`${project.title} 成果照片`}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails if multiple */}
              {project.images.length > 1 && (
                <div className="flex gap-2 pt-1">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="縮圖" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Google Drive Video Embed Section */}
          {project.videoUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Video className="w-4 h-4 text-blue-600" />
                <span>Google Drive 成果展示影片</span>
              </div>
              
              {videoParsed.isValid && videoParsed.embedUrl ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
                  <iframe
                    src={videoParsed.embedUrl}
                    title={`${project.title} 影片`}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">無法辨識 Google Drive 影片網址</p>
                    <p className="text-amber-700 mt-0.5">
                      {videoParsed.errorMessage || '請確認分享連結是否為公開可檢視的 Google Drive 檔案連結。'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 完整作品內容 (Content) */}
          {project.content && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                完整作品內容
              </h3>
              <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100">
                {project.content}
              </p>
            </div>
          )}

          {/* Structured Deep Dive Grid: Challenge, Solution, Reflection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Challenge */}
            <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-100">
              <h4 className="text-sm font-bold text-rose-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-600" />
                製作過程遇到的問題
              </h4>
              <p className="text-sm text-rose-800/90 leading-relaxed whitespace-pre-line">
                {project.challenge || '無特別記錄。'}
              </p>
            </div>

            {/* Solution */}
            <div className="p-5 rounded-xl bg-emerald-50/40 border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                我是如何解決問題
              </h4>
              <p className="text-sm text-emerald-800/90 leading-relaxed whitespace-pre-line">
                {project.solution || '無特別記錄。'}
              </p>
            </div>

          </div>

          {/* Reflection */}
          <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <h4 className="text-base font-bold text-indigo-950 mb-2 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-600" />
              學習心得與反思
            </h4>
            <p className="text-sm text-indigo-900/90 leading-relaxed whitespace-pre-line">
              {project.reflection || '持續保持學習熱情，深化探究能力。'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:scale-98 transition-all cursor-pointer"
          >
            關閉詳細內容
          </button>
        </div>

      </div>
    </div>
  );
};
