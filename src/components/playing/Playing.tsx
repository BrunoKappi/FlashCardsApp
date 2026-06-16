import { useEffect, useState } from 'react';
import PlayingHeader from '../playingHeader/PlayingHeader';
import PlayingBody from '../playingBody/PlayingBody';
import { v4 as uuid_v4 } from 'uuid';
import { Category, Card } from '../../store/types';

interface PlayingProps {
    CurrentCategoryId: string;
    Categories: Category[];
    RecordPlay: (play: any) => void;
    StopPlaying: () => void;
}

export default function Playing({ CurrentCategoryId, Categories, RecordPlay, StopPlaying }: PlayingProps) {
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
        if (!CurrentCategoryId) return;

        const foundCat = Categories.find((cat) => cat.Id.trim() === CurrentCategoryId);
        if (foundCat) {
            setCards(foundCat.Cards);
        }
    }, [CurrentCategoryId, Categories]);

    useEffect(() => {
        if (cards.length === 0) return;
        setPlayingProgress(Math.round((playingIndex / cards.length) * 100));
    }, [playingIndex, cards]);

    useEffect(() => {
        if (playingProgress === 100) {
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
        if (playingIndex >= cards.length - 1) {
            // Wait, does it mark complete? If playingIndex goes past length-1, it shows complete screen because progress is 100%
            setPlayingIndex(playingIndex + 1);
        } else {
            setPlayingIndex(playingIndex + 1);
        }
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
                Automatic={false} 
            />
        </div>
    );
}
