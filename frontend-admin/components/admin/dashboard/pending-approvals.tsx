'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

const pendingApprovals = [
  {
    id: 1,
    type: 'booking_approval',
    user: 'Michael Chen',
    room: 'Conference 1',
    date: 'Today, 3:00 PM',
    attendees: 12,
    reason: 'New booking request',
  },
  {
    id: 2,
    type: 'booking_approval',
    user: 'Lisa Anderson',
    room: 'Conference 2',
    date: 'Mar 21, 11:00 AM',
    attendees: 15,
    reason: 'Over capacity request',
  },
  {
    id: 3,
    type: 'cancellation_request',
    user: 'John Davis',
    room: 'Boardroom A',
    date: 'Tomorrow, 1:00 PM',
    attendees: 8,
    reason: 'Meeting postponed',
  },
];

export function PendingApprovals() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
        <Badge variant="secondary">{pendingApprovals.length}</Badge>
      </div>

      <div className="space-y-4">
        {pendingApprovals.map((approval) => (
          <div
            key={approval.id}
            className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={
                    approval.type === 'booking_approval'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }
                >
                  {approval.type === 'booking_approval' ? 'Booking Request' : 'Cancellation Request'}
                </Badge>
              </div>
              
              <p className="font-semibold text-foreground">{approval.user}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {approval.room} • {approval.attendees} attendees
              </p>
              <p className="text-xs text-muted-foreground mt-1">{approval.date}</p>
              <p className="text-xs text-muted-foreground mt-1 italic">{approval.reason}</p>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {pendingApprovals.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No pending approvals</p>
        </div>
      )}
    </Card>
  );
}
