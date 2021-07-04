const express = require('express')
const router = express.Router()

const {games} = require('./util/game')
const {users} = require('./util/users')

router.get('/', (req, res) =>{
    res.send('server is up and running')
})

router.get('/lobby', (req,res) => {

})

module.exports = router