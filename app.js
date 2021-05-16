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
const Comments = require('./models/content/comment/comment.model')

require('dotenv').config()

const PORT = process.env.PORT || 3030
app.use(morgan('short'))
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
    let agg_comment = [
      [
        {
          '$lookup': {
            'from': 'accounts', 
            'localField': '_userId', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user'
          }
        }, {
          '$project': {
            'user.password': 0
          }
        }
      ]
    ]

    let agg_annou = [
        {
            '$sort': {
                'created_at': -1
            }
        } 
    ]

    let agg = [
        {
            '$sort': {
              'created_at': -1
            }
        }, {
          '$lookup': {
            'from': 'accounts', 
            'localField': '_userId', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unwind': {
            'path': '$user'
          }
        }, {
          '$project': {
            'user.createdAt': 0, 
            'user.updatedAt': 0, 
            'user.password': 0, 
            'user.__v': 0
          }
        }
      ]
    Annoucement.aggregate(agg_annou)
    .then(announ => {
        PostDetail.aggregate(agg)
        .then(post => {
          Comments.aggregate(agg_comment)
          .then(cmt => {
            res.render('index', {announ: announ, auth:req.auth, post:post, cmt:cmt})
          })
        })
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

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/Social'
console.log(DATABASE_URL)
mongoose.connect(`${DATABASE_URL}`, {
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