import React, { useState } from 'react'
import "./Manual.css"
import store from './store/store'
import { addCategory } from './store/actions/CardsActions'
import { setCurrentCategory } from './store/actions/UserActions'
import { connect } from 'react-redux'
import { MdModeEditOutline } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdAddCircle } from 'react-icons/md';
import Category from './components/category/Category'
import Modal from 'react-bootstrap/Modal';
import { uuid } from 'uuidv4';
import EditModal from './components/editModal/EditModal'
import DeleteModal from './components/deleteModal/DeleteModal'

const Manual = (props) => {


  const [NewCategoryName, setNewCategoryName] = useState('');
  const [NewCategoryType, setNewCategoryType] = useState('');

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [CategoryIdEdit, setCategoryIdEdit] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [CategoryIdDelete, setCategoryIdDelete] = useState('');


  const SetCurrentCategory = (Category) => {
    store.dispatch(setCurrentCategory(Category))
  }

  function handleShow() {
    setShow(true);
  }

  function handleShowEditModal(Id) {
    setShowEditModal(true);
    setCategoryIdEdit(Id)
  }

  function handleShowDeleteModal(Id) {
    setShowDeleteModal(true);
    setCategoryIdDelete(Id)
  }


  function handleClose() {
    setShow(false);
    setNewCategoryName('')
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
  }

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const A = a.Index
    const B = b.Index

    let comparison = 0;
    if (A > B) {
      comparison = -1;
    } else if (A < B) {
      comparison = 1;
    }
    return comparison;
  }


  const handleAddCategory = (e) => {
    e.preventDefault()
  }

  const AddCategory = (e) => {
    e.preventDefault()
    setShow(false)
    const Index = props.Cards.length + 2
    const newCategory = {
      Index, 
      Id: uuid(),
      Name: NewCategoryName,
      Cards: []
    }
    console.log(newCategory)
    store.dispatch(addCategory(newCategory))
    setNewCategoryName('')
  }


  return (<div className='FlashCardsContainer'>
    {props.User.CurrentCategory === 'No' &&
      <div>
        <div className='ButtonsCategories'>
          <button onClick={handleShow}>
            {<MdAddCircle />}
            Add Category
          </button>


          <Modal size="md" centered={true} show={show} onHide={handleClose}>
            <Modal.Body >
              <div className='AddCategoryModalBody'>
                <div className='AddCategoryModalTitle'>
                  <p>Add Category</p>
                </div>
                <form onSubmit={handleAddCategory}>
                  <div className='AddCategoryFormGroup'>
                    <input type="text" placeholder='Category name' value={NewCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                  </div>
                  <div className='AddCategoryButtons'>
                    <button onClick={handleClose}>Cancel</button>
                    <button onClick={AddCategory}>Add</button>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>


          <EditModal ShowEdit={showEditModal} CloseEditModal={handleCloseEditModal} CategoryId={CategoryIdEdit} />

          <DeleteModal ShowDelete={showDeleteModal} CloseDeleteModal={handleCloseDeleteModal} CategoryId={CategoryIdDelete} />

        </div>

        {props.Cards.sort(compare).map((Category, index) => {
          return <div key={index} className='CategoryContainer'>
            <div className='CateoryNumber' onClick={e => SetCurrentCategory(Category)}>{index+1}</div>
            <div className='Category'>
              <div className='CategoryName' onClick={e => SetCurrentCategory(Category)}>
                <p>{Category.Name}</p>
              </div>
              <div className='CategoryIcons'>
                <MdModeEditOutline onClick={e => handleShowEditModal(Category.Id)} />
                <MdDelete onClick={e => handleShowDeleteModal(Category.Id)} />
              </div>
            </div>
          </div>

        })}


        {props.Cards.length === 0 &&

          <div className='NoCategories'>
            <p>You dont´t have any category added</p>
            <p>Add a category to start playing</p>
          </div>

        }

      </div>
    }{props.User.CurrentCategory !== 'No' &&

      <div>
        <Category />
      </div>

    }
  </div >


  )
}



const ConnectedManual = connect((state) => {
  return {
    User: state.User,
    Cards: state.Cards
  }
})(Manual)

export default ConnectedManual









