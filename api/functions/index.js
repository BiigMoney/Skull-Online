const functions = require("firebase-functions");
const admin = require('firebase-admin')
var cors = require("cors")

admin.initializeApp()

const express = require('express');
const app = express();
app.use(cors())


app.get('/players',(req,res)=>{
    admin.firestore().collection('players').get().then((data) => {
        let players = [];
        data.forEach((doc) =>{
            players.push({
                id: doc.id,
                name: doc.data().name,
                room: doc.data().room,
            })
        })
        return res.json(players)
    }).catch((err) =>{
        console.error(err)
    })
})

app.get('/player/:id', (req,res) =>{
    let playerData = {};
    admin.firestore().doc(`/players/${req.params.id}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: "Player does not exist"})
        }
        playerData = doc.data();
        playerData.id = doc.id;
        return res.json(playerData)
    }).catch((err) =>{
        console.error(err)
        return res.status(404).json({error: "Cant find"})
    })
})


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

app.delete('/delplayer/:id',(req,res) =>{
    const document = admin.firestore().doc(`/players/${req.params.id}`)
    admin.firestore().doc(`/players/${req.params.id}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: 'Player not found'})
        } else {
            document.delete()
        }
    }).then(() => {
        return res.json({message: 'Player deleted successfully'})
    }).catch(err =>{
        console.error(err)
        res.status(500).json({error: "Something went wrong"})
    })
})

app.get('/rooms', (req,res) =>{
    admin.firestore().collection('rooms').get().then((data) => {
        let rooms = [];
        data.forEach((doc) =>{
            rooms.push({
                id: doc.id,
                name: doc.data().name,
                players: doc.data().players,
                hasPassword: doc.data().hasPassword,
                password: doc.data().password
            })
        })
        return res.json(rooms)
    }).catch((err) =>{
        console.error(err)
    })
})

app.get('/room/:id', (req,res) =>{
    let roomData = {};
    admin.firestore().doc(`/rooms/${req.params.id}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: "Room does not exist"})
        }
        roomData = doc.data();
        roomData.id = doc.id;
        return res.json(roomData)
    }).catch((err) =>{
        console.error(err)
        return res.status(404).json({error: "Cant find"})
    })
})

app.post('/room',(req,res) =>{
    let newRoom = {
        name: req.body.name,
        players: req.body.players,
        hasPassword: req.body.hasPassword,
        password: req.body.password
    }

    admin.firestore().collection('rooms').add(newRoom).then((doc) =>{
        newRoom.id = doc.id
        return res.json({ room: newRoom})
    }).catch((err) =>{
        res.status(500).json({error: 'something went wrong'})
        console.error(err)
    })
})

app.delete("/delroom/:id",(req,res) =>{
    const document = admin.firestore().doc(`/rooms/${req.params.id}`)
    document.get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: 'Room not found'})
        } else {
            document.delete()
        }
    }).then(() => {
        return res.json({message: 'Room deleted successfully'})
    }).catch(err =>{
        console.error(err)
        res.status(500).json({error: "Something went wrong"})
    })
})

exports.api = functions.https.onRequest(app)