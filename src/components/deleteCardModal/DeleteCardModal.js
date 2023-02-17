import React, { useState, useEffect } from 'react'
import './DeleteCardModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import store from '../../store/store';
import { editCategory } from '../../store/actions/CardsActions';

const DeleteCardModal = (props) => {

    const [CurrentCategory, setCurrentCategory] = useState({});

    useEffect(() => {
        if (props.CategoryId)
            setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CategoryId))
    }, [props.CategoryId,props.Categories]);

    function handleClose() {
        props.CloseDeleteModal()
    }

    const handleDeleteCard = (e) => {
        e.preventDefault()
    }

    const DeleteCard = (e) => {
        var NewCategory = { ...CurrentCategory }
        NewCategory.Cards = NewCategory.Cards.filter(C => C.Id !== props.Card.Id)       
        store.dispatch(editCategory(NewCategory))
        //console.log(NewCategory)
        handleClose()
    }

    return (
        <div className='DeleteModal'>
            <Modal size="lg" centered={true} show={props.ShowDelete} >
                <Modal.Body >
                    <div className='AddCategoryModalBody'>
                        <div className='DeleteCategoryModalTitle'>
                            <p>Are you sure you want to delete this Card?</p>
                        </div>
                        <form onSubmit={handleDeleteCard}>
                            <div className='DeleteCategoryButtons'>
                                <button onClick={handleClose}>Cancel</button>
                                <button onClick={DeleteCard}>Delete</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}




const ConnectedDeleteCardModal = connect((state) => {
    return {
        User: state.User,
        Categories: state.Cards
    }
})(DeleteCardModal)

export default ConnectedDeleteCardModal
