games = []

const createNewGame = (user) => {
    let game = {
        roomid: user.room,
        players: user,
        objects: []      
    }
    games.push(game)
    return game
}

const removeGame = (id) => {
    const index = games.findIndex(game => game.roomid === id)
    if(index !== -1){
        return games.splice(index, 1)[0]
    }
}

const getGame = (room) => games.filter(game => game.roomid === room)

const addUserToGame = (user) => {
    const game = getGame(user.room)
    game.players.push(user)
    return game
}



module.exports = { createNewGame, removeGame, getGame, addUserToGame }