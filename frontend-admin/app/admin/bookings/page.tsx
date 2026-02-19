'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Trash2 } from 'lucide-react';

const bookings = [
  {
    id: 1,
    room: 'Boardroom A',
    user: 'Sarah Johnson',
    date: 'Mar 20, 2024',
    time: '2:00 PM - 3:30 PM',
    status: 'confirmed',
    attendees: 8,
    purpose: 'Team Standup',
  },
  {
    id: 2,
    room: 'Conference 1',
    user: 'Michael Chen',
    date: 'Mar 20, 2024',
    time: '3:00 PM - 4:00 PM',
    status: 'pending_approval',
    attendees: 12,
    purpose: 'Client Presentation',
  },
  {
    id: 3,
    room: 'Meeting Room',
    user: 'Emily Rodriguez',
    date: 'Mar 21, 2024',
    time: '10:00 AM - 11:00 AM',
    status: 'confirmed',
    attendees: 4,
    purpose: 'One-on-one',
  },
  {
    id: 4,
    room: 'Boardroom B',
    user: 'James Wilson',
    date: 'Mar 21, 2024',
    time: '2:00 PM - 3:30 PM',
    status: 'confirmed',
    attendees: 6,
    purpose: 'Budget Review',
  },
  {
    id: 5,
    room: 'Conference 2',
    user: 'Lisa Anderson',
    date: 'Mar 22, 2024',
    time: '11:00 AM - 1:00 PM',
    status: 'cancelled',
    attendees: 15,
    purpose: 'Annual Planning',
  },
  {
    id: 6,
    room: 'Boardroom A',
    user: 'Robert Taylor',
    date: 'Mar 22, 2024',
    time: '1:00 PM - 2:00 PM',
    status: 'confirmed',
    attendees: 5,
    purpose: 'Design Review',
  },
];

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = !filterStatus || booking.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Overview</h1>
        <p className="text-muted-foreground mt-1">View and manage all conference room bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-1">142</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">128</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">8</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cancelled</p>
          <p className="text-2xl font-bold text-red-600 mt-1">6</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by room, user, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['confirmed', 'pending_approval', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? null : status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'confirmed' && 'Confirmed'}
              {status === 'pending_approval' && 'Pending Approval'}
              {status === 'cancelled' && 'Cancelled'}
            </button>
          ))}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Room</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Attendees</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{booking.room}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground">{booking.user}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-xs">{booking.date}</p>
                    <p className="text-muted-foreground text-xs">{booking.time}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-xs">{booking.purpose}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground">{booking.attendees}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending_approval'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {booking.status === 'confirmed' && 'Confirmed'}
                      {booking.status === 'pending_approval' && 'Pending'}
                      {booking.status === 'cancelled' && 'Cancelled'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
