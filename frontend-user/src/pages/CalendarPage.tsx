import {
    CaretLeft,
    CaretRight,
    Ticket,
    X,
    CalendarBlank,
    CaretDown
} from '@phosphor-icons/react';
import React, { useState, useRef, useEffect } from 'react';
import { fetchUserBookings, getCurrentUser, Booking, fetchRooms, createBooking, Room } from '../lib/api';


interface CalendarPageProps {
    onPreviewTicket: () => void;
}

type ViewType = 'day' | 'week' | 'month';

interface BookingEvent {
    id: string;
    date: string;
    room: string;
    bookedBy: string;
    duration: string;
    location?: string;
    timeSlot?: string;
    purpose: string;
    status: 'booked' | 'pending' | 'available';
    capacity: number;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ onPreviewTicket }) => {
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<ViewType>('month');
    const [isViewOpen, setIsViewOpen] = useState(false);
    const viewRef = useRef<HTMLDivElement | null>(null);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const [hoveredBooking, setHoveredBooking] = useState<BookingEvent | null>(null);
    const [showBookPopup, setShowBookPopup] = useState<string | null>(null);
    const [activeDateOptions, setActiveDateOptions] = useState<string | null>(null);
    const [detailDate, setDetailDate] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Real booking data from API
    const [bookingEvents, setBookingEvents] = useState<BookingEvent[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async () => {
        const user = getCurrentUser();
        if (!user) return;
        try {
            const [bookings, rooms] = await Promise.all([
                fetchUserBookings(user.uid),
                fetchRooms()
            ]);

            setAvailableRooms(rooms);

            const mapped: BookingEvent[] = bookings.map((b: Booking) => ({
                id: b.booking_id,
                date: b.start_date?.slice(0, 10) || '',
                room: b.room_name || b.room_id,
                location: b.location || '',
                timeSlot: `${b.start_time} - ${b.end_time}`,
                bookedBy: b.user_name || user.name,
                duration: '',
                purpose: b.purpose || '',
                status: (b.status === 'confirmed' ? 'booked' : b.status === 'pending' ? 'pending' : 'available') as BookingEvent['status'],
                capacity: 0,
            }));
            setBookingEvents(mapped);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleConfirmBooking = async () => {
        const user = getCurrentUser();
        if (!user || !formData.room || formData.timeSlots.length === 0 || selectedDates.length === 0) {
            alert('Please select a room, date, and time slot.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Find selected room object
            const roomObj = availableRooms.find(r => `${r.catalog_id}:${r.room_id}` === formData.room);
            if (!roomObj) throw new Error('Selected room not found');

            // We take the first selected date and slots for simplicity in this modal
            const date = selectedDates[0];
            const slot = formData.timeSlots[0];
            const [start, end] = slot.split('-').map(s => s.trim());

            // Convert "09:00 AM" to "09:00"
            const formatTime = (t: string) => {
                const [time, meridiem] = t.split(' ');
                let [h, m] = time.split(':');
                if (meridiem === 'PM' && h !== '12') h = (parseInt(h) + 12).toString();
                if (meridiem === 'AM' && h === '12') h = '00';
                return `${h.padStart(2, '0')}:${m || '00'}:00`;
            };

            await createBooking({
                uid: user.uid,
                catalog_id: roomObj.catalog_id,
                room_id: roomObj.room_id,
                start_date: date,
                end_date: date,
                start_time: formatTime(start),
                end_time: formatTime(end),
                purpose: formData.purpose
            });

            alert('Booking request submitted successfully!');
            setIsModalOpen(false);
            loadData(); // Refresh calendar
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Modal Form State
    const [formData, setFormData] = useState({
        room: '',
        attendees: '12',
        purpose: 'team',
        name: 'jigi',
        email: '',
        timeSlots: [] as string[]
    });

    // Filters
    const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('All Time Slots');

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDateClick = (day: number) => {
        const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDates(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr].sort();
            }
        });
    };

    const toggleTimeSlot = (slot: string) => {
        setFormData(prev => {
            const slots = prev.timeSlots.includes(slot)
                ? prev.timeSlots.filter(s => s !== slot)
                : [...prev.timeSlots, slot];
            return { ...prev, timeSlots: slots };
        });
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const timeSlots = [
        "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM",
        "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM",
        "05:00 PM - 06:00 PM"
    ];

    // Time helpers
    const parseTimeToMinutes = (t: string) => {
        const [time, meridiem] = t.split(' ');
        const [hh, mm] = time.split(':').map(Number);
        let h = hh;
        if (meridiem === 'PM' && hh !== 12) h += 12;
        if (meridiem === 'AM' && hh === 12) h = 0;
        return h * 60 + (mm || 0);
    };

    const parseRangeToMinutes = (range?: string) => {
        if (!range) return null;
        const parts = range.split('-').map(p => p.trim());
        const start = parseTimeToMinutes(parts[0]);
        const end = parseTimeToMinutes(parts[1]);
        return { start, end };
    };

    const rangesOverlap = (a: { start: number; end: number }, b: { start: number; end: number }) => {
        return a.start < b.end && b.start < a.end;
    };

    const isSlotBookedForDate = (date: string, slot: string) => {
        const slotRange = parseRangeToMinutes(slot);
        if (!slotRange) return false;
        const bookings = bookingEvents.filter(e => e.date === date);
        return bookings.some(b => {
            const br = parseRangeToMinutes(b.timeSlot);
            if (!br) return false;
            return rangesOverlap(slotRange, br);
        });
    };

    const timeSlotMatchesFilter = (bookingTime?: string, filter?: string) => {
        if (!filter || filter === 'All Time Slots') return true;
        if (!bookingTime) return false;

        // Morning: 9AM - 12PM, Afternoon: 12PM - 4PM
        const start = bookingTime.split('-')[0].trim(); // e.g. "09:00 AM"
        const parts = start.split(' ');
        const time = parts[0];
        const meridiem = parts[1];
        const [hourStr] = time.split(':');
        let hour = parseInt(hourStr, 10);
        if (meridiem === 'PM' && hour !== 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;

        if (filter.includes('Morning')) {
            return hour >= 9 && hour < 12;
        }
        if (filter.includes('Afternoon')) {
            return hour >= 12 && hour < 16;
        }
        return true;
    };

    const getBookingsForDate = (date: string): BookingEvent[] => {
        return bookingEvents.filter(event => {
            if (event.date !== date) return false;
            if (selectedLocation && selectedLocation !== 'All Locations' && event.location !== selectedLocation) return false;
            if (!timeSlotMatchesFilter(event.timeSlot, selectedTimeFilter)) return false;
            return true;
        });
    };

    const getDateStatus = (date: string): 'booked' | 'pending' | 'available' => {
        const bookings = getBookingsForDate(date);
        if (bookings.length === 0) return 'available';
        if (bookings.some(b => b.status === 'booked')) return 'booked';
        if (bookings.some(b => b.status === 'pending')) return 'pending';
        return 'available';
    };

    // Get the start of the current week (Sunday)
    const getWeekStart = (date: Date): Date => {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay());
        return d;
    };

    // Get all days in the current week
    const getWeekDays = (date: Date): Date[] => {
        const start = getWeekStart(date);
        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            return d;
        });
    };

    // Format date to YYYY-MM-DD
    const dateToString = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // Navigate to previous/next period based on view
    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'month') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() - 7);
        } else {
            newDate.setDate(newDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewType === 'month') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (viewType === 'week') {
            newDate.setDate(newDate.getDate() + 7);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    // Close view dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (viewRef.current && !viewRef.current.contains(e.target as Node)) {
                setIsViewOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Booking Calendar</h1>
                    <p className="text-slate-500 mt-2">View all bookings and availability across locations</p>
                </div>
                <button
                    onClick={onPreviewTicket}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Ticket size={20} />
                    Preview Ticket Design
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1.5">Filter by Location</label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                            <option>All Locations</option>
                            <option>Downtown Office</option>
                            <option>Tech Park Campus</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1.5">Filter by Time Slot</label>
                        <select
                            value={selectedTimeFilter}
                            onChange={(e) => setSelectedTimeFilter(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                            <option>All Time Slots</option>
                            <option>Morning (9AM - 12PM)</option>
                            <option>Afternoon (12PM - 4PM)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Selection Banner */}
            {selectedDates.length > 0 && (
                <div className="bg-primary-light/30 border border-primary-light text-primary-dark px-6 py-4 rounded-xl flex justify-between items-center mb-8 animate-fade-in">
                    <div>
                        <span className="font-bold block">{selectedDates.length} dates selected</span>
                        <span className="text-sm opacity-80">{selectedDates.join(', ')}</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm"
                    >
                        Book Now
                    </button>
                </div>
            )}

            {/* Detail modal for single-date timeline */}
            {isDetailOpen && detailDate && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsDetailOpen(false)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Details for {detailDate}</h3>
                            <button onClick={() => setIsDetailOpen(false)} className="text-slate-500">Close</button>
                        </div>

                        <div className="space-y-2">
                            {timeSlots.map(slot => {
                                const bookings = getBookingsForDate(detailDate).filter(b => {
                                    const br = parseRangeToMinutes(b.timeSlot);
                                    const sr = parseRangeToMinutes(slot);
                                    return br && sr && rangesOverlap(br, sr);
                                });
                                const booked = bookings.length > 0;
                                const booking = bookings[0];
                                return (
                                    <div key={slot} className={`p-3 rounded-lg border flex justify-between items-center ${booked ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-200'}`}>
                                        <div>
                                            <div className="text-sm font-semibold">{slot}</div>
                                            {booked && booking && <div className="text-xs text-slate-600">{booking.room} — {booking.bookedBy}</div>}
                                        </div>
                                        <div>
                                            {booked ? (
                                                <div className="text-xs text-green-700 px-2 py-1 rounded">Booked</div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // open booking modal preselecting this slot
                                                        setIsDetailOpen(false);
                                                        setIsModalOpen(true);
                                                        setSelectedDates([detailDate]);
                                                        setFormData(prev => ({ ...prev, timeSlots: [slot] }));
                                                    }}
                                                    className="text-xs bg-primary text-white px-3 py-1 rounded"
                                                >
                                                    Book Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                {/* Calendar Header with View Options */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {viewType === 'month'
                                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : viewType === 'week'
                                    ? `Week of ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                                    : `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                            }
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* View Dropdown */}
                        <div className="relative" ref={viewRef}>
                            <button
                                onClick={() => setIsViewOpen(prev => !prev)}
                                className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-slate-700 font-medium hover:border-primary hover:text-primary transition-colors"
                            >
                                <span className="capitalize">{viewType} View</span>
                                <CaretDown size={16} />
                            </button>
                            {isViewOpen && (
                                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-10">
                                    {(['day', 'week', 'month'] as ViewType[]).map((view) => (
                                        <button
                                            key={view}
                                            onClick={() => { setViewType(view); setIsViewOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 capitalize transition-colors ${viewType === view
                                                ? 'bg-primary-light text-primary font-semibold'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            {view} View
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                            <button onClick={handlePrevious} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <CaretLeft size={20} />
                            </button>
                            <button onClick={handleNext} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <CaretRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mb-8 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                        <span className="text-sm text-slate-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
                        <span className="text-sm text-slate-600">Pending Approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                        <span className="text-sm text-slate-600">Available</span>
                    </div>
                </div>

                {/* MONTH VIEW */}
                {viewType === 'month' && (
                    <div className="month-view">
                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-4">
                            {/* Empty cells for start padding */}
                            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}

                            {/* Active cells */}
                            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                                const status = getDateStatus(dateStr);
                                const dayBookings = getBookingsForDate(dateStr);
                                const isSelected = selectedDates.includes(dateStr);
                                void isSelected; // suppress unused-var warning — used in future interactions

                                const statusColors = {
                                    booked: 'bg-green-100 border-green-500 hover:shadow-lg',
                                    pending: 'bg-yellow-100 border-yellow-500 hover:shadow-lg',
                                    available: 'bg-blue-100 border-blue-500 hover:shadow-lg'
                                };

                                return (
                                    <div
                                        key={day}
                                        className="relative group"
                                        onMouseEnter={() => {
                                            if (dayBookings.length > 0) setHoveredBooking(dayBookings[0]);
                                            setHoveredDate(dateStr);
                                            setActiveDateOptions(dateStr);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredBooking(null);
                                            setHoveredDate(null);
                                            setShowBookPopup(null);
                                            setActiveDateOptions(null);
                                        }}
                                    >
                                        <div
                                            onClick={() => {
                                                if (status === 'available') {
                                                    setShowBookPopup(dateStr);
                                                } else {
                                                    handleDateClick(day);
                                                }
                                            }}
                                            className={`
                                        aspect-[4/3] rounded-xl border-2 flex flex-col p-3 cursor-pointer transition-all
                                        ${statusColors[status]}
                                    `}
                                        >
                                            <span className="font-semibold text-slate-800">{day}</span>
                                            {dayBookings.length > 0 && (
                                                <div className="mt-1">
                                                    <span className="text-xs text-slate-600 block">
                                                        {dayBookings[0].room.split(' ')[0]}
                                                    </span>
                                                    {dayBookings[0].timeSlot && (
                                                        <span className="text-[11px] text-slate-500 block mt-1">{dayBookings[0].timeSlot}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Hover Tooltip for Booked/Pending */}
                                        {hoveredBooking && hoveredDate === dateStr && (dayBookings.length > 0) && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg z-20 whitespace-nowrap pointer-events-none">
                                                <p className="font-semibold text-sm">{hoveredBooking.room}</p>
                                                <p className="text-xs text-slate-300">Booked by: {hoveredBooking.bookedBy}</p>
                                                <p className="text-xs text-slate-300">Duration: {hoveredBooking.duration}</p>
                                                {hoveredBooking.timeSlot && (
                                                    <p className="text-xs text-slate-300">Time: {hoveredBooking.timeSlot}</p>
                                                )}
                                                <p className="text-xs text-slate-300">Purpose: {hoveredBooking.purpose}</p>
                                                <p className={`text-xs font-semibold mt-1 ${hoveredBooking.status === 'booked' ? 'text-green-400' : 'text-yellow-400'
                                                    }`}>
                                                    {hoveredBooking.status === 'booked' ? 'Confirmed' : 'Pending Approval'}
                                                </p>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900"></div>
                                            </div>
                                        )}

                                        {/* Options overlay on hover/click */}
                                        {activeDateOptions === dateStr && (
                                            <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Open book modal and preselect date
                                                        setIsModalOpen(true);
                                                        setSelectedDates([dateStr]);
                                                        setShowBookPopup(null);
                                                        setActiveDateOptions(null);
                                                    }}
                                                    className="bg-primary text-white text-xs px-3 py-1 rounded shadow"
                                                >
                                                    Book Now
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDetailDate(dateStr);
                                                        setIsDetailOpen(true);
                                                        setActiveDateOptions(null);
                                                    }}
                                                    className="bg-white text-xs px-3 py-1 rounded border border-slate-200 shadow"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* WEEK VIEW */}
                {viewType === 'week' && (
                    <div className="week-view overflow-x-auto">
                        {/* Day Headers */}
                        <div className="flex gap-2 mb-6 pb-6 border-b border-slate-200">
                            {getWeekDays(currentDate).map((date) => {
                                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                                const isToday = dateToString(date) === dateToString(new Date());
                                return (
                                    <div
                                        key={dateToString(date)}
                                        className={`flex-1 text-center p-4 rounded-lg border-2 ${isToday ? 'bg-primary-light border-primary' : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold text-slate-500 uppercase">{dayName}</p>
                                        <p className="text-lg font-bold text-slate-800">{date.getDate()}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time Slots Grid */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {/* Header row */}
                            <div className="flex bg-slate-100 border-b border-slate-200">
                                <div className="w-24 font-semibold text-sm text-slate-600 p-3 border-r border-slate-200">Time</div>
                                {getWeekDays(currentDate).map((date) => (
                                    <div key={dateToString(date)} className="flex-1 font-semibold text-sm text-slate-800 p-3 text-center border-r border-slate-200 last:border-r-0">
                                        &nbsp;
                                    </div>
                                ))}
                            </div>

                            {/* Time slots */}
                            {Array.from({ length: 10 }).map((_, i) => {
                                const hour = 9 + i;
                                const timeStr = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
                                return (
                                    <div key={i} className="flex border-t border-slate-200">
                                        <div className="w-24 text-xs font-medium text-slate-600 p-3 border-r border-slate-200 bg-slate-50">
                                            {timeStr}
                                        </div>
                                        {getWeekDays(currentDate).map((date) => {
                                            const dateStr = dateToString(date);
                                            const dayBookings = getBookingsForDate(dateStr);
                                            const hasBooking = dayBookings.length > 0;
                                            const status = getDateStatus(dateStr);

                                            return (
                                                <div
                                                    key={`${dateStr}-${i}`}
                                                    className={`flex-1 p-3 border-r border-slate-200 last:border-r-0 min-h-16 cursor-pointer transition-colors ${hasBooking
                                                        ? status === 'booked'
                                                            ? 'bg-green-100/50 hover:bg-green-100'
                                                            : 'bg-yellow-100/50 hover:bg-yellow-100'
                                                        : 'bg-blue-100/30 hover:bg-blue-100/60'
                                                        }`}
                                                    onMouseEnter={() => {
                                                        if (hasBooking) setHoveredBooking(dayBookings[0]);
                                                        setHoveredDate(dateStr);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredBooking(null);
                                                        setHoveredDate(null);
                                                    }}
                                                    onClick={() => {
                                                        if (!hasBooking) {
                                                            setShowBookPopup(dateStr);
                                                        }
                                                    }}
                                                >
                                                    {hasBooking && (
                                                        <div className="p-2">
                                                            <div className={`text-xs font-semibold ${status === 'booked' ? 'text-green-700' : 'text-yellow-700'
                                                                }`}>{dayBookings[0].room.split(' ')[0]}</div>
                                                            {dayBookings[0].timeSlot && (
                                                                <div className="text-[11px] text-slate-600 mt-1">{dayBookings[0].timeSlot}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {hoveredDate === dateStr && hasBooking && hoveredBooking && (
                                                        <div className="text-xs text-slate-600 mt-1">
                                                            <p>{hoveredBooking.bookedBy}</p>
                                                            {hoveredBooking.timeSlot && <p className="mt-1 text-[11px] text-slate-500">{hoveredBooking.timeSlot}</p>}
                                                        </div>
                                                    )}
                                                    {showBookPopup === dateStr && !hasBooking && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsModalOpen(true);
                                                                setSelectedDates([dateStr]);
                                                                setShowBookPopup(null);
                                                            }}
                                                            className="text-xs bg-primary text-white px-2 py-1 rounded font-semibold hover:bg-primary-dark transition-colors"
                                                        >
                                                            Book
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* DAY VIEW */}
                {viewType === 'day' && (
                    <div className="day-view">
                        {/* Day Header */}
                        <div className="bg-gradient-to-r from-primary-light to-primary/10 p-6 rounded-lg mb-8 border-2 border-primary">
                            <h3 className="text-xl font-bold text-primary mb-2">{monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}</h3>
                            <p className="text-sm text-slate-600">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()]}
                            </p>
                        </div>

                        {/* Time Slots with Available Rooms */}
                        <div className="space-y-4">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const hour = 9 + i;
                                const timeStr = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
                                const dateStr = dateToString(currentDate);
                                const dayBookings = getBookingsForDate(dateStr);

                                return (
                                    <div key={i} className="border border-slate-200 rounded-lg p-4">
                                        <h4 className="font-bold text-slate-800 mb-3">{timeStr}</h4>
                                        <div className="space-y-2">
                                            {dayBookings.length > 0 ? (
                                                dayBookings.map((booking) => (
                                                    <div
                                                        key={booking.id}
                                                        className={`p-3 rounded-lg border-l-4 ${booking.status === 'booked'
                                                            ? 'bg-green-50 border-green-500'
                                                            : 'bg-yellow-50 border-yellow-500'
                                                            }`}
                                                        onMouseEnter={() => setHoveredBooking(booking)}
                                                        onMouseLeave={() => setHoveredBooking(null)}
                                                    >
                                                        <p className="font-semibold text-sm text-slate-800">{booking.room}</p>
                                                        {booking.timeSlot && <p className="text-xs text-slate-600">Time: {booking.timeSlot}</p>}
                                                        <p className="text-xs text-slate-600">Booked by: {booking.bookedBy}</p>
                                                        <p className={`text-xs font-semibold mt-1 ${booking.status === 'booked' ? 'text-green-600' : 'text-yellow-600'
                                                            }`}>
                                                            {booking.status === 'booked' ? '✓ Confirmed' : '⏳ Pending Approval'}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    className="p-3 rounded-lg bg-blue-50 border-2 border-blue-300 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-colors"
                                                    onClick={() => {
                                                        setShowBookPopup(`${dateStr}-${hour}`);
                                                    }}
                                                >
                                                    <p className="text-sm font-semibold text-blue-700">Available - Click to Book</p>
                                                    {showBookPopup === `${dateStr}-${hour}` && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsModalOpen(true);
                                                                setSelectedDates([dateStr]);
                                                                setShowBookPopup(null);
                                                            }}
                                                            className="mt-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded font-semibold text-xs transition-colors"
                                                        >
                                                            Proceed to Booking
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-20">
                            <h2 className="text-xl font-bold text-slate-900">Book Conference Room</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            {/* Selected Dates Display */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Selected Dates</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDates.map(date => (
                                        <div key={date} className="flex items-center gap-2 px-3 py-1.5 bg-primary-light/50 text-primary-dark border border-primary-light rounded-lg text-sm font-medium">
                                            <CalendarBlank size={16} />
                                            {date}
                                            <button onClick={() => handleDateClick(parseInt(date.split('-')[2]))} className="ml-1 hover:text-red-500">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Select Room */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Select Room</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                >
                                    <option value="" disabled>Choose a room</option>
                                    {availableRooms.map(r => (
                                        <option key={`${r.catalog_id}:${r.room_id}`} value={`${r.catalog_id}:${r.room_id}`}>
                                            {r.room_name} ({r.capacity} people)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Select Time Slots</label>
                                <div className="grid grid-cols-2 gap-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {timeSlots.map(slot => {
                                        const booked = isSlotBookedForDate(selectedDates[0] || '', slot);
                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => !booked && toggleTimeSlot(slot)}
                                                disabled={booked}
                                                className={`
                                                    p-3 rounded-lg border text-sm font-medium transition-all text-center
                                                    ${formData.timeSlots.includes(slot)
                                                        ? 'bg-white border-primary text-primary ring-1 ring-primary'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }
                                                    ${booked ? 'opacity-40 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Attendees */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Number of Attendees</label>
                                <input
                                    type="number"
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={formData.attendees}
                                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                                />
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Purpose of Booking</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    placeholder="Brief description of your meeting"
                                ></textarea>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold shadow-lg shadow-teal-200/50 transition-all active:scale-[0.98] disabled:opacity-50"
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
