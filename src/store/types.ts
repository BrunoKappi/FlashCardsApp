export interface Option {
  Id: number | string;
  Option: string;
  IsAnswer: boolean;
}

export interface Card {
  Id: string;
  Type: 'Text' | 'MultipleChoice';
  Question: string;
  Answer: Option;
  Options: Option[];
}

export interface Category {
  Index: number;
  Id: string;
  Name: string;
  Cards: Card[];
}

export interface UserState {
  Name: string;
  Email: string;
  Function: 'No' | 'Trivia' | 'FlashCards';
  CurrentTab: 'Home' | 'Category';
  CurrentCategory: string;
  CurrentCategoryId: string;
  Playing: boolean;
  Rounds: any[];
}
