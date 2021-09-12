import React, {useEffect, useState} from "react"
import background from "./assets/table.jpg"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Lobby from "./components/Lobby"
import WelcomePage from "./components/WelcomePage"
import Game from "./components/Game"
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/js/src/collapse.js"
import "../bootstrap.css"
import "../extra.css"
import socketio from "socket.io-client"
import axios from "axios"

let defaultURL = "https://rocky-savannah-29000.herokuapp.com"
//let defaultURL = "http://localhost:8000"
axios.defaults.baseURL = defaultURL
const Router = () => {
  const [socket, setSocket] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    const sock = socketio(defaultURL, {transports: ["websocket"]})
    sock.on("connect", () => {
      setSocket(sock)
    })
    sock.on("connect_error", error => {
      console.error(error.message)
      setError("Error connecting to socket, please try again later.")
      sock.disconnect()
    })
  }, [])
  return (
    <div>
      {socket ? (
        <BrowserRouter>
          <Switch>
            <Route path="/" component={props => <WelcomePage {...props} socket={socket} />} exact />
            <Route path="/lobby" component={props => <Lobby {...props} socket={socket} />} />
            <Route path="/play" component={props => <Game {...props} socket={socket} />} />
          </Switch>
        </BrowserRouter>
      ) : error ? (
        <div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, fontSize: 40, textAlign: "center"}}>
          <p style={{marginTop: 50}}>{error}</p>
        </div>
      ) : (
        <div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, fontSize: 40, textAlign: "center"}}>
          <p style={{marginTop: 50}}>Loading...</p>
        </div>
      )}
      <div id="phaser"></div>
    </div>
  )
}

export default Router
