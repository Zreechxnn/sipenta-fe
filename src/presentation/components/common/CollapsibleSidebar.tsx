'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { href: '/dokumen', icon: 'fa-file-lines', label: 'Dokumen' },
  { href: '/documents', icon: 'fa-file-alt', label: 'Laporan Kerja', badge: 18 },
  { href: '/chat', icon: 'fa-robot', label: 'AI Assistant' },
  { href: '/users', icon: 'fa-users', label: 'Manajemen Tim' },
  { href: '/settings', icon: 'fa-cog', label: 'Pengaturan' },
];

export const CollapsibleSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-navy)] flex items-center justify-center text-white shrink-0 shadow-sm">
            <i className="fas fa-file-signature text-sm"></i>
          </div>
          <div>
            <h1 className="font-bold text-[var(--color-navy)] leading-tight tracking-tight whitespace-nowrap">
              SIPENTA
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Tenaga Ahli
            </p>
          </div>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'} text-sm`}></i>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center h-10 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[var(--color-navy)] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="w-6 flex justify-center shrink-0">
                <i className={`fas ${item.icon} text-[15px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
              </div>
              
              <div className={`flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ml-3 ${
                isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100'
              }`}>
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200 shrink-0">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
            <span className="text-slate-500 font-bold text-sm">JS</span>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <p className="text-sm font-bold text-slate-800 whitespace-nowrap">Joko Santoso</p>
            <p className="text-xs text-slate-500 whitespace-nowrap">Tenaga Ahli IT</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
