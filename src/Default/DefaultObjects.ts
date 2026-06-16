import { Card } from '../store/types';

export const DefaultCard: Card = {
    Id: '1',
    Type: 'Text',
    Question: '',
    Answer: { Id: 1, Option: '', IsAnswer: true },
    Options: []
};
