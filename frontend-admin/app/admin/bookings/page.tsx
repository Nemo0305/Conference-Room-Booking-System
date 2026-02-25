'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Trash2 } from 'lucide-react';
import { fetchAllBookings, cancelBooking, Booking, getAdminUser } from '@/lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadBookings = async () => {
    try {
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string, currentStatus: string) => {
    if (currentStatus === 'cancelled' || currentStatus === 'rejected') {
      alert('This booking is already cancelled or rejected.');
      return;
    }
    const adminUser = getAdminUser();
    if (!adminUser) return;

    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id, adminUser.uid, 'Cancelled by Admin');
      setBookings(prev => prev.map(b => b.booking_id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || (b.room_name || '').toLowerCase().includes(q) || (b.user_name || '').toLowerCase().includes(q) || b.purpose.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
          <p className="text-muted-foreground mt-1">View and manage all conference room bookings</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalBookings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{confirmedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cancelled/Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{cancelledCount}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by room, user, or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'confirmed', 'pending', 'rejected', 'cancelled'].map(s => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Booking ID</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Room</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">User</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Time</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Purpose</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.booking_id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-mono text-foreground">{b.booking_id}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-foreground">{b.room_name || b.room_id}</p>
                    <p className="text-xs text-muted-foreground">{b.location}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{b.user_name || b.uid}</p>
                    <p className="text-xs text-muted-foreground">{b.email}</p>
                  </td>
                  <td className="p-4 text-sm text-foreground">{b.start_date?.slice(0, 10)}</td>
                  <td className="p-4 text-sm text-foreground">{b.start_time} – {b.end_time}</td>
                  <td className="p-4 text-sm text-foreground max-w-[200px] truncate">{b.purpose}</td>
                  <td className="p-4">
                    <Badge className={getStatusBadge(b.status)}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(b.booking_id, b.status)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
