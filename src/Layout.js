import React from 'react'
import { Outlet } from "react-router-dom"
import { connect } from 'react-redux'
import Header from './Header'
import Buttons from './components/buttons/Buttons'
import BottomBar from './components/bottomBar/BottomBar'


const Layout = (props) => {

    return (
        <>
            <Header />
            <Buttons />
            <Outlet />
            <BottomBar />
        </>
    )
}



const ConnectedLayout = connect((state) => {
    return {
        User: state.User
    }
})(Layout)

export default ConnectedLayout