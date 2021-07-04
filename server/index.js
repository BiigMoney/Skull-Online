const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const { v4: uuidv4 } = require('uuid')

const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./util/users.js')
const { createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games } = require('./util/game.js')

const PORT = process.env.PORT || 8000

const router = require('./router')
const { SSL_OP_NO_TICKET } = require('constants')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080"
    }
})

io.on('connection', socket =>{
    console.log("Connection")
    socket.join("main")
    
    socket.on("getlobbyinfo", () => {
        socket.emit("sendlobbyinfo", {games, users: users.length})
    })

    socket.on('selectbase', (user, color) => {
        if(!user){
            return
        }
        let game = getGame(user.room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "selectbase",
            args: [user, color]
        })
        io.to(user.room).emit("userplaying", user, color)
    })

    socket.on('initgame', (room) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        let first = Math.round(Math.random()*5)
        game.events.push({
            name: "startgame",
            args: [first]
        })
        io.to(room).emit("startgame", first)
    })
    
    socket.on('playcard', (room, card) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "playcard",
            args: [card]
        })
        io.to(room).emit("playcard", card)
    })

    socket.on('bid', (color, bid, room) => {
        console.log("bidding")
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "bid",
            args: [color, bid]
        })
        io.to(room).emit("bid", color, bid)
    })

    socket.on('flipcard', (color, room) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "flipcard",
            args: [color]
        })
        io.to(room).emit("flipcard", color)
    })

    socket.on('fold', (color, room) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "fold",
            args: [color]
        })
        io.to(room).emit("fold", color)
    })

    socket.on("chooseremove", (color, room) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "chooseremove",
            args: [color]
        })
        io.to(room).emit("chooseremove", color)
    })

    socket.on("playerlost", (color, room) => {
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events.push({
            name: "playerlost",
            args: [color]
        })
        io.to(room).emit("playerlost", color)
    })

    socket.on("resetgame", (room) => {
        console.log("resetting")
        let game = getGame(room)
        if(!game){
            io.to(room).emit("error")
        }
        game.events = []
        io.to(room).emit("resetgame")
    })

    socket.on("createlobby", ({name, password, hasPassword, username}) => {
        const {gameError, game} = createNewGame({username, name, password, hasPassword, id: uuidv4()})
        if(gameError){
            console.log("gameerror", gameError)
            socket.emit("createlobbyerror", gameError)
            return
        }
        socket.leave("main")
        socket.join(game.id)
        const {userError, user} = addUser({id: socket.id, room: game.id, name: username, host: true})
        if(userError){
            removeGame(game.id)
            socket.leave(game.id)
            socket.emit("createlobbyerror", userError)
            return
        }
        addUserToGame(user)
        socket.emit("createlobbysuccess")
    })

    socket.on("joinlobby", ({room, name, host}) => {
        const { userError, user } = addUser({id: socket.id, room, name, host})
        if(userError){
            console.log(userError)
            socket.emit("error")
            return
        }
        socket.join(user.room)
        let game = null
        if(user.host){
            game = createNewGame(user)
        } else if(getGame(user.room).length > 0){
            game = addUserToGame(user)
        } else {
            socket.emit("error")
            return
        }
        socket.emit("initgame", game, user)
        io.to(user.room).emit("userjoined", user)
    })

    socket.on("leavegame", () => {
        let user = getUser(socket.id)
        removeUserFromGame(user)
        removeUser(socket.id)

        console.log(socket.rooms)
        socket.leave(user.room)
        console.log(socket.rooms)
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
        let thereq = {
            player: user.player,
            room: user.room,
            name: user.name,
            host: user.host
        }
        let game = removeUserFromGame(user)
        if(game && user.host){
            console.log("deleting game")
            removeGame(user.room)
            io.to(user.room).emit("error")
        }
    })
})

app.use(router)

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})