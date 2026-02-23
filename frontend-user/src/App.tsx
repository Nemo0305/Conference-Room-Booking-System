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

function App() {
    const [currentView, setCurrentView] = useState('home');
    const { user, isLoading } = useAuth();

    const navigateTo = (view: string) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    // Show loading spinner while auth state is being restored
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        );
    }

    // Show login page if not authenticated
    if (!user) {
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
                return <SearchPage />;
            case 'details':
                return (
                    <RoomDetailsPage
                        onBack={() => navigateTo('search')}
                        onBook={() => navigateTo('ticket')}
                    />
                );
            case 'ticket':
                return <TicketPage />;
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
