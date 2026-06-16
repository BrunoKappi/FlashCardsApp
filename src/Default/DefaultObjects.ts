import { Card } from '../services/db';

export const DefaultCard: Card = {
    Id: '1',
    DeckId: 'default',
    Type: 'Text',
    Question: '',
    Answer: { Id: 1, Option: '', IsAnswer: true },
    Options: [],
    Interval: 0,
    EaseFactor: 2.5,
    Repetitions: 0,
    NextReview: Date.now(),
    CorrectCount: 0,
    WrongCount: 0,
    Favorite: false,
    CreatedAt: Date.now()
};
