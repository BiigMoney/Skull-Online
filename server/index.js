const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const axios = require('axios')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 8000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080"
    }
})

io.on('connection', socket =>{
    console.log("Connection")

    socket.on('join', ({player, room, name, host}) =>{
        const { error, user } = addUser({id: socket.id, player, room, name, host})
        if(error) {
            console.log(error)
            return
        }

        socket.join(user.room)
    })

    socket.on('disconnect', () =>{
        console.log("Disconnection")
        const user = removeUser(socket.id)
        axios.delete(`http://localhost:5000/skull-online-313fe/us-central1/api/delplayer/${user.player}`).then(() => {
            let thereq = {
                player: user.player,
                room: user.room,
                name: user.name,
                host: user.host
            }
            axios.put(`http://localhost:5000/skull-online-313fe/us-central1/api/removeplayerfromroom/${user.room}`, thereq).then((res) => {
                console.log(res.data)
                if(user.host){
                    socket.broadcast.emit("dc")
                }
                if(res.data.players.length === 0){
                    axios.delete(`http://localhost:5000/skull-online-313fe/us-central1/api/delroom/${user.room}`).then(() => {
                        console.log("room is empty, deleted room")
                    })
                }
                console.log("successful disconnection")
            })
        }).catch(err => {
            console.log(err)
        })
    })
})

app.use(router)

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})