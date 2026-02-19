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

function App() {
    const [currentView, setCurrentView] = useState('home');

    const navigateTo = (view: string) => {
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

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
