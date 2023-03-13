import React from 'react'
import { Outlet } from "react-router-dom"
import { connect } from 'react-redux'
import Header from './Header'
import Buttons from './components/buttons/Buttons'
import BottomBar from './components/bottomBar/BottomBar'

import Song from './components/song/Song'

const Layout = (props) => {



    return (
        <>
            <Header />
            <Buttons />
            <Outlet />
            


        </>
    )
}



const ConnectedLayout = connect((state) => {
    return {
        User: state.User
    }
})(Layout)

export default ConnectedLayout