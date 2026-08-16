import React from 'react';
import { ArrowRight, Sparkles, Heart, GraduationCap, MapPin } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeroSectionProps {
  profile: StudentProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const scrollToProjects = () => {
    const el = document.querySelector('#projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-100/60 via-indigo-50/40 to-sky-100/50 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* School & Grade Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.school}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                <MapPin className="w-3 h-3 text-slate-400" />
                {profile.grade}
              </span>
            </div>

            {/* Main Greeting and Name */}
            <div className="mb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-blue-600 uppercase block mb-1">
                HELLO, I'M
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {profile.name}
              </h1>
            </div>

            {/* Bio Quote */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
              「{profile.bio}」
            </p>

            {/* Interests Chips */}
            <div className="mb-9 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                興趣專長：
              </span>
              {profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                id="hero-cta-projects-btn"
                type="button"
                onClick={scrollToProjects}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-sm transition-all cursor-pointer"
              >
                <span>查看我的作品</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-about-btn"
                type="button"
                onClick={scrollToAbout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:scale-98 transition-all cursor-pointer"
              >
                <span>關於我與學習方向</span>
              </button>
            </div>
          </div>

          {/* Profile Photo / Visual Card */}
          <div className="relative flex-shrink-0">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Outer decorative border/glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-sky-400/20 rotate-3 scale-105 filter blur-xs" />
              
              {/* Photo Frame */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl shadow-blue-900/5">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to beautiful student avatar placeholder
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Float badge */}
              <div className="absolute -bottom-3 -right-3 bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  高一學習探索中
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
