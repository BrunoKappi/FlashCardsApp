import React from 'react'
import "./Manual.css"
import store from './store/store'
import { addCategory } from './store/actions/CardsActions'
import { connect } from 'react-redux'
import { MdModeEditOutline } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdAddCircle } from 'react-icons/md';

const Manual = (props) => {

  const AddCategories = () => {
    const cate = {
      Name: 'Teste',
      Cards: []
    }
    store.dispatch(addCategory(cate))
  }

  return (
    <div className='FlasshCardsContainer'>

      <div className='ButtonsCategories'>
        <button onClick={AddCategories}>{<MdAddCircle />}Add Category</button>
      </div>


      {props.Cards.map((Category, index) => {
        return <div className='CategoryContainer'>
          <div className='CateoryNumber'>{index}</div>
          <div className='Category'>
            <div className='CategoryName'>{Category.Name}</div>
            <div className='CategoryIcons'>
              <MdModeEditOutline />
              <MdDelete />
            </div>
          </div>


        </div>
      })}



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