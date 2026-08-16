import React, { useMemo } from 'react';
import { Award, Check, Layers } from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsSectionProps {
  skills: SkillItem[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Group skills by category
  const groupedSkills = useMemo<Record<string, SkillItem[]>>(() => {
    const groups: Record<string, SkillItem[]> = {};
    skills.forEach((s) => {
      const cat = s.category || '通用核心能力';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(s);
    });
    return groups;
  }, [skills]);

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <Award className="w-3.5 h-3.5" />
            能力徽章
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            我的技能與跨領域專長
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            以客觀專長領域與實作工具分類，展示在課業、社團與自主學習中累積的能力
          </p>
        </div>

        {/* Grouped Category Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(groupedSkills).map((category) => {
            const items = groupedSkills[category] || [];
            return (
              <div
                key={category}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100/90 shadow-2xs flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/60">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    {category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2.5 flex-1 items-start">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-700 border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
