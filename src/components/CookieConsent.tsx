import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "🍪 Controle de Privacidade (LGPD)",
        desc: "Utilizamos cookies essenciais e tecnologias de armazenamento local para salvar suas preferências de idioma, tema visual e progresso de estudo. Ao continuar, você concorda com nossos ",
        terms: "Termos de Uso",
        and: " e nossa ",
        privacy: "Política de Privacidade",
        decline: "Apenas Necessários",
        accept: "Aceitar Todos"
    },
    en: {
        title: "🍪 Privacy Control (GDPR & LGPD)",
        desc: "We use essential cookies and local storage technologies to save your language preferences, visual theme, and study progress. By continuing, you agree to our ",
        terms: "Terms of Use",
        and: " and our ",
        privacy: "Privacy Policy",
        decline: "Necessary Only",
        accept: "Accept All"
    },
    es: {
        title: "🍪 Control de Privacidad (LGPD)",
        desc: "Utilizamos cookies esenciales y tecnologías de almacenamiento local para guardar sus preferencias de idioma, tema visual y progreso de estudio. Al continuar, acepta nuestros ",
        terms: "Términos de Uso",
        and: " y nuestra ",
        privacy: "Política de Privacidad",
        decline: "Solo Necesarios",
        accept: "Aceptar Todo"
    }
};

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const { language } = useApp();

    const activeText = translations[language] || translations.pt;

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent-choice');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = (choice: 'accepted' | 'declined') => {
        localStorage.setItem('cookie-consent-choice', choice);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md bg-card/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl p-5 z-[100] flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    {activeText.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {activeText.desc}
                    <Link to="/termos-de-uso" className="text-primary hover:underline font-semibold">
                        {activeText.terms}
                    </Link>
                    {activeText.and}
                    <Link to="/politica-de-privacidade" className="text-primary hover:underline font-semibold">
                        {activeText.privacy}
                    </Link>.
                </p>
            </div>
            
            <div className="flex gap-2.5 justify-end">
                <button
                    onClick={() => handleConsent('declined')}
                    className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                    {activeText.decline}
                </button>
                <button
                    onClick={() => handleConsent('accepted')}
                    className="cursor-pointer text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-all duration-200"
                >
                    {activeText.accept}
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
