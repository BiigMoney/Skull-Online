import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import App from './components/App'
import Lobby from './components/Lobby'
import WelcomePage from './components/WelcomePage'
import Game from './components/Game'

const Router = () =>{
    return (
        <BrowserRouter>
        <Route path="/" component={App}/>
        <Switch>
            <Route path='/' component={WelcomePage} exact/>
            <Route path='/lobby' component={Lobby}/>
            <Route path='/play' component={Game}/>
        </Switch>
        </BrowserRouter>
    )
}

export default Router