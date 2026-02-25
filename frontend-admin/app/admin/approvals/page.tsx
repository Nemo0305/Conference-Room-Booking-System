'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { fetchAllBookings, updateBookingStatus, Booking } from '@/lib/api';

export default function ApprovalsPage() {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPending = async () => {
    try {
      const all = await fetchAllBookings();
      setPendingBookings(all.filter(b => b.status === 'pending'));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
    const interval = setInterval(loadPending, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (booking_id: string, status: 'confirmed' | 'rejected') => {
    setActionLoading(booking_id);
    try {
      await updateBookingStatus(booking_id, status);
      setPendingBookings(prev => prev.filter(b => b.booking_id !== booking_id));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve pending booking requests</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Approvals</p>
          <p className="text-2xl font-bold text-foreground mt-1">{pendingBookings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Action Required</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingBookings.length > 0 ? 'Yes' : 'None'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{pendingBookings.length === 0 ? 'All Clear' : 'Needs Review'}</p>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <div className="space-y-4">
        {pendingBookings.map((booking) => (
          <Card key={booking.booking_id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{booking.user_name || booking.uid}</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Booking Request
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Room</p>
                    <p className="text-sm font-medium text-foreground mt-1">{booking.room_name || booking.room_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Date & Time</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {booking.start_date?.slice(0, 10)}
                      <br />
                      <span className="text-xs text-muted-foreground">{booking.start_time} – {booking.end_time}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Location</p>
                    <p className="text-sm font-medium text-foreground mt-1">{booking.location || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Booking ID</p>
                    <p className="text-sm font-medium text-foreground mt-1 font-mono">{booking.booking_id}</p>
                  </div>
                </div>

                {booking.purpose && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Purpose:</strong> {booking.purpose}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1"
                disabled={actionLoading === booking.booking_id}
                onClick={() => handleAction(booking.booking_id, 'confirmed')}
              >
                <CheckCircle2 className="w-4 h-4" />
                {actionLoading === booking.booking_id ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                disabled={actionLoading === booking.booking_id}
                onClick={() => handleAction(booking.booking_id, 'rejected')}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {pendingBookings.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No pending approvals — all caught up! 🎉</p>
        </Card>
      )}
    </div>
  );
}
