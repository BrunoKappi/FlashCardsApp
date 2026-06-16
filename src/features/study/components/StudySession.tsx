import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../../store/useStore';
import { getDueCards } from '../utils/studyHelpers';
import { type Card } from '../../../services/db';
import { ArrowLeft, RotateCw, CheckCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';

export const StudySession: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useApp();
  const { 
    currentDeckId, decks, cards, recordCardReview, 
    addStudySession, setPlaying, setCurrentDeckId 
  } = useStore();

  const deck = useMemo(() => decks.find(d => d.Id === currentDeckId), [decks, currentDeckId]);
  const deckCards = useMemo(() => cards.filter(c => c.DeckId === currentDeckId), [cards, currentDeckId]);

  // Filtra cards atrasados
  const dueCards = useMemo(() => getDueCards(deckCards), [deckCards]);

  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Registro de respostas da sessão
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  // Tempo de Sessão
  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (dueCards.length > 0) {
      setStudyQueue(dueCards);
    } else {
      // Se não há cards atrasados, permite estudar todos (estudo antecipado)
      setStudyQueue(deckCards);
    }
  }, [dueCards, deckCards]);

  const handleStartSession = () => {
    if (studyQueue.length === 0) return;
    setSessionStarted(true);
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {}, 1000); // placeholder
  };

  const handleGrade = async (quality: number) => {
    const card = studyQueue[currentIndex];
    if (!card) return;

    // Atualizar no IndexedDB e Zustand
    await recordCardReview(card.Id, quality);

    // Contabilizar estatísticas locais da sessão
    const isCorrect = quality >= 3;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setXpGained(prev => prev + (quality === 5 ? 15 : 10));
    } else {
      setWrongCount(prev => prev + 1);
      setXpGained(prev => prev + 3);
    }

    // Passar para o próximo card ou finalizar
    if (currentIndex < studyQueue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finalizar Sessão
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      clearInterval(timerRef.current);
      
      const finalXp = xpGained + (isCorrect ? (quality === 5 ? 15 : 10) : 3);

      await addStudySession({
        DeckId: currentDeckId || '',
        DeckName: deck?.Name || 'Deck',
        Date: new Date().toISOString().split('T')[0],
        Duration: durationSeconds,
        CardsReviewed: studyQueue.length,
        CorrectCount: correctCount + (isCorrect ? 1 : 0),
        WrongCount: wrongCount + (isCorrect ? 0 : 1),
        XpGained: finalXp
      });

      setSessionFinished(true);
    }
  };

  const handleQuit = () => {
    clearInterval(timerRef.current);
    setPlaying(false);
    setCurrentDeckId(null);
    navigate('/FlashCards');
  };

  const currentCard = studyQueue[currentIndex];

  if (!deck) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">{t('loading')}</p>
        <button onClick={() => navigate('/FlashCards')} className="bg-secondary text-foreground px-4 py-2 rounded-lg">
          {t('back')}
        </button>
      </div>
    );
  }

  // Tela de Conclusão da Sessão
  if (sessionFinished) {
    const durationMinutes = Math.round((Date.now() - startTimeRef.current) / 60000);
    return (
      <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-8 shadow-premium text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            {language === 'pt' ? 'Sessão Concluída!' : 'Session Complete!'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {language === 'pt' 
              ? `Você revisou ${studyQueue.length} cards do deck "${deck.Name}".` 
              : `You reviewed ${studyQueue.length} cards from deck "${deck.Name}".`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-4 my-2">
          <div>
            <div className="text-xl font-bold text-foreground">{durationMinutes || 1}m</div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase">{t('amount')}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-500">{correctCount}</div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase">{t('correctAnswers')}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-500">+{xpGained} XP</div>
            <div className="text-[10px] text-muted-foreground font-semibold uppercase">XP</div>
          </div>
        </div>

        <button 
          onClick={handleQuit}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl py-3 shadow transition-colors cursor-pointer border-none"
        >
          {language === 'pt' ? 'Voltar ao Painel' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  // Tela de Inicialização do Estudo (Setup)
  if (!sessionStarted) {
    const isDueOnly = dueCards.length > 0;
    return (
      <div className="w-full max-w-lg mx-auto bg-card border border-border rounded-3xl p-8 shadow-premium space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={handleQuit} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground truncate max-w-[280px]">{deck.Name}</h1>
            <p className="text-xs text-muted-foreground font-semibold">
              {isDueOnly 
                ? (language === 'pt' ? `${dueCards.length} cards pendentes` : `${dueCards.length} cards due`)
                : (language === 'pt' ? 'Sem revisões pendentes! Estudo Antecipado' : 'No reviews due! Study Ahead')}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            {language === 'pt' ? 'Como funciona a repetição espaçada?' : 'How does spaced repetition work?'}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {language === 'pt' 
              ? 'Ao ver a resposta, você classificará sua facilidade. O sistema agendará automaticamente a próxima revisão científica para otimizar sua curva de retenção mental.'
              : 'Upon seeing the answer, you will grade your recall. The system will automatically schedule the next scientific review to optimize your cognitive retention curve.'}
          </p>
        </div>

        {studyQueue.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            {language === 'pt' ? 'Adicione cards a esta categoria antes de iniciar.' : 'Add cards to this category before starting.'}
          </div>
        ) : (
          <button
            onClick={handleStartSession}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl py-3.5 shadow-md transition-colors border-none cursor-pointer text-sm flex justify-center items-center gap-2"
          >
            <RotateCw className="w-4 h-4 animate-spin-slow" />
            {language === 'pt' ? 'Iniciar Sessão de Estudo' : 'Start Study Session'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-6">
      {/* Progresso e Botão de Voltar */}
      <div className="w-full flex items-center justify-between px-2">
        <button onClick={handleQuit} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </button>
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          Card {currentIndex + 1} / {studyQueue.length}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden border border-border">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / studyQueue.length) * 100}%` }}
        />
      </div>

      {/* Container de Perspectiva 3D para o Flashcard */}
      <div 
        className="w-full relative rounded-3xl border border-border shadow-premium cursor-pointer transition-all duration-300 bg-card select-none min-h-[260px] flex"
        onClick={() => setIsFlipped(!isFlipped)} 
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateY(${isFlipped ? 180 : 0}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Lado da Pergunta */}
        <div 
          className="w-full min-h-[260px] p-8 flex flex-col justify-center items-center text-foreground rounded-3xl relative" 
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className="absolute top-4 left-4 bg-secondary/50 text-[10px] text-muted-foreground px-2.5 py-1 rounded-full uppercase tracking-wider font-bold border border-border">
            {t('question')}
          </span>
          <p className="text-lg font-bold text-center leading-relaxed max-w-xs">
            {currentCard?.Question}
          </p>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-bold mt-6">
            {language === 'pt' ? 'Clique para ver a resposta' : 'Click to show answer'}
          </span>
        </div>
        
        {/* Lado da Resposta */}
        <div 
          className="absolute inset-0 p-8 flex flex-col justify-center items-center text-primary-foreground font-bold text-lg text-center bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-650 dark:to-violet-750 rounded-3xl" 
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <span className="absolute top-4 right-4 bg-white/20 text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
            {t('answer')}
          </span>
          <p className="text-xl max-w-xs">{currentCard?.Answer?.Option}</p>
        </div>
      </div>

      {/* Painel de Ações e Notas SM-2 do Anki */}
      <div className="w-full pt-4">
        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full bg-secondary hover:bg-accent border border-border text-foreground font-bold rounded-xl py-3.5 shadow-sm transition-all duration-200 cursor-pointer text-sm"
          >
            {t('showAnswer')}
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {language === 'pt' ? 'Qual foi sua facilidade de resposta?' : 'How easy was it to recall?'}
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {/* Errei (Red) */}
              <button
                onClick={() => handleGrade(1)}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-1 rounded-xl shadow border-none text-xs flex flex-col items-center justify-center transition-transform hover:scale-[1.03]"
              >
                <span>Errei</span>
                <span className="text-[9px] font-medium opacity-80 mt-1">1 dia</span>
              </button>
              
              {/* Difícil (Amber) */}
              <button
                onClick={() => handleGrade(3)}
                className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-1 rounded-xl shadow border-none text-xs flex flex-col items-center justify-center transition-transform hover:scale-[1.03]"
              >
                <span>Difícil</span>
                <span className="text-[9px] font-medium opacity-80 mt-1">1-2 dias</span>
              </button>

              {/* Bom (Blue) */}
              <button
                onClick={() => handleGrade(4)}
                className="cursor-pointer bg-indigo-500 hover:bg-indigo-650 text-white font-bold py-3 px-1 rounded-xl shadow border-none text-xs flex flex-col items-center justify-center transition-transform hover:scale-[1.03]"
              >
                <span>Bom</span>
                <span className="text-[9px] font-medium opacity-80 mt-1">4-6 dias</span>
              </button>

              {/* Fácil (Green) */}
              <button
                onClick={() => handleGrade(5)}
                className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-1 rounded-xl shadow border-none text-xs flex flex-col items-center justify-center transition-transform hover:scale-[1.03]"
              >
                <span>Fácil</span>
                <span className="text-[9px] font-medium opacity-80 mt-1">10+ dias</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudySession;
