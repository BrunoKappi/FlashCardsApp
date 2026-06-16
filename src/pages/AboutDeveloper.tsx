import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaGlobe, FaLinkedin, FaBookOpen } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "Sobre o Desenvolvedor",
        back: "Voltar",
        developerName: "Bruno Kappi",
        role: "Desenvolvedor Fullstack & Analista de Sistemas",
        location: "Novo Hamburgo, Rio Grande do Sul, Brasil",
        bio1: "Com experiência tanto em automação industrial quanto em desenvolvimento web moderno, Bruno traz uma combinação única de profundidade técnica e visão de produto para tudo o que constrói.",
        bio2: "Ele acredita que o software deve ser elegante, eficiente e, acima de tudo, útil.",
        portfolio: "Portfólio",
        blog: "Blog"
    },
    en: {
        title: "About the Developer",
        back: "Back",
        developerName: "Bruno Kappi",
        role: "Fullstack Developer & Systems Analyst",
        location: "Novo Hamburgo, Rio Grande do Sul, Brazil",
        bio1: "With a background in both industrial automation and modern web development, Bruno brings a rare blend of technical depth and product vision to everything he builds.",
        bio2: "He believes software should be elegant, efficient, and most of all, useful.",
        portfolio: "Portfolio",
        blog: "Blog"
    },
    es: {
        title: "Sobre el Desarrollador",
        back: "Volver",
        developerName: "Bruno Kappi",
        role: "Desarrollador Fullstack y Analista de Sistemas",
        location: "Novo Hamburgo, Rio Grande do Sul, Brasil",
        bio1: "Con experiencia tanto en automatización industrial como en desarrollo web moderno, Bruno aporta una combinación única de profundidad técnica y visión de producto a todo lo que construye.",
        bio2: "Él cree que el software debe ser elegante, eficiente y, sobre todo, útil.",
        portfolio: "Portafolio",
        blog: "Blog"
    }
};

const AboutDeveloper: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useApp();

    const activeText = translations[language] || translations.pt;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
            >
                <FaArrowLeft className="text-xs" /> {activeText.back}
            </button>
            
            <div className="bg-card border border-border/40 rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Photo & Location Info */}
                <div className="flex flex-col items-center text-center shrink-0">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                        <img 
                            src="https://cdn.bkappi.com/BrunoKappi/Images/ProfilePicture.jpg" 
                            alt="Bruno Kappi" 
                            className="relative h-32 w-32 object-cover rounded-full border-2 border-card shadow-lg group-hover:scale-[1.03] transition-transform duration-300"
                        />
                    </div>
                    
                    <h2 className="text-xl font-bold mt-4 text-foreground">{activeText.developerName}</h2>
                    <p className="text-xs text-muted-foreground max-w-[200px] mt-1.5 leading-snug">{activeText.location}</p>
                </div>

                {/* Content & Social Links */}
                <div className="flex-1 flex flex-col justify-between text-center md:text-left h-full">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                            🚀 {activeText.title}
                        </span>
                        
                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-4">
                            {activeText.role}
                        </h1>
                        
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                            {activeText.bio1}
                        </p>
                        
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 font-medium">
                            {activeText.bio2}
                        </p>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-auto">
                        <a 
                            href="https://portfolio.bkappi.com/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow transition-colors"
                        >
                            <FaGlobe /> {activeText.portfolio}
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/brunokappi/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-colors"
                        >
                            <FaLinkedin className="text-[#0a66c2]" /> LinkedIn
                        </a>
                        <a 
                            href="https://blog.bkappi.com/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-colors"
                        >
                            <FaBookOpen className="text-amber-500" /> {activeText.blog}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutDeveloper;
