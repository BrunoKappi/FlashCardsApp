import React, { useState, useEffect } from 'react'
import './EditModal.css'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import store from '../../store/store';
import { editCategory } from '../../store/actions/CardsActions';
import { setCurrentCategory as SetCurrentCategoryRedux } from '../../store/actions/UserActions';

const EditModal = (props) => {

    const [CategoryName, setCategoryName] = useState('');
    const [CurrentCategory, setCurrentCategory] = useState({});

    useEffect(() => {
        if (props.CategoryId)
            setCurrentCategory(props.Categories.find((Card) => Card.Id.trim() === props.CategoryId))
    }, [props.CategoryId]);

    useEffect(() => {
        setCategoryName(CurrentCategory.Name)
    }, [CurrentCategory]);

    function handleClose() {
        props.CloseEditModal()
    }


    const handleEditCategory = (e) => {
        e.preventDefault()

    }

    const EditCategory = (e) => {

        const EditedCategory = { ...CurrentCategory }
        EditedCategory.Name = CategoryName
        store.dispatch(editCategory(EditedCategory))
        if (props.User.CurrentCategory === CurrentCategory.Name) {
            store.dispatch(SetCurrentCategoryRedux(EditedCategory))
        }

        handleClose()
        console.log(EditedCategory)
    }

    return (
        <div className='EditModal'>
            <Modal size="md" centered={true} show={props.ShowEdit} >
                <Modal.Body >
                    <div className='AddCategoryModalBody'>
                        <div className='EditCategoryModalTitle'>
                            <p>Edit Category</p>
                        </div>
                        <form onSubmit={handleEditCategory}>
                            <div className='AddCategoryFormGroup'>
                                <input type="text" placeholder='Category name' value={CategoryName} onChange={e => setCategoryName(e.target.value)} />
                            </div>
                            <div className='EditCategoryButtons'>
                                <button onClick={handleClose}>Cancel</button>
                                <button onClick={EditCategory}>Edit</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}




const ConnectedEditModal = connect((state) => {
    return {
        User: state.User,
        Categories: state.Cards
    }
})(EditModal)

export default ConnectedEditModal
