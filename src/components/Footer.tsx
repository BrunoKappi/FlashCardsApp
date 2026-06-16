import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        copyright: "Flashcards.io. Em conformidade com a LGPD.",
        terms: "Termos de Uso",
        privacy: "Política de Privacidade",
        cookies: "Política de Cookies",
        disclaimer: "Isenção de Responsabilidade",
        about: "Sobre o Desenvolvedor"
    },
    en: {
        copyright: "Flashcards.io. Compliant with GDPR & LGPD.",
        terms: "Terms of Use",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        disclaimer: "Disclaimer",
        about: "About the Developer"
    },
    es: {
        copyright: "Flashcards.io. En conformidad con la LGPD.",
        terms: "Términos de Uso",
        privacy: "Política de Privacidad",
        cookies: "Política de Cookies",
        disclaimer: "Descargo de Responsabilidad",
        about: "Sobre el Desarrollador"
    }
};

const Footer: React.FC = () => {
    const { language } = useApp();
    const activeText = translations[language] || translations.pt;

    return (
        <footer className="w-full border-t border-border/40 bg-card/40 backdrop-blur-md transition-all duration-300 py-6 mt-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand / Copyright */}
                <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
                    <span>&copy; {new Date().getFullYear()} {activeText.copyright}</span>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium">
                    <Link to="/sobre-o-desenvolvedor" className="text-muted-foreground hover:text-primary transition-colors">
                        {activeText.about}
                    </Link>
                    <Link to="/termos-de-uso" className="text-muted-foreground hover:text-primary transition-colors">
                        {activeText.terms}
                    </Link>
                    <Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                        {activeText.privacy}
                    </Link>
                    <Link to="/politica-de-cookies" className="text-muted-foreground hover:text-primary transition-colors">
                        {activeText.cookies}
                    </Link>
                    <Link to="/termos-de-responsabilidade" className="text-muted-foreground hover:text-primary transition-colors">
                        {activeText.disclaimer}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
