'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { createRoom } from '@/lib/api';

interface RoomModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function RoomModal({ onClose, onSuccess }: RoomModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        catalog_id: 'CAT-01',
        room_id: '',
        room_name: '',
        capacity: 10,
        location: '',
        amenities: '',
        status: 'active',
        floor_no: 1,
        room_number: '',
        availability: 'available',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.room_id || !formData.room_name) {
                throw new Error('Room ID and Name are required');
            }
            await createRoom(formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
                    <h2 className="text-xl font-bold text-foreground">Add New Room</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Catalog ID</label>
                            <input
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.catalog_id}
                                onChange={e => setFormData({ ...formData, catalog_id: e.target.value })}
                                placeholder="e.g. CAT-01"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Room ID</label>
                            <input
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.room_id}
                                onChange={e => setFormData({ ...formData, room_id: e.target.value })}
                                placeholder="e.g. R-101"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Room Name</label>
                        <input
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                            value={formData.room_name}
                            onChange={e => setFormData({ ...formData, room_name: e.target.value })}
                            placeholder="e.g. Executive Suite"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Capacity</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Location</label>
                            <input
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Block A, 5th Floor"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Floor No</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.floor_no}
                                onChange={e => setFormData({ ...formData, floor_no: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Room Number</label>
                            <input
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                value={formData.room_number}
                                onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Amenities (comma-separated)</label>
                        <textarea
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[80px]"
                            value={formData.amenities}
                            onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                            placeholder="e.g. Projector, WiFi, AC"
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-border">
                        <Button variant="outline" type="button" className="flex-1" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Room'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
