// Translation Dictionary
const translations = {
    en: {
        docTitle: "Flashcards - Study Smarter & Master Any Subject",
        navFeatures: "Features",
        navDemo: "Interactive Demo",
        navGallery: "Screenshots",
        ctaLaunchBtn: "Launch App",
        heroBadge: "✨ 100% Free & Offline-First",
        heroTitle: "Supercharge Your Learning with Flashcards & Trivia",
        heroSubtitle: "An elegant, gamified, and responsive study application designed to help you memorize anything faster through spaced repetition, custom study sessions, and offline trivia.",
        heroCtaPrimary: "Start Learning Now",
        heroCtaSecondary: "Try Live Demo",
        featuresSectionTitle: "Core Features Tailored for You",
        featuresSectionSubtitle: "Everything you need to learn, test your knowledge, and track your accomplishments on any device.",
        feature1Title: "Custom Study Decks",
        feature1Desc: "Organize your flashcards into neat, searchable categories. Edit, add, or delete decks and cards dynamically.",
        feature2Title: "Manual & Automatic Modes",
        feature2Desc: "Flip cards manually to learn at your own pace, or play them in automatic slideshow mode with customizable timing.",
        feature3Title: "Offline Trivia Game",
        feature3Desc: "Generate offline quiz questions dynamically across multiple categories. Earn bonus XP for correct answers.",
        feature4Title: "Analytics & XP System",
        feature4Desc: "Visualize your study performance with rich interactive charts, track sessions, and gain experience levels (XP).",
        feature5Title: "Backup Wizard",
        feature5Desc: "Never lose your decks. Seamlessly export or import all flashcards, stats, and achievements as a light JSON file.",
        feature6Title: "100% Free & Private",
        feature6Desc: "Your learning stays yours. No tracking, no mandatory cloud sign-ins. All data is saved inside your browser database (Dexie/IndexedDB).",
        demoSectionTitle: "Try the Interactive Demos",
        demoSectionSubtitle: "Test drive the application's core logic directly from this landing page with the interactive simulators below.",
        demo1Title: "Flashcard Deck Simulator",
        demo1Desc: "Click on the card below to flip it and reveal the answer. Toggle buttons to change cards.",
        demoCardTag: "Programming",
        demoCardAnswerTag: "Answer",
        demoCardHint: "Click to Flip",
        demoPrevBtn: "Previous Card",
        demoNextBtn: "Next Card",
        demo2Title: "Mini Trivia Challenge",
        demo2Desc: "Test your speed! Select the correct option below and check if you win. Accumulate XP points!",
        triviaXpText: "XP Score:",
        triviaNextQuestionBtn: "Next Question",
        galleryTitle: "Application Walkthrough",
        gallerySubtitle: "A visual walkthrough of the interface under different modes and settings.",
        galleryLabelDashboard: "1. Core Application Dashboard",
        galleryLabelTrivia: "2. Gamified Trivia Mode",
        galleryLabelExport: "3. Advanced Data Export/Import",
        galleryLabelPrint: "4. Printing and Offline Sharing",
        ctaBannerTitle: "Ready to supercharge your studies?",
        ctaBannerSubtitle: "Create your custom categories, build cards, challenge yourself with trivia, and export your backups anytime. Totally free, no credit card required.",
        ctaBannerPrimaryBtn: "Launch Web Application",
        footerDesc: "Open-source premium learning tool designed to improve spaced repetition memory retention. Safe, fast, offline-first, and fully customizable.",
        footerNavHeader: "Navigation",
        footerNavHome: "Home",
        footerNavFeatures: "Features",
        footerNavDemo: "Demos",
        footerNavGallery: "Gallery",
        footerLegalHeader: "Legal",
        footerLegalTerms: "Terms of Use",
        footerLegalPrivacy: "Privacy Policy",
        footerLegalDisclaimer: "Disclaimer"
    },
    pt: {
        docTitle: "Flashcards - Estude Melhor e Domine Qualquer Assunto",
        navFeatures: "Funcionalidades",
        navDemo: "Demo Interativa",
        navGallery: "Prints",
        ctaLaunchBtn: "Iniciar App",
        heroBadge: "✨ 100% Gratuito e Offline-First",
        heroTitle: "Acelere seu Aprendizado com Flashcards e Trivia",
        heroSubtitle: "Um aplicativo de estudos elegante, gamificado e responsivo projetado para ajudar você a memorizar mais rápido por meio de repetição espaçada, sessões personalizadas e trivias offline.",
        heroCtaPrimary: "Começar a Estudar",
        heroCtaSecondary: "Testar Demo",
        featuresSectionTitle: "Funcionalidades Principais",
        featuresSectionSubtitle: "Tudo o que você precisa para aprender, testar seus conhecimentos e acompanhar seus resultados em qualquer dispositivo.",
        feature1Title: "Baralhos Personalizados",
        feature1Desc: "Organize seus flashcards em categorias limpas e pesquisáveis. Edite, adicione ou exclua baralhos e cartões de forma dinâmica.",
        feature2Title: "Modos Manual e Automático",
        feature2Desc: "Gire os cartões manualmente para aprender no seu próprio ritmo, ou reproduza-os no modo automático com tempo customizado.",
        feature3Title: "Jogo de Trivia Offline",
        feature3Desc: "Gere perguntas de quizzes offline dinamicamente em diversas categorias globais. Ganhe XP bônus pelas respostas corretas.",
        feature4Title: "Estatísticas e Níveis de XP",
        feature4Desc: "Visualize seu desempenho de estudo com gráficos interativos detalhados, registre suas sessões e suba de nível (XP).",
        feature5Title: "Assistente de Backup",
        feature5Desc: "Nunca perca seus baralhos. Exporte ou importe facilmente todos os seus flashcards, métricas e XP em um arquivo JSON leve.",
        feature6Title: "100% Gratuito e Privado",
        feature6Desc: "Seu estudo pertence a você. Sem rastreamento, sem cadastros obrigatórios em nuvem. Todos os dados ficam no banco local (IndexedDB).",
        demoSectionTitle: "Experimente os Demos Interativos",
        demoSectionSubtitle: "Teste a lógica essencial da aplicação diretamente desta página com os simuladores interativos abaixo.",
        demo1Title: "Simulador de Flashcards",
        demo1Desc: "Clique no cartão abaixo para girá-lo e revelar a resposta. Use os botões para navegar entre os cartões.",
        demoCardTag: "Programação",
        demoCardAnswerTag: "Resposta",
        demoCardHint: "Clique para Girar",
        demoPrevBtn: "Card Anterior",
        demoNextBtn: "Próximo Card",
        demo2Title: "Mini Desafio de Trivia",
        demo2Desc: "Teste sua velocidade! Selecione a alternativa correta abaixo para pontuar e acumular pontos de XP!",
        triviaXpText: "Pontuação XP:",
        triviaNextQuestionBtn: "Próxima Pergunta",
        galleryTitle: "Demonstração Visual",
        gallerySubtitle: "Um passo a passo visual da interface sob diferentes modos e configurações.",
        galleryLabelDashboard: "1. Painel Principal do Aplicativo",
        galleryLabelTrivia: "2. Jogo de Trivia Gamificado",
        galleryLabelExport: "3. Importação e Exportação Avançada",
        galleryLabelPrint: "4. Impressão e Compartilhamento Offline",
        ctaBannerTitle: "Pronto para turbinar seus estudos?",
        ctaBannerSubtitle: "Crie categorias, adicione cartões, divirta-se com trivias e faça backups sempre que desejar. Totalmente gratuito, sem necessidade de cartão de crédito.",
        ctaBannerPrimaryBtn: "Iniciar Aplicativo Web",
        footerDesc: "Ferramenta de aprendizado de código aberto projetada para otimizar a retenção através de repetição espaçada. Seguro, rápido, offline e personalizável.",
        footerNavHeader: "Navegação",
        footerNavHome: "Início",
        footerNavFeatures: "Funcionalidades",
        footerNavDemo: "Demos",
        footerNavGallery: "Galeria",
        footerLegalHeader: "Legal",
        footerLegalTerms: "Termos de Uso",
        footerLegalPrivacy: "Política de Privacidade",
        footerLegalDisclaimer: "Aviso Legal"
    },
    es: {
        docTitle: "Flashcards - Estudia Mejor y Domina Cualquier Tema",
        navFeatures: "Funciones",
        navDemo: "Demo Interactiva",
        navGallery: "Capturas",
        ctaLaunchBtn: "Iniciar App",
        heroBadge: "✨ 100% Gratis y Offline-First",
        heroTitle: "Acelera tu Aprendizaje con Flashcards y Trivia",
        heroSubtitle: "Una aplicación de estudio elegante, gamificada y responsiva diseñada para ayudarte a memorizar más rápido mediante repetición espaciada, sesiones personalizadas y trivia offline.",
        heroCtaPrimary: "Comenzar a Estudiar",
        heroCtaSecondary: "Probar Demo",
        featuresSectionTitle: "Funciones Clave Diseñadas para Ti",
        featuresSectionSubtitle: "Todo lo que necesitas para aprender, evaluar tus conocimientos y seguir tu progreso en cualquier dispositivo.",
        feature1Title: "Mazos Personalizados",
        feature1Desc: "Organiza tus tarjetas de estudio en categorías limpias y buscables. Edita, añade o elimina mazos y tarjetas dinámicamente.",
        feature2Title: "Modos Manual y Automático",
        feature2Desc: "Voltea las tarjetas manualmente para aprender a tu propio ritmo, o reprodúcelas en modo automático con tiempos personalizados.",
        feature3Title: "Juego de Trivia Offline",
        feature3Desc: "Genera preguntas de trivia fuera de línea de forma dinámica en múltiples categorías. Gana XP por las respuestas correctas.",
        feature4Title: "Estadísticas y Niveles de XP",
        feature4Desc: "Visualiza tu rendimiento con gráficos interactivos avanzados, realiza un seguimiento de tus sesiones y sube de nivel (XP).",
        feature5Title: "Asistente de Copias de Seguridad",
        feature5Desc: "Nunca pierdas tus mazos. Exporta o importa sin problemas todas tus tarjetas, estadísticas y XP como un archivo JSON ligero.",
        feature6Title: "100% Gratis y Privado",
        feature6Desc: "Tu aprendizaje te pertenece. Sin rastreo, sin registros obligatorios en la nube. Todos los datos se guardan en tu base de datos local (IndexedDB).",
        demoSectionTitle: "Prueba las Demos Interactivas",
        demoSectionSubtitle: "Prueba la lógica principal de la aplicación directamente desde esta página de destino con los simuladores interactivos a continuación.",
        demo1Title: "Simulador de Tarjetas de Estudio",
        demo1Desc: "Haz clic en la tarjeta a continuación para voltearla y ver la respuesta. Usa los botones para cambiar de tarjeta.",
        demoCardTag: "Programación",
        demoCardAnswerTag: "Respuesta",
        demoCardHint: "Clic para Voltear",
        demoPrevBtn: "Tarjeta Anterior",
        demoNextBtn: "Siguiente Tarjeta",
        demo2Title: "Mini Desafío de Trivia",
        demo2Desc: "¡Prueba tu velocidad! Selecciona la opción correcta a continuación y comprueba si ganas. ¡Acumula puntos XP!",
        triviaXpText: "Puntaje XP:",
        triviaNextQuestionBtn: "Siguiente Pregunta",
        galleryTitle: "Guía Visual de la Aplicación",
        gallerySubtitle: "Un recorrido visual por la interfaz en diferentes modos y configuraciones.",
        galleryLabelDashboard: "1. Panel de Control Principal",
        galleryLabelTrivia: "2. Modo de Trivia Gamificada",
        galleryLabelExport: "3. Importación y Exportación de Datos",
        galleryLabelPrint: "4. Impresión y Uso Compartido Offline",
        ctaBannerTitle: "¿Listo para acelerar tus estudios?",
        ctaBannerSubtitle: "Crea tus categorías personalizadas, crea tarjetas, ponte a prueba con trivias y exporta tus copias de seguridad en cualquier momento. Totalmente gratis.",
        ctaBannerPrimaryBtn: "Iniciar Aplicación Web",
        footerDesc: "Herramienta de aprendizaje premium de código abierto diseñada para mejorar la retención de la memoria. Segura, rápida, offline y personalizable.",
        footerNavHeader: "Navegación",
        footerNavHome: "Inicio",
        footerNavFeatures: "Funciones",
        footerNavDemo: "Demos",
        footerNavGallery: "Galería",
        footerLegalHeader: "Legal",
        footerLegalTerms: "Condiciones de Uso",
        footerLegalPrivacy: "Política de Privacidad",
        footerLegalDisclaimer: "Aviso Legal"
    }
};

