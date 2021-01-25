const users = []

const addUser = ({id, player, room, host, name}) => {
    const existingUser = users.find(user => user.room === room && user.player === player)
    if(existingUser){
        return {error: "Player is already connected"}
    }

    const user = {id, player, room, host, name}
    users.push(user)
    console.log("added user")
    console.log(user.id, user.player, user.room, user.host, user.name)

    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}
const getUser = (id) => users.find(user => user.id === id) 

const getUsersInRoom = (room) => users.filter(user => user.room === room) 

module.exports = { addUser, removeUser, getUser, getUsersInRoom}