import { useEffect, useState } from 'react';
import FlipCard from '../PlayingFlipCard/FlipCard';
import Chart from 'react-apexcharts';
import { Card } from '../../services/db';
import { useApp } from '../../contexts/AppContext';

interface PlayingBodyProps {
    Cards: Card[];
    PlayingIndex: number;
    PlayingProgress: number;
    Series: number[];
    Jogada: (hit: string) => void;
    StopPlaying: () => void;
    ToNextCard: () => void;
    Automatic: boolean;
}

export default function PlayingBody({
    Cards,
    PlayingIndex,
    PlayingProgress,
    Series,
    Jogada,
    StopPlaying,
    ToNextCard,
    Automatic
}: PlayingBodyProps) {
    const [card, setCard] = useState<Card | null>(null);
    const { t, theme } = useApp();

    useEffect(() => {
        if (Cards && Cards[PlayingIndex]) {
            setCard(Cards[PlayingIndex]);
        }
    }, [PlayingIndex, Cards]);

    const isDark = theme === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';

    const chartOptions = {
        options: {
            chart: {
                id: 'round-chart',
                foreColor: textColor,
                background: 'transparent'
            },
            labels: [t('wrongAnswers'), t('correctAnswers'), 'Not Played'],
            legend: {
                position: 'bottom' as const,
                labels: {
                    colors: textColor
                }
            },
            theme: {
                mode: (isDark ? 'dark' : 'light') as 'dark' | 'light'
            },
            colors: ['#ef4444', '#10b981', '#64748b'] // Red, Emerald Green, Slate Gray
        }
    };

    const getChartWidth = () => {
        if (window.innerWidth > 1000) return 400;
        if (window.innerWidth > 600) return 380;
        return 290;
    };

    return (
        <div className="w-full flex items-center justify-center py-4">
            {PlayingProgress < 100 && card && (
                <FlipCard 
                    Jogada={Jogada} 
                    CardToPlay={card} 
                    StopPlaying={StopPlaying} 
                    ToNextCard={ToNextCard} 
                    Automatic={Automatic} 
                />
            )}

            {PlayingProgress >= 100 && (
                <div className="flex flex-col justify-center items-center text-foreground bg-card border border-border rounded-3xl p-8 shadow-md max-w-md w-full transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        {t('results')}
                    </h2>

                    <div className="w-full flex justify-center py-4">
                        <Chart
                            options={chartOptions.options}
                            series={Series}
                            type="pie"
                            width={getChartWidth()}
                        />
                    </div>

                    <button 
                        onClick={StopPlaying} 
                        className="cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg py-2.5 px-8 transition-colors mt-6 border-none text-sm shadow-sm"
                    >
                        {t('save')}
                    </button> 
                </div>
            )}
        </div>
    );
}
