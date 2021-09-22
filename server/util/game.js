const games = []

const isEmpty = string => {
  return !string || 0 === string.length
}
const createNewGame = ({username, name, password, hasPassword, id}) => {
  if (isEmpty(name)) {
    return {gameError: "Name cannot be empty."}
  }
  if (name.length > 20) {
    return {gameError: "Name cannot be longer than 20 characters."}
  }
  if (hasPassword && isEmpty(password)) {
    return {gameError: "Password cannot be empty"}
  }
  if (hasPassword && password.length > 20) {
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
  return {game}
}

const removeGame = id => {
  const index = games.findIndex(game => game.roomid === id)
  if (index !== -1) {
    return games.splice(index, 1)
  }
}

const getGame = room => games.find(game => game.roomid === room)

const addUserToGame = user => {
  const game = getGame(user.room)
  game.players.push(user)
  return game
}

const removeUserFromGame = user => {
  let game = getGame(user.room)
  if (!game) {
    return null
  }
  const index = game.players.findIndex(player => user.id === player.id)
  if (index !== -1) {
    game.players.splice(index, 1)
    return game
  }
}

module.exports = {createNewGame, removeGame, getGame, addUserToGame, removeUserFromGame, games}
