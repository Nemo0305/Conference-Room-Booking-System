import {
    CalendarX,
    CheckCircle,
    Clock,
    CalendarBlank,
    Users,
    MapPin,
    VideoCamera,
    Check
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import Footer from '../components/Footer';

interface MyBookingsPageProps {
    onBrowse: () => void;
}

const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onBrowse }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');

    // Mock Data for Past Bookings
    const pastBookings = [
        {
            id: "BK-2024-001",
            roomName: "Grand Auditorium",
            location: "Business District",
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            date: "Jan 15, 2024",
            time: "09:00 - 12:00",
            attendees: 150,
            purpose: "Annual Company Meeting",
            status: "Confirmed"
        },
        {
            id: "BK-2024-002",
            roomName: "Executive Boardroom",
            location: "Downtown Office",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            date: "Jan 15, 2024",
            time: "14:00 - 16:00",
            attendees: 10,
            purpose: "Client Presentation",
            status: "Confirmed"
        }
    ];

    const TabButton = ({ id, label, count }: { id: typeof activeTab, label: string, count: number }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex-1 py-4 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2
                ${activeTab === id
                    ? 'border-primary text-primary bg-primary-light/10'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
            `}
        >
            {label} ({count})
        </button>
    );

    const BookingTimeline = () => (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6 px-4">
            {['Requested', 'Pending Approval', 'Approved'].map((step, idx) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">
                        <Check weight="bold" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{step}</span>
                </div>
            ))}
            {/* Connecting Lines */}
            <div className="absolute top-4 left-[20%] right-[20%] h-0.5 bg-green-500 -z-0 hidden md:block w-[60%] mx-auto"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                <p className="text-slate-500 mt-2">Manage your conference room reservations</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 flex mb-0 overflow-hidden">
                <TabButton id="upcoming" label="Upcoming" count={0} />
                <TabButton id="ongoing" label="Ongoing" count={0} />
                <TabButton id="past" label="Past" count={6} />
            </div>

            <div className="bg-white rounded-b-xl border border-slate-200 p-8 min-h-[400px]">
                {/* Empty State for Upcoming/Ongoing */}
                {(activeTab === 'upcoming' || activeTab === 'ongoing') && (
                    <div className="flex flex-col items-center justify-center h-64 text-center mt-12">
                        <div className="mb-6 text-slate-300">
                            <VideoCamera size={64} weight="light" /> {/* Using video camera as placeholder based on screenshots generic icon availability, or just calendar */}
                            {/* Or simpler icon since screenshot has calendar w/ x? */}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            No {activeTab === 'upcoming' ? 'Upcoming' : 'Ongoing'} Bookings
                        </h3>
                        <p className="text-slate-500 mb-8 max-w-md">
                            You don't have any {activeTab} reservations right now.
                        </p>
                        <button
                            onClick={onBrowse}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-teal-200/50"
                        >
                            Browse Available Rooms
                        </button>
                    </div>
                )}

                {/* Past Bookings List */}
                {activeTab === 'past' && (
                    <div className="space-y-8">
                        {pastBookings.map((booking) => (
                            <div key={booking.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                                {/* Status Timeline */}
                                <div className="border-b border-slate-200 pb-6 mb-6 relative">
                                    <div className="flex justify-between items-center max-w-3xl mx-auto relative">
                                        {/* Line */}
                                        <div className="absolute top-[14px] left-0 w-full h-[2px] bg-green-500 z-0"></div>

                                        {/* Steps */}
                                        <div className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 ring-4 ring-white">
                                                <Check size={14} weight="bold" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Requested</span>
                                        </div>
                                        <div className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 ring-4 ring-white">
                                                <Check size={14} weight="bold" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">Pending Approval</span>
                                        </div>
                                        <div className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 ring-4 ring-white">
                                                <Check size={14} weight="bold" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-green-600 tracking-wide">Approved</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-64 h-40 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                                        <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{booking.roomName}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                                    <MapPin size={16} />
                                                    {booking.location}
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Booking ID</label>
                                                <span className="font-medium text-slate-700">#{booking.id}</span>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Date</label>
                                                <div className="font-medium text-slate-700 flex items-center gap-1.5">
                                                    {booking.date}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Time</label>
                                                <div className="font-medium text-slate-700 flex items-center gap-1.5">
                                                    {booking.time}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs mb-1">Attendees</label>
                                                <div className="font-medium text-slate-700 flex items-center gap-1.5">
                                                    {booking.attendees} people
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <label className="block text-slate-400 text-xs mb-1">Purpose</label>
                                            <p className="text-slate-600 font-medium">{booking.purpose}</p>
                                        </div>
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
