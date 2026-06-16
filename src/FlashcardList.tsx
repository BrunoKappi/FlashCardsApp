import { BiCategoryAlt as CategoryIcon } from 'react-icons/bi';
import { FaSearch as SearchIcon, FaInfoCircle as InfoIcon } from 'react-icons/fa';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Flashcard from './Flashcard';

interface FlashcardListProps {
  flashcards: any[];
}

export default function FlashcardList({ flashcards }: FlashcardListProps) {
  return (
    <>
      {flashcards.length === 0 && (
        <div className="flex flex-col space-y-4 max-w-xl mx-auto bg-slate-900/40 border border-slate-700/30 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
          <p className="text-white font-sans font-medium text-base sm:text-xs flex justify-start items-center gap-2 m-0">
            <CategoryIcon className="text-xl text-yellow shrink-0" />
            <span>Choose the category and the number of questions</span>
          </p>

          <p className="text-white font-sans font-medium text-base sm:text-xs flex justify-start items-center gap-2 m-0">
            <SearchIcon className="text-lg text-yellow shrink-0" />
            <span>Each time you generate the questions, they will be different</span>
          </p>

          <p className="text-white font-sans font-medium text-base sm:text-xs flex justify-start items-center gap-2 m-0">
            <InfoIcon className="text-lg text-yellow shrink-0" />
            <span>The System is limited to 50 questions at a time</span>
          </p>
        </div>
      )}

      {flashcards.length > 0 && (
        <Droppable droppableId="CardsTrivia">
          {(provided: any) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="grid items-stretch grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-4 pb-20"
            >
              {flashcards.map((flashcard, index) => (
                <Draggable key={flashcard.id} draggableId={flashcard.id} index={index}>
                  {(provided2: any) => (
                    <div 
                      ref={provided2.innerRef} 
                      {...provided2.draggableProps} 
                      {...provided2.dragHandleProps}
                      className="h-full"
                    >
                      <Flashcard flashcard={flashcard} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </>
  );
}
