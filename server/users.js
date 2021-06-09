const axios = require("axios")

const users = []

const addUser = ({id, player, room, host, name}) => {
    const existingUser = users.find(user => user.room === room && user.name === name)
    if(existingUser){
    axios.delete(`http://localhost:5000/skull-online-313fe/us-central1/api/delplayer/${player}`).then(() => {
        console.log("user delete because existing user")
    }).catch(err => {
        console.error(err)
    })
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

module.exports = { addUser, removeUser, getUser, getUsersInRoom, users}