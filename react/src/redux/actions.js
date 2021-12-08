import {SETLOADING, SETERROR, SETSOCKET, SETLOBBYINFO, SETNAME, SETLOBBYLOADING, SETLOBBYERROR} from "./types"
import socketio from "socket.io-client"
import axios from "axios"

export const loadData = () => dispatch => {
  const socket = socketio(axios.defaults.baseURL, {transports: ["websocket"]})
  socket.on("connect", () => {
    socket.on("disconnect", () => {
      dispatch({type: SETERROR, payload: "Socket has been disconnected, please refresh"})
      console.log("disconnect")
    })
    dispatch({type: SETSOCKET, payload: socket})
    axios.get("/lobby").then(res => {
      dispatch({type: SETLOBBYINFO, payload: {games: res.data.games, players: res.data.users, loading: false}})
      dispatch({type: SETLOADING, payload: false})
    })
  })
  socket.on("connect_error", error => {
    console.error(error.message)
    dispatch({type: SETERROR, payload: "Error connecting to socket, please try again later."})
    socket.disconnect()
  })
}

export const reloadData = () => dispatch => {
  dispatch({type: SETLOBBYLOADING, payload: true})
  axios.get("/lobby").then(res => {
    dispatch({type: SETLOBBYINFO, payload: {games: res.data.games, players: res.data.users, loading: false}})
    dispatch({type: SETLOADING, payload: false})
  })
}

export const setName = name => dispatch => {
  dispatch({type: SETNAME, payload: name})
}

export const setLobbyLoading = bool => dispatch => {
  dispatch({type: SETLOBBYLOADING, payload: bool})
}

export const setLobbyError = error => dispatch => {
  dispatch({type: SETLOBBYERROR, payload: error})
}
