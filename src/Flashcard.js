import React, { useState, useEffect, useRef } from 'react'
import "./Flashcard.css"

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false)
  const [height, setHeight] = useState('initial')

  const FrontElement = useRef()
  const BackElement = useRef()

  function setMaxHeight() {
    const FrontHeight = FrontElement.current.getBoundingClientRect().height
    const BackHeight = BackElement.current.getBoundingClientRect().height
    setHeight(Math.max(FrontHeight, BackHeight, 100))
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight)
    return () => window.removeEventListener('resize', setMaxHeight)
  }, [])

  return (
    <div
      className={`Card  ${flip ? 'Flip' : ''}`}
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className="Front" ref={FrontElement}>
        {flashcard.question}
        <div className="flashcard-options">
          {flashcard.options.map(option => {
            return <div className="flashcard-option" key={option}><div className='OptionDot'></div>{option}</div>
          })}
        </div>
      </div>
      <div className="Back" ref={BackElement}>{flashcard.answer}</div>
    </div>
  )
}
