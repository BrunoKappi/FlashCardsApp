import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrashAlt, FaCheck } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

const translations = {
    pt: {
        title: "Política de Privacidade",
        subtitle: "Em conformidade com a LGPD (Lei nº 13.709/2018)",
        lastUpdated: "Última atualização: 16 de Junho de 2026",
        back: "Voltar",
        sections: [
            {
                title: "1. Informações Gerais",
                content: "A presente Política de Privacidade explica como a Flashcards.io coleta, utiliza, processa e protege os dados pessoais de seus usuários de forma a garantir total transparência em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
            },
            {
                title: "2. Coleta de Dados",
                content: "Nossa plataforma foi projetada para minimizar a coleta de dados pessoais. Processamos principalmente:",
                list: [
                    "Dados de Configuração: Preferência de idioma (Inglês, Português, Espanhol) e tema visual (claro ou escuro), salvos localmente em seu dispositivo;",
                    "Dados de Estudo: Categorias e perguntas de flashcards inseridas pelo próprio usuário, armazenadas localmente no navegador (LocalStorage) ou banco de dados local da aplicação."
                ]
            },
            {
                title: "3. Finalidade do Processamento",
                content: "Os dados indicados são coletados com as seguintes finalidades exclusivas:",
                list: [
                    "Personalizar e melhorar a experiência de estudo do usuário;",
                    "Garantir o funcionamento básico da aplicação (armazenamento de cards);",
                    "Manter as preferências visuais e operacionais definidas pelo próprio usuário."
                ]
            },
            {
                title: "4. Armazenamento e Compartilhamento",
                content: "Como priorizamos o processamento no cliente (client-side), grande parte dos dados de estudos e flashcards permanecem armazenados localmente no seu navegador. Não compartilhamos, vendemos ou alugamos dados pessoais ou de conteúdo de estudos para terceiros em nenhuma hipótese."
            },
            {
                title: "5. Seus Direitos sob a LGPD",
                content: "A LGPD assegura aos titulares de dados pessoais diversos direitos. Você pode exercer a qualquer momento:",
                list: [
                    "Confirmação e Acesso: Verificar a existência do processamento de dados e obter detalhes;",
                    "Correção: Solicitar a retificação de dados incorretos ou desatualizados;",
                    "Eliminação/Exclusão: Direito de apagar todos os seus dados pessoais e cartões de estudos armazenados nesta plataforma.",
                    "Revogação de Consentimento: Retirar a autorização concedida para o uso de cookies adicionais a qualquer momento através do nosso painel de consentimento."
                ]
            },
            {
                title: "6. Segurança da Informação",
                content: "Adotamos medidas técnicas e administrativas aptas a proteger as informações de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração ou difusão."
            }
        ],
        deleteSectionTitle: "Excluir Meus Dados (Direito de Eliminação)",
        deleteSectionDesc: "Use a ferramenta abaixo para excluir todos os cartões, configurações de tema, idioma e cookies de consentimento salvos localmente no seu dispositivo. Esta ação é irreversível.",
        deleteBtn: "Excluir Todos os Meus Dados",
        deleteConfirm: "Confirmar Exclusão",
        deleteSuccess: "Todos os dados locais foram apagados com sucesso! Reiniciando a página..."
    },
    en: {
        title: "Privacy Policy",
        subtitle: "In compliance with LGPD (Brazilian General Data Protection Law)",
        lastUpdated: "Last updated: June 16, 2026",
        back: "Back",
        sections: [
            {
                title: "1. General Information",
                content: "This Privacy Policy explains how Flashcards.io collects, uses, processes, and protects personal data to ensure full transparency in accordance with the Brazilian General Data Protection Law (LGPD)."
            },
            {
                title: "2. Data Collection",
                content: "Our platform is designed to minimize the collection of personal data. We primarily process:",
                list: [
                    "Configuration Data: Language preferences (English, Portuguese, Spanish) and visual theme (light or dark), saved locally on your device;",
                    "Study Data: Categories and flashcard questions entered by the user, stored locally in the browser (LocalStorage) or the application's local database."
                ]
            },
            {
                title: "3. Purpose of Processing",
                content: "The indicated data is collected for the following exclusive purposes:",
                list: [
                    "To personalize and improve the user's study experience;",
                    "To guarantee the basic operation of the application (card storage);",
                    "To maintain the visual and operational preferences defined by the user."
                ]
            },
            {
                title: "4. Storage and Sharing",
                content: "Since we prioritize client-side processing, most study data and flashcards remain stored locally in your browser. We do not share, sell, or rent personal data or study content to third parties under any circumstances."
            },
            {
                title: "5. Your Rights under LGPD",
                content: "LGPD ensures various rights to personal data subjects. You can exercise these at any time:",
                list: [
                    "Confirmation and Access: Verify the existence of data processing and obtain details;",
                    "Correction: Request correction of incorrect or outdated data;",
                    "Erasure/Deletion: The right to delete all your personal data and flashcards stored on this platform.",
                    "Revocation of Consent: Withdraw the authorization granted for cookie usage at any time through our consent panel."
                ]
            },
            {
                title: "6. Information Security",
                content: "We adopt technical and organizational measures suitable to protect information from unauthorized access and accidental or unlawful destruction, loss, alteration, or disclosure."
            }
        ],
        deleteSectionTitle: "Delete My Data (Right to Erasure)",
        deleteSectionDesc: "Use the tool below to delete all cards, theme preferences, language settings, and cookie consents saved locally on your device. This action is irreversible.",
        deleteBtn: "Delete All My Data",
        deleteConfirm: "Confirm Deletion",
        deleteSuccess: "All local data has been successfully deleted! Reloading..."
    },
    es: {
        title: "Política de Privacidad",
        subtitle: "En conformidad con la LGPD (Ley General de Protección de Datos brasileña)",
        lastUpdated: "Última actualización: 16 de Junio de 2026",
        back: "Volver",
        sections: [
            {
                title: "1. Información General",
                content: "Esta Política de Privacidad explica cómo Flashcards.io recopila, utiliza, procesa y protege los datos personales para garantizar la total transparencia de acuerdo con la Ley General de Protección de Datos (LGPD)."
            },
            {
                title: "2. Recopilación de Datos",
                content: "Nuestra plataforma está diseñada para minimizar la recopilación de datos personales. Procesamos principalmente:",
                list: [
                    "Datos de Configuración: Preferencia de idioma (inglés, portugués, español) y tema visual (claro u oscuro), guardados localmente en su dispositivo;",
                    "Datos de Estudio: Categorías y preguntas de flashcards ingresadas por el usuario, almacenadas localmente en el navegador (LocalStorage) o base de datos local de la aplicación."
                ]
            },
            {
                title: "3. Finalidad del Procesamiento",
                content: "Los datos indicados se recopilan con las siguientes finalidades exclusivas:",
                list: [
                    "Personalizar y mejorar la experiencia de estudio del usuario;",
                    "Garantizar el funcionamiento básico de la aplicación (almacenamiento de tarjetas);",
                    "Mantener las preferencias visuales y operativas definidas por el usuario."
                ]
            },
            {
                title: "4. Almacenamiento y Compartición",
                content: "Como priorizamos el procesamiento en el cliente (client-side), la gran parte de los datos de estudio y flashcards permanecen almacenados localmente en su navegador. No compartimos, vendemos ni alquilamos datos personales o contenido de estudios a terceros bajo ninguna circunstancia."
            },
            {
                title: "5. Sus Derechos bajo la LGPD",
                content: "La LGPD garantiza diversos derechos a los titulares de datos personales. Puede ejercerlos en cualquier momento:",
                list: [
                    "Confirmación y Acceso: Verificar la existencia del procesamiento de datos y obtener detalles;",
                    "Corrección: Solicitar la rectificación de datos incorrectos o desactualizados;",
                    "Eliminación/Exclusión: Derecho a borrar todos sus datos personales y tarjetas de estudio almacenadas en esta plataforma.",
                    "Revocación del Consentimiento: Retirar la autorización otorgada para el uso de cookies en cualquier momento a través de nuestro panel de consentimiento."
                ]
            },
            {
                title: "6. Seguridad de la Información",
                content: "Adoptamos medidas técnicas y organizativas adecuadas para proteger la información frente a accesos no autorizados y destrucción, pérdida, alteración o divulgación accidental o ilícita."
            }
        ],
        deleteSectionTitle: "Eliminar Mis Datos (Derecho de Eliminación)",
        deleteSectionDesc: "Utilice la siguiente herramienta para eliminar todas las tarjetas, preferencias de tema, idioma y cookies de consentimiento guardadas localmente en su dispositivo. Esta acción es irreversible.",
        deleteBtn: "Eliminar Todos Mis Datos",
        deleteConfirm: "Confirmar Eliminación",
        deleteSuccess: "¡Todos los datos locales han sido eliminados con éxito! Recargando..."
    }
};

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useApp();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const activeText = translations[language] || translations.pt;

    const handleDeleteAllData = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        // Clear local storage
        localStorage.clear();
        
        // Clear all cookies
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        setDeleted(true);

        setTimeout(() => {
            window.location.href = '/';
        }, 2500);
    };

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
                <p className="text-xs text-muted-foreground mb-1 font-semibold">{activeText.subtitle}</p>
                <p className="text-xs text-muted-foreground mb-6">{activeText.lastUpdated}</p>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90 mb-10">
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

                {/* Right to erasure / Data Deletion Section */}
                <div className="border-t border-red-500/20 pt-8 mt-8">
                    <h2 className="text-lg font-bold text-red-500 dark:text-red-400 mb-2 flex items-center gap-2">
                        <FaTrashAlt /> {activeText.deleteSectionTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        {activeText.deleteSectionDesc}
                    </p>

                    {deleted ? (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <FaCheck /> {activeText.deleteSuccess}
                        </div>
                    ) : (
                        <button
                            onClick={handleDeleteAllData}
                            className={`cursor-pointer inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 shadow transition-all duration-200 ${
                                confirmDelete 
                                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
                            }`}
                        >
                            <FaTrashAlt className="text-xs" /> {confirmDelete ? activeText.deleteConfirm : activeText.deleteBtn}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
