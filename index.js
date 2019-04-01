const express = require('express')
const helmet = require('helmet')

const server = express()

server.use(express.json())
server.use(helmet())

const URL = 5000;

server.get('/', (req, res) => {
    res.status(200).json('sanity check')
})

server.listen(URL, () => {
    console.log(`\n== SERVER LISTENING ON PORT ${URL} ==\n`)
})