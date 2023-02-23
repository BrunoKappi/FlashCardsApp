import React from 'react'
import "./Header.css"
import Logo from './images/Logo.png'
import User from './images/User.png'
import store from './store/store'
import { resetFunction } from './store/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FaPlay } from 'react-icons/fa';
import { setPlaying } from './store/actions/UserActions'

const Header = (props) => {

    const reset = () => {
        store.dispatch(resetFunction())
    }

    const handleStartPLaying = () => {
        store.dispatch(setPlaying(true))
    }

    return (
        <div className={(props.User.CurrentCategory === 'No' || props.User.CurrentCategory === 'CardsFilled') && props.User.Playing === false ? 'Header' : 'Header HeaderNoShow'}>
            <div className='LogoHeaderCointainer'>
                <Link to={'/'}>
                    <img onClick={reset} className='LogoHeader' src={Logo} alt="" />
                </Link>
            </div>
            <div className='UserHeaderPhotoAndPlayButtonContainer'>
                {props.User.CurrentCategory === 'CardsFilled' && <button onClick={handleStartPLaying} className='AutomaticPlayButton'>Play <FaPlay /> </button>}
                <img className='UserPhotoHeader' src={User} alt="" />
            </div>
        </div>
    )
}




const ConnectedHeader = connect((state) => {
    return {
        User: state.User
    }
})(Header)

export default ConnectedHeader