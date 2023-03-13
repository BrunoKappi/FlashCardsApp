import React from 'react'
import './BottomBar.css'
import { Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai';
import { MdQuestionAnswer } from 'react-icons/md';
import { MdSchool } from 'react-icons/md';
import store from '../../store/store';
import { setFunction } from '../../store/actions/UserActions';
import { connect } from 'react-redux'

const BottomBar = (props) => {

    const SetFuction = (func) => {
        store.dispatch(setFunction(func))
    }

    return (
        <div className={props.User.Playing === false ? 'BottomBar' : 'BottomBarNoShow'}>
            <Link onClick={e => SetFuction('No')} to="/">
                <AiFillHome className={props.User.Function === 'No' ? 'ActiveBottomBarItem' : ''} />
            </Link>
            <Link onClick={e => SetFuction('Trivia')} to="/Trivia">
                <MdQuestionAnswer className={props.User.Function === 'Trivia' ? 'ActiveBottomBarItem' : ''} />
            </Link>
            <Link onClick={e => SetFuction('FlashCards')} to="/FlashCards">
                <MdSchool className={props.User.Function === 'FlashCards' ? 'ActiveBottomBarItem' : ''} />
            </Link>
        </div>
    )
}




const ConnectedBottomBar = connect((state) => {
    return {
        User: state.User
    }
})(BottomBar)

export default ConnectedBottomBar
