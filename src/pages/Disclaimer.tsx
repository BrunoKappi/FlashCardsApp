import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "Termo de Responsabilidade e Isenção",
        lastUpdated: "Última atualização: 16 de Junho de 2026",
        back: "Voltar",
        sections: [
            {
                title: "1. Finalidade Educacional e Informativa",
                content: "A Flashcards.io é uma plataforma digital desenvolvida estritamente para propósitos educacionais, de estudo pessoal e entretenimento (por meio de jogos de trivia). O conteúdo disponibilizado ou criado na plataforma não deve ser interpretado como aconselhamento profissional, acadêmico formal ou instrução oficial de qualquer espécie."
            },
            {
                title: "2. Isenção de Garantias de Desempenho",
                content: "O uso da técnica de repetição espaçada por meio de flashcards e a participação em trivias são métodos de apoio ao estudo. Não garantimos aprovação em exames, concursos, testes acadêmicos, certificações ou qualquer tipo de melhoria direta de desempenho intelectual. O rendimento acadêmico é de inteira responsabilidade da dedicação e metodologia adotadas pelo próprio usuário."
            },
            {
                title: "3. Conteúdo Gerado pelo Usuário",
                content: "Os flashcards, tópicos, perguntas e respostas criados e cadastrados no sistema são de responsabilidade exclusiva dos usuários que os geraram. A plataforma não realiza pré-triagem, verificação de acurácia factual, correção ortográfica ou moderação prévia dos conteúdos criados pelos usuários, não se responsabilizando por eventuais erros conceituais ou conteúdos incorretos presentes nas fichas de estudo criadas."
            },
            {
                title: "4. Funcionamento Técnico e Integridade dos Dados",
                content: "A plataforma utiliza armazenamento em navegador (local storage) para guardar suas listas de cartões e configurações de tema e idioma. Falhas no dispositivo, exclusão manual de dados do navegador, formatações ou atualizações do sistema operacional podem causar a perda irremediável desses cartões. Recomendamos que o usuário mantenha backups externos dos seus tópicos de estudo. A plataforma exime-se de qualquer obrigação de ressarcimento por dados perdidos."
            }
        ]
    },
    en: {
        title: "Disclaimer & Limitation of Liability",
        lastUpdated: "Last updated: June 16, 2026",
        back: "Back",
        sections: [
            {
                title: "1. Educational and Informational Purpose",
                content: "Flashcards.io is a digital platform developed strictly for educational purposes, personal study, and entertainment (through trivia games). The content made available or created on the platform should not be interpreted as professional, formal academic, or official advice of any kind."
            },
            {
                title: "2. Disclaimer of Performance Guarantees",
                content: "The use of spaced repetition techniques through flashcards and participation in trivias are study support methods. We do not guarantee approval in exams, contests, academic tests, certifications, or any kind of direct improvement in intellectual performance. Academic achievement is the sole responsibility of the dedication and methodology adopted by the user."
            },
            {
                title: "3. User-Generated Content",
                content: "The flashcards, topics, questions, and answers created and registered in the system are the exclusive responsibility of the users who generated them. The platform does not pre-screen, verify factual accuracy, correct spelling, or moderate user content. Therefore, it is not responsible for any conceptual errors or incorrect information present in the created study materials."
            },
            {
                title: "4. Technical Operation and Data Integrity",
                content: "The platform uses browser storage (local storage) to store your cards and your theme and language preferences. Device failures, manual deletion of browser data, formatting, or operating system updates can cause the permanent loss of these cards. We recommend that the user keep external backups of their study topics. The platform is exempt from any obligation to compensate for lost data."
            }
        ]
    },
    es: {
        title: "Descargo de Responsabilidad y Exención",
        lastUpdated: "Última actualización: 16 de Junio de 2026",
        back: "Volver",
        sections: [
            {
                title: "1. Finalidad Educativa e Informativa",
                content: "Flashcards.io es una plataforma digital desarrollada estrictamente con fines educativos, de estudio personal y entretenimiento (a través de juegos de trivia). El contenido disponible o creado en la plataforma no debe interpretarse como asesoramiento profesional, académico formal o instrucción oficial de ningún tipo."
            },
            {
                title: "2. Exención de Garantías de Rendimiento",
                content: "El uso de la técnica de repetición espaciada mediante tarjetas y la participación en trivias son métodos de apoyo al estudio. No garantizamos la aprobación en exámenes, oposiciones, pruebas académicas, certificaciones ni ningún tipo de mejora directa del rendimiento intelectual. El rendimiento académico es responsabilidad exclusiva de la dedicación y metodología adoptadas por el propio usuario."
            },
            {
                title: "3. Contenido Generado por el Usuario",
                content: "Las tarjetas de estudio, temas, preguntas y respuestas creadas y registradas en el sistema son responsabilidad exclusiva de los usuarios que las generaron. La plataforma no realiza filtrado previo, verificación de precisión de los hechos, corrección ortográfica o moderación previa de los contenidos creados por los usuarios, por lo que no se hace responsable de posibles errores conceptuales o contenidos incorrectos presentes en las fichas de estudio creadas."
            },
            {
                title: "4. Funcionamiento Técnico e Integridad de Datos",
                content: "La plataforma utiliza almacenamiento en el navegador (local storage) para guardar sus listas de tarjetas y la configuración de tema e idioma. Fallos del dispositivo, eliminación manual de datos del navegador, formateos o actualizaciones del sistema operativo pueden causar la pérdida irreversible de estas tarjetas. Recomendamos que el usuario mantenga copias de seguridad externas de sus temas de estudio. La plataforma se exime de cualquier obligación de compensación por la pérdida de datos."
            }
        ]
    }
};

const Disclaimer: React.FC = () => {
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
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
