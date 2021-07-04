import React, { useEffect, useState } from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Lobby from './components/Lobby'
import WelcomePage from './components/WelcomePage'
import Game from './components/Game'
import "../bootstrap.css"
import socketio from 'socket.io-client'

const Router = () =>{
    const [socket, setSocket] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        try {
        const sock = socketio("http://localhost:8000")
        setSocket(sock)
        } catch(err){
            console.error(err)
            setError("error")
        }
    }, [])
    return (
        <div>
        { socket ? ( 
        <BrowserRouter>
        <Switch>
        <Route path='/' component={() => <WelcomePage socket={socket}/>} exact/>
        <Route path='/lobby' component={() => <Lobby socket={socket}/>}/>
        <Route path='/play' component={() => <Game socket={socket}/>}/>
        </Switch>
        </BrowserRouter>
        ) : error ? (
            <div><p>Error lol</p></div>
        ) : (
            <div><p>Loading lol</p></div>
        )
        }
        </div>
    )
}

export default Router