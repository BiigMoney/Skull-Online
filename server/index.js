const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const {v4: uuidv4} = require("uuid")
var cors = require("cors")
const {addUser, removeUser, getUser, getUsersInRoom, users} = require("./util/users.js")
const {createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games} = require("./util/game.js")

const PORT = process.env.PORT || 8000

const origin = "https://skull-online-4793e.web.app/"

const bodyParser = require("body-parser")
const app = express()
app.use(cors())
app.use(bodyParser.json())
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin
  }
})

io.on("connection", socket => {
  socket.on("selectbase", (user, color) => {
    if (!user) {
      return
    }
    let game = getGame(user.room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }

    game.events.push({
      name: "selectbase",
      args: [user, color]
    })
    socket.broadcast.to(user.room).emit("userplaying", user, color)
  })

  socket.on("initgame", room => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    let first = Math.round(Math.random() * getUsersInRoom(room).length)
    game.events.push({
      name: "startgame",
      args: [first]
    })
    io.to(room).emit("startgame", first)
  })

  socket.on("playcard", (room, card) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "playcard",
      args: [card]
    })
    socket.broadcast.to(room).emit("playcard", card)
  })

  socket.on("bid", (color, bid, room) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "bid",
      args: [color, bid]
    })
    socket.broadcast.to(room).emit("bid", color, bid)
  })

  socket.on("flipcard", (color, room) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "flipcard",
      args: [color]
    })
    socket.broadcast.to(room).emit("flipcard", color)
  })

  socket.on("fold", (color, room) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "fold",
      args: [color]
    })
    socket.broadcast.to(room).emit("fold", color)
  })

  socket.on("chooseremove", (color, room) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "chooseremove",
      args: [color]
    })
    socket.broadcast.to(room).emit("chooseremove", color)
  })

  socket.on("playerlost", (color, room) => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events.push({
      name: "playerlost",
      args: [color]
    })
    socket.broadcast.to(room).emit("playerlost", color)
  })

  socket.on("resetgame", room => {
    let game = getGame(room)
    if (!game) {
      io.to(room).emit("error", "The game has been forcefully closed.")
      return
    }
    game.events = []
    io.to(room).emit("resetgame")
  })

  socket.on("join", () => {
    let user = getUser(socket.id)
    const game = getGame(user.room)
    socket.emit("initgame", game, user)
    socket.broadcast.to(user.room).emit("userjoined", user)
  })

  socket.on("message", (name, message, color) => {
    let user = getUser(socket.id)
    if (!user) {
      return
    }
    socket.broadcast.to(user.room).emit("message", name, message, color)
  })

  socket.on("leavegame", () => {
    let user = getUser(socket.id)
    if (!user) {
      return
    }
    let game = removeUserFromGame(user)
    if (game.players.length === 0 || user.host) {
      game.players.forEach(player => {
        removeUser(player.id)
      })
      removeGame(game.roomid)
    } else {
      game.events.push({name: "leavegame", args: [socket.id]})
    }
    removeUser(user.id)

    socket.leave(user.room)
    if (user.host && game.players.length > 0) {
      io.to(user.room).emit("error", "Host has closed the lobby.")
    } else {
      socket.broadcast.to(user.room).emit("leavegame", socket.id)
    }
    socket.emit("leave")
  })

  socket.on("disconnect", () => {
    if (users.length === 0) {
      return
    }
    let user = removeUser(socket.id)
    if (!user) {
      return
    }
    let game = removeUserFromGame(user)
    if (!game) {
      return
    }
    if (!user.host) {
      io.to(user.room).emit("leavegame", socket.id)
      game.events.push({name: "leavegame", args: [socket.id]})
    }
    if (game && user.host) {
      game.players.forEach(player => {
        removeUser(player.id)
      })
      removeGame(user.room)
      io.to(user.room).emit("error", "Host has disconnected from lobby.")
    }
  })
})

const getRouter = () => {
  const router = express.Router()

  router.get("/", (req, res) => {
    res.send("server is up and running" + origin)
  })

  router.get("/lobby", (req, res) => {
    return res.json({games, users: users.length})
  })

  router.post("/createLobby", (req, res) => {
    let socket = io.of("/").sockets.get(req.body.socketId)
    if (!socket) {
      return res.status(400).json({error: "Could not find socket"})
    }
    let {username, name, password, hasPassword} = req.body
    const {gameError, game} = createNewGame({username, name, password, hasPassword, id: uuidv4()})
    if (gameError) {
      socket.emit("createlobbyerror", gameError)
      return res.status(400).json({error: gameError})
    }
    socket.join(game.roomid)
    const {userError, user} = addUser({id: socket.id, room: game.roomid, name: username, host: true})
    if (userError) {
      game.players.forEach(player => {
        removeUser(player.id)
      })
      removeGame(game.id)
      socket.leave(game.id)
      socket.emit("createlobbyerror", userError)
      return res.status(400).json({error: userError})
    }
    addUserToGame(user)
    return res.json({success: "Successfully created lobby.", player: user})
  })

  router.post("/joinLobby", (req, res) => {
    let socket = io.of("/").sockets.get(req.body.socketId)
    if (!socket) {
      return res.status(400).json({error: "Could not find socket"})
    }
    let {room, name, password} = req.body
    let game = getGame(room)
    if (!game) {
      return res.status(400).json({error: "Lobby no longer exists."})
    }
    if (game.hasPassword && game.password !== password) {
      return res.status(401).json({error: "Incorrect password"})
    }
    const {userError, user} = addUser({id: socket.id, room, name, host: false})
    if (userError) {
      socket.emit("error")
      return res.status(400).json({error: userError})
    }
    addUserToGame(user)
    socket.join(user.room)
    return res.json({success: "Successfully added user to game.", player: user})
  })

  return router
}

const router = getRouter()

app.use(router)

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
