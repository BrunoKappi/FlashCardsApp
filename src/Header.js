import React from 'react'
import "./Header.css"
import Logo from './images/Logo.png'
import User from './images/User.png'
import store from './store/store'
import { resetFunction } from './store/actions/UserActions'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const Header = (props) => {

    const reset = () => {
        store.dispatch(resetFunction())
    }

    return (
        <div className={props.User.CurrentCategory === 'No' ? 'Header' : 'Header HeaderNoShow'}>
            <div className='LogoHeaderCointainer'>
                <Link to={'/'}>
                    <img onClick={reset} className='LogoHeader' src={Logo} alt="" />
                </Link>
            </div>
            <div className='UserPhotoHeaderCointainer'>
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