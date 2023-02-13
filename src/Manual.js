import React from 'react'
import "./Manual.css"
import store from './store/store'
import { addCategory } from './store/actions/CardsActions'

export default function Manual() {




  const AddCategories = () => {
    const cate = {
      Name: 'Teste',
      Cards: []
    }
    store.dispatch(addCategory(cate))
  }

  return (
    <div className='AutomaticContainer'>

      <button onClick={AddCategories}>Adicionar Categoria</button>
      <button>Adicionar Item</button>



    </div >


  )
}
