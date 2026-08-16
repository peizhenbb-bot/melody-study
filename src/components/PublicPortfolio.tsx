import React, { useState, useEffect } from 'react';
import { StudentProfile, ProjectItem, TimelineItem, SkillItem } from '../types';
import { StorageService } from '../lib/storage';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { TimelineSection } from './TimelineSection';
import { SkillsSection } from './SkillsSection';
import { Footer } from './Footer';

export const PublicPortfolio: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>(StorageService.getProfile());
  const [projects, setProjects] = useState<ProjectItem[]>(StorageService.getProjects());
  const [timeline, setTimeline] = useState<TimelineItem[]>(StorageService.getTimeline());
  const [skills, setSkills] = useState<SkillItem[]>(StorageService.getSkills());

  // Listen to live data updates from admin
  useEffect(() => {
    const handleDataUpdate = () => {
      setProfile(StorageService.getProfile());
      setProjects(StorageService.getProjects());
      setTimeline(StorageService.getTimeline());
      setSkills(StorageService.getSkills());
    };

    window.addEventListener('student-portfolio-data-updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('student-portfolio-data-updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Public Navigation */}
      <Navbar profile={profile} />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <TimelineSection timeline={timeline} />
        <SkillsSection skills={skills} />
      </main>

      {/* Public Footer */}
      <Footer profile={profile} />
    </div>
  );
};
