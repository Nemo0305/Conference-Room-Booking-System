'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

const cancellationRequests = [
  {
    id: 1,
    user: 'John Davis',
    room: 'Boardroom A',
    date: 'Mar 21, 2024',
    time: '1:00 PM - 2:00 PM',
    attendees: 8,
    requestedAt: '1 hour ago',
    reason: 'Meeting postponed',
    originalBookingDate: 'Mar 20, 2024',
  },
  {
    id: 2,
    user: 'Sarah Williams',
    room: 'Meeting Room',
    date: 'Mar 22, 2024',
    time: '3:00 PM - 4:00 PM',
    attendees: 4,
    requestedAt: '30 minutes ago',
    reason: 'Unexpected conflict',
    originalBookingDate: 'Mar 19, 2024',
  },
  {
    id: 3,
    user: 'Tom Bradley',
    room: 'Conference 1',
    date: 'Mar 23, 2024',
    time: '2:00 PM - 3:30 PM',
    attendees: 14,
    requestedAt: '10 minutes ago',
    reason: 'Client cancelled the meeting',
    originalBookingDate: 'Mar 18, 2024',
  },
];

export default function CancellationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cancellation Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve booking cancellation requests</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Requests</p>
          <p className="text-2xl font-bold text-foreground mt-1">{cancellationRequests.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Approved This Month</p>
          <p className="text-2xl font-bold text-green-600 mt-1">8</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Declined This Month</p>
          <p className="text-2xl font-bold text-red-600 mt-1">1</p>
        </Card>
      </div>

      {/* Cancellation Requests List */}
      <div className="space-y-4">
        {cancellationRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{request.user}</h3>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Cancellation Request
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Room</p>
                    <p className="text-sm font-medium text-foreground mt-1">{request.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Scheduled For</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {request.date}
                      <br />
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Attendees</p>
                    <p className="text-sm font-medium text-foreground mt-1">{request.attendees}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Requested</p>
                    <p className="text-sm font-medium text-foreground mt-1">{request.requestedAt}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-foreground">
                    <strong>Cancellation Reason:</strong> {request.reason}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Originally booked on {request.originalBookingDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Cancellation
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
              >
                <XCircle className="w-4 h-4" />
                Deny
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

      {cancellationRequests.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No pending cancellation requests</p>
        </Card>
      )}
    </div>
  );
}