// State Variables
let currentLanguage = localStorage.getItem('landing-lang') || 'en';
let currentTheme = localStorage.getItem('landing-theme') || 'dark';

// DOM Elements
const langSelect = document.getElementById('langSelect');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const heroMockupImg = document.getElementById('heroMockupImg');
const galleryDashboardImg = document.getElementById('galleryDashboardImg');
const galleryTriviaImg = document.getElementById('galleryTriviaImg');
const galleryExportImg = document.getElementById('galleryExportImg');

// Initialize App Setup
document.addEventListener('DOMContentLoaded', () => {
    // Set Language UI selector
    langSelect.value = currentLanguage;
    applyLanguage(currentLanguage);

    // Set Theme UI
    applyTheme(currentTheme);

    // Set up interactive simulator
    initFlashcardSimulator();
    initTriviaSimulator();
});

// Theme Logic
themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('landing-theme', theme);
    
    // Toggle body classes
    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    // Dynamic asset swap for light vs dark screenshots
    const themeSuffix = theme === 'light' ? 'Light' : 'Dark';
    
    if (heroMockupImg) {
        heroMockupImg.src = `https://cdn.bkappi.com/ProjectsAssets/Flashcards/HomePage${themeSuffix}.png`;
    }
    if (galleryDashboardImg) {
        galleryDashboardImg.src = `https://cdn.bkappi.com/ProjectsAssets/Flashcards/HomePage${themeSuffix}.png`;
    }
    if (galleryTriviaImg) {
        galleryTriviaImg.src = `https://cdn.bkappi.com/ProjectsAssets/Flashcards/TriviaGame${themeSuffix}.png`;
    }
    if (galleryExportImg) {
        galleryExportImg.src = `https://cdn.bkappi.com/ProjectsAssets/Flashcards/ExportData${themeSuffix}.png`;
    }
}

