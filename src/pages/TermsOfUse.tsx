import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "Termos de Uso",
        lastUpdated: "Última atualização: 16 de Junho de 2026",
        back: "Voltar",
        sections: [
            {
                title: "1. Aceitação dos Termos",
                content: "Ao acessar e utilizar a plataforma Flashcards.io, você concorda em cumprir e estar vinculado a estes Termos de Uso. Caso não concorde com qualquer parte deste documento, recomendamos que não utilize nossos serviços."
            },
            {
                title: "2. Descrição do Serviço",
                content: "O Flashcards.io é uma ferramenta interativa voltada para o aprendizado e memorização através de cartões de estudo (flashcards) e jogos de perguntas (trivia). O serviço é fornecido de forma digital e depende da interação direta do usuário."
            },
            {
                title: "3. Cadastro e Segurança",
                content: "Para usufruir de determinados recursos da plataforma, o usuário poderá armazenar informações localmente. O usuário é inteiramente responsável por manter a confidencialidade de seus dados de navegação e pelas atividades que ocorram sob seu dispositivo de acesso."
            },
            {
                title: "4. Propriedade Intelectual e Conteúdo do Usuário",
                content: "O conteúdo criado, importado ou adicionado à plataforma pelo usuário (como perguntas e respostas personalizadas) permanece sob sua propriedade. Contudo, ao utilizar a plataforma, o usuário concede autorização técnica para processamento local desse material. O design, código-fonte e marcas associadas ao Flashcards.io são propriedade intelectual protegida por lei."
            },
            {
                title: "5. Condutas Proibidas",
                content: "O usuário se compromete a não utilizar a plataforma para:",
                list: [
                    "Armazenar ou propagar conteúdo ilícito, ofensivo, difamatório ou prejudicial;",
                    "Tentar violar a segurança do sistema ou acessar dados de terceiros;",
                    "Executar scripts automatizados ou engenharia reversa que prejudique a performance da plataforma."
                ]
            },
            {
                title: "6. Limitação de Responsabilidade",
                content: "A plataforma é disponibilizada \"como está\", sem garantias implícitas ou explícitas de funcionamento ininterrupto ou de resultados acadêmicos específicos. Não nos responsabilizamos por perdas de dados decorrentes de falhas técnicas nos navegadores ou dispositivos dos usuários."
            },
            {
                title: "7. Alterações nos Termos",
                content: "Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. Modificações importantes serão sinalizadas na plataforma. A continuidade do uso após as alterações implica na aceitação tácita das novas diretrizes."
            },
            {
                title: "8. Lei Aplicável e Foro",
                content: "Estes termos são regidos pelas leis da República Federativa do Brasil, em especial a Lei Geral de Proteção de Dados (LGPD). Fica eleito o foro do domicílio do usuário para dirimir quaisquer dúvidas decorrentes deste instrumento."
            }
        ]
    },
    en: {
        title: "Terms of Use",
        lastUpdated: "Last updated: June 16, 2026",
        back: "Back",
        sections: [
            {
                title: "1. Acceptance of Terms",
                content: "By accessing and using the Flashcards.io platform, you agree to comply with and be bound by these Terms of Use. If you do not agree with any part of this document, we recommend that you do not use our services."
            },
            {
                title: "2. Description of Service",
                content: "Flashcards.io is an interactive tool for learning and memorization using study cards (flashcards) and quiz games (trivia). The service is provided digitally and depends on direct user interaction."
            },
            {
                title: "3. Registration and Security",
                content: "To use certain features of the platform, users may store information locally. Users are entirely responsible for maintaining the confidentiality of their navigation data and the activities that occur under their access device."
            },
            {
                title: "4. Intellectual Property and User Content",
                content: "Content created, imported, or added to the platform by users (such as personalized questions and answers) remains their property. However, by using the platform, the user grants technical authorization for the local processing of this material. The design, source code, and trademarks associated with Flashcards.io are intellectual property protected by law."
            },
            {
                title: "5. Prohibited Conduct",
                content: "The user agrees not to use the platform to:",
                list: [
                    "Store or propagate illegal, offensive, defamatory, or harmful content;",
                    "Attempt to violate system security or access third-party data;",
                    "Run automated scripts or reverse engineer that harms the platform's performance."
                ]
            },
            {
                title: "6. Limitation of Liability",
                content: "The platform is provided \"as is\", without implicit or explicit warranties of uninterrupted operation or specific academic results. We are not responsible for data loss due to technical failures in user browsers or devices."
            },
            {
                title: "7. Modifications of Terms",
                content: "We reserve the right to change these Terms of Use at any time. Important modifications will be signaled on the platform. Continued use after changes implies tacit acceptance of the new guidelines."
            },
            {
                title: "8. Governing Law and Jurisdiction",
                content: "These terms are governed by the laws of the Federative Republic of Brazil, in particular the General Data Protection Law (LGPD). The forum of the user's domicile is chosen to resolve any doubts arising from this instrument."
            }
        ]
    },
    es: {
        title: "Términos de Uso",
        lastUpdated: "Última actualización: 16 de Junio de 2026",
        back: "Volver",
        sections: [
            {
                title: "1. Aceptación de los Términos",
                content: "Al acceder y utilizar la plataforma Flashcards.io, usted acepta cumplir y estar sujeto a estos Términos de Uso. Si no está de acuerdo con alguna parte de este documento, le recomendamos que no utilice nuestros servicios."
            },
            {
                title: "2. Descripción del Servicio",
                content: "Flashcards.io es una herramienta interactiva para el aprendizaje y la memorización mediante tarjetas de estudio (flashcards) y juegos de preguntas (trivia). El servicio se proporciona digitalmente y depende de la interacción directa del usuario."
            },
            {
                title: "3. Registro y Seguridad",
                content: "Para utilizar ciertas características de la plataforma, el usuario puede almacenar información localmente. El usuario é enteramente responsable de mantener la confidencialidad de sus datos de navegación y de las actividades que ocurran bajo su dispositivo de acceso."
            },
            {
                title: "4. Propiedad Intelectual y Contenido del Usuario",
                content: "El contenido creado, importado o añadido a la plataforma por el usuario (como preguntas y respuestas personalizadas) sigue siendo de su propiedad. Sin embargo, al utilizar la plataforma, el usuario otorga autorización técnica para el procesamiento local de este material. El diseño, código fuente y marcas asociadas a Flashcards.io son propiedad intelectual protegida por la ley."
            },
            {
                title: "5. Conductas Prohibidas",
                content: "El usuario se compromete a no utilizar la plataforma para:",
                list: [
                    "Almacenar o propagar contenido ilícito, ofensivo, difamatorio o perjudicial;",
                    "Intentar violar la seguridad del sistema o acceder a datos de terceros;",
                    "Ejecutar scripts automatizados o ingeniería inversa que perjudique el rendimiento de la plataforma."
                ]
            },
            {
                title: "6. Limitación de Responsabilidad",
                content: "La plataforma se proporciona \"tal cual\", sin garantías implícitas o explícitas de funcionamiento ininterrumpido o resultados académicos específicos. No nos responsabilizamos de la pérdida de datos debido a fallos técnicos en los navegadores o dispositivos de los usuarios."
            },
            {
                title: "7. Modificaciones de los Términos",
                content: "Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Las modificaciones importantes se señalarán en la plataforma. El uso continuado después de los cambios implica la aceptación tácita de las nuevas directrices."
            },
            {
                title: "8. Ley Aplicable y Jurisdicción",
                content: "Estos términos se rigen por las leyes de la República Federativa de Brasil, en particular la Ley General de Protección de Datos (LGPD). Se elige el foro del domicilio del usuario para resolver cualquier duda derivada de este instrumento."
            }
        ]
    }
};

const TermsOfUse: React.FC = () => {
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
                            <p className="text-muted-foreground">{sec.content}</p>
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

export default TermsOfUse;
