'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchCancellations, Cancellation } from '@/lib/api';

export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCancellations()
      .then(setCancellations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cancellation Records</h1>
        <p className="text-muted-foreground mt-1">View all booking cancellation records</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Cancellations</p>
          <p className="text-2xl font-bold text-foreground mt-1">{cancellations.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="text-2xl font-bold text-foreground mt-1">{cancellations.length === 0 ? 'No cancellations' : 'Records available'}</p>
        </Card>
      </div>

      {/* Cancellation Records */}
      {cancellations.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Booking ID</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Room</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Reason</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Cancelled At</th>
                </tr>
              </thead>
              <tbody>
                {cancellations.map(c => (
                  <tr key={c.cancellation_id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm font-mono text-foreground">{c.cancellation_id}</td>
                    <td className="p-4 text-sm font-mono text-foreground">{c.booking_id}</td>
                    <td className="p-4 text-sm text-foreground">{c.user_name || c.uid}</td>
                    <td className="p-4 text-sm text-foreground">{c.room_name || '—'}</td>
                    <td className="p-4 text-sm text-foreground max-w-[250px]">{c.reason || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {c.cancelled_at ? new Date(c.cancelled_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No cancellation records yet</p>
        </Card>
      )}
    </div>
  );
}
