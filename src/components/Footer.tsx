import React from 'react';
import { StudentProfile } from '../types';
import { Heart } from 'lucide-react';

interface FooterProps {
  profile: StudentProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div>
            <p className="text-white font-bold text-base tracking-tight">
              {profile.name} · 個人學習歷程網站
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.school} ‧ {profile.grade}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Designed by {profile.name}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              以熱情與專注創作 <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
