const functions = require("firebase-functions");
const admin = require('firebase-admin')
var cors = require("cors")

const io = require('socket.io-client')

admin.initializeApp()

const express = require('express');
const app = express();
app.use(cors())

app.post('/player',(req,res) =>{
    let newPlayer = {
        name: req.body.name,
        room: req.body.room
    }

    admin.firestore().collection('players').add(newPlayer).then((doc) =>{
        newPlayer.id = doc.id
        return res.json({ player: newPlayer})
    }).catch((err) =>{
        res.status(500).json({error: 'something went wrong'})
        console.error(err)
    })
})

app.post('/delplayer',(req,res) =>{
    console.log(req.body)
    admin.firestore().doc(`/players/${req.body.player}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: 'Player not found'})
        } else {
            doc.ref.delete().then(() => {
                admin.firestore().doc(`/rooms/${req.body.room}`).get().then(doc => {
                    if(!doc.exists){
                        return res.json({success: "Player deleted, lobby has already been deleted."})
                    }
                    if(req.body.host){
                        doc.ref.delete().then(() => {
                            return res.json({success: "Deleted room and player"})
                        }).catch(err => {
                            return res.status(500).json({error: "Error deleting lobby"})
                        })
                    } else {
                        doc.ref.update({
                            players: admin.firestore.FieldValue.arrayRemove(req.body)
                        }).then(() => {
                            return res.json({success: "Deleted player and removed from room"})
                        }).catch(err => {
                            console.error(err)
                            return res.status(500).json({error: "Error updating players array"})
                        })
                    }
                })
            }).catch(err => {
                console.error(err)
                return res.status(500).json({error: "Error deleting player from players collection"})
            })
        }
    }).catch(err =>{
        console.error(err)
        res.status(500).json({error: "Something went wrong"})
    })
})

app.post('/room',(req,res) =>{
    let { lobby, player } = req.body

    if(isEmpty(lobby.name)){
        return res.status(400).json({error: "Name cannot be empty."})
    }
    if(lobby.name.length > 20){
        return res.status(400).json({error: "Name cannot be longer than 20 characters"})
    }
    if(lobby.hasPassword && isEmpty(lobby.password)){
        return res.status(400).json({error:"Password cannot be empty."})
    }
    if(lobby.hasPassword && lobby.password.length > 20){
        return res.status(400).json({error: "Password cannot be longer than 20 characters."})
    }

    const batch = admin.firestore().batch()
    let newLobbyRef = admin.firestore().collection('rooms').doc()
    let newPlayerRef = admin.firestore().collection('players').doc()
    player.room = newLobbyRef.id
    let lobbyPlayer = {name: player.name, host: true, player: newPlayerRef.id, room: player.room}
    lobby.players=[lobbyPlayer]
    batch.set(newLobbyRef, lobby)
    batch.set(newPlayerRef, player)
    batch.commit().then(() => {
        return res.json({success: "Success", player: lobbyPlayer})
    }).catch(err => {
        console.error(err)
        return res.status(500).json({error: "Error committing batch"})
    })
})

function isEmpty(string){
    return (!string || 0 === string.length);
}

exports.api = functions.https.onRequest(app)