'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, CalendarCheck, AlertCircle } from 'lucide-react';

const bookingTrend = [
  { name: 'Mon', bookings: 12, cancelled: 2 },
  { name: 'Tue', bookings: 19, cancelled: 1 },
  { name: 'Wed', bookings: 15, cancelled: 3 },
  { name: 'Thu', bookings: 22, cancelled: 2 },
  { name: 'Fri', bookings: 28, cancelled: 4 },
  { name: 'Sat', bookings: 8, cancelled: 1 },
  { name: 'Sun', bookings: 5, cancelled: 0 },
];

const roomUtilization = [
  { room: 'Boardroom A', utilization: 85 },
  { room: 'Boardroom B', utilization: 72 },
  { room: 'Conference 1', utilization: 68 },
  { room: 'Conference 2', utilization: 91 },
  { room: 'Meeting Room', utilization: 55 },
];

const metrics = [
  {
    label: 'Total Bookings',
    value: '142',
    change: '+12%',
    icon: CalendarCheck,
    color: 'text-blue-500',
  },
  {
    label: 'Active Users',
    value: '67',
    change: '+5%',
    icon: Users,
    color: 'text-green-500',
  },
  {
    label: 'Avg. Utilization',
    value: '74%',
    change: '+8%',
    icon: TrendingUp,
    color: 'text-purple-500',
  },
  {
    label: 'Pending Approvals',
    value: '8',
    change: '-2%',
    icon: AlertCircle,
    color: 'text-orange-500',
  },
];

export function DashboardAnalytics() {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-1">{metric.change} from last week</p>
                </div>
                <Icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Booking Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Room Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="room" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="utilization"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
