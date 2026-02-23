"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Building2,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  BarChart3,
} from 'lucide-react';
import { fetchAllBookings } from '@/lib/api';

const navigationItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutGrid },
  { label: 'Rooms', href: '/admin/rooms', icon: Building2 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Approvals', href: '/admin/approvals', icon: CheckCircle },
  { label: 'Cancellations', href: '/admin/cancellations', icon: XCircle },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    fetchAllBookings()
      .then(bookings => {
        const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
        setActiveCount(confirmedCount);
      })
      .catch(console.error);
  }, []);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          BookRooms
        </h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-lg p-3">
          <p className="text-xs text-sidebar-foreground font-semibold mb-1">
            Confirmed Bookings
          </p>
          <p className="text-2xl font-bold text-sidebar-foreground">{activeCount}</p>
          <p className="text-xs text-sidebar-foreground/60">Total active</p>
        </div>
      </div>
    </aside>
  );
}
