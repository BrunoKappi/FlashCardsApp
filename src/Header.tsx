import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaSun, FaMoon, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { useStore } from './store/useStore';
import { useApp } from './contexts/AppContext';

const infoMenuTranslations = {
    pt: {
        label: "Info",
        about: "Sobre o Desenvolvedor",
        terms: "Termos de Uso",
        privacy: "Política de Privacidade",
        cookies: "Política de Cookies",
        disclaimer: "Isenção de Responsabilidade"
    },
    en: {
        label: "Info",
        about: "About the Developer",
        terms: "Terms of Use",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        disclaimer: "Disclaimer"
    },
    es: {
        label: "Info",
        about: "Sobre el Desarrollador",
        terms: "Términos de Uso",
        privacy: "Política de Privacidad",
        cookies: "Política de Cookies",
        disclaimer: "Descargo de Responsabilidad"
    }
};

const Header: React.FC = () => {
    const { playing, currentDeckId, setPlaying } = useStore();
    const { theme, language, toggleTheme, setLanguage, t } = useApp();

    const handleStartPlaying = () => {
        setPlaying(true);
    };

    // O header deve ser ocultado em modo de jogo ativo para foco máximo
    if (playing) return null;

    const infoText = infoMenuTranslations[language] || infoMenuTranslations.pt;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md transition-all duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
                        <img 
                            className="h-6 w-6 object-contain" 
                            src="https://cdn.bkappi.com/ProjectsAssets/BkappiGeneral/bkappiIcon.ico" 
                            alt="Logo" 
                        />
                        <span className="font-sans font-extrabold tracking-tight text-xl bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            Flashcards.io
                        </span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Play Button (para Trivia ou Decks carregados) */}
                    {currentDeckId === 'trivia' && (
                        <button 
                            onClick={handleStartPlaying} 
                            className="inline-flex items-center gap-2 cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg px-4 py-1.5 text-sm shadow transition-colors duration-200"
                        >
                            {t('play')} <FaPlay className="text-xs" />
                        </button>
                    )}

                    {/* Info/Legal Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1.5 p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                            <FaInfoCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold">{infoText.label}</span>
                        </button>
                        <div className="absolute right-0 top-full pt-1.5 w-56 origin-top-right opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                            <div className="rounded-md border border-border bg-card p-1 shadow-lg">
                                <Link
                                    to="/sobre-o-desenvolvedor"
                                    className="block w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors text-muted-foreground font-medium"
                                >
                                    {infoText.about}
                                </Link>
                                <Link
                                    to="/termos-de-uso"
                                    className="block w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors text-muted-foreground font-medium"
                                >
                                    {infoText.terms}
                                </Link>
                                <Link
                                    to="/politica-de-privacidade"
                                    className="block w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors text-muted-foreground font-medium"
                                >
                                    {infoText.privacy}
                                </Link>
                                <Link
                                    to="/politica-de-cookies"
                                    className="block w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors text-muted-foreground font-medium"
                                >
                                    {infoText.cookies}
                                </Link>
                                <Link
                                    to="/termos-de-responsabilidade"
                                    className="block w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors text-muted-foreground font-medium"
                                >
                                    {infoText.disclaimer}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="relative group">
                        <button className="flex items-center gap-1.5 p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                            <FaGlobe className="h-4 w-4" />
                            <span className="uppercase text-xs">{language}</span>
                        </button>
                        <div className="absolute right-0 top-full pt-1.5 w-24 origin-top-right opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
                            <div className="rounded-md border border-border bg-card p-1 shadow-lg">
                                {(['en', 'pt', 'es'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-sm hover:bg-accent hover:text-foreground transition-colors uppercase ${
                                            language === lang ? 'font-bold text-primary bg-primary/10' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <FaMoon className="h-4 w-4" /> : <FaSun className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
