'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RoleManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Role Management</h1>
          <p className="text-muted-foreground">Manage administrative access levels and system permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Shield className="mr-2 h-4 w-4" /> Audit Logs</Button>
          <Button variant="industrial" size="sm"><UserPlus className="mr-2 h-4 w-4" /> Add Admin User</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-8">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">System Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Super Admin', users: 3, permissions: 'All Access', color: 'bg-red-500' },
                { name: 'Moderator', users: 12, permissions: 'Products, Vendors', color: 'bg-blue-500' },
                { name: 'Support', users: 25, permissions: 'Disputes, Messages', color: 'bg-amber-500' },
                { name: 'Editor', users: 8, permissions: 'CMS, Categories', color: 'bg-emerald-500' },
              ].map((role) => (
                <div key={role.name} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border hover:border-primary transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.color + "/10")}>
                      <Shield className={cn("h-5 w-5", role.color.replace('bg-', 'text-'))} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{role.name}</h3>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{role.users} Users Assigned</div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Permissions</div>
                    <div className="text-xs font-medium">{role.permissions}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-workshop-dark border rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black tracking-tighter uppercase border-b pb-4">Permission Groups</h2>
            <div className="space-y-4">
              {[
                { name: 'User Management', status: 'Active' },
                { name: 'Financial Records', status: 'Restricted' },
                { name: 'System Settings', status: 'Restricted' },
                { name: 'Content Editing', status: 'Active' },
              ].map((group) => (
                <div key={group.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border">
                  <span className="text-sm font-bold">{group.name}</span>
                  <Badge className={cn(
                    "text-[8px] font-bold uppercase tracking-widest",
                    group.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                  )}>
                    {group.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-12 font-bold uppercase tracking-widest">
              Manage All Permissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
