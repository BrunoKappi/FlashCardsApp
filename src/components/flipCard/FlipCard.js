import React, { useState, useRef, useEffect } from 'react'
import './FlipCard.css'
import { connect } from 'react-redux'
import { MdModeEditOutline } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { uuid } from 'uuidv4';

const FlipCard = ({ Card }) => {

    const [flip, setFlip] = useState(false)
    const [height, setHeight] = useState('initial')

    const FrontElement = useRef()
    const BackElement = useRef()

    function setMaxHeight() {
        const FrontHeight = FrontElement.current.getBoundingClientRect().height
        const BackHeight = BackElement.current.getBoundingClientRect().height
        setHeight(Math.max(FrontHeight, BackHeight, 100))
    }

    useEffect(setMaxHeight, [Card.Question, Card.Answer, Card.Options])
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight)
        return () => window.removeEventListener('resize', setMaxHeight)
    }, [])

    return (
        <div className='FlipCardContainer'>
            <div className={`FlipCard  ${flip ? 'FlipCardFlip' : ''}`} onClick={() => setFlip(!flip)} style={{ height: height }}>
                <div className='FlipCardFront' ref={FrontElement}>
                    <div className='FlipCardQuestion'>{Card.Question}</div>
                    <div className='FlipCardOptions'>
                        {Card.Options.map(Option => {
                            return <p key={uuid()}> <div key={uuid()} className='FlipCardOptionDot'></div>  {Option.Option}</p>
                        })}
                    </div>
                </div>
                <div className="FlipCardBack" ref={BackElement}>{Card.Answer.Option}</div>
            </div>
            <div className='FlipCardButtonsBottom'>
                <button>
                    <MdModeEditOutline />
                </button>
                <button>
                    <MdDelete />
                </button>
            </div>
        </div>





    )
}




const ConnectedFlipCard = connect((state) => {
    return {
        User: state.User
    }
})(FlipCard)

export default ConnectedFlipCard