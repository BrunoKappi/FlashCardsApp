import React from 'react'
import store from '../../store/store';
import { setFunction } from '../../store/actions/UserActions';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './Buttons.css'


const Buttons = (props) => {

  



    const SetFuction = (func) => {
        store.dispatch(setFunction(func))
    }

    return (
        <div className={props.User.Function === 'No' ? 'NotChosen' : 'Chosen'}>
       
            {props.User.Function === 'No' &&

                <Link className='LinkButton' onClick={e => SetFuction('Trivia')} to="/Trivia">Trivia Game</Link>

            }
            {props.User.Function === 'No' &&

                <Link className='LinkButton' onClick={e => SetFuction('FlashCards')} to="/FlashCards">FlashCards</Link>

            }
        </div>


    )


}


const ConnectedButtons = connect((state) => {
    return {
        User: state.User
    }
})(Buttons)

export default ConnectedButtons
