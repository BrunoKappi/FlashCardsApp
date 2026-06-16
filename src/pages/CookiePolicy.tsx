import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "Política de Cookies",
        lastUpdated: "Última atualização: 16 de Junho de 2026",
        back: "Voltar",
        sections: [
            {
                title: "1. O que são Cookies?",
                content: "Cookies e tecnologias semelhantes (como LocalStorage) são pequenos arquivos de texto ou dados baixados no seu navegador ao acessar sites. Eles ajudam a plataforma a lembrar de ações e preferências (como login, idioma, tamanho da fonte e outras preferências de exibição) ao longo do tempo."
            },
            {
                title: "2. Como utilizamos essas tecnologias?",
                content: "A Flashcards.io faz uso mínimo de armazenamento, focando estritamente em dados essenciais para o funcionamento técnico e para guardar as suas preferências de customização."
            },
            {
                title: "3. Classificação das Tecnologias de Armazenamento Utilizadas",
                content: "",
                cards: [
                    {
                        name: "A. Estritamente Necessários (Funcionais)",
                        desc: "Esses dados são cruciais para que o site funcione corretamente e forneça os serviços esperados.",
                        items: [
                            "theme: Salva se você escolheu o Modo Claro ou Modo Escuro para exibição consistente.",
                            "language: Salva sua preferência de idioma (PT, EN, ES) para que a tradução seja aplicada imediatamente no próximo acesso.",
                            "cookie-consent-choice: Registra a aceitação ou rejeição do banner de termos/cookies para evitar exibições recorrentes."
                        ]
                    },
                    {
                        name: "B. Armazenamento de Conteúdo (Local)",
                        desc: "Os cartões de estudo (flashcards) criados pelo usuário são mantidos na memória do navegador para que não se percam a cada reinicialização da página."
                    }
                ]
            },
            {
                title: "4. Como gerenciar e excluir Cookies?",
                content: "Você pode gerenciar as preferências diretamente pelo seu navegador. A maioria dos navegadores permite bloquear cookies ou limpar dados de navegação armazenados:",
                list: [
                    "Para limpar suas preferências visuais e cartões de estudos, basta limpar o histórico de navegação ou os dados locais do site nas configurações do navegador.",
                    "A rejeição ou bloqueio total das chaves essenciais pode impedir o funcionamento correto da plataforma, fazendo com que as configurações e cartões sejam reiniciados a cada visita."
                ]
            }
        ]
    },
    en: {
        title: "Cookie Policy",
        lastUpdated: "Last updated: June 16, 2026",
        back: "Back",
        sections: [
            {
                title: "1. What are Cookies?",
                content: "Cookies and similar technologies (like LocalStorage) are small text files or data downloaded to your browser when accessing websites. They help the platform remember actions and preferences (such as login, language, font size, and other display preferences) over time."
            },
            {
                title: "2. How do we use these technologies?",
                content: "Flashcards.io makes minimal use of storage, focusing strictly on data essential for technical operations and to save your customization preferences."
            },
            {
                title: "3. Classification of Storage Technologies Used",
                content: "",
                cards: [
                    {
                        name: "A. Strictly Necessary (Functional)",
                        desc: "This data is crucial for the website to function properly and provide the expected services.",
                        items: [
                            "theme: Saves whether you chose Light Mode or Dark Mode for consistent display.",
                            "language: Saves your language preference (PT, EN, ES) so the translation is applied immediately on next access.",
                            "cookie-consent-choice: Records acceptance or rejection of the terms/cookie banner to avoid recurring displays."
                        ]
                    },
                    {
                        name: "B. Content Storage (Local)",
                        desc: "The study cards (flashcards) created by the user are kept in the browser's memory so that they are not lost on each page reload."
                    }
                ]
            },
            {
                title: "4. How to manage and delete Cookies?",
                content: "You can manage preferences directly through your browser. Most browsers allow you to block cookies or clear stored browsing data:",
                list: [
                    "To clear your visual preferences and flashcards, simply clear the browsing history or local site data in your browser settings.",
                    "Rejecting or blocking essential keys may prevent the platform from working properly, causing preferences and cards to reset on each visit."
                ]
            }
        ]
    },
    es: {
        title: "Política de Cookies",
        lastUpdated: "Última actualización: 16 de Junio de 2026",
        back: "Volver",
        sections: [
            {
                title: "1. ¿Qué son las Cookies?",
                content: "Las cookies y tecnologías similares (como LocalStorage) son pequeños archivos de texto o datos que se descargan en su navegador al acceder a sitios web. Ayudan a la plataforma a recordar acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) a lo largo del tiempo."
            },
            {
                title: "2. ¿Cómo utilizamos estas tecnologías?",
                content: "Flashcards.io hace un uso mínimo del almacenamiento, centrándose estrictamente en los datos esenciales para el funcionamiento técnico y para guardar sus preferencias de personalización."
            },
            {
                title: "3. Clasificación de las Tecnologías de Almacenamiento Utilizadas",
                content: "",
                cards: [
                    {
                        name: "A. Estrictamente Necesarias (Funcionales)",
                        desc: "Estos datos son cruciales para que el sitio funcione correctamente y proporcione los servicios esperados.",
                        items: [
                            "theme: Guarda si eligió el Modo Claro o Modo Oscuro para una visualización consistente.",
                            "language: Guarda su preferencia de idioma (PT, EN, ES) para que la traducción se aplique inmediatamente en el próximo acceso.",
                            "cookie-consent-choice: Registra la aceptación o rechazo de los términos/cookies para evitar visualizaciones recurrentes."
                        ]
                    },
                    {
                        name: "B. Almacenamiento de Contenido (Local)",
                        desc: "Las tarjetas de estudio (flashcards) creadas por el usuario se mantienen en la memoria del navegador para que no se pierdan en cada recarga de la página."
                    }
                ]
            },
            {
                title: "4. ¿Cómo administrar y eliminar las Cookies?",
                content: "Puede administrar las preferencias directamente a través de su navegador. La mayoría de los navegadores le permiten bloquear cookies o borrar los datos de navegación almacenados:",
                list: [
                    "Para borrar sus preferencias visuales y tarjetas de estudio, simplemente borre el historial de navegación o los datos locales del sitio en la configuración de su navegador.",
                    "El rechazo o bloqueo de claves esenciales puede impedir que la plataforma funcione correctamente, lo que provocará que las preferencias y tarjetas se restablezcan en cada visita."
                ]
            }
        ]
    }
};

const CookiePolicy: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useApp();

    const activeText = translations[language] || translations.pt;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
            >
                <FaArrowLeft className="text-xs" /> {activeText.back}
            </button>
            
            <div className="bg-card border border-border/40 rounded-2xl shadow-lg p-6 sm:p-10 transition-all duration-300">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2">
                    {activeText.title}
                </h1>
                <p className="text-xs text-muted-foreground mb-6">{activeText.lastUpdated}</p>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
                    {activeText.sections.map((sec, idx) => (
                        <section key={idx}>
                            <h2 className="text-lg font-bold text-foreground mb-2">{sec.title}</h2>
                            {sec.content && <p className="text-muted-foreground">{sec.content}</p>}
                            {sec.cards && (
                                <div className="space-y-4 mt-2">
                                    {sec.cards.map((card, cardIdx) => (
                                        <div key={cardIdx} className="border border-border/40 bg-muted/30 rounded-lg p-4">
                                            <h3 className="font-semibold text-foreground text-sm">{card.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
                                            {card.items && (
                                                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
                                                    {card.items.map((item, itemIdx) => (
                                                        <li key={itemIdx}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {sec.list && (
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                                    {sec.list.map((item, itemIdx) => (
                                        <li key={itemIdx}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
