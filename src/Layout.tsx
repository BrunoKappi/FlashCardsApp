import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomBar from './components/bottomBar/BottomBar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
                <Outlet />
            </main>
            <Footer />
            <BottomBar />
            <CookieConsent />
        </div>
    );
};

export default Layout;
