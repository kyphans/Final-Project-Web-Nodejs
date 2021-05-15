const { json } = require('express')
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()
const multer= require('multer')
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
const Department = require('./models/department.model')
const uploadModel = require('./models/image_model')
const Account = require('./models/user.model')
const AccountRouter = require('./routers/AccountRouter')
const Post = require('./routers/PostRouter')
const AnnouncementRouter = require('./routers/AnnouncementRouter')
const CategoriesRouter = require('./routers/CategoriesRouter')
const CommentRouter = require('./routers/CommentRouter')
const DepartmentRouter = require('./routers/DepartmentRouter')
const CookieParser = require('cookie-parser')
const Annoucement = require('./models/content/annoucement/annoucement.model')
const CheckLogin = require('./auth/CheckLogin')
const PostDetail = require('./models/content/post/post.model')

require('dotenv').config()

const PORT = process.env.PORT
app.set("view engine", "ejs")
app.use(expressLayouts);
app.set('layout','./layouts/layout')


app.use((req,res,next) => {
    req.vars = {root: __dirname}
    next()
})
app.use(CookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

//static file
app.use(express.static('public'))

app.get('/',CheckLogin,(req,res) => {
    Annoucement.find()
    .then(announ => {
        // console.log(annou)
        // res.render('notification_list',{ layout: '../views/layouts/notification_layout', announ: announ})
        res.render('index', {announ: announ, auth:req.auth})
    })
   
})

app.get('/login',(req,res) => {
    res.render('login',{ layout: './layouts/layout_login'})
})

app.use('/account', AccountRouter)
app.use('/post', Post)
app.use('/announ',CheckLogin, AnnouncementRouter)
app.use('/cate',CheckLogin, CategoriesRouter)
app.use('/comment',CheckLogin, CommentRouter)
app.use('/department',CheckLogin, DepartmentRouter)


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