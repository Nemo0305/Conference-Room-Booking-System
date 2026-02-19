'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const rooms = [
  {
    id: 1,
    name: 'Boardroom A',
    capacity: 12,
    status: 'available',
    nextBooking: '2:00 PM',
    floor: '2nd Floor',
  },
  {
    id: 2,
    name: 'Boardroom B',
    capacity: 10,
    status: 'occupied',
    currentBooking: '1:00 PM - 2:30 PM',
    floor: '2nd Floor',
  },
  {
    id: 3,
    name: 'Conference 1',
    capacity: 20,
    status: 'available',
    nextBooking: '3:00 PM',
    floor: '3rd Floor',
  },
  {
    id: 4,
    name: 'Conference 2',
    capacity: 20,
    status: 'maintenance',
    reason: 'AV Equipment Check',
    floor: '3rd Floor',
  },
  {
    id: 5,
    name: 'Meeting Room',
    capacity: 6,
    status: 'available',
    nextBooking: '1:30 PM',
    floor: '1st Floor',
  },
];

export function RealTimeAvailability() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Real-Time Availability</h3>
      
      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-foreground">{room.name}</p>
                <Badge variant="outline" className="text-xs">
                  {room.capacity} people
                </Badge>
              </div>
              
              <div className="mt-1 text-xs text-muted-foreground">
                {room.status === 'available' && (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    Available • Next: {room.nextBooking}
                  </div>
                )}
                {room.status === 'occupied' && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    Occupied • {room.currentBooking}
                  </div>
                )}
                {room.status === 'maintenance' && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                    Maintenance • {room.reason}
                  </div>
                )}
              </div>
            </div>

            <Badge
              className={`ml-2 ${
                room.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : room.status === 'occupied'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
