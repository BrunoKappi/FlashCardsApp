import { MdClear as ClearIcon, MdNavigateNext as NextIcon } from 'react-icons/md';
import { useApp } from '../../contexts/AppContext';

interface PlayingHeaderProps {
    StopPlaying: () => void;
    ToNextCard: () => void;
    PlayingProgress: number;
}

export default function PlayingHeader({ StopPlaying, ToNextCard, PlayingProgress }: PlayingHeaderProps) {
    const { t } = useApp();

    return (
        <div className="w-full grid grid-cols-[20%_60%_20%] items-center justify-center px-6 mb-6 bg-card border border-border rounded-2xl p-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-start">
                <button 
                    onClick={StopPlaying} 
                    title={t('stopPlaying')}
                    className="text-muted-foreground hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer flex items-center p-2 rounded-lg hover:bg-secondary"
                >
                    <ClearIcon className="text-xl font-bold" />
                </button>
            </div>

            <div className="flex items-center justify-center w-full">
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden border border-border shadow-inner">
                    <div 
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${PlayingProgress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-end">
                <button 
                    onClick={ToNextCard} 
                    title={t('restart')}
                    className="text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer flex items-center p-2 rounded-lg hover:bg-secondary"
                >
                    <NextIcon className="text-2xl" />
                </button>
            </div>
        </div>
    );
}
