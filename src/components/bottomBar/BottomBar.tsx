import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { MdQuestionAnswer, MdSchool } from 'react-icons/md';
import { setFunction } from '../../store/actions/UserActions';
import { RootState } from '../../store/store';

const BottomBar: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User);

    const handleSetFunction = (func: 'No' | 'Trivia' | 'FlashCards') => {
        dispatch(setFunction(func));
    };

    if (user.Playing) return null;

    return (
        <div className="bg-card/80 backdrop-blur-md w-full h-14 fixed bottom-0 left-0 right-0 border-t border-border/40 flex flex-row justify-around items-center shadow-lg sm:hidden z-50 transition-all duration-300">
            <Link onClick={() => handleSetFunction('No')} to="/">
                <AiFillHome className={`text-xl transition-all duration-200 ${user.Function === 'No' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
            <Link onClick={() => handleSetFunction('Trivia')} to="/Trivia">
                <MdQuestionAnswer className={`text-xl transition-all duration-200 ${user.Function === 'Trivia' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
            <Link onClick={() => handleSetFunction('FlashCards')} to="/FlashCards">
                <MdSchool className={`text-xl transition-all duration-200 ${user.Function === 'FlashCards' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`} />
            </Link>
        </div>
    );
};

export default BottomBar;
