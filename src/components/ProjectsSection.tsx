import React, { useState, useMemo } from 'react';
import { Sparkles, Calendar, ArrowUpRight, FolderGit2, Video, ImageIcon } from 'lucide-react';
import { ProjectItem } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('全部');
    projects.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === '全部') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            學習成果
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            我的專案與作品集
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            點擊卡片可展開查看完整的專案背景、遇到的困難、解決策略與反思心得
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">目前尚無此分類的作品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProjects.map((project) => {
              const coverImage =
                project.images && project.images.length > 0
                  ? project.images[0]
                  : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => setActiveProject(project)}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Card Cover Image */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                        {project.category || '作品'}
                      </span>
                    </div>

                    {/* Media Badges */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {project.videoUrl && (
                        <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white shadow-xs" title="包含展示影片">
                          <Video className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {project.images && project.images.length > 1 && (
                        <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white shadow-xs flex items-center gap-1 text-[10px] font-bold" title={`包含 ${project.images.length} 張圖片`}>
                          <ImageIcon className="w-3.5 h-3.5" />
                          {project.images.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.date || '未標示日期'}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2.5 line-clamp-2">
                        {project.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>
                    </div>

                    {/* Footer / Read More Button */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>查看詳細探究歷程</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal for Detailed View */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
