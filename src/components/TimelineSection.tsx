import React from 'react';
import { History, Milestone, Sparkles, CheckCircle2 } from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  const sortedTimeline = [...timeline].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="timeline" className="py-24 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <History className="w-3.5 h-3.5" />
            歷程軌跡
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            學習重要里程碑
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            記錄從啟蒙探索、專案挑戰到未來目標的每一步積累
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 ml-4 sm:ml-8 space-y-10">
          {sortedTimeline.map((item, index) => {
            const isFuture = item.yearOrPeriod.includes('未來') || item.yearOrPeriod.includes('目標');

            return (
              <div key={item.id} className="relative group">
                
                {/* Node Icon on Timeline Axis */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${
                    isFuture
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isFuture ? (
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>

                {/* Content Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                      <Milestone className="w-3 h-3" />
                      {item.yearOrPeriod}
                    </span>
                    {item.category && (
                      <span className="text-xs font-medium text-slate-400">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
