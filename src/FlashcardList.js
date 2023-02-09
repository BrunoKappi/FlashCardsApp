import React from 'react'
import Flashcard from './Flashcard';
import './FlashcardList.css'

export default function FlashcardList({ flashcards }) {
  return (
    <>
      {flashcards.length === 0 &&

        <div className='NoQuestionDescription'>

          <p>Choose the desired category and the number of questions you want</p>

          <p> Each time you generate the questions, they will be different</p>

          <p> The system is limited to 50 questions at a time</p> 

        </div>}
      <div className="card-grid"> 


        {flashcards.map(flashcard => { 
          return <Flashcard flashcard={flashcard} key={flashcard.id} />
        })}
      </div>
    </>
  )
}
