const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const axios = require('axios')

const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users.js')
const { createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games } = require('./game.js')

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
    
    socket.on('selectbase', (user, color) => {
        if(!user){
            return
        }
        let game = getGame(user.room)[0]
        game.events.push({
            name: "selectbase",
            args: [user, color]
        })
        io.to(user.room).emit("userplaying", user, color)
    })

    socket.on('initgame', (room) => {
        let game = getGame(room)[0]
        let first = Math.round(Math.random()*5)
        game.events.push({
            name: "startgame",
            args: [first]
        })
        io.to(room).emit("startgame", first)
    })
    
    socket.on('playcard', (room, card) => {
        let game = getGame(room)[0]
        game.events.push({
            name: "playcard",
            args: [card]
        })
        io.to(room).emit("playcard", card)
    })

    socket.on('bid', (color, bid, room) => {
        console.log("bidding")
        let game = getGame(room)[0]
        game.events.push({
            name: "bid",
            args: [color, bid]
        })
        io.to(room).emit("bid", color, bid)
    })

    socket.on('flipcard', (color, room) => {
        let game = getGame(room)[0]
        game.events.push({
            name: "flipcard",
            args: [color]
        })
        io.to(room).emit("flipcard", color)
    })

    socket.on('fold', (color, room) => {
        let game = getGame(room)[0]
        game.events.push({
            name: "fold",
            args: [color]
        })
        io.to(room).emit("fold", color)
    })

    socket.on("chooseremove", (color, room) => {
        let game = getGame(room)[0]
        game.events.push({
            name: "chooseremove",
            args: [color]
        })
        io.to(room).emit("chooseremove", color)
    })

    socket.on("playerlost", (color, room) => {
        let game = getGame(room)[0]
        game.events.push({
            name: "playerlost",
            args: [color]
        })
        io.to(room).emit("playerlost", color)
    })

    socket.on("resetgame", (room) => {
        console.log("resetting")
        let game = getGame(room)[0]
        game.events = []
        io.to(room).emit("resetgame")
    })

    socket.on('join', ({player, room, name, host}) =>{
        const { error, user } = addUser({id: socket.id, player, room, name, host})
        if(error) {
            console.log(error)
            socket.emit('error')
            return
        }
        socket.join(user.room)
        let game = null
        if(users.length === 1){
            game = createNewGame(user)
        }
        else{
            game = addUserToGame(user)
        }
        socket.emit("initgame", game, user)
        io.to(user.room).emit("userjoined", user)
    })



    socket.on('disconnect', () =>{
        console.log("Disconnection")
        if(users.length === 0){
            return
        } 
        let user = removeUser(socket.id)
        if(!user){
            console.log("not user")
            return
        }
        let game = removeUserFromGame(user)
        if(!game){
            console.log("not game")
            return
        }
        console.log(game.players.length)
        if(user.host){
            console.log("deleting game")
            removeGame(user.room)
            io.to(user.room).emit("error")
        }
        let thereq = {
            player: user.player,
            room: user.room,
            name: user.name,
            host: user.host
        }
        axios.post(`http://localhost:5000/skull-online-313fe/us-central1/api/delplayer`, thereq).then(res => {
            console.log(res.data)
            console.log("successful disconnection")
        }).catch(err => {
            console.error(err.response.data)
        })
    })
})

app.use(router)

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})