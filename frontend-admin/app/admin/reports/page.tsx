'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Filter } from 'lucide-react';
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

const roomPopularity = [
  { room: 'Boardroom A', bookings: 48 },
  { room: 'Boardroom B', bookings: 42 },
  { room: 'Conference 1', bookings: 38 },
  { room: 'Conference 2', bookings: 35 },
  { room: 'Meeting Room', bookings: 28 },
];

export default function ReportsPage() {
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
          <p className="text-2xl font-bold text-foreground mt-1">300</p>
          <p className="text-xs text-green-600 mt-1">+15% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Utilization</p>
          <p className="text-2xl font-bold text-foreground mt-1">74%</p>
          <p className="text-xs text-green-600 mt-1">+8% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cancellation Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">4.2%</p>
          <p className="text-xs text-green-600 mt-1">-1% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold text-foreground mt-1">67</p>
          <p className="text-xs text-green-600 mt-1">+12 from last month</p>
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
                label={({ name, value }) => `${name} (${value}%)`}
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
                  className={`h-full rounded-lg transition-all ${
                    index === 0
                      ? 'bg-blue-500'
                      : index === 1
                      ? 'bg-green-500'
                      : index === 2
                      ? 'bg-purple-500'
                      : 'bg-orange-500'
                  }`}
                  style={{ width: `${(room.bookings / 48) * 100}%` }}
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
