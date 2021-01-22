import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import App from './components/App'
import HomePage from "./components/Homepage"

const Router = () =>{
    return (
        <div className="page-container">
        <div className="content-wrap">
        <BrowserRouter>
        <Route path="/" component={App}/>
        <Switch>
        <Route path='/' component={HomePage} exact/>
        </Switch>
        </BrowserRouter>
        </div>
        </div>
    )
}

export default Router