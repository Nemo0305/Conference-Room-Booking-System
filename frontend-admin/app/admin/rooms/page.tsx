'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const rooms = [
  {
    id: 1,
    name: 'Boardroom A',
    floor: '2nd Floor',
    capacity: 12,
    amenities: ['Whiteboard', 'Projector', 'Video Call', 'WiFi'],
    status: 'active',
    bookingsThisMonth: 28,
  },
  {
    id: 2,
    name: 'Boardroom B',
    floor: '2nd Floor',
    capacity: 10,
    amenities: ['Projector', 'Video Call', 'WiFi'],
    status: 'active',
    bookingsThisMonth: 24,
  },
  {
    id: 3,
    name: 'Conference 1',
    floor: '3rd Floor',
    capacity: 20,
    amenities: ['Whiteboard', 'Projector', 'Video Call', 'WiFi', 'AV System'],
    status: 'active',
    bookingsThisMonth: 18,
  },
  {
    id: 4,
    name: 'Conference 2',
    floor: '3rd Floor',
    capacity: 20,
    amenities: ['Whiteboard', 'Projector', 'Video Call', 'WiFi', 'AV System'],
    status: 'maintenance',
    bookingsThisMonth: 15,
  },
  {
    id: 5,
    name: 'Meeting Room',
    floor: '1st Floor',
    capacity: 6,
    amenities: ['Whiteboard', 'WiFi'],
    status: 'active',
    bookingsThisMonth: 32,
  },
];

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<typeof rooms[0] | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage conference rooms and their amenities</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Rooms</p>
          <p className="text-2xl font-bold text-foreground mt-1">5</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Rooms</p>
          <p className="text-2xl font-bold text-foreground mt-1">4</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Under Maintenance</p>
          <p className="text-2xl font-bold text-foreground mt-1">1</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg Capacity</p>
          <p className="text-2xl font-bold text-foreground mt-1">14</p>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground">{room.floor}</p>
              </div>
              <Badge
                className={
                  room.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }
              >
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                  Capacity
                </p>
                <p className="text-2xl font-bold text-foreground">{room.capacity} people</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{room.bookingsThisMonth}</strong> bookings this month
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="w-4 h-4" />
                  Schedule
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
