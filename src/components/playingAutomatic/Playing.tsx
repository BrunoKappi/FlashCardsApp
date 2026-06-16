import { useEffect, useState } from 'react';
import PlayingHeader from '../playingHeader/PlayingHeader';
import PlayingBody from '../playingBody/PlayingBody';
import { v4 as uuid_v4 } from 'uuid';
import { Card, Option } from '../../services/db';

interface RawFlashCard {
    question: string;
    answer: string;
    options: string[];
}

interface PlayingAutomaticProps {
    FlashCards: RawFlashCard[];
    RecordPlay: (play: any) => void;
    StopPlaying: () => void;
}

export default function PlayingAutomatic({ FlashCards, RecordPlay, StopPlaying }: PlayingAutomaticProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [playingProgress, setPlayingProgress] = useState(0);
    const [playingIndex, setPlayingIndex] = useState(0);
    const [series, setSeries] = useState<number[]>([]);

    const [play, setPlay] = useState({
        Acertos: 0,
        Erros: 0,
        NaoJogada: 0
    });

    const Jogada = (tipo: string) => {
        if (tipo === 'Certo') {
            setPlay(prev => ({ ...prev, Acertos: prev.Acertos + 1 }));
        }
        if (tipo === 'Errado') {
            setPlay(prev => ({ ...prev, Erros: prev.Erros + 1 }));
        }
    };

    useEffect(() => {
        if (!FlashCards || FlashCards.length === 0) return;

        // Process raw cards into store compatible types
        const formatted: Card[] = FlashCards.map((raw) => {
            const formattedOptions: Option[] = (raw.options || []).map((option) => ({
                Id: uuid_v4(),
                Option: option,
                IsAnswer: raw.answer === option
            }));
            const answerObj = formattedOptions.find(o => o.IsAnswer) || { Id: uuid_v4(), Option: raw.answer, IsAnswer: true };

            return {
                Id: uuid_v4(),
                DeckId: 'trivia',
                Type: 'MultipleChoice',
                Question: raw.question,
                Answer: answerObj,
                Options: formattedOptions,
                Interval: 0,
                EaseFactor: 2.5,
                Repetitions: 0,
                NextReview: Date.now(),
                CorrectCount: 0,
                WrongCount: 0,
                Favorite: false,
                CreatedAt: Date.now()
            };
        });

        setCards(formatted);
    }, [FlashCards]);

    useEffect(() => {
        if (cards.length === 0) return;
        setPlayingProgress(Math.round((playingIndex / cards.length) * 100));
    }, [playingIndex, cards]);

    useEffect(() => {
        if (playingProgress === 100 && cards.length > 0) {
            const finalSeries = [play.Erros, play.Acertos, (cards.length - (play.Erros + play.Acertos))];
            setSeries(finalSeries);
            const round = {
                Id: uuid_v4(),
                Acertos: play.Acertos,
                Erros: play.Erros,
                NaoJogada: (cards.length - (play.Erros + play.Acertos)),
                Series: finalSeries
            };
            RecordPlay(round);
        }
    }, [playingProgress, cards.length, play.Erros, play.Acertos, RecordPlay]);

    const ToNextCard = () => {
        setPlayingIndex(prev => prev + 1);
    };

    const handleStopPlaying = () => {
        setPlayingIndex(0);
        setPlayingProgress(0);
        StopPlaying();
    };

    return (
        <div className="flex flex-col items-center justify-start gap-8 w-full max-w-2xl mx-auto px-4">
            <PlayingHeader PlayingProgress={playingProgress} StopPlaying={handleStopPlaying} ToNextCard={ToNextCard} />
            <PlayingBody 
                Series={series} 
                Jogada={Jogada} 
                Cards={cards} 
                PlayingIndex={playingIndex} 
                PlayingProgress={playingProgress} 
                StopPlaying={handleStopPlaying} 
                ToNextCard={ToNextCard} 
                Automatic={true} 
            />
        </div>
    );
}
