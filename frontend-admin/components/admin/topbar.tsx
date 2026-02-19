'use client';

import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopBar() {
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">Conference Room Booking System</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User className="w-5 h-5 text-foreground" />
        </button>
        
        <Button variant="ghost" size="sm" className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
