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
import React from 'react';


interface RoomDetailsPageProps {
    onBack: () => void;
    onBook: () => void;
}

const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({ onBack, onBook }) => {
    // Mock room data
    const room = {
        name: "Executive Boardroom",
        location: "Downtown Office",
        type: "Conference",
        capacity: 12,
        amenities: [
            { name: "Whiteboard", icon: <ChalkboardTeacher size={20} /> },
            { name: "Projector", icon: <ProjectorScreen size={20} /> },
            { name: "High-Speed WiFi", icon: <WifiHigh size={20} /> },
            { name: "Audio System", icon: <SpeakerHigh size={20} /> }
        ],
        price: 75,
        layout: "Boardroom"
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium">
                <ArrowLeft size={16} />
                Back to all spaces
            </button>

            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 h-[400px]">
                <div className="md:col-span-2 h-full rounded-xl overflow-hidden bg-slate-200">
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Main view" />
                </div>
                <div className="flex flex-col gap-4 h-full">
                    <div className="h-1/2 rounded-xl overflow-hidden bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Detail 1" />
                    </div>
                    <div className="h-1/2 rounded-xl overflow-hidden bg-slate-200">
                        <img src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Detail 2" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Info */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{room.name}</h1>
                        <div className="flex items-center gap-4 text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={18} /> {room.location}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1.5">
                                <SquaresFour size={18} /> {room.type}
                            </span>
                        </div>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            Premium boardroom with state-of-the-art video conferencing facilities, perfect for executive meetings and client presentations. Includes dedicated climate control and soundproofing for privacy.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary-light/30 p-5 rounded-xl flex items-center gap-4 border border-primary-light">
                            <div className="p-3 bg-primary-light text-primary rounded-lg">
                                <Users size={24} />
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500">Capacity</span>
                                <strong className="text-lg text-slate-900">{room.capacity} people</strong>
                            </div>
                        </div>
                        <div className="bg-green-50 p-5 rounded-xl flex items-center gap-4 border border-green-100">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <SquaresFour size={24} />
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500">Layout</span>
                                <strong className="text-lg text-slate-900">{room.layout}</strong>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {room.amenities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="text-primary bg-white p-2 rounded shadow-sm border border-slate-100">
                                        {item.icon}
                                    </div>
                                    <span className="text-slate-700 font-medium">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seating Arrangement Visualizer (Mock) */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Seating Arrangement</h2>
                        <div className="relative h-64 flex items-center justify-center">
                            {/* Table */}
                            <div className="w-64 h-32 bg-slate-200 rounded-lg border-2 border-slate-300 flex items-center justify-center relative z-10">
                                <div className="text-slate-400 font-medium flex flex-col items-center gap-1">
                                    <SquaresFour size={24} />
                                    <span>Conference Table</span>
                                </div>
                            </div>

                            {/* Chairs Top */}
                            <div className="absolute top-[25%] flex gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 bg-primary-light rounded-full border-2 border-primary"></div>)}
                            </div>

                            {/* Chairs Bottom */}
                            <div className="absolute bottom-[25%] flex gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 bg-primary-light rounded-full border-2 border-primary"></div>)}
                            </div>

                            {/* Chairs Sides */}
                            <div className="absolute left-[20%] w-10 h-10 bg-primary-light rounded-full border-2 border-primary"></div>
                            <div className="absolute right-[20%] w-10 h-10 bg-primary-light rounded-full border-2 border-primary"></div>

                            {/* Presentation Screen */}
                            <div className="absolute bottom-4 w-96 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-white text-sm">
                                Presentation Screen
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Booking Card */}
                <div className="w-full lg:w-96 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-secondary">${room.price}</span>
                            <span className="text-slate-500"> per hour</span>
                        </div>

                        <button
                            onClick={onBook}
                            className="w-full py-4 bg-secondary hover:bg-secondary-dark text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                        >
                            Book This Space
                        </button>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-3">Location Details</h3>
                            <button className="flex items-center gap-2 text-primary font-medium hover:underline">
                                <MapPin size={18} /> View on map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsPage;
