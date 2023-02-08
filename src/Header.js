import React from 'react'
import "./Header.css"
import Logo from './images/Logo.png'
import User from './images/User.png'


export default function Header() {
    return (
        <div className='Header'>
            <div className='LogoHeaderCointainer'>
                <img className='LogoHeader' src={Logo} alt="" />
            </div>
            <div className='ButtonsContainer'>
                <button className='PlayButtonHeader'>Play</button>
            </div>
            <div className='UserPhotoHeaderCointainer'>
                <img className='UserPhotoHeader' src={User} alt="" />
            </div>
        </div>
    )
}
