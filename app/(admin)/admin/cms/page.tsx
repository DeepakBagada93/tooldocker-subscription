'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit2, 
  Trash2, 
  Eye, 
  Globe, 
  Layout, 
  Image as ImageIcon,
  ChevronRight,
  Save,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CMSEditorPage() {
  const [activeTab, setActiveTab] = React.useState<'pages' | 'banners' | 'navigation'>('pages');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">CMS Content Editor</h1>
          <p className="text-muted-foreground">Manage platform pages, marketing banners, and site navigation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4" /> Revision History</Button>
          <Button variant="industrial" size="sm"><Plus className="mr-2 h-4 w-4" /> Create New Page</Button>
        </div>
      </div>

      {/* CMS Tabs */}
      <div className="flex items-center gap-2 border-b pb-px">
        {[
          { id: 'pages', name: 'Pages', icon: FileText },
          { id: 'banners', name: 'Banners', icon: ImageIcon },
          { id: 'navigation', name: 'Navigation', icon: Layout },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
              {isActive && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
            </button>
          );
        })}
      </div>

      {/* Pages List */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { title: 'Home Page', slug: '/', lastModified: '2024-03-03', status: 'Published' },
            { title: 'About Us', slug: '/about', lastModified: '2024-02-28', status: 'Published' },
            { title: 'Terms of Service', slug: '/terms', lastModified: '2024-01-15', status: 'Draft' },
            { title: 'Privacy Policy', slug: '/privacy', lastModified: '2024-01-15', status: 'Published' },
          ].map((page) => (
            <div key={page.slug} className="bg-white dark:bg-workshop-dark border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold">{page.title}</div>
                    <div className="text-xs text-muted-foreground font-mono">{page.slug}</div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Modified</div>
                    <div className="text-sm font-bold">{new Date(page.lastModified).toLocaleDateString()}</div>
                  </div>
                  <Badge className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    page.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  )}>
                    {page.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm"><Edit2 className="mr-2 h-4 w-4" /> Edit</Button>
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banners Placeholder */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { title: 'Spring Industrial Sale', position: 'Home Hero', status: 'Active' },
            { title: 'New Vendor Spotlight', position: 'Category Sidebar', status: 'Inactive' },
          ].map((banner) => (
            <div key={banner.title} className="bg-white dark:bg-workshop-dark border rounded-3xl overflow-hidden shadow-sm group">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                <ImageIcon className="h-12 w-12 text-slate-300" />
                <div className="absolute top-4 right-4">
                  <Badge className={banner.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}>{banner.status}</Badge>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{banner.title}</h3>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{banner.position}</p>
                  </div>
                  <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                </div>
                <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest">Update Creative</Button>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 p-12 text-muted-foreground hover:border-primary hover:text-primary transition-all bg-white dark:bg-workshop-dark">
            <Plus className="h-10 w-10" />
            <span className="font-bold uppercase tracking-widest">Add New Banner</span>
          </button>
        </div>
      )}
    </div>
  );
}
