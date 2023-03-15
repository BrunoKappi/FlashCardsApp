import React, { useState, useEffect } from 'react'
import './EditCardModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { v4 as uuid_v4 } from "uuid";
import { editCategory } from '../../store/actions/CardsActions';
import { MdDelete } from 'react-icons/md';
import store from '../../store/store';
import { Draggable, Droppable } from "react-beautiful-dnd";

const EditCardModal = (props) => {

    const [CardType, setCardType] = useState('Text');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Question, setQuestion] = useState('');
    const [Answer, setAnswer] = useState('');
    const [CurrentCategory, setCurrentCategory] = useState({});
    const [OptionsSet, setOptionsSet] = useState([]);
    const [NewOption, setNewOption] = useState(''); 
    const [CorrectIndex, setCorrectIndex] = useState(-1);


    useEffect(() => {
        if (props.Card) {
            setCardType(props.Card.Type)
            setQuestion(props.Card.Question)
            setAnswer(props.Card.Answer.Option)
            setOptionsSet([...props.Card.Options])
        }
    }, [props.Card]);


    useEffect(() => {
        if (props.CategoryId) {
            setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CategoryId))
            //console.log(props.Categories.find((Card) => Card.Id.trim() === props.CategoryId))
        }

    }, [props.CategoryId, props.Cards, props.Categories]);


    function handleClose() {
        props.CloseEditCardModal()
    }

    const handleChangeTypeOption = (event) => {
        setCardType(event.target.value)
    }

    const handleChangeCorrectOption = (event) => {
        const OptionID = event.target.value
        const OptionIndex = OptionsSet.findIndex(op => op.Id == OptionID)
        const NewOptionsSet = [...OptionsSet]
        NewOptionsSet.forEach(op => { op.IsAnswer = false })
        NewOptionsSet[OptionIndex].IsAnswer = true
        setCorrectIndex(OptionIndex)
        //console.log(NewOptionsSet)
        setOptionsSet([...NewOptionsSet])
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleAddOption = (e) => {
        e.preventDefault()
        if (NewOption) {
            var newOptionObject = { Id: (OptionsSet.length + 1), Option: capitalizeFirstLetter(NewOption), IsAnswer: false }
            const NewOptionsSet = [...OptionsSet, newOptionObject]
            setOptionsSet([...NewOptionsSet])
            setNewOption('')
        }

    }


    const handleDeleteOption = (OptionID) => {
        const NewOptionsSet = [...OptionsSet].filter(op => op.Id !== OptionID)
        setOptionsSet([...NewOptionsSet])

    }


    const handleAddCard = () => {

        if (OptionsSet.length === 0 && CardType === 'MultipleChoice') {
            setErrorMessage('You need at least one option')
        }
        else if (CorrectIndex === -1 && CardType === 'MultipleChoice') {
            setErrorMessage('You need to choose the correct one')
        }
        else if (!Question) {
            setErrorMessage('You need to fill the question')
        }
        else if (!Answer && CardType === 'Text') {
            setErrorMessage('You need to fill the answer')
        }
        else if (CardType === 'MultipleChoice') {
            const NewCard = {
                Id: props.Card.Id,
                Type: CardType,
                Question: Question,
                Answer: OptionsSet[CorrectIndex],
                Options: [...OptionsSet]
            }

            var NewCategory = { ...CurrentCategory }
            NewCategory.Cards = NewCategory.Cards.filter(C => C.Id !== props.Card.Id)
            NewCategory.Cards = [NewCard, ...NewCategory.Cards]
            store.dispatch(editCategory(NewCategory))
            //console.log(NewCategory)

        }
        else if (CardType === 'Text') {
            const NewCard = {
                Id: props.Card.Id,
                Type: CardType,
                Question: Question,
                Answer: { Id: 1, Option: Answer, IsAnswer: true },
                Options: []
            }

            var NewCategoryText = { ...CurrentCategory }
            NewCategoryText.Cards = NewCategoryText.Cards.filter(C => C.Id !== props.Card.Id)
            NewCategoryText.Cards = [NewCard, ...NewCategoryText.Cards]
            //console.log(NewCategoryText)
            store.dispatch(editCategory(NewCategoryText))
        }



    }



    return (
        <div className='EditCardModal'>
            <Modal size="md" centered={true} show={props.ShowEditCardModal} fullscreen={'md-down'} onHide={handleClose}>
                <Modal.Body className='EditModalCardBodyBootstrap' >
                    <div className='EditModalCardBody'>
                        <div className='EditModalCardTitle'>
                            <p>What type of card will it be?</p>
                        </div>
                        <div className='EditModalCardRadios'>
                            <div className='EditModalCardRadio'>
                                <input type="radio" id="TextOption" name="Text" value="Text" checked={CardType === 'Text'} onChange={handleChangeTypeOption} />
                                <label htmlFor="TextOption">Text</label>
                            </div>
                            <div className='EditModalCardRadio'>
                                <input type="radio" id="MultipleChoiceOption" name="MultipleChoice" value="MultipleChoice" checked={CardType === 'MultipleChoice'} onChange={handleChangeTypeOption} />
                                <label htmlFor="MultipleChoiceOption">Multiple Choice</label>
                            </div>
                        </div>


                        {CardType === 'Text' &&
                            <form className='EditModalCardTextChoiceContainer' onSubmit={handleAddOption}>
                                <textarea placeholder='Question' value={Question} onChange={e => setQuestion(e.target.value)} />
                                <textarea placeholder='Answer' value={Answer} onChange={e => setAnswer(e.target.value)} />
                            </form>
                        }

                        {CardType === 'MultipleChoice' &&
                            <div className='EditModalCardMultipleChoiceContainer'>
                                <textarea placeholder='Question' value={Question} onChange={e => setQuestion(e.target.value)} />
                                {OptionsSet.length > 0 && <div className='EditModalCardOptionsTitle'>
                                    Options
                                </div>}


                                {OptionsSet.map((OP, Index) => {

                                    return <div key={uuid_v4()} className='EditModalCardOption'>
                                        <button onClick={e => handleDeleteOption(OP.Id)}>
                                            <MdDelete />
                                        </button>
                                        <div className='EditModalCardOptionDot'></div>
                                        <div className='EditModalCardOptionName'>
                                            <p>{OP.Option}</p>
                                        </div>
                                        <div className='EditModalCardOptionCorret'>
                                            <input className={OP.IsAnswer === true ? 'EditModalCardCorrectOption' : ''} type="checkbox" id={OP.Option} name="Corret" value={OP.Id} checked={OP.IsAnswer === true} onChange={handleChangeCorrectOption} />
                                            <label className={OP.IsAnswer === true ? 'EditModalCardCorrectOption' : ''} htmlFor={OP.Option}>Corret</label>
                                        </div>
                                    </div>


                                })}







                                {OptionsSet.length <= 9 &&
                                    <form className='EditModalCardAddOptionForm' onSubmit={handleAddOption}>
                                        <button>Add Option</button>
                                        <input type="text" value={NewOption} onChange={e => setNewOption(e.target.value)} placeholder={`Option  ${OptionsSet.length + 1}`} />
                                    </form>
                                }
                            </div>
                        }


                    </div>
                    {ErrorMessage && <div className='EditModalCardErrorMessage'>{ErrorMessage}</div>}

                    <div className='EditModalCardButtons'>
                        <button onClick={handleClose}>Cancel</button>
                        <button onClick={handleAddCard}>Save</button>
                    </div>
                </Modal.Body >
            </Modal >
        </div >
    )
}




const ConnectedEditCardModal = connect((state) => {
    return {
        User: state.User,
        Categories: state.Cards
    }
})(EditCardModal)

export default ConnectedEditCardModal
