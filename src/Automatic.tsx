import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdArrowBackIos as BackIcon } from 'react-icons/md';
import FlashcardList from './FlashcardList';
import Playing from './components/playingAutomatic/Playing';
import { setFunction, setUser, setPlaying, setCurrentCategory } from './store/actions/UserActions';
import { RootState } from './store/store';
import { useApp } from './contexts/AppContext';

interface TriviaCategory {
  id: number;
  name: string;
}

const Automatic: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.User);
  const { t } = useApp();

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [categories, setCategories] = useState<TriviaCategory[]>([
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Entertainment: Books' },
    { id: 11, name: 'Entertainment: Film' },
    { id: 12, name: 'Entertainment: Music' },
    { id: 13, name: 'Entertainment: Musicals & Theatres' },
    { id: 14, name: 'Entertainment: Television' },
    { id: 15, name: 'Entertainment: Video Games' },
    { id: 16, name: 'Entertainment: Board Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Science: Computers' },
    { id: 19, name: 'Science: Mathematics' },
    { id: 20, name: 'Mythology' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 25, name: 'Art' },
    { id: 26, name: 'Celebrities' },
    { id: 27, name: 'Animals' },
    { id: 28, name: 'Vehicles' },
    { id: 29, name: 'Entertainment: Comics' },
    { id: 30, name: 'Science: Gadgets' },
    { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, name: 'Entertainment: Cartoon & Animations' }
  ]);

  const categoryEl = useRef<HTMLSelectElement>(null);
  const amountEl = useRef<HTMLInputElement>(null);

  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then((res) => {
        if (res.data && res.data.trivia_categories) {
          setCategories(res.data.trivia_categories);
        }
      })
      .catch((err) => console.log('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    setIsPlayingState(user.Playing);
  }, [user.Playing]);

  const decodeString = (str: string) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryEl.current || !amountEl.current) return;

    const selectedId = Number(categoryEl.current.value);
    const foundCat = categories.find((c) => c.id === selectedId);
    const catName = foundCat ? foundCat.name : '';
    setSelectedCategoryName(catName);
    setLoading(true);

    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then((res) => {
        dispatch(setCurrentCategory({ Name: 'CardsFilled', Id: '1' }));
        const formatted = (res.data.results || []).map((questionItem: any, index: number) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map((a: string) => decodeString(a)),
            answer
          ];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5)
          };
        });
        setFlashcards(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Failed to fetch trivia:', err);
        setLoading(false);
      });
  };

  const handleSetFunction = (func: 'No' | 'Trivia' | 'FlashCards') => {
    dispatch(setFunction(func));
  };

  const handleStopPlaying = () => {
    dispatch(setPlaying(false));
    setIsPlayingState(false);
  };

  const RecordPlay = (play: any) => {
    const playEdited = { ...play, Category: selectedCategoryName };
    const editedUser = { ...user, Rounds: [...user.Rounds, playEdited] };
    dispatch(setUser(editedUser));
  };

  return (
    <div className="w-full flex flex-col">
      {!isPlayingState && (
        <div className="w-full bg-card border border-border rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Link className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleSetFunction('No')} to="/">
              <BackIcon className="text-base font-medium translate-x-[3px]" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('triviaGame')}
            </h1>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('category')}</label>
              <select 
                id="category" 
                ref={categoryEl} 
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold"
              >
                {categories.map((category) => (
                  <option value={category.id} key={category.id} className="text-foreground bg-card">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('amount')}</label>
              <input 
                type="number" 
                id="amount" 
                min="1" 
                max="50" 
                step="1" 
                defaultValue={10} 
                ref={amountEl} 
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full cursor-pointer bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground font-bold rounded-lg py-2.5 px-6 shadow transition-colors text-sm h-[42px] flex items-center justify-center border-none disabled:cursor-not-allowed">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                t('generate')
              )}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-2xl bg-card/50">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-semibold animate-pulse">{t('loading')}</p>
        </div>
      )}

      <div className="w-full mt-4">
        {!isPlayingState && !loading && <FlashcardList flashcards={flashcards} />}

        {isPlayingState && (
          <div className="w-full">
            <Playing RecordPlay={RecordPlay} FlashCards={flashcards} StopPlaying={handleStopPlaying} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Automatic;
