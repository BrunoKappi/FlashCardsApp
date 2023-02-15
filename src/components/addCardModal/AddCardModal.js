import React, { useState, useEffect } from 'react'
import './AddCardModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { uuid } from 'uuidv4';
import { editCategory } from '../../store/actions/CardsActions';
import store from '../../store/store';


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

    }, [props.CategoryId, props.Cards]);


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
        console.log(NewOptionsSet)
        setOptionsSet([...NewOptionsSet])
    }


    const handleAddOption = () => {
        if (NewOption) {
            var newOptionObject = { Id: (OptionsSet.length + 1), Option: NewOption, IsAnswer: false }
            const NewOptionsSet = [...OptionsSet, newOptionObject]
            setOptionsSet([...NewOptionsSet])
            setNewOption('')
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
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
                Id: uuid(),
                Type: CardType,
                Question: Question,
                Answer: OptionsSet[CorrectIndex],
                Options: [...OptionsSet]
            }

            var NewCategory = { ...CurrentCategory }
            NewCategory.Cards = [...NewCategory.Cards, NewCard]
            store.dispatch(editCategory(NewCategory))
            console.log(NewCategory)
            setCurrentCategory({...NewCategory})
            handleClose()
            handleClearAll()
        }
        else if (CardType === 'Text') {
            const NewCard = {
                Id: uuid(),
                Type: CardType,
                Question: Question,
                Answer: { Id: 1, Option: Answer, IsAnswer: true },
                Options: []
            }

            var NewCategory = { ...CurrentCategory }
            NewCategory.Cards = [...NewCategory.Cards, NewCard]
            store.dispatch(editCategory(NewCategory))
            console.log(NewCategory)
            setCurrentCategory({...NewCategory})
            handleClose()
            handleClearAll()
        }



    }


    return (
        <div className='AddCardModal'>
            <Modal size="md" centered={true} show={props.ShowAddCardModal} >
                <Modal.Body >
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input type="radio" id="TextOption" name="Text" value="Text" checked={CardType === 'Text'} onChange={handleChangeTypeOption} />
                            <label for="TextOption">Text</label>
                        </div>
                        <div>
                            <input type="radio" id="MultipleChoiceOption" name="MultipleChoice" value="MultipleChoice" checked={CardType === 'MultipleChoice'} onChange={handleChangeTypeOption} />
                            <label for="MultipleChoiceOption">Multiple Choice</label>
                        </div>


                        {CardType === 'Text' &&
                            <div>
                                <textarea placeholder='Pergunta' value={Question} onChange={e => setQuestion(e.target.value)} />
                                <textarea placeholder='Resposta' value={Answer} onChange={e => setAnswer(e.target.value)} />
                            </div>
                        }

                        {CardType === 'MultipleChoice' &&
                            <div>
                                <textarea placeholder='Pergunta' value={Question} onChange={e => setQuestion(e.target.value)} />
                                {OptionsSet.map((OP, index) => {
                                    return <div key={uuid()}>
                                        <button onClick={e => handleDeleteOption(OP.Id)}>Delete</button>
                                        <input type="text" value={OP.Option} />
                                        <input type="radio" id={OP.Option} name="Corret" value={OP.Id} checked={OP.IsAnswer === true} onChange={handleChangeCorrectOption} />
                                        <label for={OP.Option}>Corret</label>
                                    </div>
                                })}
                                {OptionsSet.length <= 9 &&
                                    < div >
                                        <button onClick={handleAddOption}>Add Option</button>
                                        <input type="text" value={NewOption} onChange={e => setNewOption(e.target.value)} placeholder={`Option  ${OptionsSet.length + 1}`} />
                                    </div>
                                }
                            </div>
                        }


                    </form>
                    {ErrorMessage && <div>{ErrorMessage}</div>}

                    <div className='EditCategoryButtons'>
                        <button onClick={handleClose}>Cancel</button>
                        <button onClick={handleAddCard}>Add</button>
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
