const { json } = require('express')
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const cors = require('cors')
const AccountRouter = require('./routers/AccountRouter')
const Post = require('./routers/PostRouter')
const AnnouncementRouter = require('./routers/AnnouncementRouter')
const CategoriesRouter = require('./routers/CategoriesRouter')
const CommentRouter = require('./routers/CommentRouter')
const departmentRouter = require('./routers/DepartmentRouter')
require('dotenv').config()

const PORT = process.env.PORT
app.set("view engine", "ejs")
app.use(expressLayouts);
app.set('layout','./layouts/layout')


app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use('/account', AccountRouter)
app.use('/post', Post)
app.use('/announ', AnnouncementRouter)
app.use('/cate', CategoriesRouter)
app.use('/comment', CommentRouter)
app.use('/department', departmentRouter)

//static file
app.use(express.static('public'))

app.get('',(req,res) => {
    res.render('index')
})



app.get('/login',(req,res) => {
    res.render('login',{ layout: './layouts/layout_login' })
})



app.all('*', (req, res) => res.json({code:101, message: 'Đường dẫn hoặc phương thức không được hỗ trợ'}))

// app.listen(PORT, () => console.log("listening on port: http://localhost:" + PORT))
mongoose.connect('mongodb://localhost:27017/Social', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    // chỉ start server sau khi đã connect đến db
    app.listen(PORT, () => {
        console.log('http://localhost:' + PORT)
    })
})
.catch(e => console.log('Không thể kết nối tới db server: ' + e.message))