import {
    CheckCircle,
    DownloadSimple,
    CalendarBlank,
    Clock,
    MapPin,
    ArrowRight,
    House
} from '@phosphor-icons/react';
import React from 'react';
import { BookingResult } from '../App';

interface TicketPageProps {
    booking: BookingResult | null;
    onHome: () => void;
    onViewBookings: () => void;
}

const TicketPage: React.FC<TicketPageProps> = ({ booking, onHome, onViewBookings }) => {
    if (!booking) {
        return (
            <div className="max-w-md mx-auto text-center py-20 px-4">
                <p className="text-slate-500">No booking information available.</p>
                <button onClick={onHome} className="mt-4 text-primary font-semibold hover:underline">Go Home</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            {/* Success Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6 animate-bounce">
                    <CheckCircle size={48} weight="fill" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
                <p className="text-slate-500 mt-2">Your conference room has been reserved successfully</p>
            </div>

            {/* Ticket Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden relative">
                {/* Decorative Header */}
                <div className="bg-gradient-to-r from-primary to-secondary py-6 px-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">{booking.room_name}</h2>
                            <p className="text-white/80 text-sm mt-1">{booking.location}</p>
                        </div>
                        <span className="bg-white/20 text-white px-3 py-1 text-xs rounded-full font-semibold backdrop-blur-sm">
                            Pending Approval
                        </span>
                    </div>
                </div>

                {/* Dot border separator */}
                <div className="w-full flex items-center relative -mt-px">
                    <div className="w-6 h-6 bg-slate-50 rounded-full -ml-3 z-10" />
                    <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                    <div className="w-6 h-6 bg-slate-50 rounded-full -mr-3 z-10" />
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-6">
                        <div className="flex items-start gap-3">
                            <CalendarBlank size={20} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date</p>
                                <p className="text-slate-900 font-semibold">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock size={20} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Time</p>
                                <p className="text-slate-900 font-semibold">{booking.start_time} – {booking.end_time}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Location</p>
                                <p className="text-slate-900 font-semibold">{booking.location}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <DownloadSimple size={20} className="text-primary mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Booking ID</p>
                                <p className="text-slate-900 font-semibold font-mono text-sm">{booking.booking_id}</p>
                            </div>
                        </div>
                    </div>

                    {booking.purpose && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Purpose</p>
                            <p className="text-slate-700">{booking.purpose}</p>
                        </div>
                    )}

                    <p className="text-xs text-center text-slate-400 mt-4">
                        Your booking is pending admin approval. You'll receive a confirmation once approved.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button onClick={onHome} className="flex-1 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <House size={20} /> Back to Home
                </button>
                <button onClick={onViewBookings} className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    View My Bookings <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default TicketPage;
