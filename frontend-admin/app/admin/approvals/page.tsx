'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

const pendingApprovals = [
  {
    id: 1,
    type: 'booking',
    user: 'Michael Chen',
    room: 'Conference 1',
    date: 'Mar 20, 2024',
    time: '3:00 PM - 4:00 PM',
    attendees: 12,
    requestedAt: '2 hours ago',
    reason: 'New booking request',
  },
  {
    id: 2,
    type: 'booking',
    user: 'Lisa Anderson',
    room: 'Conference 2',
    date: 'Mar 22, 2024',
    time: '11:00 AM - 1:00 PM',
    attendees: 15,
    requestedAt: '30 minutes ago',
    reason: 'Over capacity approval needed',
  },
  {
    id: 3,
    type: 'booking',
    user: 'David Martinez',
    room: 'Boardroom A',
    date: 'Mar 23, 2024',
    time: '10:00 AM - 11:30 AM',
    attendees: 10,
    requestedAt: '15 minutes ago',
    reason: 'Recurring booking request',
  },
];

export default function ApprovalsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve pending booking requests</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Approvals</p>
          <p className="text-2xl font-bold text-foreground mt-1">{pendingApprovals.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Approved This Month</p>
          <p className="text-2xl font-bold text-green-600 mt-1">38</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Rejected This Month</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3</p>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <div className="space-y-4">
        {pendingApprovals.map((approval) => (
          <Card key={approval.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{approval.user}</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Booking Request
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Room</p>
                    <p className="text-sm font-medium text-foreground mt-1">{approval.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Date & Time</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {approval.date}
                      <br />
                      <span className="text-xs text-muted-foreground">{approval.time}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Attendees</p>
                    <p className="text-sm font-medium text-foreground mt-1">{approval.attendees}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Requested</p>
                    <p className="text-sm font-medium text-foreground mt-1">{approval.requestedAt}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Note:</strong> {approval.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {pendingApprovals.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No pending approvals</p>
        </Card>
      )}
    </div>
  );
}
