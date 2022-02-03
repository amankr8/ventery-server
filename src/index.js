// Use express
const express = require('express')
const app = express()

// .env file configuration
require('dotenv').config()

// Resolve CORS Policy
var cors = require('cors')
app.use(cors())

// Connect to database
const connect = require('./config/db')
connect()

// Configure express application
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Endpoints definitions
app.use('/items', require('./components/routes/items'))
app.use('/users', require('./components/routes/users'))

// Render the root page of the application
app.get('/', (res) => {
	res.render('index')
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`)
})