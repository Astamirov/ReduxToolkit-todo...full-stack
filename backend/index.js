const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express()
const port = 3000


app.use(cors())
app.use(express.json())
app.use(require('./routes/todo.router'))


mongoose.connect('mongodb+srv://astamirov001:1234@cluster0.85hvdyp.mongodb.net/Todo')
    .then(() => console.log('launch'))
    .catch(() => console.log('error'))

app.listen(port, () => console.log(`http://localhost:${port}`))