import React from 'react'
import Flashcard from './Flashcard';
import './FlashcardList.css'
import { BiCategoryAlt } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import {  Draggable, Droppable } from "react-beautiful-dnd";

export default function FlashcardList({ flashcards }) {

  const Card = {
    id: 'sasasasas'
  }

  return (
    <>
      {flashcards.length === 0 &&

        <div className='NoQuestionDescription'>

          <p> <BiCategoryAlt /> Choose the category and the number of questions</p>

          <p> <FaSearch /> Each time you generate the questions, they will be different</p>

          <p> <FaInfoCircle /> The System is limited to 50 questions at a time</p>

        </div>}



        <div>

          <Droppable droppableId={'CardsTrivia'} key={'CardsTrivia'} index={1}>
            {(provided, snapshot) => {
              return (

                <div {...provided.droppableProps} ref={provided.innerRef}>
                 
                  <div className="Card-grid">


                    {flashcards.map((flashcard, index) => {


                      return <Draggable key={flashcard.id} draggableId={flashcard.id} index={index} >

                        {(provided2, snapshot) => { 

                          return (

                            <div ref={provided2.innerRef} {...provided2.draggableProps} {...provided2.dragHandleProps}>

                              <Flashcard flashcard={flashcard} key={flashcard.id} />

                            </div>
                          )
                        }}

                      </Draggable>


                    })}


                  </div>
               
               
                </div>

              );
            }}
          </Droppable>
        </div>

      
    </>
  )
} 
