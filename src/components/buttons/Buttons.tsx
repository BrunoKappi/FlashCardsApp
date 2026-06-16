import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGamepad } from 'react-icons/fa';
import { setFunction } from '../../store/actions/UserActions';
import { RootState } from '../../store/store';
import { useApp } from '../../contexts/AppContext';

const Buttons: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.User);
  const { t } = useApp();

  const handleSetFunction = (func: 'No' | 'Trivia' | 'FlashCards') => {
    dispatch(setFunction(func));
  };

  const isNotChosen = user.Function === 'No';

  if (!isNotChosen) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          {t('selectMode')}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Trivia Game Card */}
        <Link 
          onClick={() => handleSetFunction('Trivia')} 
          to="/Trivia"
          className="group relative flex flex-col items-center p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-4 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
            <FaGamepad className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {t('triviaGame')}
          </h3>
          <p className="text-muted-foreground text-sm text-center line-clamp-3">
            {t('modeTriviaDesc')}
          </p>
        </Link>

        {/* Flashcards Card */}
        <Link 
          onClick={() => handleSetFunction('FlashCards')} 
          to="/FlashCards"
          className="group relative flex flex-col items-center p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-4 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
            <FaGraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {t('flashcards')}
          </h3>
          <p className="text-muted-foreground text-sm text-center line-clamp-3">
            {t('modeFlashDesc')}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Buttons;
