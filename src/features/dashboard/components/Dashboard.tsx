import React, { useMemo, useState } from 'react';
import { useStore } from '../../../store/useStore';
import { getDueCards, getDeckStudyStats } from '../../study/utils/studyHelpers';
import { 
  Flame, Award, Clock, BookOpen, Calendar as CalendarIcon, 
  TrendingUp, Sparkles, Play, BookMarked, Activity, Database
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useApp } from '../../../contexts/AppContext';
import { BackupWizard } from './BackupWizard';

// CSS para o react-day-picker customizado com nossas variáveis de cores
const calendarStyles = `
  .rdp-root {
    --rdp-accent-color: var(--primary);
    --rdp-accent-color-foreground: var(--primary-foreground);
    --rdp-background-color: var(--secondary);
    margin: 0;
  }
  .rdp-day_has_activity {
    position: relative;
  }
  .rdp-day_has_activity::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--primary);
  }
`;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const { decks, cards, studySessions, userStats, setPlaying, setCurrentDeckId } = useStore();

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const selectedDayStr = useMemo(() => {
    if (!selectedDay) return '';
    const year = selectedDay.getFullYear();
    const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDay.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDay]);

  const selectedDaySessions = useMemo(() => {
    if (!selectedDayStr) return [];
    return studySessions.filter(s => s.Date === selectedDayStr);
  }, [selectedDayStr, studySessions]);

  const selectedDayStats = useMemo(() => {
    if (selectedDaySessions.length === 0) return null;
    const cardsReviewed = selectedDaySessions.reduce((acc, s) => acc + s.CardsReviewed, 0);
    const correctCount = selectedDaySessions.reduce((acc, s) => acc + s.CorrectCount, 0);
    const duration = selectedDaySessions.reduce((acc, s) => acc + s.Duration, 0);
    const xpGained = selectedDaySessions.reduce((acc, s) => acc + s.XpGained, 0);
    
    return {
      cardsReviewed,
      correctCount,
      accuracy: cardsReviewed > 0 ? Math.round((correctCount / cardsReviewed) * 100) : 0,
      durationMinutes: Math.round(duration / 60) || 1,
      xpGained,
      decksStudied: Array.from(new Set(selectedDaySessions.map(s => s.DeckName)))
    };
  }, [selectedDaySessions]);

  const activeLocale = useMemo(() => {
    if (language === 'pt') return ptBR;
    if (language === 'es') return es;
    return enUS;
  }, [language]);

  // Calcula estatísticas gerais de estudo
  const dueCardsCount = useMemo(() => getDueCards(cards).length, [cards]);
  
  const totalStudyTimeMinutes = useMemo(() => {
    const totalSeconds = studySessions.reduce((acc, s) => acc + s.Duration, 0);
    return Math.round(totalSeconds / 60);
  }, [studySessions]);

  // Prepara dados para o gráfico de XP semanal (últimos 7 dias)
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(language, { weekday: 'short' });
      const xp = userStats.WeeklyProgress?.[dateStr] || 0;
      data.push({ name: dayName, XP: xp, date: dateStr });
    }
    return data;
  }, [userStats.WeeklyProgress, language]);

  // Dias com atividade de estudo registrados para o Calendário
  const activeDays = useMemo(() => {
    return studySessions.map(session => new Date(session.Date + 'T12:00:00'));
  }, [studySessions]);

  // Gera as coleções inteligentes para os widgets de recomendações

  // Gera insights automáticos
  const insights = useMemo(() => {
    const list = [];
    
    // Insight de Cards Atrasados
    if (dueCardsCount > 0) {
      list.push({
        id: 'due',
        text: language === 'pt' 
          ? `Você tem ${dueCardsCount} cards pendentes de revisão. O aprendizado espaçado é mais eficiente se feito diariamente!` 
          : `You have ${dueCardsCount} cards pending review. Spaced repetition is most efficient when done daily!`,
        type: 'warning'
      });
    }

    // Insight de Decks Negligenciados
    const now = Date.now();
    const neglectedDecks = decks.filter(deck => {
      const deckCards = cards.filter(c => c.DeckId === deck.Id);
      if (deckCards.length === 0) return false;
      const oldestReview = Math.min(...deckCards.map(c => c.LastReview || 0));
      return oldestReview < now - 3 * 24 * 60 * 60 * 1000; // sem revisar a mais de 3 dias
    });

    if (neglectedDecks.length > 0) {
      list.push({
        id: 'neglected',
        text: language === 'pt'
          ? `O deck "${neglectedDecks[0].Name}" não é revisado há mais de 3 dias. Que tal fazer uma rodada hoje?`
          : `The deck "${neglectedDecks[0].Name}" hasn't been reviewed for over 3 days. How about a quick study session?`,
        type: 'info'
      });
    }

    // Insight de Horário Produtivo
    if (studySessions.length > 3) {
      const hours = studySessions.map(s => new Date(s.Timestamp).getHours());
      const peakHour = hours.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const bestHour = Object.entries(peakHour).sort((a, b) => b[1] - a[1])[0][0];
      list.push({
        id: 'peak_time',
        text: language === 'pt'
          ? `Seu horário mais ativo de estudos é por volta das ${bestHour}h. Tente bloquear esse horário na sua agenda!`
          : `Your most active study time is around ${bestHour}:00. Try booking this time in your schedule!`,
        type: 'success'
      });
    }

    // Fallback padrão
    if (list.length === 0) {
      list.push({
        id: 'welcome',
        text: language === 'pt'
          ? 'Tudo em dia! Crie novos cards ou revise categorias antigas para manter sua ofensiva.'
          : 'Everything is up to date! Create new cards or review old categories to maintain your streak.',
        type: 'success'
      });
    }

    return list;
  }, [dueCardsCount, decks, cards, studySessions, language]);

  const handleStartReview = (deckId: string) => {
    setCurrentDeckId(deckId);
    setPlaying(true);
    navigate(`/FlashCards/${decks.find(d => d.Id === deckId)?.Name}`);
  };

  const currentLevelXpMax = Math.pow(userStats.Level, 2) * 100;
  const currentLevelXpMin = Math.pow(userStats.Level - 1, 2) * 100;
  const levelProgressPercent = Math.min(
    100, 
    Math.max(
      0, 
      ((userStats.Xp - currentLevelXpMin) / (currentLevelXpMax - currentLevelXpMin)) * 100
    )
  );

  return (
    <div className="w-full space-y-6">
      <style>{calendarStyles}</style>
      
      {/* Header do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {language === 'pt' ? 'Painel de Estudos' : 'Study Dashboard'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {language === 'pt' ? 'Monitore seu progresso e mantenha sua rotina cognitiva.' : 'Monitor your progress and keep up your cognitive routine.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBackupOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-lg font-medium text-sm border border-border transition-colors"
          >
            <Database className="w-4 h-4 text-indigo-500" />
            {language === 'pt' ? 'Backup & Sinc' : 'Backup & Sync'}
          </button>
          <Link
            to="/FlashCards"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm shadow transition-colors"
          >
            <BookMarked className="w-4 h-4" />
            {language === 'pt' ? 'Gerenciar Decks' : 'Manage Decks'}
          </Link>
          <Link
            to="/Trivia"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-accent text-secondary-foreground px-4 py-2 rounded-lg font-medium text-sm border border-border transition-colors"
          >
            <Play className="w-4 h-4" />
            {language === 'pt' ? 'Trivia Offline' : 'Offline Trivia'}
          </Link>
        </div>
      </div>

      {/* Grid de Estatísticas Rápidas (Streaks, XP, Tempo) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-premium">
          <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-bold">{userStats.Streak} {language === 'pt' ? 'Dias' : 'Days'}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {language === 'pt' ? 'Streak Atual' : 'Current Streak'}
            </div>
          </div>
        </div>

        {/* Nível e XP */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-premium">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">Lvl {userStats.Level}</div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                XP: {userStats.Xp} / {currentLevelXpMax}
              </div>
            </div>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Tempo de Estudo */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-premium">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{totalStudyTimeMinutes} min</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {language === 'pt' ? 'Tempo Estudado' : 'Time Studied'}
            </div>
          </div>
        </div>

        {/* Cards Pendentes */}
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-premium">
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{dueCardsCount}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {language === 'pt' ? 'Revisões Pendentes' : 'Pending Reviews'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Gráfico, Insights e Calendário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos de Aprendizado & Atividade */}
        <div className="lg:col-span-2 space-y-6">
          {/* Histórico Semanal de XP */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold">
                {language === 'pt' ? 'Desempenho Semanal (XP)' : 'Weekly Performance (XP)'}
              </h2>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--foreground)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="XP" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Inteligentes */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold">
                {language === 'pt' ? 'Insights do Sistema' : 'System Insights'}
              </h2>
            </div>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-xl border flex gap-3 text-sm font-medium leading-relaxed ${
                    insight.type === 'warning' 
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 dark:text-rose-400' 
                      : insight.type === 'success'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 dark:text-emerald-400'
                      : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-500 dark:text-indigo-400'
                  }`}
                >
                  <Activity className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Lateral: Calendário de Atividades & Categorias Rápidas */}
        <div className="space-y-6">
          {/* Calendário de Estudos */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center shadow-premium">
            <div className="w-full flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold">
                {language === 'pt' ? 'Calendário de Estudos' : 'Study Log'}
              </h2>
            </div>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              locale={activeLocale}
              className="border-none rounded-xl"
              modifiers={{
                has_activity: activeDays
              }}
              modifiersClassNames={{
                has_activity: 'rdp-day_has_activity'
              }}
            />

            {/* Resumo do Dia Selecionado */}
            <div className="w-full mt-4 border-t border-border pt-4">
              <h3 className="text-sm font-bold text-foreground mb-3">
                {language === 'pt' ? 'Estudos em' : 'Studies on'} {selectedDay ? selectedDay.toLocaleDateString(language, { day: 'numeric', month: 'short' }) : ''}
              </h3>
              {selectedDayStats ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center bg-secondary/50 p-2.5 rounded-lg">
                    <span className="text-muted-foreground">{language === 'pt' ? 'Decks Estudados' : 'Decks Studied'}</span>
                    <span className="font-semibold text-right max-w-[150px] truncate" title={selectedDayStats.decksStudied.join(', ')}>
                      {selectedDayStats.decksStudied.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary/50 p-2.5 rounded-lg">
                    <span className="text-muted-foreground">{language === 'pt' ? 'Cards Revisados' : 'Cards Reviewed'}</span>
                    <span className="font-bold text-foreground">
                      {selectedDayStats.cardsReviewed} ({selectedDayStats.accuracy}% {language === 'pt' ? 'de acertos' : 'accuracy'})
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary/50 p-2.5 rounded-lg">
                    <span className="text-muted-foreground">{language === 'pt' ? 'Tempo de Estudo' : 'Study Time'}</span>
                    <span className="font-bold text-foreground">{selectedDayStats.durationMinutes} min</span>
                  </div>
                  <div className="flex justify-between items-center bg-secondary/50 p-2.5 rounded-lg">
                    <span className="text-muted-foreground">{language === 'pt' ? 'XP Conquistado' : 'XP Gained'}</span>
                    <span className="font-bold text-indigo-500">+{selectedDayStats.xpGained} XP</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  {language === 'pt' ? 'Nenhuma atividade registrada neste dia.' : 'No activity recorded for this day.'}
                </p>
              )}
            </div>
          </div>

          {/* Decks Recentes / Próximas Revisões */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium">
            <h2 className="text-lg font-bold mb-4">
              {language === 'pt' ? 'Foco de Revisão' : 'Revision Focus'}
            </h2>
            {decks.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">
                {language === 'pt' ? 'Crie um deck para ver suas revisões' : 'Create a deck to see your reviews'}
              </div>
            ) : (
              <div className="space-y-3">
                {decks.slice(0, 3).map((deck) => {
                  const stats = getDeckStudyStats(deck.Id, cards);
                  return (
                    <div 
                      key={deck.Id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-sm truncate">{deck.Name}</div>
                        <div className="text-xs text-muted-foreground">
                          {stats.due} {language === 'pt' ? 'pendentes' : 'due'} • {stats.total} total
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartReview(deck.Id)}
                        className="cursor-pointer p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0"
                        title={language === 'pt' ? 'Estudar deck' : 'Study deck'}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <BackupWizard isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </div>
  );
};
export default Dashboard;