// Translation Logic
langSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    applyLanguage(selectedLang);
});

function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('landing-lang', lang);
    document.documentElement.lang = lang;

    // Update all elements with data-i18n tags
    const translateElements = document.querySelectorAll('[data-i18n]');
    translateElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        } else if (translations['en'][key]) {
            el.textContent = translations['en'][key];
        }
    });

    // Update page document title
    if (translations[lang] && translations[lang]['docTitle']) {
        document.title = translations[lang]['docTitle'];
    }

    // Sync translated content in widgets
    updateFlashcardContent();
    updateTriviaLanguageStrings();
}

// -------------------------------------------------------------
// Interactive Flashcard Simulator
// -------------------------------------------------------------
const mockFlashcards = {
    en: [
        { category: "Programming", question: "What is the Big O time complexity of accessing an element in an Array by index?", answer: "O(1) - Constant Time. Array indices allow direct calculation of memory addresses." },
        { category: "Databases", question: "What does the ACID acronym stand for in database management systems?", answer: "Atomicity, Consistency, Isolation, and Durability. These guarantee reliable transactions." },
        { category: "Web Dev", question: "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?", answer: "CSR builds HTML in the user's browser, while SSR builds HTML on the server and returns a completed page." }
    ],
    pt: [
        { category: "Programação", question: "Qual é a complexidade de tempo Big O para acessar um elemento de um Array por índice?", answer: "O(1) - Tempo Constante. Os índices de array permitem calcular diretamente os endereços de memória." },
        { category: "Banco de Dados", question: "O que significa a sigla ACID em sistemas de gerenciamento de banco de dados?", answer: "Atomicidade, Consistência, Isolamento e Durabilidade. Garante transações confiáveis." },
        { category: "Web Dev", question: "Qual a diferença entre renderização client-side (CSR) e server-side (SSR)?", answer: "CSR renderiza o HTML diretamente no navegador do usuário, enquanto SSR gera o HTML pronto no servidor antes do envio." }
    ],
    es: [
        { category: "Programación", question: "¿Cuál es la complejidad temporal Big O de acceder a un elemento en un Array por índice?", answer: "O(1) - Tiempo Constante. Los índices de array permiten calcular directamente las direcciones de memoria." },
        { category: "Bases de Datos", question: "¿Qué significan las siglas ACID en sistemas de gestión de bases de datos?", answer: "Atomicidad, Consistencia, Aislamiento y Durabilidad. Estas garantizan transacciones confiables." },
        { category: "Desarrollo Web", question: "¿Cuál es la diferencia entre renderizado en cliente (CSR) y renderizado en servidor (SSR)?", answer: "CSR genera el HTML en el navegador del usuario, mientras que SSR procesa el HTML completo en el servidor." }
    ]
};

