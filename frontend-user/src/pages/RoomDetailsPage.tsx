import {
    ArrowLeft,
    MapPin,
    Users,
    SquaresFour,
    ChalkboardTeacher,
    ProjectorScreen,
    WifiHigh,
    SpeakerHigh
} from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react';
import { fetchRoom, createBooking, getCurrentUser, Room } from '../lib/api';
import { BookingResult } from '../App';
import LoginPage from './LoginPage';

interface RoomDetailsPageProps {
    room: { catalog_id: string; room_id: string } | null;
    onBack: () => void;
    onBookingSuccess: (booking: BookingResult) => void;
}

const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({ room: roomRef, onBack, onBookingSuccess }) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Booking form
    const [bookDate, setBookDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [bookResult, setBookResult] = useState<{ ok: boolean; msg: string } | null>(null);

    useEffect(() => {
        if (!roomRef) { setLoading(false); setError('No room selected'); return; }
        const load = async () => {
            try {
                const data = await fetchRoom(roomRef.catalog_id, roomRef.room_id);
                setRoom(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [roomRef?.catalog_id, roomRef?.room_id]);

    const submitBookingAction = async (user: any) => {
        if (!room) return;
        setSubmitting(true);
        setBookResult(null);
        try {
            const result = await createBooking({
                uid: user.uid,
                catalog_id: room.catalog_id,
                room_id: room.room_id,
                start_date: bookDate,
                end_date: bookDate,
                start_time: startTime,
                end_time: endTime,
                purpose,
            });
            setBookResult({ ok: true, msg: `Booking created! ID: ${result.booking_id}` });
            // Navigate to ticket after short delay
            setTimeout(() => {
                onBookingSuccess({
                    booking_id: result.booking_id,
                    room_name: room.room_name,
                    location: room.location,
                    date: bookDate,
                    start_time: startTime,
                    end_time: endTime,
                    purpose,
                    user_name: user.name,
                    email: user.email,
                });
            }, 800);
        } catch (err: any) {
            setBookResult({ ok: false, msg: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        submitBookingAction(user);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
    );

    if (error || !room) return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium">
                <ArrowLeft size={16} /> Back to all spaces
            </button>
            <div className="text-center py-20 text-slate-500">
                <p className="text-lg font-semibold">{error || 'Room not found'}</p>
            </div>
        </div>
    );

    const amenityList = room.amenities ? room.amenities.split(',').map(a => a.trim()) : [];
    const amenityIcons: Record<string, React.ReactNode> = {
        'Whiteboard': <ChalkboardTeacher size={20} />,
        'Projector': <ProjectorScreen size={20} />,
        'WiFi': <WifiHigh size={20} />,
        'Audio System': <SpeakerHigh size={20} />,
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium">
                <ArrowLeft size={16} />
                Back to all spaces
            </button>

            {/* Gallery placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[400px]">
                <div className="md:col-span-2 h-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                        <SquaresFour size={64} className="text-primary/40 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-primary/60">{room.room_name}</h3>
                        <p className="text-primary/40">Room {room.room_number} • Floor {room.floor_no}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 h-full">
                    <div className="h-1/2 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                            <Users size={32} className="mx-auto mb-1" />
                            <p className="text-sm font-medium">Capacity: {room.capacity}</p>
                        </div>
                    </div>
                    <div className="h-1/2 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100/30 flex items-center justify-center">
                        <div className="text-center text-green-600">
                            <MapPin size={32} className="mx-auto mb-1" />
                            <p className="text-sm font-medium">{room.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Info */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{room.room_name}</h1>
                        <div className="flex items-center gap-4 text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin size={18} /> {room.location}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1.5"><SquaresFour size={18} /> Room {room.room_number}</span>
                        </div>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            Located on Floor {room.floor_no}, this room has a capacity of {room.capacity} people.
                            {room.availability ? ` ${room.availability}` : ' Available for booking.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary-light/30 p-5 rounded-xl flex items-center gap-4 border border-primary-light">
                            <div className="p-3 bg-primary-light text-primary rounded-lg"><Users size={24} /></div>
                            <div>
                                <span className="block text-sm text-slate-500">Capacity</span>
                                <strong className="text-lg text-slate-900">{room.capacity} people</strong>
                            </div>
                        </div>
                        <div className="bg-green-50 p-5 rounded-xl flex items-center gap-4 border border-green-100">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><SquaresFour size={24} /></div>
                            <div>
                                <span className="block text-sm text-slate-500">Status</span>
                                <strong className="text-lg text-slate-900 capitalize">{room.status}</strong>
                            </div>
                        </div>
                    </div>

                    {amenityList.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {amenityList.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="text-primary bg-white p-2 rounded shadow-sm border border-slate-100">
                                            {amenityIcons[item] || <SquaresFour size={20} />}
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Booking Card */}
                <div className="w-full lg:w-96 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-secondary">Free</span>
                            <span className="text-slate-500"> per hour</span>
                        </div>

                        {bookResult && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${bookResult.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {bookResult.msg}
                            </div>
                        )}

                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} required className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                                <textarea rows={3} value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Meeting purpose..." />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full py-4 bg-secondary hover:bg-secondary-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-60">
                                {submitting ? 'Booking...' : 'Book This Space'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-3">Location Details</h3>
                            <p className="text-sm text-slate-600">{room.location} — Floor {room.floor_no}, Room {room.room_number}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showLoginModal && (
                <LoginPage
                    isModal
                    onClose={() => setShowLoginModal(false)}
                    onSuccess={() => {
                        setShowLoginModal(false);
                        const user = getCurrentUser();
                        if (user) submitBookingAction(user);
                    }}
                />
            )}
        </div>
    );
};

export default RoomDetailsPage;
