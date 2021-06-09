games = []

const createNewGame = (user) => {
    let game = {
        roomid: user.room,
        players: [user],
        events: []      
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
    const game = getGame(user.room)[0]
    console.log("game here", game)
    game.players.push(user)
    return game
}

const removeUserFromGame = (user) => {
    let game = getGame(user.room)[0]
    const index = game.players.findIndex(player => user.id === player.id)
    if(index !== -1){
        game.players.splice(index,1)[0]
        return game
    }
}


module.exports = { createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games }