let currentCardIndex = 0;
const demoFlipCard = document.getElementById('demoFlipCard');
const cardQuestionText = document.getElementById('cardQuestion');
const cardAnswerText = document.getElementById('cardAnswer');
const prevCardBtn = document.getElementById('prevCardBtn');
const nextCardBtn = document.getElementById('nextCardBtn');

function initFlashcardSimulator() {
    if (!demoFlipCard) return;

    // Flip Card Click Handler
    demoFlipCard.addEventListener('click', () => {
        demoFlipCard.classList.toggle('flipped');
    });

    // Keyboard trigger (Enter/Space)
    demoFlipCard.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            demoFlipCard.classList.toggle('flipped');
        }
    });

    prevCardBtn.addEventListener('click', () => {
        navigateFlashcard(-1);
    });

    nextCardBtn.addEventListener('click', () => {
        navigateFlashcard(1);
    });

    updateFlashcardContent();
}

function navigateFlashcard(direction) {
    // Return card to front first
    demoFlipCard.classList.remove('flipped');
    
    // Allow animation to reset back to front before updating content
    setTimeout(() => {
        const totalCards = mockFlashcards[currentLanguage].length;
        currentCardIndex = (currentCardIndex + direction + totalCards) % totalCards;
        updateFlashcardContent();
    }, 200);
}

