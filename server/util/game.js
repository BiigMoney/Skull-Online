/**/games = [{roomid: "lol", players: [], name: "12345678912345678900", events: [], password: null, hasPassword: false, host: "HuuuuuuuuuuuuugeMoney"},
{roomid: "lol2", players: [], name: "lol2", events: [], password: "lol", hasPassword: true, host: "lol2"},
{roomid: "lol3", players: [], name: "lol3", events: [], password: null, hasPassword: false, host: "lol3"},
{roomid: "lol4", players: [], name: "lol4", events: [], password: null, hasPassword: false, host: "lol4"},
{roomid: "lol5", players: [], name: "lol5", events: [], password: "null", hasPassword: true, host: "lol5"},
{roomid: "lol6", players: [], name: "lol6", events: [], password: null, hasPassword: false, host: "lol6"},
{roomid: "lol7", players: [], name: "lol7", events: [], password: "lolo", hasPassword: true, host: "lol7"},
{roomid: "lol8", players: [], name: "lol8", events: [], password: null, hasPassword: false, host: "lol8"},
{roomid: "lol9", players: [], name: "lol9", events: [], password: null, hasPassword: false, host: "lol9"},
{roomid: "lol10", players: [], name: "lol10", events: [], password: null, hasPassword: false, host: "lol10"},
{roomid: "lol11", players: [], name: "lol11", events: [], password: null, hasPassword: false, host: "lol11"},
{roomid: "lol12", players: [], name: "lol12", events: [], password: null, hasPassword: false, host: "lol12"}]
//games = []

const isEmpty = (string) => {
    return (!string || 0 === string.length);
}
const createNewGame = ({username, name, password, hasPassword, id}) => {

    if(isEmpty(name)){
        return {gameError: "Name cannot be empty."}
    }
    if(name.length > 20){
        return {gameError: "Name cannot be longer than 20 characters."}
    }
    if(hasPassword && isEmpty(password)){
        return {gameError: "Password cannot be empty"}
    }
    if(hasPassword && password.length > 20){
        return {gameError: "Password cannot be longer than 20 characters"}
    }

    let game = {
        roomid: id,
        players: [],
        name,
        events: [],
        password,
        hasPassword,
        host: username
    }
    games.push(game)
    return { game }
}

const removeGame = (id) => {
    const index = games.findIndex(game => game.roomid === id)
    if(index !== -1){
        return games.splice(index, 1)
    }
}

const getGame = (room) => games.find(game => game.roomid === room)

const addUserToGame = (user) => {
    const game = getGame(user.room)
    console.log("game here", game)
    game.players.push(user)
    return game
}

const removeUserFromGame = (user) => {
    let game = getGame(user.room)
    if(!game){
        return null
    }
    const index = game.players.findIndex(player => user.id === player.id)
    if(index !== -1){
        game.players.splice(index,1)
        return game
    }
}


module.exports = { createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games }