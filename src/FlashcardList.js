import React from 'react'
import Flashcard from './Flashcard';
import './FlashcardList.css'
import { BiCategoryAlt } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';

export default function FlashcardList({ flashcards }) {
  return (
    <>
      {flashcards.length === 0 &&

        <div className='NoQuestionDescription'>

          <p> <BiCategoryAlt /> Choose the category and the number of questions</p>

          <p> <FaSearch /> Each time you generate the questions, they will be different</p>

          <p> <FaInfoCircle /> The System is limited to 50 questions at a time</p>

        </div>}
      <div className="Card-grid">


        {flashcards.map(flashcard => {
          return <Flashcard flashcard={flashcard} key={flashcard.id} />
        })}
      </div>
    </>
  )
} 