function updateFlashcardContent() {
    if (!cardQuestionText || !cardAnswerText) return;
    
    const cardData = mockFlashcards[currentLanguage][currentCardIndex] || mockFlashcards['en'][currentCardIndex];
    
    // Front update
    const categoryFrontTag = demoFlipCard.querySelector('.flip-card-front .card-category-tag');
    categoryFrontTag.textContent = cardData.category;
    cardQuestionText.textContent = cardData.question;
    
    // Back update
    const categoryBackTag = demoFlipCard.querySelector('.flip-card-back .card-category-tag');
    categoryBackTag.textContent = translations[currentLanguage]?.demoCardAnswerTag || "Answer";
    cardAnswerText.textContent = cardData.answer;
}

// -------------------------------------------------------------
// Interactive Mini Trivia Simulator
// -------------------------------------------------------------
const mockTriviaQuestions = {
    en: [
        {
            category: "Science & Nature",
            question: "Which gas makes up approximately 78% of the Earth's atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
            correctIndex: 1,
            feedbackCorrect: "Correct! Nitrogen is indeed the most abundant gas. +15 XP",
            feedbackIncorrect: "Incorrect! Nitrogen is the most abundant gas (78%). Try again!"
        },
        {
            category: "General Knowledge",
            question: "What is the only country that is also a continent?",
            options: ["Canada", "Russia", "Australia", "Greenland"],
            correctIndex: 2,
            feedbackCorrect: "Correct! Australia is both a country and a continent. +15 XP",
            feedbackIncorrect: "Incorrect! The right answer is Australia. Try again!"
        },
        {
            category: "History",
            question: "In which year did the Titanic sink in the North Atlantic Ocean?",
            options: ["1912", "1905", "1923", "1898"],
            correctIndex: 0,
            feedbackCorrect: "Correct! The Titanic sank on its maiden voyage in 1912. +15 XP",
            feedbackIncorrect: "Incorrect! The Titanic struck an iceberg and sank in 1912. Try again!"
        }
    ],
    pt: [
        {
            category: "Ciência e Natureza",
            question: "Qual gás constitui aproximadamente 78% da atmosfera da Terra?",
            options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Argônio"],
            correctIndex: 1,
            feedbackCorrect: "Correto! O Nitrogênio é de fato o gás mais abundante. +15 XP",
            feedbackIncorrect: "Incorreto! O Nitrogênio é o gás mais abundante (78%). Tente novamente!"
        },
        {
            category: "Conhecimentos Gerais",
            question: "Qual é o único país que também é considerado um continente?",
            options: ["Canadá", "Rússia", "Austrália", "Groenlândia"],
            correctIndex: 2,
            feedbackCorrect: "Correto! A Austrália é tanto um país quanto um continente. +15 XP",
            feedbackIncorrect: "Incorreto! A resposta correta é Austrália. Tente novamente!"
        },
        {
            category: "História",
            question: "Em que ano o Titanic afundou no Oceano Atlântico Norte?",
            options: ["1912", "1905", "1923", "1898"],
            correctIndex: 0,
            feedbackCorrect: "Correto! O Titanic afundou em sua viagem inaugural em 1912. +15 XP",
            feedbackIncorrect: "Incorreto! O Titanic colidiu com um iceberg e afundou em 1912. Tente novamente!"
        }
    ],
    es: [
        {
            category: "Ciencia y Naturaleza",
            question: "¿Qué gas constituye aproximadamente el 78% de la atmósfera terrestre?",
            options: ["Oxígeno", "Nitrógeno", "Dióxido de Carbono", "Argón"],
            correctIndex: 1,
            feedbackCorrect: "¡Correcto! El Nitrógeno es, de hecho, el gas más abundante. +15 XP",
            feedbackIncorrect: "¡Incorrecto! El Nitrógeno es el gas más abundante (78%). ¡Inténtalo de nuevo!"
        },
        {
            category: "Cultura General",
            question: "¿Cuál es el único país del mundo que también es un continente?",
            options: ["Canadá", "Rusia", "Australia", "Groenlandia"],
            correctIndex: 2,
            feedbackCorrect: "¡Correcto! Australia es tanto un país como un continente. +15 XP",
            feedbackIncorrect: "¡Incorrecto! La respuesta correcta es Australia. ¡Inténtalo de nuevo!"
        },
        {
            category: "Historia",
            question: "¿En qué año se hundió el Titanic en el Océano Atlántico Norte?",
            options: ["1912", "1905", "1923", "1898"],
            correctIndex: 0,
            feedbackCorrect: "¡Correcto! El Titanic se hundió en su viaje inaugural en 1912. +15 XP",
            feedbackIncorrect: "¡Incorrecto! El Titanic chocó contra un iceberg y se hundió en 1912. ¡Inténtalo de nuevo!"
        }
    ]
};

