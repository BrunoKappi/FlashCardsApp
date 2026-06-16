import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Buttons from './components/buttons/Buttons';
import BottomBar from './components/bottomBar/BottomBar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
                {location.pathname === '/' && <Buttons />}
                <Outlet />
            </main>
            <Footer />
            <BottomBar />
            <CookieConsent />
        </div>
    );
};

export default Layout;
