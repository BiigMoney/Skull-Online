import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import App from './components/App'
import Lobby from './components/Lobby'
import WelcomePage from './components/WelcomePage'

const Router = () =>{
    return (
        <BrowserRouter>
        <Route path="/" component={App}/>
        </BrowserRouter>
    )
}

export default Router