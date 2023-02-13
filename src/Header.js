import React from 'react'
import "./Header.css"
import Logo from './images/Logo.png'
import User from './images/User.png'
import store from './store/store'
import { resetFunction } from './store/actions/UserActions'
import { Link } from 'react-router-dom'

export default function Header() {

    const reset = () => {
        store.dispatch(resetFunction())
    }

    return (
        <div className='Header'>
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
