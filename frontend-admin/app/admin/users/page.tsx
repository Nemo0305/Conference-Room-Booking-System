'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Lock, Unlock } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    department: 'Management',
    status: 'active',
    bookings: 12,
    joinedDate: 'Jan 2023',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'manager',
    department: 'Engineering',
    status: 'active',
    bookings: 24,
    joinedDate: 'Mar 2023',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'user',
    department: 'Sales',
    status: 'active',
    bookings: 18,
    joinedDate: 'May 2023',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'user',
    department: 'HR',
    status: 'active',
    bookings: 8,
    joinedDate: 'Jul 2023',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    role: 'manager',
    department: 'Finance',
    status: 'inactive',
    bookings: 15,
    joinedDate: 'Aug 2023',
  },
  {
    id: 6,
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    role: 'user',
    department: 'Operations',
    status: 'active',
    bookings: 5,
    joinedDate: 'Sep 2023',
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = !filterRole || user.role === filterRole;

    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage users and their permissions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground mt-1">{users.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Managers</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {users.filter((u) => u.role === 'manager').length}
          </p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['admin', 'manager', 'user'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(filterRole === role ? null : role)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterRole === role
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Bookings</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{user.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-xs">{user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-xs">{user.department}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground">{user.bookings}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {user.status === 'active' ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
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
    </div>
  );
}
