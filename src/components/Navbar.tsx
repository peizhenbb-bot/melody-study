import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  profile: StudentProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '關於我', href: '#about' },
    { name: '我的作品', href: '#projects' },
    { name: '學習歷程', href: '#timeline' },
    { name: '專長技能', href: '#skills' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-100 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Student Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-800 tracking-tight block group-hover:text-blue-600 transition-colors">
              {profile.name}
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-normal block">
              {profile.school}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, '#projects')}
            className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs hover:shadow-sm transition-all"
          >
            探索成果
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="打開導覽選單"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, '#projects')}
              className="mt-2 w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
            >
              探索成果
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
