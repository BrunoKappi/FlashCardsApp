import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'pt' | 'es';

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header & Navigation
    logoAlt: "Logo",
    play: "Play",
    userAlt: "User Profile",
    triviaGame: "Trivia Game",
    flashcards: "FlashCards",
    back: "Back",

    // Dashboard & Home
    selectMode: "Choose a mode to start studying",
    modeTriviaDesc: "Test your knowledge with automatically generated trivia questions.",
    modeFlashDesc: "Create and customize your own categories and flashcards.",

    // Categories
    categories: "Categories",
    searchCategories: "Search categories...",
    addCategory: "Add Category",
    editCategory: "Edit Category",
    deleteCategory: "Delete Category",
    categoryName: "Category Name",
    enterCategoryName: "Enter category name",
    noCategories: "No categories found. Create a new category to get started!",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirmDeleteCategory: "Are you sure you want to delete this category? All cards inside it will be permanently deleted.",
    confirmDeleteCard: "Are you sure you want to delete this card?",
    cardsCount: "cards",

    // Cards
    manageCards: "Manage Cards",
    addCard: "Add Card",
    editCard: "Edit Card",
    deleteCard: "Delete Card",
    question: "Question",
    answer: "Answer",
    cardType: "Card Type",
    textType: "Text Answer",
    mcType: "Multiple Choice",
    options: "Options",
    isCorrectAnswer: "Correct Answer",
    enterQuestion: "Enter the question",
    enterAnswer: "Enter the correct answer",
    enterOption: "Enter option text",
    noCards: "No cards in this category yet. Add your first card!",

    // Trivia Game Screen
    category: "Category",
    amount: "Amount of Questions",
    generate: "Generate Trivia",
    loading: "Loading trivia questions...",
    stopPlaying: "Quit Game",
    score: "Score",
    questionProgress: "Question",
    results: "Results",
    correctAnswers: "Correct Answers",
    wrongAnswers: "Wrong Answers",
    restart: "Play Again",
    correct: "Correct!",
    incorrect: "Incorrect!",
    selectAnswer: "Select an option:",
    flipCardTip: "Click on the card to flip it and reveal the answer.",
    showAnswer: "Show Answer",
  },
  pt: {
    // Header & Navigation
    logoAlt: "Logotipo",
    play: "Jogar",
    userAlt: "Perfil de Usuário",
    triviaGame: "Jogo de Trivia",
    flashcards: "FlashCards",
    back: "Voltar",

    // Dashboard & Home
    selectMode: "Escolha um modo para começar a estudar",
    modeTriviaDesc: "Teste seus conhecimentos com perguntas de trivia geradas automaticamente.",
    modeFlashDesc: "Crie e personalize suas próprias categorias e flashcards.",

    // Categories
    categories: "Categorias",
    searchCategories: "Buscar categorias...",
    addCategory: "Nova Categoria",
    editCategory: "Editar Categoria",
    deleteCategory: "Excluir Categoria",
    categoryName: "Nome da Categoria",
    enterCategoryName: "Digite o nome da categoria",
    noCategories: "Nenhuma categoria encontrada. Crie uma categoria para começar!",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    confirmDeleteCategory: "Tem certeza de que deseja excluir esta categoria? Todos os cartões dentro dela serão excluídos permanentemente.",
    confirmDeleteCard: "Tem certeza de que deseja excluir este cartão?",
    cardsCount: "cartões",

    // Cards
    manageCards: "Gerenciar Cartões",
    addCard: "Novo Cartão",
    editCard: "Editar Cartão",
    deleteCard: "Excluir Cartão",
    question: "Pergunta",
    answer: "Resposta",
    cardType: "Tipo de Cartão",
    textType: "Resposta de Texto",
    mcType: "Múltipla Escolha",
    options: "Opções",
    isCorrectAnswer: "Resposta Correta",
    enterQuestion: "Digite a pergunta",
    enterAnswer: "Digite a resposta correta",
    enterOption: "Digite o texto da opção",
    noCards: "Nenhum cartão nesta categoria ainda. Adicione seu primeiro cartão!",

    // Trivia Game Screen
    category: "Categoria",
    amount: "Quantidade de Perguntas",
    generate: "Gerar Trivia",
    loading: "Carregando perguntas da trivia...",
    stopPlaying: "Sair do Jogo",
    score: "Pontuação",
    questionProgress: "Pergunta",
    results: "Resultados",
    correctAnswers: "Respostas Corretas",
    wrongAnswers: "Respostas Incorretas",
    restart: "Jogar Novamente",
    correct: "Correto!",
    incorrect: "Incorreto!",
    selectAnswer: "Selecione uma opção:",
    flipCardTip: "Clique no cartão para girar e revelar a resposta.",
    showAnswer: "Mostrar Resposta",
  },
  es: {
    // Header & Navigation
    logoAlt: "Logotipo",
    play: "Jugar",
    userAlt: "Perfil de Usuario",
    triviaGame: "Juego de Trivia",
    flashcards: "FlashCards",
    back: "Volver",

    // Dashboard & Home
    selectMode: "Elige un modo para empezar a estudiar",
    modeTriviaDesc: "Pon a prueba tus conocimientos con preguntas de trivia geradas automáticamente.",
    modeFlashDesc: "Crea y personaliza tus propias categorías y flashcards.",

    // Categories
    categories: "Categorías",
    searchCategories: "Buscar categorías...",
    addCategory: "Nueva Categoría",
    editCategory: "Editar Categoría",
    deleteCategory: "Eliminar Categoría",
    categoryName: "Nombre de la Categoría",
    enterCategoryName: "Introduce el nombre de la categoría",
    noCategories: "No se encontraron categorías. ¡Crea una categoría para comenzar!",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    confirmDeleteCategory: "¿Estás seguro de que deseas eliminar esta categoría? Todas las tarjetas dentro de ella se eliminarán permanentemente.",
    confirmDeleteCard: "¿Estás seguro de que deseas eliminar esta tarjeta?",
    cardsCount: "tarjetas",

    // Cards
    manageCards: "Gestionar Tarjetas",
    addCard: "Nueva Tarjeta",
    editCard: "Editar Tarjeta",
    deleteCard: "Eliminar Tarjeta",
    question: "Pregunta",
    answer: "Respuesta",
    cardType: "Tipo de Tarjeta",
    textType: "Respuesta de Texto",
    mcType: "Opción Múltiple",
    options: "Opciones",
    isCorrectAnswer: "Respuesta Correta",
    enterQuestion: "Introduce la pregunta",
    enterAnswer: "Introduce la respuesta correcta",
    enterOption: "Introduce el texto de la opción",
    noCards: "Aún no hay tarjetas en esta categoría. ¡Añade tu primera tarjeta!",

    // Trivia Game Screen
    category: "Categoría",
    amount: "Cantidad de Preguntas",
    generate: "Generar Trivia",
    loading: "Cargando preguntas de trivia...",
    stopPlaying: "Salir del Juego",
    score: "Puntuación",
    questionProgress: "Pregunta",
    results: "Resultados",
    correctAnswers: "Respuestas Correctas",
    wrongAnswers: "Respuestas Incorrectas",
    restart: "Jugar de Nuevo",
    correct: "¡Correcto!",
    incorrect: "¡Incorrecto!",
    selectAnswer: "Selecciona una opción:",
    flipCardTip: "Haz clic en la tarjeta para voltearla y revelar la respuesta.",
    showAnswer: "Mostrar Respuesta",
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'pt' || saved === 'es') return saved;
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'pt') return 'pt';
    if (browserLang === 'es') return 'es';
    return 'en';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    const defaultDict = translations.en as Record<string, string>;
    return dict[key] || defaultDict[key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
