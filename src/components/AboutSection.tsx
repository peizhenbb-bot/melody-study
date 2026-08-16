import React from 'react';
import { User, Compass, BookOpen, Target, Sparkles, Music, BookMarked, PenTool } from 'lucide-react';
import { StudentProfile } from '../types';

interface AboutSectionProps {
  profile: StudentProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <User className="w-3.5 h-3.5" />
            個人簡介
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            關於我與學習願景
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            記錄我的成長軌跡、熱情所在與對未來的期許
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: 自我介紹 & 核心特質 */}
          <div className="bg-white rounded-2xl p-7 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                自我介紹與理念
              </h3>
              <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                我是{profile.name}，目前就讀於{profile.school}{profile.grade}。
                {profile.bio}。
                在日常學習中，我熱愛保持好奇心，嘗試將不同領域的知識融會貫通，並透過筆記與實作梳理出系統化的思維。
              </p>
            </div>

            {/* Interest Badges with custom icons */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                我的休閒與熱情：
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => {
                  let Icon = BookMarked;
                  if (interest.includes('琴') || interest.includes('音樂')) Icon = Music;
                  if (interest.includes('寫') || interest.includes('作')) Icon = PenTool;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-500" />
                      {interest}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: 學習方向 */}
          <div className="bg-white rounded-2xl p-7 shadow-xs border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              探索領域與學習方向
            </h3>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {profile.learningDirection || '專注於跨領域自主學習、科技探究與人文實踐整合。'}
            </p>
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-xs text-indigo-900">
              <p className="font-semibold mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                探究焦點
              </p>
              以「發現生活問題、運用科學方法、動手實作驗證」為核心，培養終身受用的探究與自學能力。
            </div>
          </div>

          {/* Card 3: 目前正在學習的內容 */}
          <div className="bg-white rounded-2xl p-7 shadow-xs border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              目前正在學習的內容
            </h3>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {profile.currentLearning || '深入學習高中基礎學科，並主動研修資訊科技、實作實驗與批判性閱讀。'}
            </p>
          </div>

          {/* Card 4: 未來想挑戰的事情 */}
          <div className="bg-white rounded-2xl p-7 shadow-xs border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              未來想挑戰的目標
            </h3>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {profile.futureAspirations || '參與校外青年科學競賽、完成完整的跨領域自主學習專案，並持續分享學習心得。'}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
