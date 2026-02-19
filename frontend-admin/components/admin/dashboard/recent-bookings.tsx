'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

const bookings = [
  {
    id: 1,
    room: 'Boardroom A',
    user: 'Sarah Johnson',
    date: 'Today',
    time: '2:00 PM - 3:30 PM',
    status: 'confirmed',
    attendees: 8,
  },
  {
    id: 2,
    room: 'Conference 1',
    user: 'Michael Chen',
    date: 'Today',
    time: '3:00 PM - 4:00 PM',
    status: 'pending_approval',
    attendees: 12,
  },
  {
    id: 3,
    room: 'Meeting Room',
    user: 'Emily Rodriguez',
    date: 'Tomorrow',
    time: '10:00 AM - 11:00 AM',
    status: 'confirmed',
    attendees: 4,
  },
  {
    id: 4,
    room: 'Boardroom B',
    user: 'James Wilson',
    date: 'Tomorrow',
    time: '2:00 PM - 3:30 PM',
    status: 'confirmed',
    attendees: 6,
  },
  {
    id: 5,
    room: 'Conference 2',
    user: 'Lisa Anderson',
    date: 'Mar 21',
    time: '11:00 AM - 1:00 PM',
    status: 'pending_approval',
    attendees: 15,
  },
];

export function RecentBookings() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Room</th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">User</th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Date & Time</th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Attendees</th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3">
                  <p className="font-medium text-foreground">{booking.room}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="text-foreground">{booking.user}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="text-muted-foreground">{booking.date}</p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </td>
                <td className="py-3 px-3">
                  <p className="text-foreground">{booking.attendees}</p>
                </td>
                <td className="py-3 px-3">
                  <Badge
                    className={
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                  </Badge>
                </td>
                <td className="py-3 px-3 text-right">
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
  );
}
