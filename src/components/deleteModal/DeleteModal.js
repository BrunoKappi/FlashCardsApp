import React, { useState, useEffect } from 'react'
import './DeleteModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import store from '../../store/store';
import { deleteCategory } from '../../store/actions/CardsActions';
import { setCurrentCategory as SetCurrentCategoryRedux } from '../../store/actions/UserActions';


const DeleteModal = (props) => {

    const [CurrentCategory, setCurrentCategory] = useState({});

    useEffect(() => {
        if (props.CategoryId)
            setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() == props.CategoryId))
    }, [props.CategoryId]);

    function handleClose() {
        props.CloseDeleteModal()
    }

    const handleDeleteCategory = (e) => {
        e.preventDefault()
    }

    const DeleteCategory = (e) => {

        store.dispatch(deleteCategory(CurrentCategory))

        if (props.User.CurrentCategory === CurrentCategory.Name) {
            console.log(props.User.CurrentCategory, CurrentCategory.Name)
            store.dispatch(SetCurrentCategoryRedux({ Name: 'No', Id: '' }))

        }
        handleClose()
    }

    return (
        <div className='DeleteModal'>
            <Modal size="lg" centered={true} show={props.ShowDelete} >
                <Modal.Body >
                    <div className='AddCategoryModalBody'>
                        <div className='DeleteCategoryModalTitle'>
                            <p>Are you sure you want to delete this category?</p>
                        </div>
                        <form onSubmit={handleDeleteCategory}>
                            <div className='DeleteCategoryButtons'>
                                <button onClick={handleClose}>Cancel</button>
                                <button onClick={DeleteCategory}>Delete</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}




const ConnectedDeleteModal = connect((state) => {
    return {
        User: state.User,
        Categories: state.Cards
    }
})(DeleteModal)

export default ConnectedDeleteModal
