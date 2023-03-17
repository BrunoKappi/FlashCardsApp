import React, { useState, useEffect } from 'react'
import './AddCardModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { v4 as uuid_v4 } from "uuid";
import { editCategory } from '../../store/actions/CardsActions';
import { MdDelete } from 'react-icons/md';
import store from '../../store/store';
import Teste from '../../Teste';
import { Draggable, Droppable } from "react-beautiful-dnd";

const AddCardModal = (props) => {


    const [CardType, setCardType] = useState('Text');
    const [ErrorMessage, setErrorMessage] = useState('');
    const [Question, setQuestion] = useState('');
    const [Answer, setAnswer] = useState('');
    const [CurrentCategory, setCurrentCategory] = useState({});
    const [OptionsSet, setOptionsSet] = useState([]);
    const [NewOption, setNewOption] = useState('');
    const [CorrectIndex, setCorrectIndex] = useState(-1);

    useEffect(() => {
        if (props.CategoryId)
            setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CategoryId))

    }, [props.CategoryId, props.Cards, props.Categories]);


    function handleClose() {
        props.CloseAddCardModal()
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
        //console.log("Teste")
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


    const handleClearAll = () => {
        setAnswer('')
        setQuestion('')
        setErrorMessage('')
        setOptionsSet([])
        setCardType('Text')
        setNewOption('')

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
                Id: uuid_v4(),
                Type: CardType,
                Question: Question,
                Answer: OptionsSet[CorrectIndex],
                Options: [...OptionsSet]
            }

            var NewCategory = { ...CurrentCategory }
            NewCategory.Cards = [...NewCategory.Cards, NewCard]
            store.dispatch(editCategory(NewCategory))
            //console.log(NewCategory)
            setCurrentCategory({ ...NewCategory })
            handleClose()
            handleClearAll()
        }
        else if (CardType === 'Text') {
            const NewCard = {
                Id: uuid_v4(),
                Type: CardType,
                Question: Question,
                Answer: { Id: 1, Option: Answer, IsAnswer: true },
                Options: []
            }

            var NewCategoryText = { ...CurrentCategory }
            NewCategoryText.Cards = [...NewCategoryText.Cards, NewCard]
            store.dispatch(editCategory(NewCategoryText))
            //console.log(NewCategoryText)
            setCurrentCategory({ ...NewCategoryText })
            handleClose()
            handleClearAll()
        }



    }



    return (
        <div className='AddCardModal'>
            <Modal size="md" centered={true} show={props.ShowAddCardModal} fullscreen={'md-down'} onHide={handleClose}>
                <Modal.Body className='AddModalCardBodyBootstrap' >
                    <div className='AddModalCardBody'>
                        <div className='AddModalCardTitle'>
                            <p>What type of card will it be?</p>
                        </div>
                        <div className='AddModalCardRadios'>
                            <div className='AddModalCardRadio'>
                                <input type="radio" id="TextOption" name="Text" value="Text" checked={CardType === 'Text'} onChange={handleChangeTypeOption} />
                                <label htmlFor="TextOption">Text</label>
                            </div>
                            <div className='AddModalCardRadio'>
                                <input type="radio" id="MultipleChoiceOption" name="MultipleChoice" value="MultipleChoice" checked={CardType === 'MultipleChoice'} onChange={handleChangeTypeOption} />
                                <label htmlFor="MultipleChoiceOption">Multiple Choice</label>
                            </div>
                        </div>


                        {CardType === 'Text' &&
                            <form className='AddModalCardTextChoiceContainer' onSubmit={handleAddOption}>
                                <textarea placeholder='Question' value={Question} onChange={e => setQuestion(e.target.value)} />
                                <textarea placeholder='Answer' value={Answer} onChange={e => setAnswer(e.target.value)} />
                            </form>
                        }

                        {CardType === 'MultipleChoice' &&
                            <div className='AddModalCardMultipleChoiceContainer'>
                                <textarea placeholder='Question' value={Question} onChange={e => setQuestion(e.target.value)} />
                                {OptionsSet.length > 0 && <div className='AddModalCardOptionsTitle'>
                                    Options
                                </div>}


                                <Droppable droppableId={'AddCardModalDropable'} key={'AddCardModalDropable'}  >
                                    {(AddCardProvided) => {
                                        return (
                                            <div {...AddCardProvided.droppableProps} ref={AddCardProvided.innerRef}>

                                                {OptionsSet.map((OP, OptionID) => {
                                                    return <Draggable key={uuid_v4()} draggableId={OP.Option + OptionID} index={OptionID} >
                                                        {(DragProvided) => {
                                                            return (
                                                                <div ref={DragProvided.innerRef} {...DragProvided.draggableProps} {...DragProvided.dragHandleProps} >
                                                                    <div key={uuid_v4()} className='AddModalCardOption'>
                                                                        <button onClick={e => handleDeleteOption(OP.Id)}>
                                                                            <MdDelete />
                                                                        </button>
                                                                        <div className='AddModalCardOptionDot'></div>
                                                                        <div className='AddModalCardOptionName'>
                                                                            <p>{OP.Option}</p>
                                                                        </div>
                                                                        <div className='AddModalCardOptionCorret'>
                                                                            <input className={OP.IsAnswer === true ? 'AddModalCardCorrectOption' : ''} type="checkbox" id={OP.Option} name="Corret" value={OP.Id} checked={OP.IsAnswer === true} onChange={handleChangeCorrectOption} />
                                                                            <label className={OP.IsAnswer === true ? 'AddModalCardCorrectOption' : ''} htmlFor={OP.Option}>Corret</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }}
                                                    </Draggable>
                                                })}



                                            </div>
                                        );
                                    }}
                                </Droppable>



                                {OptionsSet.length <= 9 &&
                                    <form className='AddModalCardAddOptionForm' onSubmit={handleAddOption}>
                                        <button>Add Option</button>
                                        <input type="text" value={NewOption} onChange={e => setNewOption(e.target.value)} placeholder={`Option  ${OptionsSet.length + 1}`} />
                                    </form>
                                }
                            </div>
                        }


                    </div>
                    {ErrorMessage && <div className='AddModalCardErrorMessage'>{ErrorMessage}</div>}

                    <div className='AddModalCardButtons'>
                        <button onClick={handleClose}>Cancel</button>
                        <button onClick={handleAddCard}>Add Card</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}




const ConnectedAddCardModal = connect((state) => {
    return {
        User: state.User,
        Categories: state.Cards
    }
})(AddCardModal)

export default ConnectedAddCardModal
