import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import App from './components/App'
import Lobby from './components/Lobby'
import WelcomePage from './components/WelcomePage'

const Router = () =>{
    return (
        <div className="page-container">
        <div className="content-wrap">
        <BrowserRouter>
        <Route path="/" component={App}/>
        <Switch>
        <Route exact path="/" component={WelcomePage}/>
        <Route path="/lobby" component={Lobby}/>
        </Switch>
        </BrowserRouter>
        </div>
        </div>
    )
}

export default Router