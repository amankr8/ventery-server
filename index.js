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
app.use('/categories', require('./components/routes/categories'))

// Render the root page of the application
app.get('/', (req, res) => { res.render('index') })

// Start server
const port = process.env.PORT
app.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`)
})