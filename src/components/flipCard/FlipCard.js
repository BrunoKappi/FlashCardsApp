import React, { useState, useRef, useEffect } from 'react'
import './FlipCard.css'
import { connect } from 'react-redux'
import { MdModeEditOutline } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { v4 as uuid_v4 } from "uuid"; 
import EditCardModal from '../editCardModal/EditCardModal'
import DeleteCardModal from '../deleteCardModal/DeleteCardModal'

const FlipCard = (props) => {

    const [flip, setFlip] = useState(false) 
    const [height, setHeight] = useState('initial')

    const [showEditCardModal, setShowEditCardModal] = useState(false);    
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);  

    function handleShowEditCardModal(Id) {
        setShowEditCardModal(true);      
    }

    function handleCloseEditCardModal() {
        setShowEditCardModal(false);
    }

    function handleShowDeleteCardModal(Id) {
        setShowDeleteCardModal(true);
        
    }

    function handleCloseDeleteCardModal() {
        setShowDeleteCardModal(false);
    }


    const FrontElement = useRef()
    const BackElement = useRef()

    function setMaxHeight() {
        const FrontHeight = FrontElement.current.getBoundingClientRect().height
        const BackHeight = BackElement.current.getBoundingClientRect().height
        setHeight(Math.max(FrontHeight, BackHeight, 100))
    }

    useEffect(setMaxHeight, [props.Card.Question, props.Card.Answer, props.Card.Options])
    useEffect(() => {
        //console.log("flip")
        window.addEventListener('resize', setMaxHeight)
        return () => window.removeEventListener('resize', setMaxHeight)
    }, [])

    return (
        <div className='FlipCardContainer'>

            <EditCardModal Card={props.Card} ShowEditCardModal={showEditCardModal} CloseEditCardModal={handleCloseEditCardModal} CategoryId={props.CategoryId} />
            <DeleteCardModal Card={props.Card} ShowDelete={showDeleteCardModal} CloseDeleteModal={handleCloseDeleteCardModal} CategoryId={props.CategoryId} />

            <div className={`FlipCard  ${flip ? 'FlipCardFlip' : ''}`} onClick={() => setFlip(!flip)} style={{ height: height }}>
                <div className='FlipCardFront' ref={FrontElement}>
                    <div className='FlipCardQuestion'>{props.Card.Question}</div>
                    <div className='FlipCardOptions'>
                        {props.Card.Options.map(Option => {
                            return <p key={uuid_v4()}> <span key={uuid_v4()} className='FlipCardOptionDot'></span>  {Option.Option}</p>
                        })}
                    </div>
                </div>
                <div className="FlipCardBack" ref={BackElement}>{props.Card.Answer.Option}</div>
            </div>
            <div className='FlipCardButtonsBottom'>
                <button onClick={e => handleShowEditCardModal(props.User.CurrentCategoryId)}>
                    <MdModeEditOutline />
                </button>
                <button onClick={e => handleShowDeleteCardModal(props.User.CurrentCategoryId)}>
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