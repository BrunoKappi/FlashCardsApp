import React, { useState, useEffect } from 'react'
import './Category.css'
import store from '../../store/store';
import { connect } from 'react-redux'
import { MdArrowBackIos } from 'react-icons/md';
import { Link } from 'react-router-dom'
import { MdModeEditOutline } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdPlayCircle } from 'react-icons/md';
import { MdAddCircle } from 'react-icons/md';
import {  setPlaying } from '../../store/actions/UserActions';
import EditModal from '../editModal/EditModal'
import DeleteModal from '../deleteModal/DeleteModal'
import AddCardModal from '../addCardModal/AddCardModal'

import FlipCard from '../flipCard/FlipCard'
import { v4 as uuid_v4 } from "uuid";
import Playing from '../playing/Playing';
import Song from '../song/Song';

const Category = (props) => {


    const [PLaying, setPLaying] = useState(false);
    const [CurrentCategory, setCurrentCategory] = useState({ Cards: [] });
    const [showEditModal, setShowEditModal] = useState(false);
    const [CategoryIdEdit, setCategoryIdEdit] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [CategoryIdDelete, setCategoryIdDelete] = useState('');

    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [CategoryIdAddCard, setCategoryIdAddCard] = useState('');


    useEffect(() => {
        if (!props.User.CurrentCategoryId) return
        setCurrentCategory(props.Cards.find((Card) => Card.Id.trim() === props.User.CurrentCategoryId))
        //console.log(props.Cards.find((Card) => Card.Id.trim() === props.User.CurrentCategoryId))

    }, [props.User.CurrentCategoryId, props.Cards]);

    function handleShowEditModal(Id) {
        setShowEditModal(true);
        setCategoryIdEdit(Id)
    }

    function handleShowDeleteModal(Id) {
        setShowDeleteModal(true);
        setCategoryIdDelete(Id)
    }

    function handleShowAddCardModal(Id) {
        setShowAddCardModal(true);
        setCategoryIdAddCard(Id)
    }

    function handleCloseEditModal() {
        setShowEditModal(false);
    }

    function handleCloseDeleteModal() {
        setShowDeleteModal(false);
    }

    function handleCloseAddCardModal() {
        setShowAddCardModal(false);
    }

    const BackToCategories = () => {
        store.dispatch(setCurrentCategory({ Name: 'No', Id: '' }))
    }

    const handleStartPLaying = () => {
        //console.log('PLaying')
        store.dispatch(setPlaying(true))
        setPLaying(true)
    }

    const handleStopPLaying = () => {
        //console.log('PLaying')
        store.dispatch(setPlaying(false))
        setPLaying(false)
    }

    return (
        <div className='SelectedCategoryContainer'>

            <EditModal ShowEdit={showEditModal} CloseEditModal={handleCloseEditModal} CategoryId={CategoryIdEdit} />

            <DeleteModal ShowDelete={showDeleteModal} CloseDeleteModal={handleCloseDeleteModal} CategoryId={CategoryIdDelete} />

            <AddCardModal ShowAddCardModal={showAddCardModal} CloseAddCardModal={handleCloseAddCardModal} CategoryId={CategoryIdAddCard} />



            {!PLaying && <div className='SelectedCategoryNotPlaying'>

                <div className='SelectedCategoryHeader'>
                    <Link className='SelectedCategoryBackButton' onClick={BackToCategories} to="/FlashCards"><MdArrowBackIos /></Link>
                    <div className='SelectedCategoryName'>
                        <p>{props.User.CurrentCategory}</p>
                    </div>

                    <div className='SelectedCategoryIcons'>
                        <div className='SelectedCategoryButtons'>
                            {CurrentCategory.Cards.length > 0 &&
                                <button onClick={handleStartPLaying}>
                                    {<MdPlayCircle />}
                                    Play
                                </button>
                            }
                        </div>
                        <MdModeEditOutline onClick={e => handleShowEditModal(props.User.CurrentCategoryId)} />
                        <MdDelete onClick={e => handleShowDeleteModal(props.User.CurrentCategoryId)} />
                    </div>

                </div>
                <div className='SelectedCategoryCards'>
                    <button className="AddCardButton" onClick={e => handleShowAddCardModal(props.User.CurrentCategoryId)}>
                        <MdAddCircle />
                        <p>Add Card</p>
                    </button>
                    {props.Cards.find(Cat => Cat.Id === props.User.CurrentCategoryId).Cards.map(Card => {
                        return <FlipCard key={uuid_v4()} Card={Card} CategoryId={props.User.CurrentCategoryId} />
                    })}
                </div>

            </div>}

            {PLaying && <div className='SelectedCategoryPlaying'>

                <Playing CurrentCategoryId={props.User.CurrentCategoryId} Categories={props.Cards} StopPlaying={handleStopPLaying} />

            </div>}


            <Song Playing={PLaying} />


        </div>
    )
}




const ConnectedCategory = connect((state) => {
    return {
        User: state.User,
        Cards: state.Cards
    }
})(Category)

export default ConnectedCategory
