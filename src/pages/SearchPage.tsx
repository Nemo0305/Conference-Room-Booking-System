import {
    Funnel,
    MagnifyingGlass,
    Users,
    ProjectorScreen,
    ChalkboardTeacher,
    WifiHigh,
    MonitorPlay,
    VideoCamera,
    Star,
    CaretDown
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import Footer from '../components/Footer';

// Mock data type
export interface Room {
    id: number;
    name: string;
    location: string;
    description: string;
    capacity: number;
    rating: number;
    reviews: number;
    image: string;
    tags: string[];
    utilization: number;
    amenities: string[];
    type: string;
}

interface SearchPageProps {
}

interface Office {
    name: string;
    location: string;
    image: string;
}

const SearchPage: React.FC<SearchPageProps> = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [hasFiltered, setHasFiltered] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
    const [selectedRoomType, setSelectedRoomType] = useState<Room | null>(null);

    const filters = {
        roomType: ['Conference Room', 'Meeting Room', 'Training Room', 'Auditorium'],
        location: ['Downtown Office', 'Tech Park Campus', 'Business District'],
        amenities: ['video-conferencing', 'whiteboard', 'projector', 'wifi', 'audio-system'],
        capacity: ['2-6 People', '6-12 People', '12-20 People', '20+ People'],
    };

    const rooms: Room[] = [
        {
            id: 1,
            name: "Executive Boardroom",
            location: "Downtown Office",
            description: "Premium boardroom with state-of-the-art video conferencing facilities, perfect for executive meetings and client presentations.",
            capacity: 12,
            rating: 4.8,
            reviews: 124,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 71,
            amenities: ["video-conferencing", "whiteboard", "projector", "wifi"],
            type: 'Conference Room'
        },
        {
            id: 2,
            name: "Conference Room A",
            location: "Downtown Office",
            description: "Spacious conference room ideal for team meetings, workshops, and training sessions with flexible seating arrangements.",
            capacity: 25,
            rating: 4.6,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Limited"],
            utilization: 49,
            amenities: ["projector", "whiteboard", "wifi", "audio-system"],
            type: 'Conference Room'
        },
        {
            id: 3,
            name: "Tech Park Meeting Room",
            location: "Tech Park Campus",
            description: "Modern meeting room equipped with latest technology and video conferencing setup for productive team collaborations.",
            capacity: 8,
            rating: 4.5,
            reviews: 56,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 35,
            amenities: ["video-conferencing", "wifi", "projector"],
            type: 'Meeting Room'
        },
        {
            id: 4,
            name: "Training Hall B",
            location: "Business District",
            description: "Large training facility with flexible layout options, suitable for workshops, seminars, and training sessions.",
            capacity: 50,
            rating: 4.7,
            reviews: 102,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 62,
            amenities: ["audio-system", "whiteboard", "projector", "wifi"],
            type: 'Training Room'
        },
        {
            id: 5,
            name: "Innovation Lab",
            location: "Tech Park Campus",
            description: "Creative space for brainstorming and collaborative work with modern amenities and flexible seating.",
            capacity: 20,
            rating: 4.9,
            reviews: 78,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 55,
            amenities: ["whiteboard", "video-conferencing", "wifi"],
            type: 'Meeting Room'
        },
        {
            id: 6,
            name: "Grand Auditorium",
            location: "Business District",
            description: "Premium auditorium designed for large presentations, conferences, and corporate events with full AV setup.",
            capacity: 200,
            rating: 4.8,
            reviews: 145,
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Limited"],
            utilization: 85,
            amenities: ["audio-system", "projector", "video-conferencing", "wifi"],
            type: 'Auditorium'
        },
        {
            id: 7,
            name: "Auditorium",
            location: "Downtown Office",
            description: "Large auditorium for major presentations and events.",
            capacity: 150,
            rating: 4.7,
            reviews: 98,
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 40,
            amenities: ["audio-system", "projector", "video-conferencing"],
            type: 'Auditorium'
        },
        {
            id: 8,
            name: "Meeting Room",
            location: "Tech Park Campus",
            description: "Versatile meeting space for team gatherings.",
            capacity: 10,
            rating: 4.4,
            reviews: 45,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 28,
            amenities: ["wifi", "projector"],
            type: 'Meeting Room'
        },
        {
            id: 9,
            name: "Board Room",
            location: "Business District",
            description: "Executive board room for confidential meetings.",
            capacity: 16,
            rating: 4.9,
            reviews: 67,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            tags: ["Available"],
            utilization: 30,
            amenities: ["video-conferencing", "whiteboard", "audio-system"],
            type: 'Conference Room'
        }
    ];

    const getCapacityRange = (people: number): string => {
        if (people <= 6) return '2-6 People';
        if (people <= 12) return '6-12 People';
        if (people <= 20) return '12-20 People';
        return '20+ People';
    };

    const applyFilters = () => {
        let results = rooms;

        // Search filter (location and name)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(room =>
                room.name.toLowerCase().includes(query) ||
                room.location.toLowerCase().includes(query)
            );
        }

        // Room Type filter
        if (selectedRoomTypes.length > 0) {
            results = results.filter(room => selectedRoomTypes.includes(room.type));
        }

        // Location filter
        if (selectedLocations.length > 0) {
            results = results.filter(room => selectedLocations.includes(room.location));
        }

        // Amenities filter
        if (selectedAmenities.length > 0) {
            results = results.filter(room =>
                selectedAmenities.some(amenity => room.amenities.includes(amenity))
            );
        }

        // Capacity filter
        if (selectedCapacity.length > 0) {
            results = results.filter(room => {
                const roomCapacityRange = getCapacityRange(room.capacity);
                return selectedCapacity.includes(roomCapacityRange);
            });
        }

        setFilteredRooms(results);
        setHasFiltered(true);
    };

    const handleRoomTypeChange = (type: string) => {
        setSelectedRoomTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleLocationChange = (loc: string) => {
        setSelectedLocations(prev =>
            prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
        );
    };

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handleCapacityChange = (capacity: string) => {
        setSelectedCapacity(prev =>
            prev.includes(capacity) ? prev.filter(c => c !== capacity) : [...prev, capacity]
        );
    };

    const displayRooms = hasFiltered ? filteredRooms : rooms;

    const getUniqueOffices = (): Office[] => {
        const offices: { [key: string]: Office } = {};
        displayRooms.forEach(room => {
            if (!offices[room.location]) {
                offices[room.location] = {
                    name: room.location,
                    location: room.location,
                    image: room.image
                };
            }
        });
        return Object.values(offices);
    };

    const getRoomTypesForOffice = (office: string): Room[] => {
        return displayRooms.filter(room => room.location === office);
    };

    // If an office is selected, show room types
    if (selectedOffice) {
        const roomTypes = getRoomTypesForOffice(selectedOffice);
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => setSelectedOffice(null)}
                        className="text-primary hover:underline mb-4 font-semibold"
                    >
                        ← Back to Offices
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">{selectedOffice}</h1>
                    <p className="text-slate-500 mt-2">Select a room type to view details and book</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomTypes.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="h-48 overflow-hidden bg-slate-100">
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{room.type}</h3>
                                <p className="text-slate-600 text-sm mb-4">{room.description}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={16} className="text-primary" />
                                        <span>{room.capacity} people</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                        <Star size={14} weight="fill" />
                                        <span>{room.rating}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        console.log('Button clicked with room:', room);
                                        setSelectedRoomType(room);
                                    }}
                                    type="button"
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                                >
                                    Select Room Type
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // If a room type is selected, show detailed booking with layout
    if (selectedRoomType) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-8">
                <button
                    onClick={() => setSelectedRoomType(null)}
                    className="text-primary hover:underline mb-4 font-semibold"
                >
                    ← Back to Room Types
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Room Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                            <div className="h-64 overflow-hidden bg-slate-100">
                                <img src={selectedRoomType.image} alt={selectedRoomType.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-8">
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedRoomType.name}</h1>
                                <p className="text-slate-600 mb-6">{selectedRoomType.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-slate-500 text-sm">Capacity</p>
                                        <p className="text-2xl font-bold text-primary">{selectedRoomType.capacity}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-slate-500 text-sm">Rating</p>
                                        <p className="text-2xl font-bold text-amber-500">{selectedRoomType.rating}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-slate-500 text-sm">Cost</p>
                                        <p className="text-2xl font-bold text-slate-800">Free</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedRoomType.amenities.map((amenity) => (
                                            <span key={amenity} className="px-3 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium capitalize">
                                                {amenity.replace('-', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Room Layout</h3>
                                    <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-12 border-2 border-dashed border-slate-300">
                                        {/* Screen/Display Area */}
                                        <div className="mb-8">
                                            <div className="h-16 bg-slate-400 rounded-lg flex items-center justify-center text-white font-bold mb-2">
                                                Screen / Display Area
                                            </div>
                                            <p className="text-center text-sm text-slate-500">Front of Room</p>
                                        </div>

                                        {/* Seats Layout */}
                                        <div className="flex flex-col items-center gap-3 mb-6">
                                            {Array.from({ length: Math.ceil(selectedRoomType.capacity / 8) }).map((_, row) => (
                                                <div key={row} className="flex gap-3 justify-center">
                                                    {Array.from({ length: Math.min(8, selectedRoomType.capacity - row * 8) }).map((_, seat) => (
                                                        <button
                                                            key={`${row}-${seat}`}
                                                            className="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            {row * 8 + seat + 1}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-center text-sm text-slate-500">← Click to select your seat(s) →</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Book This Room</h3>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                                    <input type="date" className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                                    <input type="time" className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                                    <input type="time" className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
                                    <textarea rows={3} className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Meeting purpose..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Number of Attendees</label>
                                    <input type="number" min="1" max={selectedRoomType.capacity} className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-600 mb-3">
                                        <span className="font-semibold">Total Cost: </span>
                                        <span className="text-lg font-bold text-primary">Free</span>
                                    </p>
                                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors">
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Reserve a Space</h1>
                <p className="text-slate-500 mt-2">Find and book the perfect conference room for your needs</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 shrink-0 space-y-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Funnel size={20} className="text-slate-800" />
                        <h2 className="font-bold text-lg text-slate-800">Filters</h2>
                    </div>

                    {/* Room Type Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4 cursor-pointer">
                            <h3 className="font-semibold text-slate-700">Room Type</h3>
                            <CaretDown size={14} />
                        </div>
                        <div className="space-y-3">
                            {filters.roomType.map((type) => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoomTypes.includes(type)}
                                        onChange={() => handleRoomTypeChange(type)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-600 group-hover:text-primary transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4 cursor-pointer">
                            <h3 className="font-semibold text-slate-700">Location</h3>
                            <CaretDown size={14} />
                        </div>
                        <div className="space-y-3">
                            {filters.location.map((loc) => (
                                <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(loc)}
                                        onChange={() => handleLocationChange(loc)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-600 group-hover:text-primary transition-colors">{loc}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4 cursor-pointer">
                            <h3 className="font-semibold text-slate-700">Amenities</h3>
                            <CaretDown size={14} />
                        </div>
                        <div className="space-y-3">
                            {filters.amenities.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-600 group-hover:text-primary transition-colors capitalize">{amenity.replace('-', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Filter */}
                    <div>
                        <div className="flex justify-between items-center mb-4 cursor-pointer">
                            <h3 className="font-semibold text-slate-700">Capacity</h3>
                            <CaretDown size={14} />
                        </div>
                        <div className="space-y-3">
                            {filters.capacity.map((cap) => (
                                <label key={cap} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedCapacity.includes(cap)}
                                        onChange={() => handleCapacityChange(cap)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-600 group-hover:text-primary transition-colors">{cap}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Apply Filters Button */}
                    <div className="pt-4 border-t border-slate-200">
                        <button
                            onClick={applyFilters}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by location or office name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-500 font-medium">{getUniqueOffices().length} offices available</span>
                    </div>

                    {/* Office Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getUniqueOffices().map((office) => (
                            <div
                                key={office.location}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Office Image */}
                                <div className="h-48 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setSelectedOffice(office.location)}>
                                    <img src={office.image} alt={office.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                {/* Office Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{office.name}</h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        {getRoomTypesForOffice(office.location).length} room types available
                                    </p>

                                    {/* Room Types Preview */}
                                    <div className="space-y-2 mb-6">
                                        {[...new Set(getRoomTypesForOffice(office.location).map(r => r.type))].map((type) => (
                                            <span key={type} className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full mr-2 mb-2">
                                                {type}
                                            </span>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => setSelectedOffice(office.location)}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Explore Rooms
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
