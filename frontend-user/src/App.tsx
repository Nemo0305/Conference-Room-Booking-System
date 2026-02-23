import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Analytics from './components/Analytics'
import QuickAccess from './components/QuickAccess'
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage'
import RoomDetailsPage from './pages/RoomDetailsPage'
import TicketPage from './pages/TicketPage'
import CalendarPage from './pages/CalendarPage'
import MyBookingsPage from './pages/MyBookingsPage'
import HelpCenterPage from './pages/HelpCenterPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import { useAuth } from './context/AuthContext'

export interface SelectedRoom {
    catalog_id: string;
    room_id: string;
}

export interface BookingResult {
    booking_id: string;
    room_name: string;
    location: string;
    date: string;
    start_time: string;
    end_time: string;
    purpose: string;
}

function App() {
    const [currentView, setCurrentView] = useState('home');
    const { isLoading } = useAuth();
    const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);
    const [lastBooking, setLastBooking] = useState<BookingResult | null>(null);

    const navigateTo = (view: string) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const navigateToRoom = (catalog_id: string, room_id: string) => {
        setSelectedRoom({ catalog_id, room_id });
        navigateTo('details');
    };

    const navigateToTicket = (booking: BookingResult) => {
        setLastBooking(booking);
        navigateTo('ticket');
    };

    // Show loading spinner while auth state is being restored
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        );
    }

    // Instead of forcing login, we allow the view to determine it.
    if (currentView === 'login') {
        return <LoginPage onSuccess={() => navigateTo('home')} />;
    }

    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return (
                    <>
                        <Hero
                            onReserveClick={() => navigateTo('search')}
                            onCalendarClick={() => navigateTo('calendar')}
                        />
                        <Stats />
                        <Analytics />
                        <QuickAccess
                            onViewAvailableToday={() => navigateTo('search')}
                            onSearch={() => navigateTo('search')}
                        />
                    </>
                );
            case 'search':
                return <SearchPage onViewRoom={navigateToRoom} onBookingSuccess={navigateToTicket} />;
            case 'details':
                return (
                    <RoomDetailsPage
                        room={selectedRoom}
                        onBack={() => navigateTo('search')}
                        onBookingSuccess={navigateToTicket}
                    />
                );
            case 'ticket':
                return <TicketPage booking={lastBooking} onHome={() => navigateTo('home')} onViewBookings={() => navigateTo('my-bookings')} />;
            case 'calendar':
                return <CalendarPage onPreviewTicket={() => navigateTo('ticket')} />;
            case 'my-bookings':
                return <MyBookingsPage onBrowse={() => navigateTo('search')} />;
            case 'help':
                return <HelpCenterPage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return (
                    <>
                        <Hero />
                        <Stats />
                        <Analytics />
                        <QuickAccess />
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header currentView={currentView} onNavigate={navigateTo} />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
        </div>
    )
}

export default App
