import {
    Check,
    MapPin,
    VideoCamera,
    XCircle
} from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react';
import { fetchUserBookings, cancelBooking, Booking, getCurrentUser } from '../lib/api';

interface MyBookingsPageProps {
    onBrowse: () => void;
}

const statusColors: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-600',
    rejected: 'bg-slate-100 text-slate-600',
};

const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onBrowse }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const user = getCurrentUser();

    useEffect(() => {
        if (!user) return;
        const load = async () => {
            try {
                const data = await fetchUserBookings(user.uid);
                setBookings(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const now = new Date();

    const upcoming = bookings.filter(b =>
        b.status !== 'cancelled' && b.status !== 'rejected' &&
        new Date(`${b.start_date}T${b.start_time}`) >= now
    );
    const past = bookings.filter(b =>
        b.status !== 'cancelled' && b.status !== 'rejected' &&
        new Date(`${b.start_date}T${b.start_time}`) < now
    );
    const cancelled = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');

    const displayBookings = activeTab === 'upcoming' ? upcoming : activeTab === 'past' ? past : cancelled;

    const handleCancel = async (booking_id: string) => {
        if (!confirm('Cancel this booking?')) return;
        setCancellingId(booking_id);
        try {
            await cancelBooking(booking_id);
            setBookings(prev => prev.map(b => b.booking_id === booking_id ? { ...b, status: 'cancelled' } : b));
        } catch (e: any) {
            alert(e.message);
        } finally {
            setCancellingId(null);
        }
    };

    const TabButton = ({ id, label, count }: { id: typeof activeTab; label: string; count: number }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2
                ${activeTab === id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
            {label} <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Retry</button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                <p className="text-slate-500 mt-1">Manage your conference room reservations</p>
            </div>

            <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 flex overflow-hidden">
                <TabButton id="upcoming" label="Upcoming" count={upcoming.length} />
                <TabButton id="past" label="Past" count={past.length} />
                <TabButton id="cancelled" label="Cancelled" count={cancelled.length} />
            </div>

            <div className="bg-white rounded-b-xl border border-slate-200 p-8 min-h-[400px]">
                {displayBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="text-slate-300 mb-4"><VideoCamera size={64} weight="light" /></div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} bookings</h3>
                        <p className="text-slate-500 mb-6">You don't have any {activeTab} reservations.</p>
                        {activeTab === 'upcoming' && (
                            <button onClick={onBrowse} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-colors">
                                Browse Available Rooms
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {displayBookings.map(booking => (
                            <div key={booking.booking_id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                                {/* Status Timeline */}
                                <div className="flex items-center gap-2 mb-5 border-b border-slate-200 pb-5">
                                    {['Requested', 'Pending Approval', booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'rejected' ? 'Rejected' : 'Cancelled'].map((step, i) => (
                                        <React.Fragment key={step}>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs mb-1 ${i < 2 || booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-400'}`}>
                                                    <Check size={12} weight="bold" />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-semibold">{step}</span>
                                            </div>
                                            {i < 2 && <div className={`flex-1 h-0.5 mb-4 ${i < 1 || booking.status === 'confirmed' ? 'bg-green-500' : 'bg-slate-200'}`} />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{booking.room_name || `Room ${booking.room_id}`}</h3>
                                                {booking.location && (
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                                        <MapPin size={14} />
                                                        {booking.location} {booking.floor_no ? `— Floor ${booking.floor_no}` : ''}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${statusColors[booking.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Booking ID</label>
                                                <span className="font-medium text-slate-700">#{booking.booking_id}</span>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Date</label>
                                                <span className="font-medium text-slate-700">{new Date(booking.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Time</label>
                                                <span className="font-medium text-slate-700">{booking.start_time?.slice(0, 5)} – {booking.end_time?.slice(0, 5)}</span>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Purpose</label>
                                                <span className="font-medium text-slate-700">{booking.purpose || '—'}</span>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                <button
                                                    onClick={() => handleCancel(booking.booking_id)}
                                                    disabled={cancellingId === booking.booking_id}
                                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors disabled:opacity-60"
                                                >
                                                    <XCircle size={16} />
                                                    {cancellingId === booking.booking_id ? 'Cancelling...' : 'Cancel Booking'}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
