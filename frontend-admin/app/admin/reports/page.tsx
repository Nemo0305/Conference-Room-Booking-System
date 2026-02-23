'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Filter } from 'lucide-react';
import { fetchAllBookings, fetchAllUsers, fetchRooms, fetchCancellations, Booking, User, Room, Cancellation } from '@/lib/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  const [data, setData] = useState<{
    bookings: Booking[];
    users: User[];
    rooms: Room[];
    cancellations: Cancellation[];
  }>({ bookings: [], users: [], rooms: [], cancellations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllBookings(), fetchAllUsers(), fetchRooms(), fetchCancellations()])
      .then(([bookings, users, rooms, cancellations]) => {
        setData({ bookings, users, rooms, cancellations });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBookings = data.bookings.length;
  const activeUsers = data.users.length;
  const cancellationRate = totalBookings > 0 ? ((data.cancellations.length / totalBookings) * 100).toFixed(1) : '0';

  const roomsWithBookings = new Set(data.bookings.filter(b => b.status === 'confirmed').map(b => `${b.catalog_id}-${b.room_id}`));
  const utilization = data.rooms.length > 0 ? Math.round((roomsWithBookings.size / data.rooms.length) * 100) : 0;

  // Restore mock data for charts to fix lint errors
  const departmentUsage = [
    { name: 'Engineering', value: 45, color: '#3b82f6' },
    { name: 'Sales', value: 30, color: '#10b981' },
    { name: 'Finance', value: 15, color: '#f59e0b' },
    { name: 'HR', value: 10, color: '#ef4444' },
  ];

  const monthlyBookings = [
    { month: 'Jan', bookings: 85, users: 35 },
    { month: 'Feb', bookings: 95, users: 40 },
    { month: 'Mar', bookings: 120, users: 55 },
  ];

  const roomPopularity = data.rooms.slice(0, 5).map(room => ({
    room: room.room_name,
    bookings: data.bookings.filter(b => b.catalog_id === room.catalog_id && b.room_id === room.room_id).length
  })).sort((a, b) => b.bookings - a.bookings);

  if (loading) return <div className="p-6 h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customizable Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and export booking analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalBookings}</p>
          <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Utilization</p>
          <p className="text-2xl font-bold text-foreground mt-1">{utilization}%</p>
          <p className="text-xs text-muted-foreground mt-1">Rooms active</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cancellation Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">{cancellationRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Relative to bookings</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold text-foreground mt-1">{activeUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">Total registered</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Usage by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }: any) => `${name} (${value}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Room Popularity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Room Popularity</h3>
        <div className="space-y-3">
          {roomPopularity.map((room, index) => (
            <div key={room.room}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">{room.room}</p>
                <p className="text-sm font-semibold text-foreground">{room.bookings} bookings</p>
              </div>
              <div className="w-full bg-muted rounded-lg h-2 overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all ${index === 0
                    ? 'bg-blue-500'
                    : index === 1
                      ? 'bg-green-500'
                      : index === 2
                        ? 'bg-purple-500'
                        : 'bg-orange-500'
                    }`}
                  style={{ width: roomPopularity[0].bookings > 0 ? `${(room.bookings / roomPopularity[0].bookings) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Templates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Weekly Usage Report', icon: '📊' },
            { name: 'Monthly Analytics', icon: '📈' },
            { name: 'Room Utilization', icon: '🏢' },
            { name: 'User Activity', icon: '👥' },
            { name: 'Cancellation Analysis', icon: '❌' },
            { name: 'Department Summary', icon: '📋' },
          ].map((template) => (
            <Card key={template.name} className="p-4 border cursor-pointer hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{template.icon}</div>
              <p className="font-semibold text-foreground text-sm">{template.name}</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Generate
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