let currentTriviaIndex = 0;
let userXp = 0;
let hasAnswered = false;

const triviaCategoryText = document.getElementById('triviaCategory');
const triviaQuestionText = document.getElementById('triviaQuestionText');
const triviaOptionsContainer = document.getElementById('triviaOptionsContainer');
const triviaFeedbackBox = document.getElementById('triviaFeedbackBox');
const triviaFeedbackText = document.getElementById('triviaFeedbackText');
const triviaNextBtn = document.getElementById('triviaNextBtn');
const triviaXpValue = document.getElementById('triviaXpValue');

function initTriviaSimulator() {
    if (!triviaOptionsContainer) return;
    
    triviaNextBtn.addEventListener('click', () => {
        loadNextTrivia();
    });

    loadTriviaQuestion();
}

function loadTriviaQuestion() {
    if (!triviaOptionsContainer) return;
    hasAnswered = false;

    // Reset feedback UI
    triviaFeedbackBox.classList.add('hidden');
    triviaFeedbackBox.classList.remove('correct', 'incorrect');

    const questionList = mockTriviaQuestions[currentLanguage] || mockTriviaQuestions['en'];
    const currentQ = questionList[currentTriviaIndex];

    triviaCategoryText.textContent = currentQ.category;
    triviaQuestionText.textContent = currentQ.question;
    
    // Clear old options
    triviaOptionsContainer.innerHTML = '';

    // Render options
    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'trivia-option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectTriviaOption(index, btn));
        triviaOptionsContainer.appendChild(btn);
    });
}

function selectTriviaOption(selectedIndex, buttonElement) {
    if (hasAnswered) return;
    hasAnswered = true;

    const questionList = mockTriviaQuestions[currentLanguage] || mockTriviaQuestions['en'];
    const currentQ = questionList[currentTriviaIndex];
    const correctIdx = currentQ.correctIndex;
    const allOptionButtons = triviaOptionsContainer.querySelectorAll('.trivia-option');

    // Disable all options and show answers
    allOptionButtons.forEach((btn, idx) => {
        btn.style.cursor = 'not-allowed';
        if (idx === correctIdx) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });

    // Check correctness
    if (selectedIndex === correctIdx) {
        userXp += 15;
        triviaXpValue.textContent = userXp;
        triviaFeedbackText.textContent = currentQ.feedbackCorrect;
        triviaFeedbackBox.classList.add('correct');
    } else {
        triviaFeedbackText.textContent = currentQ.feedbackIncorrect;
        triviaFeedbackBox.classList.add('incorrect');
    }

    // Show feedback box
    triviaFeedbackBox.classList.remove('hidden');
}

function loadNextTrivia() {
    const questionList = mockTriviaQuestions[currentLanguage] || mockTriviaQuestions['en'];
    currentTriviaIndex = (currentTriviaIndex + 1) % questionList.length;
    loadTriviaQuestion();
}

function updateTriviaLanguageStrings() {
    // Update active question elements for current language
    const xpTextSpan = document.querySelector('.trivia-xp-badge span:first-child');
    if (xpTextSpan && translations[currentLanguage]) {
        xpTextSpan.textContent = translations[currentLanguage].triviaXpText;
    }
    
    // Reload active question texts
    loadTriviaQuestion();
}
