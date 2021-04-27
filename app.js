const { json } = require('express')
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT
app.set("view engine", "ejs")
app.use(expressLayouts);
app.set('layout','./layouts/layout')

//static file
app.use(express.static('public'))
app.get('',(req,res) => {
    res.render('index')
})

app.listen(PORT, () => console.log("listening on port: http://localhost:" + PORT))