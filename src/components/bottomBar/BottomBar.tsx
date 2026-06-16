import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdQuestionAnswer, MdSchool } from 'react-icons/md';
import { useStore } from '../../store/useStore';

const BottomBar: React.FC = () => {
    const location = useLocation();
    const playing = useStore((state) => state.playing);

    if (playing) return null;

    const currentPath = location.pathname;

    return (
        <div className="bg-card/85 backdrop-blur-md w-full h-14 fixed bottom-0 left-0 right-0 border-t border-border flex flex-row justify-around items-center shadow-lg sm:hidden z-50 transition-all duration-300">
            <Link to="/">
                <AiFillHome className={`text-xl transition-all duration-200 ${currentPath === '/' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
            <Link to="/Trivia">
                <MdQuestionAnswer className={`text-xl transition-all duration-200 ${currentPath.startsWith('/Trivia') ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
            <Link to="/FlashCards">
                <MdSchool className={`text-xl transition-all duration-200 ${currentPath.startsWith('/FlashCards') ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
        </div>
    );
};

export default BottomBar;
